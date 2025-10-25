const { Connection, PublicKey } = require('@solana/web3.js');
const connection = new Connection('https://api.devnet.solana.com');

async function checkCollectionAndCandyMachine() {
  try {
    console.log('🎨 Checking Collection and Candy Machine info...');
    
    // Collection NFT
    const collectionNftAddress = 'CR6wcxexGpd8WEXMSQg1Bgjt5mYV9FLtJLRjQ2Zw4Udz';
    console.log('\n📝 Collection NFT:', collectionNftAddress);
    
    const collectionAccount = await connection.getAccountInfo(new PublicKey(collectionNftAddress));
    if (collectionAccount) {
      console.log('✅ Collection NFT exists on blockchain');
      console.log('📊 Account data length:', collectionAccount.data.length, 'bytes');
    } else {
      console.log('❌ Collection NFT not found');
    }
    
    // Candy Machine
    const candyMachineAddress = '8rVpkqC55YWTL83r9rLCfVyL1LRoeQ5MgGNnz7jNwFed';
    console.log('\n🍭 Candy Machine:', candyMachineAddress);
    
    const candyMachineAccount = await connection.getAccountInfo(new PublicKey(candyMachineAddress));
    if (candyMachineAccount) {
      console.log('✅ Candy Machine exists on blockchain');
      console.log('📊 Account data length:', candyMachineAccount.data.length, 'bytes');
    } else {
      console.log('❌ Candy Machine not found');
    }
    
    // Links to explorers
    console.log('\n🔗 Explorer Links:');
    console.log('Collection NFT: https://explorer.solana.com/address/' + collectionNftAddress + '?cluster=devnet');
    console.log('Candy Machine: https://explorer.solana.com/address/' + candyMachineAddress + '?cluster=devnet');
    console.log('Minted NFT: https://explorer.solana.com/address/BbUsRDGyN3rbgrkgLVQTtVuitpMvTRTdTyaBSjXE2Zsn?cluster=devnet');
    
  } catch (error) {
    console.error('❌ Error checking collection and candy machine:', error.message);
  }
}

checkCollectionAndCandyMachine();
