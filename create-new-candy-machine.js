const axios = require('axios');

async function createNewCandyMachineWithPrice() {
  try {
    console.log('🎯 Creating new Candy Machine with correct price...');
    
    // Используем существующую коллекцию с правильной ценой
    const collectionId = 'collection_1761426504747_1hykk4p22'; // Final Price Test Collection
    
    console.log('📝 Using collection:', collectionId);
    
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
    
    // Тестируем минтинг с Bob
    console.log('🎫 Testing minting with Bob...');
    const mintResponse = await axios.post('http://localhost:3000/api/tickets/mint', {
      collectionId: collectionId,
      userWallet: 'GcUxE5YPjFtK4ri1CZ2vG9tK9Mrt6hFSZ38cLCoC5tf7', // Bob
      quantity: 1
    });
    
    console.log('✅ Minting successful:', mintResponse.data);
    
    return {
      collectionId,
      candyMachineAddress,
      status,
      mintResult: mintResponse.data
    };
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    throw error;
  }
}

// Run the function
createNewCandyMachineWithPrice()
  .then(result => {
    console.log('\n🎉 Test completed!');
    console.log('Collection ID:', result.collectionId);
    console.log('Candy Machine Address:', result.candyMachineAddress);
    console.log('Price:', result.status.price, 'SOL');
    console.log('Mint Result:', result.mintResult);
  })
  .catch(error => {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  });
