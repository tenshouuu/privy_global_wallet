# Privy Global Wallet Bug Report

## 🐛 Bug Description

This repository demonstrates a critical bug in Privy's Global Wallet integration where transaction signing fails with a white screen when using custom chain IDs.

### Bug Behavior

1. **With Chain ID**: When signing a transaction with `chainId: 267` (Neura Testnet), the Privy popup shows a white screen and fails
2. **Without Chain ID**: When signing a transaction without `chainId`, the popup opens successfully but defaults to ETH Mainnet

### Error Details

**Error Location**: `https://privy.infra.neuraprotocol.io/oauth/transact`

**Console Error**:
```
Uncaught (in promise) c: Chain ID 267 is not supported. It must be added to the config.supportedChains property of the PrivyProvider.
```

**File**: `5947-6adb08b49c9d53c3.js?dpl=dpl_54bhrJkAJeboZuvagiCwGHD2bSb7:23`

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- Yarn package manager

### Installation

1. **Clone and install dependencies**:
   ```bash
   git clone <repository-url>
   cd privy_global_wallet
   yarn install
   ```

2. **Start development server**:
   ```bash
   yarn dev
   ```

3. **Open application**:
   - Navigate to `http://localhost:3000` (or the port shown in terminal)

## 🧪 Bug Reproduction Steps

### Step 1: Login with Global Wallet

1. Click **"Login"** button
2. Select **"Login with Neura Global Wallet"** (or the configured global wallet provider)
3. Complete authentication process
4. Verify you see "Connected" status with account address

### Step 2: Test Transaction Signing

You'll see two test buttons:

#### ❌ **Bug Case: Sign Transaction (With ChainId 267)**
1. Click the **red button**: "Sign Transaction (With ChainId 267)"
2. **Expected**: Privy popup should open for transaction signing
3. **Actual Bug**: White screen appears at `https://privy.infra.neuraprotocol.io/oauth/transact`
4. **Console Error**: `Chain ID 267 is not supported. It must be added to the config.supportedChains property of the PrivyProvider.`

#### ✅ **Working Case: Sign Transaction (No ChainId)**
1. Click the **green button**: "Sign Transaction (No ChainId)"
2. **Expected**: Privy popup opens successfully
3. **Actual**: Popup opens but defaults to ETH Mainnet instead of Neura Testnet

## 🔍 Technical Investigation

### Configuration Analysis

The application is properly configured with Neura Testnet:

**File**: `src/modules/config.ts`
```typescript
export const neuraTestnet = defineChain({
  id: DEFAULT_CHAIN_ID, // 267
  name: 'Neura Testnet',
  testnet: true,
  nativeCurrency: { name: 'ANKR', symbol: 'ANKR', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://testnet.rpc.neuraprotocol.io'] },
  },
  blockExplorers: {
    default: {
      name: 'Neura Explorer',
      url: 'https://testnet-blockscout.infra.neuraprotocol.io/',
    },
  },
});
```

**File**: `src/modules/PrivyProvider.tsx`
```typescript
<PrivyProviderBase
  appId={PRIVY_APP_ID}
  config={{
    // ... other config
    defaultChain: neuraTestnet,
    supportedChains: [neuraTestnet], // ✅ Chain 267 is properly configured
  }}
>
```

### Issue Analysis

Despite `chainId: 267` being properly configured in:
- `PrivyProvider.supportedChains`
- `WagmiProvider` chains
- Transaction object

The Privy Global Wallet popup still fails with "Chain ID 267 is not supported" error.

## 🎯 Expected vs Actual Behavior

| Scenario | Expected Behavior | Actual Behavior |
|----------|------------------|-----------------|
| **With ChainId 267** | Popup opens, signs transaction on Neura Testnet | White screen, console error about unsupported chain |
| **Without ChainId** | Popup opens, uses configured default chain (Neura Testnet) | Popup opens, but defaults to ETH Mainnet |

## 🔧 Environment Details

- **Privy React Auth**: `^3.0.1`
- **Privy Wagmi**: `^2.0.0`
- **Wagmi**: `2.17.2`
- **Next.js**: `15.5.3`
- **React**: `19.1.0`

## 📋 Additional Observations

1. **Content Security Policy errors** in console (not related to main bug)
2. **Missing manifest.json** 404 errors (not critical)
3. **Google Tag Manager** CSP violations (not related to transaction signing)

## 🎯 For Privy Developers

### Debugging Suggestions

1. Check if Global Wallet provider has its own chain validation logic
2. Verify if `cross_app` account type requires different chain configuration
3. Investigate if popup domain (`privy.infra.neuraprotocol.io`) has different chain support than main Privy infrastructure

## 📝 Test Cases

### Test Case 1: Transaction with ChainId
```typescript
const testTransaction = {
  to: walletAddress,
  value: '0',
  gas: '21000',
  gasPrice: '20000000000',
  nonce: '0',
  data: '0x',
  chainId: 267, // ❌ Causes white screen
};
```

### Test Case 2: Transaction without ChainId
```typescript
const testTransaction = {
  to: walletAddress,
  value: '0',
  gas: '21000',
  gasPrice: '20000000000',
  nonce: '0',
  data: '0x',
  // No chainId - defaults to ETH Mainnet instead of configured defaultChain
};
```

---

**Repository**: This is a minimal reproduction case for Privy Global Wallet chain configuration bug.  
**Status**: 🐛 Confirmed bug affecting custom chain support in Global Wallet integration.
