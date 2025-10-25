const axios = require('axios');

async function checkCandyMachineGuards() {
  try {
    console.log('🔍 Checking Candy Machine guards and price settings...');
    
    const candyMachineAddress = 'EBDiuSexmy37aQLWpDX31xetDvrMYnAxdeT9xgmD2gVb';
    
    console.log('📝 Getting Candy Machine details from blockchain...');
    
    // Используем Solana RPC для получения данных Candy Machine
    const response = await axios.post('https://api.devnet.solana.com', {
      jsonrpc: '2.0',
      id: 1,
      method: 'getAccountInfo',
      params: [
        candyMachineAddress,
        { encoding: 'base64' }
      ]
    });
    
    if (response.data.result && response.data.result.value) {
      console.log('✅ Candy Machine found on blockchain');
      console.log('📊 Account Info:');
      console.log('- Owner:', response.data.result.value.owner);
      console.log('- Lamports:', response.data.result.value.lamports);
      console.log('- Executable:', response.data.result.value.executable);
      console.log('- Rent Epoch:', response.data.result.value.rentEpoch);
    } else {
      console.log('❌ Candy Machine not found on blockchain');
    }
    
    // Также проверим через наш API
    console.log('\n📝 Checking through our API...');
    try {
      const apiResponse = await axios.get(`http://localhost:3000/api/candy-machine/${candyMachineAddress}/info`);
      console.log('API Response:', JSON.stringify(apiResponse.data, null, 2));
    } catch (apiError) {
      console.log('API Error:', apiError.response?.data || apiError.message);
    }
    
  } catch (error) {
    console.error('❌ Error checking Candy Machine:', error.response?.data || error.message);
    throw error;
  }
}

// Run the function
checkCandyMachineGuards()
  .then(() => {
    console.log('\n🎉 Candy Machine check completed!');
  })
  .catch(error => {
    console.error('❌ Failed to check Candy Machine:', error.message);
    process.exit(1);
  });
