const { Connection, PublicKey } = require('@solana/web3.js');

async function checkWalletBalance() {
  try {
    const connection = new Connection('https://api.devnet.solana.com');
    const newWallet = 'syhurEG8zZwZZ5921bnLXWw8Ta8JsrGt2qKvR8FgxKK';
    
    console.log('💰 Checking new platform wallet balance...');
    console.log('Wallet:', newWallet);
    console.log('');
    
    const balance = await connection.getBalance(new PublicKey(newWallet));
    const balanceSOL = balance / 1e9;
    
    console.log('Balance:', balanceSOL, 'SOL');
    console.log('');
    
    if (balanceSOL < 2) {
      console.log('⚠️  Wallet needs funding!');
      console.log('   1. Go to: https://faucet.solana.com/');
      console.log('   2. Enter:', newWallet);
      console.log('   3. Get 2 SOL');
      console.log('   4. Then run: node recreate-workshop-collection.js');
    } else {
      console.log('✅ Wallet has sufficient balance!');
      console.log('   Ready to create collection.');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkWalletBalance();

