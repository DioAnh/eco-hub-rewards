/// Staking Module - ECO Token Staking with rewards
module eco_token::staking {
    use sui::coin::{Self, Coin, TreasuryCap};
    use sui::balance::{Self, Balance};
    use sui::event;
    use sui::clock::Clock;
    use eco_token::eco_token::{Self, ECO_TOKEN, MinterCap, EcoTokenInfo};

    // ============ Constants ============
    
    /// Minimum stake duration in milliseconds (7 days)
    const MIN_STAKE_DURATION: u64 = 7 * 24 * 60 * 60 * 1000;
    
    /// APY rates in basis points (100 = 1%)
    const APY_7_DAYS: u64 = 500;    // 5% APY
    const APY_30_DAYS: u64 = 1000;  // 10% APY
    const APY_90_DAYS: u64 = 1500;  // 15% APY
    const APY_365_DAYS: u64 = 2500; // 25% APY
    
    /// Milliseconds per year for APY calculation
    const MS_PER_YEAR: u64 = 365 * 24 * 60 * 60 * 1000;
    
    /// Error codes
    const E_INSUFFICIENT_STAKE: u64 = 200;
    const E_STAKE_LOCKED: u64 = 201;
    const E_INVALID_DURATION: u64 = 202;
    const E_NOT_OWNER: u64 = 203;

    // ============ Types ============

    /// Individual stake position
    public struct StakePosition has key, store {
        id: UID,
        /// Owner of this stake
        owner: address,
        /// Staked ECO tokens
        staked_balance: Balance<ECO_TOKEN>,
        /// Stake start timestamp
        start_time: u64,
        /// Lock duration in milliseconds
        lock_duration: u64,
        /// APY rate in basis points
        apy_rate: u64,
        /// Accumulated rewards claimed
        rewards_claimed: u64,
    }

    /// Staking pool configuration
    public struct StakingPool has key {
        id: UID,
        /// Total ECO staked in the pool
        total_staked: u64,
        /// Total rewards distributed
        total_rewards: u64,
        /// Number of active stakers
        active_stakers: u64,
        /// Is staking active
        is_active: bool,
    }

    // ============ Events ============

    /// Emitted when tokens are staked
    public struct TokensStaked has copy, drop {
        staker: address,
        stake_id: ID,
        amount: u64,
        lock_duration: u64,
        apy_rate: u64,
        timestamp: u64,
    }

    /// Emitted when tokens are unstaked
    public struct TokensUnstaked has copy, drop {
        staker: address,
        stake_id: ID,
        principal: u64,
        rewards: u64,
        timestamp: u64,
    }

    /// Emitted when rewards are claimed
    public struct RewardsClaimed has copy, drop {
        staker: address,
        stake_id: ID,
        amount: u64,
        timestamp: u64,
    }

    // ============ Initialization ============

    fun init(ctx: &mut TxContext) {
        let pool = StakingPool {
            id: object::new(ctx),
            total_staked: 0,
            total_rewards: 0,
            active_stakers: 0,
            is_active: true,
        };

        transfer::share_object(pool);
    }

    // ============ Staking Functions ============

    /// Stake ECO tokens for a specified duration
    public fun stake(
        pool: &mut StakingPool,
        tokens: Coin<ECO_TOKEN>,
        lock_duration: u64,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        assert!(lock_duration >= MIN_STAKE_DURATION, E_INVALID_DURATION);
        
        let amount = coin::value(&tokens);
        assert!(amount > 0, E_INSUFFICIENT_STAKE);

        // Determine APY based on lock duration
        let apy_rate = get_apy_for_duration(lock_duration);
        
        let current_time = sui::clock::timestamp_ms(clock);
        let staker = tx_context::sender(ctx);

        let stake_position = StakePosition {
            id: object::new(ctx),
            owner: staker,
            staked_balance: coin::into_balance(tokens),
            start_time: current_time,
            lock_duration,
            apy_rate,
            rewards_claimed: 0,
        };

        // Update pool stats
        pool.total_staked = pool.total_staked + amount;
        pool.active_stakers = pool.active_stakers + 1;

        event::emit(TokensStaked {
            staker,
            stake_id: object::id(&stake_position),
            amount,
            lock_duration,
            apy_rate,
            timestamp: current_time,
        });

        transfer::transfer(stake_position, staker);
    }

    /// Unstake tokens after lock period
    public fun unstake(
        treasury_cap: &mut TreasuryCap<ECO_TOKEN>,
        minter_cap: &mut MinterCap,
        token_info: &mut EcoTokenInfo,
        pool: &mut StakingPool,
        stake: StakePosition,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let current_time = sui::clock::timestamp_ms(clock);
        let staker = tx_context::sender(ctx);
        
        assert!(stake.owner == staker, E_NOT_OWNER);
        assert!(
            current_time >= stake.start_time + stake.lock_duration,
            E_STAKE_LOCKED
        );

        let StakePosition {
            id,
            owner: _,
            staked_balance,
            start_time,
            lock_duration,
            apy_rate,
            rewards_claimed,
        } = stake;

        let principal = balance::value(&staked_balance);
        
        // Calculate pending rewards
        let total_rewards = calculate_rewards(
            principal,
            apy_rate,
            current_time - start_time
        );
        let pending_rewards = total_rewards - rewards_claimed;

        // Update pool stats
        pool.total_staked = pool.total_staked - principal;
        pool.total_rewards = pool.total_rewards + pending_rewards;
        pool.active_stakers = pool.active_stakers - 1;

        // Return principal
        let principal_coin = coin::from_balance(staked_balance, ctx);
        transfer::public_transfer(principal_coin, staker);

        // Mint and transfer rewards
        if (pending_rewards > 0) {
            eco_token::mint_reward(
                treasury_cap,
                minter_cap,
                token_info,
                pending_rewards,
                0, // No CO2 offset for staking rewards
                staker,
                ctx
            );
        };

        event::emit(TokensUnstaked {
            staker,
            stake_id: object::uid_to_inner(&id),
            principal,
            rewards: pending_rewards,
            timestamp: current_time,
        });

        object::delete(id);
    }

    /// Claim rewards without unstaking (for long-term stakes)
    public fun claim_rewards(
        treasury_cap: &mut TreasuryCap<ECO_TOKEN>,
        minter_cap: &mut MinterCap,
        token_info: &mut EcoTokenInfo,
        pool: &mut StakingPool,
        stake: &mut StakePosition,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let staker = tx_context::sender(ctx);
        assert!(stake.owner == staker, E_NOT_OWNER);

        let current_time = sui::clock::timestamp_ms(clock);
        let principal = balance::value(&stake.staked_balance);
        
        // Calculate pending rewards
        let total_rewards = calculate_rewards(
            principal,
            stake.apy_rate,
            current_time - stake.start_time
        );
        let pending_rewards = total_rewards - stake.rewards_claimed;

        if (pending_rewards > 0) {
            stake.rewards_claimed = stake.rewards_claimed + pending_rewards;
            pool.total_rewards = pool.total_rewards + pending_rewards;

            eco_token::mint_reward(
                treasury_cap,
                minter_cap,
                token_info,
                pending_rewards,
                0,
                staker,
                ctx
            );

            event::emit(RewardsClaimed {
                staker,
                stake_id: object::id(stake),
                amount: pending_rewards,
                timestamp: current_time,
            });
        };
    }

    // ============ Helper Functions ============

    /// Get APY rate based on lock duration
    fun get_apy_for_duration(duration: u64): u64 {
        if (duration >= 365 * 24 * 60 * 60 * 1000) {
            APY_365_DAYS
        } else if (duration >= 90 * 24 * 60 * 60 * 1000) {
            APY_90_DAYS
        } else if (duration >= 30 * 24 * 60 * 60 * 1000) {
            APY_30_DAYS
        } else {
            APY_7_DAYS
        }
    }

    /// Calculate rewards based on principal, APY, and time staked
    fun calculate_rewards(principal: u64, apy_bps: u64, time_staked: u64): u64 {
        // rewards = principal * apy * time / year
        // Using basis points: apy_bps / 10000
        ((principal as u128) * (apy_bps as u128) * (time_staked as u128) / 
         (10000u128 * (MS_PER_YEAR as u128))) as u64
    }

    // ============ View Functions ============

    /// Get stake position info
    public fun get_stake_info(stake: &StakePosition): (u64, u64, u64, u64, u64) {
        (
            balance::value(&stake.staked_balance),
            stake.start_time,
            stake.lock_duration,
            stake.apy_rate,
            stake.rewards_claimed
        )
    }

    /// Get pool stats
    public fun get_pool_stats(pool: &StakingPool): (u64, u64, u64, bool) {
        (
            pool.total_staked,
            pool.total_rewards,
            pool.active_stakers,
            pool.is_active
        )
    }

    /// Calculate pending rewards for a stake
    public fun pending_rewards(stake: &StakePosition, clock: &Clock): u64 {
        let current_time = sui::clock::timestamp_ms(clock);
        let principal = balance::value(&stake.staked_balance);
        let total_rewards = calculate_rewards(
            principal,
            stake.apy_rate,
            current_time - stake.start_time
        );
        total_rewards - stake.rewards_claimed
    }

    /// Check if stake is unlocked
    public fun is_unlocked(stake: &StakePosition, clock: &Clock): bool {
        let current_time = sui::clock::timestamp_ms(clock);
        current_time >= stake.start_time + stake.lock_duration
    }

    // ============ Test Functions ============

    #[test_only]
    public fun init_for_testing(ctx: &mut TxContext) {
        init(ctx);
    }
}
