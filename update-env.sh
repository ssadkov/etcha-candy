#!/bin/bash
# Update .env with new wallet private key

NEW_PRIVATE_KEY="[52,145,216,231,55,155,43,228,66,198,127,198,189,42,120,226,97,5,213,79,111,14,7,227,76,113,65,184,103,102,63,189,13,15,40,76,83,242,4,242,5,101,102,241,240,65,219,190,172,26,38,148,53,181,251,39,220,4,225,198,143,174,33,186]"

echo "SOLANA_PRIVATE_KEY=$NEW_PRIVATE_KEY" > .env
echo "PORT=3000" >> .env
echo "SOLANA_RPC_URL=https://api.devnet.solana.com" >> .env
echo "NODE_ENV=development" >> .env

echo "✅ .env updated with new wallet!"
echo ""
echo "New Platform Wallet: syhurEG8zZwZZ5921bnLXWw8Ta8JsrGt2qKvR8FgxKK"
echo "Next step: Fund this wallet on https://faucet.solana.com/"

