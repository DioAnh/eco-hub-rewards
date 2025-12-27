/// Marketplace Module - Product listing and ECO rewards distribution
module eco_token::marketplace {
    use sui::coin::{Self, Coin, TreasuryCap};
    use sui::sui::SUI;
    use sui::event;
    use sui::clock::Clock;
    use eco_token::eco_token::{Self, ECO_TOKEN, MinterCap, EcoTokenInfo};

    // ============ Constants ============
    
    /// Reward multiplier base (100 = 1x, 150 = 1.5x)
    const REWARD_MULTIPLIER_BASE: u64 = 100;
    
    /// Minimum eco score to qualify for rewards
    const MIN_ECO_SCORE: u8 = 10;
    
    /// Error codes
    const E_INVALID_ECO_SCORE: u64 = 100;
    const E_INSUFFICIENT_PAYMENT: u64 = 101;
    const E_PRODUCT_NOT_AVAILABLE: u64 = 102;
    const E_NOT_MERCHANT: u64 = 103;

    // ============ Types ============

    /// Merchant capability - allows creating and managing products
    public struct MerchantCap has key, store {
        id: UID,
        merchant_name: vector<u8>,
        total_sales: u64,
        total_co2_reduced: u64,
    }

    /// Product listing on the marketplace
    public struct Product has key, store {
        id: UID,
        /// Product name
        name: vector<u8>,
        /// Product description
        description: vector<u8>,
        /// Price in SUI (with 9 decimals)
        price: u64,
        /// Eco score (0-100)
        eco_score: u8,
        /// CO2 reduction value in grams
        co2_reduction_value: u64,
        /// Product image URL
        image_url: vector<u8>,
        /// Merchant who listed this product
        merchant: address,
        /// Available quantity
        quantity: u64,
        /// Is product active
        is_active: bool,
    }

    /// Marketplace configuration
    public struct MarketplaceConfig has key {
        id: UID,
        /// Treasury to collect fees
        fee_treasury: address,
        /// Fee percentage (basis points, 100 = 1%)
        fee_bps: u64,
        /// Total volume traded
        total_volume: u64,
        /// Total CO2 offset through purchases
        total_co2_offset: u64,
        /// Total ECO rewards distributed
        total_rewards_distributed: u64,
    }

    // ============ Events ============

    /// Emitted when a product is purchased and rewards distributed
    /// This is the key event for triggering the "Blooming" UI effect
    public struct RewardDistributed has copy, drop {
        buyer: address,
        product_id: ID,
        product_name: vector<u8>,
        purchase_amount: u64,
        eco_reward: u64,
        co2_offset: u64,
        eco_score: u8,
        timestamp: u64,
    }

    /// Emitted when a product is listed
    public struct ProductListed has copy, drop {
        product_id: ID,
        merchant: address,
        name: vector<u8>,
        price: u64,
        eco_score: u8,
    }

    /// Emitted when a purchase is made
    public struct PurchaseCompleted has copy, drop {
        buyer: address,
        product_id: ID,
        amount_paid: u64,
        timestamp: u64,
    }

    // ============ Initialization ============

    /// Initialize the marketplace
    fun init(ctx: &mut TxContext) {
        let config = MarketplaceConfig {
            id: object::new(ctx),
            fee_treasury: tx_context::sender(ctx),
            fee_bps: 250, // 2.5% fee
            total_volume: 0,
            total_co2_offset: 0,
            total_rewards_distributed: 0,
        };

        transfer::share_object(config);
    }

    // ============ Merchant Functions ============

    /// Register as a merchant
    public fun register_merchant(
        merchant_name: vector<u8>,
        ctx: &mut TxContext
    ) {
        let merchant_cap = MerchantCap {
            id: object::new(ctx),
            merchant_name,
            total_sales: 0,
            total_co2_reduced: 0,
        };

        transfer::transfer(merchant_cap, tx_context::sender(ctx));
    }

    /// List a new product (merchant only)
    public fun list_product(
        merchant_cap: &MerchantCap,
        name: vector<u8>,
        description: vector<u8>,
        price: u64,
        eco_score: u8,
        co2_reduction_value: u64,
        image_url: vector<u8>,
        quantity: u64,
        ctx: &mut TxContext
    ) {
        assert!(eco_score <= 100, E_INVALID_ECO_SCORE);
        
        let product = Product {
            id: object::new(ctx),
            name,
            description,
            price,
            eco_score,
            co2_reduction_value,
            image_url,
            merchant: tx_context::sender(ctx),
            quantity,
            is_active: true,
        };

        event::emit(ProductListed {
            product_id: object::id(&product),
            merchant: tx_context::sender(ctx),
            name: product.name,
            price,
            eco_score,
        });

        transfer::share_object(product);
    }

    /// Update product quantity
    public fun update_quantity(
        merchant_cap: &MerchantCap,
        product: &mut Product,
        new_quantity: u64,
        ctx: &TxContext
    ) {
        assert!(product.merchant == tx_context::sender(ctx), E_NOT_MERCHANT);
        product.quantity = new_quantity;
    }

    /// Deactivate a product
    public fun deactivate_product(
        merchant_cap: &MerchantCap,
        product: &mut Product,
        ctx: &TxContext
    ) {
        assert!(product.merchant == tx_context::sender(ctx), E_NOT_MERCHANT);
        product.is_active = false;
    }

    // ============ Reward Calculation ============

    /// Calculate ECO token reward based on product attributes
    /// Formula: ECO = (CO2_reduced * eco_score) / 100
    /// Returns amount in ECO token smallest unit (9 decimals)
    public fun calculate_reward(
        product_price: u64,
        eco_score: u8,
        co2_value: u64
    ): u64 {
        if (eco_score < MIN_ECO_SCORE) {
            return 0
        };

        // Base reward from CO2 value
        let base_reward = (co2_value * (eco_score as u64)) / 100;
        
        // Apply multiplier based on price tier (higher price = more reward potential)
        let price_multiplier = if (product_price > 1_000_000_000_000) { // > 1000 SUI
            150 // 1.5x
        } else if (product_price > 100_000_000_000) { // > 100 SUI
            125 // 1.25x
        } else {
            100 // 1x
        };

        // Convert to ECO token units (9 decimals)
        // 1 gram CO2 = 1_000_000 ECO units (0.001 ECO)
        (base_reward * 1_000_000 * price_multiplier) / REWARD_MULTIPLIER_BASE
    }

    // ============ Purchase Functions ============

    /// Purchase a product and receive ECO rewards
    /// This is the main function that triggers the reward distribution
    public fun purchase_and_reward(
        treasury_cap: &mut TreasuryCap<ECO_TOKEN>,
        minter_cap: &mut MinterCap,
        token_info: &mut EcoTokenInfo,
        config: &mut MarketplaceConfig,
        product: &mut Product,
        payment: Coin<SUI>,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        // Validate product
        assert!(product.is_active, E_PRODUCT_NOT_AVAILABLE);
        assert!(product.quantity > 0, E_PRODUCT_NOT_AVAILABLE);
        
        // Validate payment
        let payment_amount = coin::value(&payment);
        assert!(payment_amount >= product.price, E_INSUFFICIENT_PAYMENT);

        // Calculate fee
        let fee_amount = (product.price * config.fee_bps) / 10000;
        let merchant_amount = product.price - fee_amount;

        // Split payment
        let merchant_payment = coin::split(&mut payment, merchant_amount, ctx);
        let fee_payment = coin::split(&mut payment, fee_amount, ctx);

        // Transfer to merchant and fee treasury
        transfer::public_transfer(merchant_payment, product.merchant);
        transfer::public_transfer(fee_payment, config.fee_treasury);

        // Return excess payment
        if (coin::value(&payment) > 0) {
            transfer::public_transfer(payment, tx_context::sender(ctx));
        } else {
            coin::destroy_zero(payment);
        };

        // Update product quantity
        product.quantity = product.quantity - 1;

        // Calculate and mint ECO reward
        let eco_reward = calculate_reward(
            product.price,
            product.eco_score,
            product.co2_reduction_value
        );

        let buyer = tx_context::sender(ctx);
        let timestamp = sui::clock::timestamp_ms(clock);

        // Mint reward tokens if eligible
        if (eco_reward > 0) {
            eco_token::mint_reward(
                treasury_cap,
                minter_cap,
                token_info,
                eco_reward,
                product.co2_reduction_value,
                buyer,
                ctx
            );

            config.total_rewards_distributed = config.total_rewards_distributed + eco_reward;
        };

        // Update marketplace stats
        config.total_volume = config.total_volume + product.price;
        config.total_co2_offset = config.total_co2_offset + product.co2_reduction_value;

        // Emit purchase event
        event::emit(PurchaseCompleted {
            buyer,
            product_id: object::id(product),
            amount_paid: product.price,
            timestamp,
        });

        // Emit reward event for UI "Blooming" effect
        event::emit(RewardDistributed {
            buyer,
            product_id: object::id(product),
            product_name: product.name,
            purchase_amount: product.price,
            eco_reward,
            co2_offset: product.co2_reduction_value,
            eco_score: product.eco_score,
            timestamp,
        });
    }

    // ============ View Functions ============

    /// Get product details
    public fun get_product_info(product: &Product): (vector<u8>, u64, u8, u64, u64, bool) {
        (
            product.name,
            product.price,
            product.eco_score,
            product.co2_reduction_value,
            product.quantity,
            product.is_active
        )
    }

    /// Get marketplace stats
    public fun get_marketplace_stats(config: &MarketplaceConfig): (u64, u64, u64) {
        (
            config.total_volume,
            config.total_co2_offset,
            config.total_rewards_distributed
        )
    }

    /// Get merchant stats
    public fun get_merchant_stats(merchant_cap: &MerchantCap): (vector<u8>, u64, u64) {
        (
            merchant_cap.merchant_name,
            merchant_cap.total_sales,
            merchant_cap.total_co2_reduced
        )
    }

    /// Preview reward for a product
    public fun preview_reward(product: &Product): u64 {
        calculate_reward(product.price, product.eco_score, product.co2_reduction_value)
    }

    // ============ Test Functions ============

    #[test_only]
    public fun init_for_testing(ctx: &mut TxContext) {
        init(ctx);
    }
}
