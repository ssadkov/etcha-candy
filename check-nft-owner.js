const { Connection, PublicKey } = require('@solana/web3.js');
const connection = new Connection('https://api.devnet.solana.com');

async function checkNFTOwner() {
  try {
    const nftAddress = 'BbUsRDGyN3rbgrkgLVQTtVuitpMvTRTdTyaBSjXE2Zsn';
    console.log('🎫 Checking NFT owner for:', nftAddress);
    
    // Get token accounts for this mint
    const tokenAccounts = await connection.getTokenAccountsByMint(new PublicKey(nftAddress));
    
    if (tokenAccounts.value.length > 0) {
      const tokenAccount = tokenAccounts.value[0];
      const accountInfo = await connection.getParsedAccountInfo(tokenAccount.pubkey);
      
      if (accountInfo.value && accountInfo.value.data && accountInfo.value.data.parsed) {
        const owner = accountInfo.value.data.parsed.info.owner;
        console.log('👤 NFT Owner:', owner);
        
        // Check if this is one of our test wallets
        const testWallets = [
          { name: 'Alice', wallet: '5ZLxvtmcpbUgHJdfAtHREwT3gLey4TWU3JHteqGzciED' },
          { name: 'Bob', wallet: 'GcUxE5YPjFtK4ri1CZ2vG9tK9Mrt6hFSZ38cLCoC5tf7' },
          { name: 'Charlie', wallet: '4LJ9wbTJW3y9LJ4ZzcR3BFXJoWLJkZR4NdYzPFm72nLy' }
        ];
        
        const walletInfo = testWallets.find(w => w.wallet === owner);
        if (walletInfo) {
          console.log('✅ Owner found in test wallets:', walletInfo.name);
        } else {
          console.log('ℹ️ Owner is not in our test wallets');
        }
        
        console.log('🔗 Owner Explorer: https://explorer.solana.com/address/' + owner + '?cluster=devnet');
      }
    } else {
      console.log('❌ No token accounts found for this NFT');
    }
  } catch (error) {
    console.error('❌ Error checking NFT owner:', error.message);
  }
}

checkNFTOwner();
