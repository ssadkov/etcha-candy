const axios = require('axios');

async function createFinalCorrectPriceCandyMachine() {
  try {
    console.log('🍭 Creating Candy Machine with CORRECT price structure (basisPoints + currency)...');
    
    const collectionId = 'collection_1761427859093_v5a9hfr1h';
    
    console.log('📝 Creating Candy Machine...');
    const candyMachineResponse = await axios.post(`http://localhost:3000/api/collections/${collectionId}/candy-machine`);
    const candyMachine = candyMachineResponse.data.data;
    
    console.log('✅ Candy Machine created successfully!');
    console.log('📊 Candy Machine Details:');
    console.log('- Collection ID:', collectionId);
    console.log('- Candy Machine Address:', candyMachine.candyMachineAddress);
    console.log('- Items Available:', candyMachine.itemsAvailable);
    console.log('- Items Minted:', candyMachine.itemsMinted);
    console.log('- Price:', candyMachine.price, 'SOL');
    console.log('- Symbol:', candyMachine.symbol);
    console.log('- Seller Fee:', candyMachine.sellerFeeBasisPoints, 'basis points');
    
    return candyMachine;
  } catch (error) {
    console.error('❌ Error creating Candy Machine:', error.response?.data || error.message);
    throw error;
  }
}

// Run the function
createFinalCorrectPriceCandyMachine()
  .then(candyMachine => {
    console.log('\n🎉 Candy Machine creation completed!');
    console.log('Candy Machine Address:', candyMachine.candyMachineAddress);
    console.log('Price:', candyMachine.price, 'SOL');
    console.log('Items Available:', candyMachine.itemsAvailable);
    console.log('\nNext step: Check price using correct method');
  })
  .catch(error => {
    console.error('❌ Failed to create Candy Machine:', error.message);
    process.exit(1);
  });
