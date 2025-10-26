# 🔐 Security Notice

## Private Keys Storage

### ✅ SAFE (Current Setup)
- **Platform Wallet Key**: `SOLANA_PRIVATE_KEY` environment variable
  - Location: `.env` file (not in git)
  - Used for: Platform operations (creating NFT, collections, marketplace)

### ⚠️ TEST WALLETS (Local Only)
- **Location**: `data/test-wallets.json` (in `.gitignore`)
- **Purpose**: Local devnet testing only
- **Wallets**: Alice, Bob, Charlie (test users)
- **NEVER commit to git!**

### 🗑️ Files with Private Keys (REMOVED from git)
- `data/test-wallets.json`
- `test-wallet-1.json`
- `test-wallet-2.json`
- `test-wallet-3.json`
- `dev-wallet.json`
- `test-keypair.json`

## 🔒 Security Checklist

✅ `.gitignore` updated to exclude:
- `.env` files
- `*.json` except package files
- `data/test-wallets.json`

✅ Private keys NOT in git history (removed from cache)

⚠️ **IMPORTANT**: 
- Never commit real private keys
- Use environment variables for production
- Test wallets only for devnet testing
- Rotate keys if they were ever in git history

## 🚨 If Keys Were Exposed

If you've pushed to a public repo before this fix:

1. **Generate new test wallets** (devnet can be regenerated)
2. **Platform wallet**: Change immediately if it was exposed!
3. **Use GitHub's secret scanning** to check for exposure
4. **Consider**: Rewrite git history with `git filter-branch` or BFG Repo-Cleaner

## 📝 Current Setup

```
.env (NOT in git)
├─ SOLANA_PRIVATE_KEY: Platform wallet
└─ Used for platform operations

data/test-wallets.json (NOT in git)
├─ Alice wallet (test)
├─ Bob wallet (test)  
└─ Charlie wallet (test)
```

