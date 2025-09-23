# Privy Global Wallet Chain Support Bug Report

## 🎯 Summary

**Bug**: Privy Global Wallet transaction signing fails with custom chain IDs despite proper configuration.

**Impact**: Prevents integration of custom blockchains with Privy Global Wallet feature.

**Priority**: High - Blocks production deployment for custom chain integrations.

## 🔍 Bug Details

### Environment
- **Privy React Auth**: `3.0.1`
- **Privy Wagmi**: `2.0.0`
- **Chain ID**: `267` (Neura Testnet)
- **Provider App ID**: `cmbpempz2011ll10l7iucga14`

### Error Location
- **Domain**: `https://privy.infra.neuraprotocol.io/oauth/transact`
- **Error**: `Chain ID 267 is not supported. It must be added to the config.supportedChains property of the PrivyProvider.`
- **Stack Trace**: `5947-6adb08b49c9d53c3.js?dpl=dpl_54bhrJkAJeboZuvagiCwGHD2bSb7:23`

## 📋 Reproduction Steps

### 1. Setup
```bash
git clone <repo>
cd privy_global_wallet
yarn install
yarn dev
```

### 2. Test Case A: With ChainId (FAILS)
1. Login with Global Wallet
2. Click "Sign Transaction (With ChainId 267)"
3. **Result**: White screen, console error

### 3. Test Case B: Without ChainId (PARTIALLY WORKS)
1. Click "Sign Transaction (No ChainId)"
2. **Result**: Popup opens, but defaults to ETH Mainnet instead of configured defaultChain

## 🔧 Configuration Analysis

### Current Setup (CORRECT)
```typescript
// config.ts
export const neuraTestnet = defineChain({
  id: 267,
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

// PrivyProvider.tsx
<PrivyProviderBase
  appId={PRIVY_APP_ID}
  config={{
    defaultChain: neuraTestnet,           // ✅ Set correctly
    supportedChains: [neuraTestnet],      // ✅ Chain 267 included
    embeddedWallets: {
      ethereum: {
        createOnLogin: "users-without-wallets",
      },
    },
  }}
>
  <WagmiProvider config={wagmiConfig}>   // ✅ Chain 267 configured
    {children}
  </WagmiProvider>
</PrivyProviderBase>
```

### Transaction Object (CORRECT)
```typescript
const testTransaction = {
  to: walletAddress,
  value: '0',
  gas: '21000',
  gasPrice: '20000000000',
  nonce: '0',
  data: '0x',
  chainId: 267,  // ✅ Matches configured chain
};
```

## 🚨 Root Cause Analysis

### Hypothesis 1: Global Wallet Provider Chain Validation
The Global Wallet provider (`cmbpempz2011ll10l7iucga14`) may have its own chain validation logic that doesn't recognize chain ID 267.

### Hypothesis 2: Cross-App Account Chain Support
Cross-app accounts might require additional chain configuration beyond the standard PrivyProvider setup.

### Hypothesis 3: Popup Domain Chain Support
The popup domain `privy.infra.neuraprotocol.io` might have different chain support than the main Privy infrastructure.

## 🎯 Expected Behavior

1. **With ChainId**: Transaction signing popup should open and allow signing on Neura Testnet (chain 267)
2. **Without ChainId**: Should default to the configured `defaultChain` (Neura Testnet), not ETH Mainnet

## 🔍 Debugging Information

### Console Errors (Full Context)
```
Refused to load script https://www.googletagmanager.com/gtm.js?id=GTM-WV9MVTB3 because it violates CSP directive
Failed to load resource: 404 manifest.json
Uncaught (in promise) c: Chain ID 267 is not supported. It must be added to the config.supportedChains property of the PrivyProvider.
```

### Network Requests
- **Success**: `https://privy.infra.neuraprotocol.io/oauth/transact` loads
- **Failure**: White screen with JavaScript error

## 🛠️ Potential Solutions

### Solution 1: Provider-Specific Chain Configuration
```typescript
// May need provider-specific chain configuration
config: {
  globalWallets: {
    [NEURA_PROVIDER_APP_ID]: {
      supportedChains: [neuraTestnet],
    },
  },
}
```

### Solution 2: Cross-App Account Chain Setup
```typescript
// May need cross-app specific configuration
crossAppAccounts: {
  supportedChains: [neuraTestnet],
}
```

### Solution 3: Popup Domain Chain Registration
The popup domain might need to be configured with supported chains.

## 📊 Impact Assessment

- **Severity**: High - Blocks custom chain integration
- **Affected Users**: All users attempting to use custom chains with Global Wallet
- **Workaround**: None available - functionality completely broken

## 🎯 Next Steps for Privy Team

1. **Investigate Global Wallet chain validation logic**
2. **Check if provider app needs chain configuration**
3. **Verify popup domain chain support**
4. **Test with other custom chains to confirm scope**

## 📞 Contact

For additional debugging information or test access, please contact the development team.

---

**Status**: 🐛 Confirmed bug requiring investigation by Privy team  
**Last Updated**: [Current Date]  
**Reproducible**: ✅ Yes, 100% reproducible
