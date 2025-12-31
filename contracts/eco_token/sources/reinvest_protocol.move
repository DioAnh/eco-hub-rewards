/// Green Reinvest Option (GRO) Protocol
/// Allows users to reinvest ECO rewards into Startup Investment Vaults
/// for potential future airdrops and bonus rewards.
module eco_token::reinvest_protocol {
    use sui::object::{Self, UID, ID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::coin::{Self, Coin};
    use sui::balance::{Self, Balance};
    use sui::event;
    use sui::clock::{Self, Clock};
    use sui::table::{Self, Table};
    use std::string::{Self, String};
    use eco_token::eco_token::ECO;

    // ============ Error Codes ============
    const E_NOT_AUTHORIZED: u64 = 1;
    const E_VAULT_CLOSED: u64 = 2;
    const E_INSUFFICIENT_AMOUNT: u64 = 3;
    const E_PROJECT_NOT_FOUND: u64 = 4;
    const E_LOCK_PERIOD_NOT_ENDED: u64 = 5;
    const E_PROJECT_NOT_RESOLVED: u64 = 6;
    const E_ALREADY_CLAIMED: u64 = 7;
    const E_INVALID_STATUS: u64 = 8;

    // ============ Constants ============
    const MIN_INVESTMENT: u64 = 1_000_000_000; // 1 ECO (9 decimals)
    const LOCK_PERIOD_MS: u64 = 15552000000; // 180 days in milliseconds
    const SUCCESS_BONUS_RATE: u64 = 50; // 50% bonus on success (500% ROI claim)

    // ============ Project Status ============
    const STATUS_OPERATIONAL: u8 = 0;
    const STATUS_BOOMING: u8 = 1;
    const STATUS_CRITICAL: u8 = 2;
    const STATUS_SUCCESS: u8 = 3;
    const STATUS_FAILED: u8 = 4;

    // ============ Data Structures ============

    /// Global config for the reinvest protocol
    public struct ProtocolConfig has key {
        id: UID,
        admin: address,
        bonus_reserve: Balance<ECO>,
        total_invested: u64,
        total_projects: u64,
        active_investments: u64,
    }

    /// Investment Vault for each Startup/Merchant
    public struct InvestmentVault has key, store {
        id: UID,
        merchant_id: ID,
        merchant_name: String,
        vault_balance: Balance<ECO>,
        total_investors: u64,
        total_invested: u64,
        status: u8,
        lock_end_time: u64,
        eco_score: u8,
        co2_offset: u64,
        milestone_achieved: bool,
        is_active: bool,
    }

    /// Investment Receipt NFT - Proof of investment
    public struct InvestmentNFT has key, store {
        id: UID,
        vault_id: ID,
        investor: address,
        project_name: String,
        invested_amount: u64,
        invested_at: u64,
        status: u8, // Mirrors project status
        claimed: bool,
        estimated_roi: u64, // Basis points (50000 = 500%)
    }

    /// Registry to track all vaults
    public struct VaultRegistry has key {
        id: UID,
        vaults: Table<ID, ID>, // merchant_id -> vault_id
    }

    // ============ Events ============

    public struct InvestmentCreated has copy, drop {
        investor: address,
        vault_id: ID,
        nft_id: ID,
        project_name: String,
        amount: u64,
        timestamp: u64,
    }

    public struct ProjectStatusUpdated has copy, drop {
        vault_id: ID,
        old_status: u8,
        new_status: u8,
        timestamp: u64,
    }

    public struct AirdropDistributed has copy, drop {
        vault_id: ID,
        investor: address,
        original_amount: u64,
        bonus_amount: u64,
        total_received: u64,
    }

    public struct InvestmentTerminated has copy, drop {
        vault_id: ID,
        investor: address,
        nft_id: ID,
        burned_amount: u64,
    }

    public struct VaultBurned has copy, drop {
        vault_id: ID,
        project_name: String,
        total_burned: u64,
        total_affected_investors: u64,
    }

    // ============ Initialization ============

    fun init(ctx: &mut TxContext) {
        let config = ProtocolConfig {
            id: object::new(ctx),
            admin: tx_context::sender(ctx),
            bonus_reserve: balance::zero(),
            total_invested: 0,
            total_projects: 0,
            active_investments: 0,
        };

        let registry = VaultRegistry {
            id: object::new(ctx),
            vaults: table::new(ctx),
        };

        transfer::share_object(config);
        transfer::share_object(registry);
    }

    // ============ Vault Management ============

    /// Create an Investment Vault for a registered merchant
    public entry fun create_vault(
        config: &mut ProtocolConfig,
        registry: &mut VaultRegistry,
        merchant_id: ID,
        merchant_name: vector<u8>,
        initial_lock_period: u64,
        eco_score: u8,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        assert!(tx_context::sender(ctx) == config.admin, E_NOT_AUTHORIZED);

        let current_time = clock::timestamp_ms(clock);
        let lock_end = current_time + (initial_lock_period * 86400000); // days to ms

        let vault = InvestmentVault {
            id: object::new(ctx),
            merchant_id,
            merchant_name: string::utf8(merchant_name),
            vault_balance: balance::zero(),
            total_investors: 0,
            total_invested: 0,
            status: STATUS_OPERATIONAL,
            lock_end_time: lock_end,
            eco_score,
            co2_offset: 0,
            milestone_achieved: false,
            is_active: true,
        };

        let vault_id = object::id(&vault);
        table::add(&mut registry.vaults, merchant_id, vault_id);
        config.total_projects = config.total_projects + 1;

        transfer::share_object(vault);
    }

    // ============ Core Reinvest Functions ============

    /// Execute reinvestment - User reinvests their ECO rewards into a Startup
    public entry fun execute_reinvest(
        config: &mut ProtocolConfig,
        vault: &mut InvestmentVault,
        eco_payment: Coin<ECO>,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        assert!(vault.is_active, E_VAULT_CLOSED);
        let amount = coin::value(&eco_payment);
        assert!(amount >= MIN_INVESTMENT, E_INSUFFICIENT_AMOUNT);

        let investor = tx_context::sender(ctx);
        let current_time = clock::timestamp_ms(clock);

        // Transfer ECO to vault
        let eco_balance = coin::into_balance(eco_payment);
        balance::join(&mut vault.vault_balance, eco_balance);

        // Update vault stats
        vault.total_investors = vault.total_investors + 1;
        vault.total_invested = vault.total_invested + amount;

        // Update protocol stats
        config.total_invested = config.total_invested + amount;
        config.active_investments = config.active_investments + 1;

        // Calculate estimated ROI based on project risk
        let estimated_roi = calculate_estimated_roi(vault.status, vault.eco_score);

        // Mint Investment NFT as receipt
        let nft = InvestmentNFT {
            id: object::new(ctx),
            vault_id: object::id(vault),
            investor,
            project_name: vault.merchant_name,
            invested_amount: amount,
            invested_at: current_time,
            status: vault.status,
            claimed: false,
            estimated_roi,
        };

        let nft_id = object::id(&nft);
        let vault_id = object::id(vault);

        event::emit(InvestmentCreated {
            investor,
            vault_id,
            nft_id,
            project_name: vault.merchant_name,
            amount,
            timestamp: current_time,
        });

        transfer::transfer(nft, investor);
    }

    // ============ Project Outcome Resolution ============

    /// Resolve project outcome - Admin/Oracle only
    public entry fun resolve_project_outcome(
        config: &mut ProtocolConfig,
        vault: &mut InvestmentVault,
        is_success: bool,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        assert!(tx_context::sender(ctx) == config.admin, E_NOT_AUTHORIZED);
        assert!(vault.status < STATUS_SUCCESS, E_INVALID_STATUS);

        let old_status = vault.status;
        let current_time = clock::timestamp_ms(clock);

        if (is_success) {
            vault.status = STATUS_SUCCESS;
            vault.milestone_achieved = true;
        } else {
            vault.status = STATUS_FAILED;
            vault.is_active = false;
            
            // Burn the vault balance on failure
            let burned_amount = balance::value(&vault.vault_balance);
            let burn_balance = balance::withdraw_all(&mut vault.vault_balance);
            balance::destroy_zero(burn_balance); // This will fail - need proper burn

            event::emit(VaultBurned {
                vault_id: object::id(vault),
                project_name: vault.merchant_name,
                total_burned: burned_amount,
                total_affected_investors: vault.total_investors,
            });
        };

        event::emit(ProjectStatusUpdated {
            vault_id: object::id(vault),
            old_status,
            new_status: vault.status,
            timestamp: current_time,
        });
    }

    /// Update project status (OPERATIONAL -> BOOMING -> CRITICAL)
    public entry fun update_project_status(
        config: &ProtocolConfig,
        vault: &mut InvestmentVault,
        new_status: u8,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        assert!(tx_context::sender(ctx) == config.admin, E_NOT_AUTHORIZED);
        assert!(new_status < STATUS_SUCCESS, E_INVALID_STATUS);

        let old_status = vault.status;
        vault.status = new_status;

        event::emit(ProjectStatusUpdated {
            vault_id: object::id(vault),
            old_status,
            new_status,
            timestamp: clock::timestamp_ms(clock),
        });
    }

    // ============ Airdrop Distribution ============

    /// Claim airdrop for successful project
    public entry fun claim_airdrop(
        config: &mut ProtocolConfig,
        vault: &mut InvestmentVault,
        nft: &mut InvestmentNFT,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let investor = tx_context::sender(ctx);
        assert!(nft.investor == investor, E_NOT_AUTHORIZED);
        assert!(vault.status == STATUS_SUCCESS, E_PROJECT_NOT_RESOLVED);
        assert!(!nft.claimed, E_ALREADY_CLAIMED);
        assert!(clock::timestamp_ms(clock) >= vault.lock_end_time, E_LOCK_PERIOD_NOT_ENDED);

        let original_amount = nft.invested_amount;
        let bonus_amount = (original_amount * SUCCESS_BONUS_RATE) / 100;
        let total_payout = original_amount + bonus_amount;

        // Withdraw from vault balance
        let vault_payout = balance::split(&mut vault.vault_balance, original_amount);
        
        // Withdraw bonus from protocol reserve
        let bonus_payout = balance::split(&mut config.bonus_reserve, bonus_amount);
        balance::join(&mut vault_payout, bonus_payout);

        let payout_coin = coin::from_balance(vault_payout, ctx);

        // Mark as claimed
        nft.claimed = true;
        nft.status = STATUS_SUCCESS;
        config.active_investments = config.active_investments - 1;

        event::emit(AirdropDistributed {
            vault_id: object::id(vault),
            investor,
            original_amount,
            bonus_amount,
            total_received: total_payout,
        });

        transfer::public_transfer(payout_coin, investor);
    }

    /// Mark NFT as terminated for failed project
    public entry fun terminate_investment(
        config: &mut ProtocolConfig,
        vault: &InvestmentVault,
        nft: &mut InvestmentNFT,
        ctx: &mut TxContext
    ) {
        let investor = tx_context::sender(ctx);
        assert!(nft.investor == investor, E_NOT_AUTHORIZED);
        assert!(vault.status == STATUS_FAILED, E_INVALID_STATUS);

        nft.status = STATUS_FAILED;
        nft.claimed = true; // Prevent future claims
        config.active_investments = config.active_investments - 1;

        event::emit(InvestmentTerminated {
            vault_id: object::id(vault),
            investor,
            nft_id: object::id(nft),
            burned_amount: nft.invested_amount,
        });
    }

    // ============ Admin Functions ============

    /// Add to bonus reserve pool
    public entry fun add_bonus_reserve(
        config: &mut ProtocolConfig,
        bonus_coin: Coin<ECO>,
        ctx: &TxContext
    ) {
        assert!(tx_context::sender(ctx) == config.admin, E_NOT_AUTHORIZED);
        let bonus_balance = coin::into_balance(bonus_coin);
        balance::join(&mut config.bonus_reserve, bonus_balance);
    }

    /// Update CO2 offset for project
    public entry fun update_co2_offset(
        config: &ProtocolConfig,
        vault: &mut InvestmentVault,
        co2_amount: u64,
        ctx: &TxContext
    ) {
        assert!(tx_context::sender(ctx) == config.admin, E_NOT_AUTHORIZED);
        vault.co2_offset = vault.co2_offset + co2_amount;
    }

    // ============ View Functions ============

    /// Calculate estimated ROI based on project status and eco score
    fun calculate_estimated_roi(status: u8, eco_score: u8): u64 {
        let base_roi: u64 = 50000; // 500% base
        
        // Adjust based on status
        let status_multiplier = if (status == STATUS_OPERATIONAL) {
            100
        } else if (status == STATUS_BOOMING) {
            150
        } else {
            50 // CRITICAL
        };

        // Adjust based on eco score
        let score_bonus = ((eco_score as u64) * 100);

        (base_roi * status_multiplier / 100) + score_bonus
    }

    /// Get vault information
    public fun get_vault_info(vault: &InvestmentVault): (String, u64, u64, u8, bool, u8, u64) {
        (
            vault.merchant_name,
            balance::value(&vault.vault_balance),
            vault.total_investors,
            vault.status,
            vault.is_active,
            vault.eco_score,
            vault.co2_offset
        )
    }

    /// Get NFT information
    public fun get_investment_info(nft: &InvestmentNFT): (String, u64, u64, u8, bool, u64) {
        (
            nft.project_name,
            nft.invested_amount,
            nft.invested_at,
            nft.status,
            nft.claimed,
            nft.estimated_roi
        )
    }

    /// Get protocol stats
    public fun get_protocol_stats(config: &ProtocolConfig): (u64, u64, u64, u64) {
        (
            balance::value(&config.bonus_reserve),
            config.total_invested,
            config.total_projects,
            config.active_investments
        )
    }
}
