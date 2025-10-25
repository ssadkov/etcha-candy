const axios = require('axios');

async function getTestWallets() {
  try {
    console.log('👥 Getting test wallets...');
    
    console.log('📝 Fetching test wallets...');
    const walletsResponse = await axios.get('http://localhost:3000/api/test-wallets');
    const wallets = walletsResponse.data.data;
    
    console.log('✅ Test wallets retrieved!');
    console.log('📊 Available Test Wallets:');
    
    if (Array.isArray(wallets)) {
      wallets.forEach((wallet, index) => {
        console.log(`${index + 1}. ${wallet.name}: ${wallet.wallet}`);
      });
    } else if (wallets && wallets.wallets) {
      wallets.wallets.forEach((wallet, index) => {
        console.log(`${index + 1}. ${wallet.name}: ${wallet.wallet}`);
      });
    } else {
      console.log('Wallets structure:', wallets);
    }
    
    return wallets;
  } catch (error) {
    console.error('❌ Error getting test wallets:', error.response?.data || error.message);
    throw error;
  }
}

// Run the function
getTestWallets()
  .then(wallets => {
    console.log('\n🎉 Test wallets retrieved successfully!');
  })
  .catch(error => {
    console.error('❌ Failed to get test wallets:', error.message);
    process.exit(1);
  });
