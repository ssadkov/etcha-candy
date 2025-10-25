const { Connection, PublicKey } = require('@solana/web3.js');
const connection = new Connection('https://api.devnet.solana.com');

async function checkNFTOwner() {
  try {
    const nftAddress = 'BbUsRDGyN3rbgrkgLVQTtVuitpMvTRTdTyaBSjXE2Zsn';
    console.log('🎫 Checking NFT owner for:', nftAddress);
    
    // Get the transaction details to see who minted it
    const signatures = await connection.getSignaturesForAddress(new PublicKey(nftAddress), { limit: 1 });
    
    if (signatures.length > 0) {
      const signature = signatures[0].signature;
      console.log('📝 Transaction signature:', signature);
      
      const transaction = await connection.getTransaction(signature, {
        commitment: 'confirmed',
        maxSupportedTransactionVersion: 0
      });
      
      if (transaction) {
        console.log('⏰ Transaction time:', new Date(transaction.blockTime * 1000).toISOString());
        
        // Get the signer (minter)
        if (transaction.transaction.message.staticAccountKeys.length > 0) {
          const signer = transaction.transaction.message.staticAccountKeys[0];
          console.log('✍️ Transaction signer (minter):', signer.toBase58());
          
          // Check if this is one of our test wallets
          const testWallets = [
            { name: 'Alice', wallet: '5ZLxvtmcpbUgHJdfAtHREwT3gLey4TWU3JHteqGzciED' },
            { name: 'Bob', wallet: 'GcUxE5YPjFtK4ri1CZ2vG9tK9Mrt6hFSZ38cLCoC5tf7' },
            { name: 'Charlie', wallet: '4LJ9wbTJW3y9LJ4ZzcR3BFXJoWLJkZR4NdYzPFm72nLy' }
          ];
          
          const walletInfo = testWallets.find(w => w.wallet === signer.toBase58());
          if (walletInfo) {
            console.log('✅ Minter found in test wallets:', walletInfo.name);
          } else {
            console.log('ℹ️ Minter is not in our test wallets');
          }
          
          console.log('🔗 Minter Explorer: https://explorer.solana.com/address/' + signer.toBase58() + '?cluster=devnet');
        }
        
        console.log('🔗 Transaction Explorer: https://explorer.solana.com/tx/' + signature + '?cluster=devnet');
      }
    } else {
      console.log('❌ No transactions found for this NFT');
    }
  } catch (error) {
    console.error('❌ Error checking NFT owner:', error.message);
  }
}

checkNFTOwner();
