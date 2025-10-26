# Wallet Status

## Current Setup

### Active Wallet (In Use)
- **Address:** `5ZLxvtmcpbUgHJdfAtHREwT3gLey4TWU3JHteqGzciED`
- **Source:** `.env` file (`SOLANA_PRIVATE_KEY`)
- **Used for:**
  - Creating collections
  - Creating Candy Machines
  - Creating NFT metadata
  - Platform operations
- **Current Status:** Active with balance

### Alternative Wallet (Not Used)
- **Address:** `syhurEG8zZwZZ5921bnLXWw8Ta8JsrGt2qKvR8FgxKK`
- **Source:** `platform-wallet.json`
- **Status:** Created but not connected
- **Needs:** Balance from faucet

## Collections Created

### Solana Workshop
- **Authority:** `5ZLxvtmcpbUgHJdfAtHREwT3gLey4TWU3JHteqGzciED`
- **Candy Machine:** `5gb2yAVS38gNHZAL1qx5N6t62iVe5vSjA91pZZUJB8yj`
- **Guard destination:** `5ZLxvtmcpbUgHJdfAtHREwT3gLey4TWU3JHteqGzciED` ← Revenue goes here
- **Price:** 0.25 SOL per ticket
- **Status:** Ready for minting

## To Switch to New Wallet

If you want to use the new wallet:

1. **Fund the wallet:**
   ```
   Address: syhurEG8zZwZZ5921bnLXWw8Ta8JsrGt2qKvR8FgxKK
   ```
   https://faucet.solana.com/

2. **Update `.env`:**
   ```bash
   SOLANA_PRIVATE_KEY="[52,145,216,231,55,155,43,228,...]" // from platform-wallet.json
   ```

3. **Restart server:**
   ```bash
   npm run dev
   ```

## Current Status

✅ Everything works with current wallet  
✅ All new collections use: `5ZLxvtmcpbUgHJdfAtHREwT3gLey4TWU3JHteqGzciED`  
⚠️ New wallet created but not connected

