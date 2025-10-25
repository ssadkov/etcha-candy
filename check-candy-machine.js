const { Connection, PublicKey } = require('@solana/web3.js');
const connection = new Connection('https://api.devnet.solana.com');

async function checkCandyMachine() {
  try {
    const candyMachineAddress = 'jUn8Z1kLAqM3nKsdThPzRs6vNNQaCd6YTav9xMv8Q5G';
    console.log('🔍 Checking Candy Machine:', candyMachineAddress);
    
    const accountInfo = await connection.getAccountInfo(new PublicKey(candyMachineAddress));
    
    if (accountInfo) {
      console.log('✅ Candy Machine exists on blockchain');
      console.log('📊 Account data length:', accountInfo.data.length, 'bytes');
      console.log('🏦 Owner program:', accountInfo.owner.toBase58());
      console.log('💰 Rent exempt:', accountInfo.rentEpoch);
      
      // Get recent transactions
      const signatures = await connection.getSignaturesForAddress(new PublicKey(candyMachineAddress), { limit: 3 });
      console.log('📝 Recent transactions:', signatures.length);
      if (signatures.length > 0) {
        console.log('🕒 Latest transaction:', signatures[0].signature);
        console.log('⏰ Block time:', new Date(signatures[0].blockTime * 1000).toISOString());
      }
      
      console.log('🔗 Solana Explorer: https://explorer.solana.com/address/' + candyMachineAddress + '?cluster=devnet');
    } else {
      console.log('❌ Candy Machine not found on blockchain');
    }
  } catch (error) {
    console.error('❌ Error checking Candy Machine:', error.message);
  }
}

checkCandyMachine();
