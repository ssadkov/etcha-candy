const axios = require('axios');

async function createCandyMachineForExistingCollection() {
  try {
    console.log('🍭 Creating Candy Machine for existing collection with correct price...');
    
    // Используем существующую коллекцию с правильной ценой
    const collectionId = 'collection_1761426379700_p848z912b';
    
    console.log('📝 Using existing collection:', collectionId);
    
    // Проверяем коллекцию
    const collectionResponse = await axios.get(`http://localhost:3000/api/collections/${collectionId}`);
    const collection = collectionResponse.data.data;
    
    console.log('✅ Collection found:');
    console.log('- Name:', collection.name);
    console.log('- Ticket Price:', collection.ticketPrice, 'SOL');
    console.log('- Max Tickets:', collection.maxTickets);
    console.log('- Collection NFT:', collection.collectionNftAddress);
    
    // Создаем Candy Machine
    console.log('🍭 Creating Candy Machine...');
    const candyMachineResponse = await axios.post(`http://localhost:3000/api/collections/${collectionId}/candy-machine`);
    const candyMachineAddress = candyMachineResponse.data.data.candyMachineAddress;
    
    console.log('✅ Candy Machine created:', candyMachineAddress);
    
    // Проверяем статус Candy Machine
    console.log('🔍 Checking Candy Machine status...');
    const statusResponse = await axios.get(`http://localhost:3000/api/collections/${collectionId}/candy-machine`);
    const status = statusResponse.data.data;
    
    console.log('📊 Candy Machine Status:');
    console.log('- Address:', status.address);
    console.log('- Items Available:', status.itemsAvailable);
    console.log('- Items Minted:', status.itemsMinted);
    console.log('- Price:', status.price, 'SOL');
    console.log('- Symbol:', status.symbol);
    
    return {
      collectionId,
      collectionNftAddress: collection.collectionNftAddress,
      candyMachineAddress,
      status
    };
  } catch (error) {
    console.error('❌ Error creating Candy Machine:', error.response?.data || error.message);
    throw error;
  }
}

// Run the function
createCandyMachineForExistingCollection()
  .then(result => {
    console.log('\n🎉 Candy Machine creation completed!');
    console.log('Collection ID:', result.collectionId);
    console.log('Candy Machine Address:', result.candyMachineAddress);
    console.log('Price:', result.status.price, 'SOL');
    console.log('\nNext step: Test minting with Bob and Charlie');
  })
  .catch(error => {
    console.error('❌ Failed to create Candy Machine:', error.message);
    process.exit(1);
  });
