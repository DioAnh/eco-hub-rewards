/// ECO Token Module - Sui Coin Standard Implementation
/// A sustainable token that rewards eco-friendly purchases
module eco_token::eco_token {
    use sui::coin::{Self, Coin, TreasuryCap};
    use sui::url;
    use sui::event;

    // ============ Constants ============
    
    /// Maximum total supply: 100 million ECO tokens (with 9 decimals)
    const MAX_SUPPLY: u64 = 100_000_000_000_000_000; // 100M * 10^9
    
    /// Error codes
    const E_EXCEEDS_MAX_SUPPLY: u64 = 1;
    const E_NOT_AUTHORIZED: u64 = 2;
    const E_INSUFFICIENT_BALANCE: u64 = 3;

    // ============ Types ============

    /// One-Time-Witness for the ECO token
    public struct ECO_TOKEN has drop {}

    /// Admin capability for managing the token system
    public struct AdminCap has key, store {
        id: UID,
    }

    /// Minter capability - only holders can mint tokens
    /// Given to marketplace and governance modules
    public struct MinterCap has key, store {
        id: UID,
        /// Maximum amount this minter can mint
        mint_limit: u64,
        /// Amount already minted by this minter
        minted: u64,
    }

    /// Token metadata and supply tracking
    public struct EcoTokenInfo has key {
        id: UID,
        /// Current total supply
        total_supply: u64,
        /// Maximum supply cap
        max_supply: u64,
        /// Total CO2 offset represented by this token
        total_co2_offset: u64,
    }

    // ============ Events ============

    /// Emitted when ECO tokens are minted
    public struct TokenMinted has copy, drop {
        recipient: address,
        amount: u64,
        co2_offset: u64,
        timestamp: u64,
    }

    /// Emitted when ECO tokens are burned
    public struct TokenBurned has copy, drop {
        burner: address,
        amount: u64,
        timestamp: u64,
    }

    /// Emitted when a new minter is authorized
    public struct MinterAuthorized has copy, drop {
        minter_cap_id: ID,
        mint_limit: u64,
    }

    // ============ Initialization ============

    /// Initialize the ECO token with coin metadata
    fun init(witness: ECO_TOKEN, ctx: &mut TxContext) {
        let (treasury_cap, metadata) = coin::create_currency(
            witness,
            9, // 9 decimals like SUI
            b"ECO",
            b"EcoShop Token",
            b"Sustainable commerce token that rewards eco-friendly purchases. Each ECO represents verified CO2 reduction.",
            option::some(url::new_unsafe_from_bytes(b"https://ecoshop.io/eco-token.png")),
            ctx
        );

        // Create admin capability
        let admin_cap = AdminCap {
            id: object::new(ctx),
        };

        // Create token info tracker
        let token_info = EcoTokenInfo {
            id: object::new(ctx),
            total_supply: 0,
            max_supply: MAX_SUPPLY,
            total_co2_offset: 0,
        };

        // Transfer ownership
        transfer::public_freeze_object(metadata);
        transfer::public_transfer(treasury_cap, tx_context::sender(ctx));
        transfer::transfer(admin_cap, tx_context::sender(ctx));
        transfer::share_object(token_info);
    }

    // ============ Admin Functions ============

    /// Create a new minter capability (admin only)
    public fun create_minter_cap(
        _admin: &AdminCap,
        mint_limit: u64,
        recipient: address,
        ctx: &mut TxContext
    ) {
        let minter_cap = MinterCap {
            id: object::new(ctx),
            mint_limit,
            minted: 0,
        };

        event::emit(MinterAuthorized {
            minter_cap_id: object::id(&minter_cap),
            mint_limit,
        });

        transfer::transfer(minter_cap, recipient);
    }

    /// Update minter limit (admin only)
    public fun update_minter_limit(
        _admin: &AdminCap,
        minter_cap: &mut MinterCap,
        new_limit: u64,
    ) {
        minter_cap.mint_limit = new_limit;
    }

    // ============ Minting Functions ============

    /// Mint ECO tokens as reward (requires MinterCap)
    public fun mint_reward(
        treasury_cap: &mut TreasuryCap<ECO_TOKEN>,
        minter_cap: &mut MinterCap,
        token_info: &mut EcoTokenInfo,
        amount: u64,
        co2_offset: u64,
        recipient: address,
        ctx: &mut TxContext
    ) {
        // Check supply cap
        assert!(
            token_info.total_supply + amount <= token_info.max_supply,
            E_EXCEEDS_MAX_SUPPLY
        );

        // Check minter limit
        assert!(
            minter_cap.minted + amount <= minter_cap.mint_limit,
            E_NOT_AUTHORIZED
        );

        // Mint tokens
        let minted_coin = coin::mint(treasury_cap, amount, ctx);
        
        // Update tracking
        token_info.total_supply = token_info.total_supply + amount;
        token_info.total_co2_offset = token_info.total_co2_offset + co2_offset;
        minter_cap.minted = minter_cap.minted + amount;

        // Emit event for UI
        event::emit(TokenMinted {
            recipient,
            amount,
            co2_offset,
            timestamp: tx_context::epoch_timestamp_ms(ctx),
        });

        // Transfer to recipient
        transfer::public_transfer(minted_coin, recipient);
    }

    /// Direct mint by treasury holder (for initial distribution)
    public fun mint_direct(
        treasury_cap: &mut TreasuryCap<ECO_TOKEN>,
        token_info: &mut EcoTokenInfo,
        amount: u64,
        recipient: address,
        ctx: &mut TxContext
    ) {
        assert!(
            token_info.total_supply + amount <= token_info.max_supply,
            E_EXCEEDS_MAX_SUPPLY
        );

        let minted_coin = coin::mint(treasury_cap, amount, ctx);
        token_info.total_supply = token_info.total_supply + amount;

        event::emit(TokenMinted {
            recipient,
            amount,
            co2_offset: 0,
            timestamp: tx_context::epoch_timestamp_ms(ctx),
        });

        transfer::public_transfer(minted_coin, recipient);
    }

    // ============ Burn Functions ============

    /// Burn ECO tokens
    public fun burn(
        treasury_cap: &mut TreasuryCap<ECO_TOKEN>,
        token_info: &mut EcoTokenInfo,
        coin_to_burn: Coin<ECO_TOKEN>,
        ctx: &mut TxContext
    ) {
        let amount = coin::value(&coin_to_burn);
        token_info.total_supply = token_info.total_supply - amount;
        
        event::emit(TokenBurned {
            burner: tx_context::sender(ctx),
            amount,
            timestamp: tx_context::epoch_timestamp_ms(ctx),
        });

        coin::burn(treasury_cap, coin_to_burn);
    }

    // ============ View Functions ============

    /// Get current total supply
    public fun total_supply(token_info: &EcoTokenInfo): u64 {
        token_info.total_supply
    }

    /// Get maximum supply
    public fun max_supply(token_info: &EcoTokenInfo): u64 {
        token_info.max_supply
    }

    /// Get total CO2 offset
    public fun total_co2_offset(token_info: &EcoTokenInfo): u64 {
        token_info.total_co2_offset
    }

    /// Get remaining mintable supply
    public fun remaining_supply(token_info: &EcoTokenInfo): u64 {
        token_info.max_supply - token_info.total_supply
    }

    /// Get minter's remaining mint allowance
    public fun minter_remaining(minter_cap: &MinterCap): u64 {
        minter_cap.mint_limit - minter_cap.minted
    }

    // ============ Test Functions ============

    #[test_only]
    public fun init_for_testing(ctx: &mut TxContext) {
        init(ECO_TOKEN {}, ctx);
    }
}
