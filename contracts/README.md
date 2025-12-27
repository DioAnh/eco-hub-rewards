# EcoShop Smart Contracts - Sui Move

Đây là bộ smart contract cho ECO Token trên Sui blockchain.

## Cấu trúc Package

```
contracts/
└── eco_token/
    ├── Move.toml
    └── sources/
        ├── eco_token.move    # ECO Token (sui::coin standard)
        ├── marketplace.move  # Marketplace & Rewards
        └── staking.move      # Staking với APY
```

## Modules

### 1. eco_token
Token ECO theo chuẩn `sui::coin` với các tính năng:
- **TreasuryCap**: Quản lý mint/burn
- **Capped Supply**: 100 triệu ECO tokens
- **MinterCap**: Chỉ marketplace/governance mới được mint
- **Events**: `TokenMinted`, `TokenBurned`

### 2. marketplace
Marketplace với hệ thống rewards:
- **MerchantCap**: Đăng ký merchant
- **Product Objects**: Chứa `eco_score` và `co2_reduction_value`
- **calculate_reward()**: Tính toán ECO reward
- **purchase_and_reward()**: Mua hàng và nhận thưởng
- **Events**: `RewardDistributed` (trigger UI Blooming effect)

### 3. staking
Staking ECO token với APY:
- 7 ngày: 5% APY
- 30 ngày: 10% APY
- 90 ngày: 15% APY
- 365 ngày: 25% APY

## Deployment Guide (Testnet)

### 1. Cài đặt Sui CLI

```bash
# Cài đặt Sui CLI
cargo install --locked --git https://github.com/MystenLabs/sui.git --branch testnet sui

# Kiểm tra version
sui --version
```

### 2. Tạo Wallet

```bash
# Tạo wallet mới
sui client new-address ed25519

# Lấy testnet tokens từ faucet
sui client faucet
```

### 3. Build & Deploy

```bash
# Di chuyển vào thư mục contract
cd contracts/eco_token

# Build package
sui move build

# Deploy lên testnet
sui client publish --gas-budget 100000000

# Lưu lại Package ID và các Object IDs
```

### 4. Sau khi Deploy

Bạn sẽ nhận được các Object IDs quan trọng:
- **Package ID**: ID của smart contract package
- **TreasuryCap**: Dùng để mint tokens
- **AdminCap**: Quyền admin
- **EcoTokenInfo**: Theo dõi supply
- **MarketplaceConfig**: Config marketplace
- **StakingPool**: Pool staking

### 5. Tạo MinterCap cho Marketplace

```bash
# Gọi hàm create_minter_cap
sui client call \
  --package <PACKAGE_ID> \
  --module eco_token \
  --function create_minter_cap \
  --args <ADMIN_CAP_ID> 1000000000000000000 <MARKETPLACE_ADDRESS> \
  --gas-budget 10000000
```

## Tích hợp với Frontend

### 1. Lắng nghe RewardDistributed Event

```typescript
import { SuiClient } from '@mysten/sui/client';

const client = new SuiClient({ url: 'https://fullnode.testnet.sui.io' });

// Subscribe to RewardDistributed events
const unsubscribe = await client.subscribeEvent({
  filter: {
    MoveEventType: `${PACKAGE_ID}::marketplace::RewardDistributed`,
  },
  onMessage: (event) => {
    const { buyer, eco_reward, co2_offset, product_name } = event.parsedJson;
    
    // Trigger Blooming animation
    triggerBloomAnimation({
      amount: eco_reward,
      co2: co2_offset,
      productName: product_name,
    });
  },
});
```

### 2. Gọi purchase_and_reward

```typescript
import { Transaction } from '@mysten/sui/transactions';

async function purchaseProduct(productId: string, paymentAmount: bigint) {
  const tx = new Transaction();
  
  // Split SUI for payment
  const [paymentCoin] = tx.splitCoins(tx.gas, [paymentAmount]);
  
  tx.moveCall({
    target: `${PACKAGE_ID}::marketplace::purchase_and_reward`,
    arguments: [
      tx.object(TREASURY_CAP_ID),
      tx.object(MINTER_CAP_ID),
      tx.object(TOKEN_INFO_ID),
      tx.object(MARKETPLACE_CONFIG_ID),
      tx.object(productId),
      paymentCoin,
      tx.object('0x6'), // Clock object
    ],
  });
  
  const result = await signAndExecuteTransaction({ transaction: tx });
  return result;
}
```

### 3. Stake ECO Tokens

```typescript
async function stakeTokens(amount: bigint, durationDays: number) {
  const tx = new Transaction();
  
  // Duration in milliseconds
  const duration = BigInt(durationDays * 24 * 60 * 60 * 1000);
  
  // Get ECO coin to stake
  const [stakeCoin] = tx.splitCoins(tx.object(ECO_COIN_ID), [amount]);
  
  tx.moveCall({
    target: `${PACKAGE_ID}::staking::stake`,
    arguments: [
      tx.object(STAKING_POOL_ID),
      stakeCoin,
      tx.pure.u64(duration),
      tx.object('0x6'), // Clock
    ],
  });
  
  return signAndExecuteTransaction({ transaction: tx });
}
```

## Events Reference

| Event | Module | Description |
|-------|--------|-------------|
| `TokenMinted` | eco_token | ECO được mint |
| `TokenBurned` | eco_token | ECO bị burn |
| `MinterAuthorized` | eco_token | Minter mới được tạo |
| `ProductListed` | marketplace | Sản phẩm được list |
| `PurchaseCompleted` | marketplace | Mua hàng thành công |
| `RewardDistributed` | marketplace | **Key event** - Trigger UI Bloom |
| `TokensStaked` | staking | Stake ECO |
| `TokensUnstaked` | staking | Unstake ECO |
| `RewardsClaimed` | staking | Claim staking rewards |

## Reward Formula

```
ECO_reward = (CO2_reduced * eco_score / 100) * price_multiplier * 1_000_000

Where:
- CO2_reduced: grams of CO2 offset
- eco_score: 0-100
- price_multiplier: 1x (default), 1.25x (>100 SUI), 1.5x (>1000 SUI)
- 1_000_000: conversion to ECO smallest unit (9 decimals)
```

## Testing

```bash
# Run tests
sui move test

# Test with coverage
sui move test --coverage
```

## Security Considerations

1. **TreasuryCap** phải được giữ an toàn bởi admin
2. **MinterCap** chỉ cấp cho trusted modules
3. Tất cả mint operations đều check `max_supply`
4. Events được emit cho mọi state changes quan trọng
