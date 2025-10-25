const { Connection, PublicKey } = require('@solana/web3.js');
const connection = new Connection('https://api.devnet.solana.com');

async function checkAliceNewNFT() {
  try {
    const nftAddress = '7byxYWyfXgMUcMQ8UyZ3jrZiSiqueczcuTLzxniy2JDQ';
    console.log('🎫 Checking Alice\'s new minted NFT:', nftAddress);
    
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
        
        // Get transaction details to see who minted it
        const transaction = await connection.getTransaction(signatures[0].signature, {
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
          
          console.log('🔗 Transaction Explorer: https://explorer.solana.com/tx/' + signatures[0].signature + '?cluster=devnet');
        }
      }
      
      console.log('🔗 NFT Explorer: https://explorer.solana.com/address/' + nftAddress + '?cluster=devnet');
    } else {
      console.log('❌ NFT not found on blockchain');
    }
  } catch (error) {
    console.error('❌ Error checking NFT:', error.message);
  }
}

checkAliceNewNFT();
