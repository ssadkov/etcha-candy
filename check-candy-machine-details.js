const axios = require('axios');

async function checkCandyMachineDetails() {
  try {
    console.log('🔍 Checking Candy Machine details...');
    
    const candyMachineAddress = 'EBDiuSexmy37aQLWpDX31xetDvrMYnAxdeT9xgmD2gVb';
    
    console.log('📝 Getting Candy Machine info...');
    const infoResponse = await axios.get(`http://localhost:3000/api/candy-machine/${candyMachineAddress}/info`);
    const info = infoResponse.data.data;
    
    console.log('✅ Candy Machine info retrieved!');
    console.log('📊 Candy Machine Details:');
    console.log('- Address:', candyMachineAddress);
    console.log('- Items Available:', info.itemsAvailable);
    console.log('- Items Minted:', info.itemsMinted);
    console.log('- Items Remaining:', info.itemsAvailable - info.itemsMinted);
    console.log('- Price:', info.price, 'SOL');
    console.log('- Symbol:', info.symbol);
    console.log('- Seller Fee:', info.sellerFeeBasisPoints, 'basis points');
    console.log('- Is Fully Loaded:', info.isFullyLoaded);
    console.log('- Is Active:', info.isActive);
    
    return info;
  } catch (error) {
    console.error('❌ Error getting Candy Machine info:', error.response?.data || error.message);
    throw error;
  }
}

// Run the function
checkCandyMachineDetails()
  .then(info => {
    console.log('\n🎉 Candy Machine info retrieved successfully!');
    console.log('Price:', info.price, 'SOL');
    console.log('Items Available:', info.itemsAvailable);
    console.log('Items Minted:', info.itemsMinted);
  })
  .catch(error => {
    console.error('❌ Failed to get Candy Machine info:', error.message);
    process.exit(1);
  });
