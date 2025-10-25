const axios = require('axios');

async function createCorrectPriceCandyMachine() {
  try {
    console.log('🍭 Creating Candy Machine with CORRECT price (0.1 SOL = 100,000,000 lamports)...');
    
    const collectionId = 'collection_1761427515287_2b5m46rin';
    
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
createCorrectPriceCandyMachine()
  .then(candyMachine => {
    console.log('\n🎉 Candy Machine creation completed!');
    console.log('Candy Machine Address:', candyMachine.candyMachineAddress);
    console.log('Price:', candyMachine.price, 'SOL');
    console.log('Items Available:', candyMachine.itemsAvailable);
    console.log('\nNext step: Test minting with correct price');
  })
  .catch(error => {
    console.error('❌ Failed to create Candy Machine:', error.message);
    process.exit(1);
  });
