const axios = require('axios');

async function checkWalletBalancesAfterMinting() {
  try {
    console.log('💰 Checking wallet balances after minting...');
    
    const wallets = [
      { name: 'Alice', address: '5ZLxvtmcpbUgHJdfAtHREwT3gLey4TWU3JHteqGzciED' },
      { name: 'Bob', address: 'GcUxE5YPjFtK4ri1CZ2vG9tK9Mrt6hFSZ38cLCoC5tf7' },
      { name: 'Charlie', address: '4LJ9wbTJW3y9LJ4ZzcR3BFXJoWLJkZR4NdYzPFm72nLy' }
    ];
    
    console.log('📝 Getting current balances...');
    
    for (const wallet of wallets) {
      try {
        const response = await axios.post('https://api.devnet.solana.com', {
          jsonrpc: '2.0',
          id: 1,
          method: 'getBalance',
          params: [wallet.address]
        });
        
        const balance = response.data.result.value / 1e9;
        console.log(`- ${wallet.name}: ${balance} SOL`);
        
      } catch (error) {
        console.log(`- ${wallet.name}: Error getting balance - ${error.message}`);
      }
    }
    
    console.log('\n🔍 Expected balances after 0.1 SOL minting:');
    console.log('- Alice: ~1.13 SOL (was 1.23 SOL)');
    console.log('- Bob: ~0.34 SOL (was 0.44 SOL)');
    console.log('- Charlie: ~0.36 SOL (was 0.46 SOL)');
    
  } catch (error) {
    console.error('❌ Error checking balances:', error.message);
    throw error;
  }
}

// Run the function
checkWalletBalancesAfterMinting()
  .then(() => {
    console.log('\n🎉 Balance check completed!');
  })
  .catch(error => {
    console.error('❌ Failed to check balances:', error.message);
    process.exit(1);
  });
