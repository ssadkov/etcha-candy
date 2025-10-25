const axios = require('axios');

async function checkWalletBalance() {
  try {
    console.log('💰 Checking wallet balance...');
    
    const userWallet = '5ZLxvtmcpbUgHJdfAtHREwT3gLey4TWU3JHteqGzciED';
    
    console.log('📝 Getting wallet balance...');
    const balanceResponse = await axios.get(`https://api.devnet.solana.com`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        jsonrpc: '2.0',
        id: 1,
        method: 'getBalance',
        params: [userWallet]
      }
    });
    
    const balance = balanceResponse.data.result.value / 1e9;
    
    console.log('✅ Wallet balance retrieved!');
    console.log('📊 Wallet Details:');
    console.log('- Address:', userWallet);
    console.log('- Balance:', balance, 'SOL');
    
    return balance;
  } catch (error) {
    console.error('❌ Error getting wallet balance:', error.response?.data || error.message);
    throw error;
  }
}

// Run the function
checkWalletBalance()
  .then(balance => {
    console.log('\n🎉 Balance check completed!');
    console.log('Current Balance:', balance, 'SOL');
  })
  .catch(error => {
    console.error('❌ Failed to get balance:', error.message);
    process.exit(1);
  });
