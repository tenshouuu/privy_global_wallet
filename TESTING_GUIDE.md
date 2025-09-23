# Quick Testing Guide for Privy Team

## 🚀 5-Minute Bug Reproduction

### Step 1: Start Application
```bash
yarn install
yarn dev
```

### Step 2: Access Application
Open `http://localhost:3000` in browser

### Step 3: Login
1. Click **"Login"** button
2. Select **"Login with Neura Global Wallet"**
3. Complete authentication

### Step 4: Test Bug Cases

#### ❌ Bug Case (Red Button)
- Click **"Sign Transaction (With ChainId 267)"**
- **Expected**: Popup opens for signing
- **Actual**: White screen + console error

#### ✅ Working Case (Green Button)  
- Click **"Sign Transaction (No ChainId)"**
- **Expected**: Uses Neura Testnet (configured default)
- **Actual**: Uses ETH Mainnet

## 🔍 Key Files to Examine

### Configuration Files
- `src/modules/config.ts` - Chain definition
- `src/modules/PrivyProvider.tsx` - Privy configuration
- `src/modules/const.ts` - App IDs and chain ID

### Test Implementation
- `src/modules/PrivySample.tsx` - Test buttons and transaction signing

## 🎯 Console Monitoring

Open Developer Tools → Console tab to see:
```
Uncaught (in promise) c: Chain ID 267 is not supported. It must be added to the config.supportedChains property of the PrivyProvider.
```

## 🔧 Configuration Verification

The app is correctly configured with:
- ✅ Chain ID 267 in `supportedChains`
- ✅ Chain ID 267 as `defaultChain`  
- ✅ Chain ID 267 in Wagmi config
- ✅ Proper RPC URLs and block explorer

**Issue**: Despite correct configuration, Global Wallet popup fails.

## 📊 Test Results Summary

| Test Case | Expected | Actual | Status |
|-----------|----------|--------|---------|
| With ChainId 267 | Popup opens, signs on Neura Testnet | White screen, error | ❌ FAIL |
| Without ChainId | Popup opens, uses Neura Testnet | Popup opens, uses ETH Mainnet | ⚠️ PARTIAL |

## 🎯 Focus Areas for Investigation

1. **Global Wallet Provider Chain Validation**
2. **Cross-App Account Chain Support**  
3. **Popup Domain Chain Configuration**
4. **Default Chain Resolution Logic**

---

**Time to Reproduce**: ~2 minutes  
**Complexity**: Low (just click buttons)  
**Reliability**: 100% reproducible
