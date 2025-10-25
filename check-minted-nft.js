const { Connection, PublicKey } = require('@solana/web3.js');
const connection = new Connection('https://api.devnet.solana.com');

async function checkMintedNFT() {
  try {
    const nftAddress = 'BbUsRDGyN3rbgrkgLVQTtVuitpMvTRTdTyaBSjXE2Zsn';
    console.log('🎫 Checking minted NFT:', nftAddress);
    
    const accountInfo = await connection.getAccountInfo(new PublicKey(nftAddress));
    
    if (accountInfo) {
      console.log('✅ NFT exists on blockchain');
      console.log('📊 Account data length:', accountInfo.data.length, 'bytes');
      console.log('🏦 Owner program:', accountInfo.owner.toBase58());
      console.log('💰 Rent exempt:', accountInfo.rentEpoch);
      
      // Get recent transactions
      const signatures = await connection.getSignaturesForAddress(new PublicKey(nftAddress), { limit: 3 });
      console.log('📝 Recent transactions:', signatures.length);
      if (signatures.length > 0) {
        console.log('🕒 Latest transaction:', signatures[0].signature);
        console.log('⏰ Block time:', new Date(signatures[0].blockTime * 1000).toISOString());
      }
      
      console.log('🔗 Solana Explorer: https://explorer.solana.com/address/' + nftAddress + '?cluster=devnet');
    } else {
      console.log('❌ NFT not found on blockchain');
    }
  } catch (error) {
    console.error('❌ Error checking NFT:', error.message);
  }
}

checkMintedNFT();
