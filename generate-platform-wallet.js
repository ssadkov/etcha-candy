const { Keypair } = require('@solana/web3.js');
const fs = require('fs');

function generateNewWallet() {
  console.log('🔑 Generating new devnet platform wallet...');
  
  // Generate new keypair
  const keypair = Keypair.generate();
  
  const wallet = {
    publicKey: keypair.publicKey.toString(),
    privateKey: Array.from(keypair.secretKey)
  };
  
  console.log('\n✅ New wallet generated!');
  console.log('='.repeat(50));
  console.log('Public Key (Address):');
  console.log(wallet.publicKey);
  console.log('\nPrivate Key (for .env):');
  console.log(JSON.stringify(wallet.privateKey));
  console.log('='.repeat(50));
  
  // Save to file
  const filename = 'platform-wallet.json';
  fs.writeFileSync(filename, JSON.stringify(wallet, null, 2));
  
  console.log(`\n💾 Saved to: ${filename}`);
  console.log('✅ Wallet file created successfully!\n');
  
  console.log('🔗 To fund this wallet on devnet:');
  console.log(`   https://faucet.solana.com/`);
  console.log(`   Address: ${wallet.publicKey}`);
  
  return wallet;
}

generateNewWallet();

