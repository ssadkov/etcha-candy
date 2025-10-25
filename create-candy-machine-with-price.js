const axios = require('axios');

async function createCandyMachineWithPrice() {
  try {
    console.log('🍭 Creating Candy Machine with correct price (0.1 SOL)...');
    
    // Сначала создаем коллекцию с правильной ценой
    const collectionData = {
      name: "Price Test Collection",
      eventName: "Price Test Event", // ✅ Добавляем обязательное поле
      description: "Collection for testing correct 0.1 SOL pricing",
      eventCreator: "Platform",
      eventCreatorName: "Platform",
      eventDate: "2025-01-01",
      eventLocation: "Test Location",
      maxTickets: 10,
      ticketPrice: 0.1, // ✅ Правильная цена 0.1 SOL
      imageUrl: "https://api.etcha-candy.com/images/test-collection.jpg"
    };

    console.log('📝 Creating collection...');
    const collectionResponse = await axios.post('http://localhost:3000/api/collections', collectionData);
    const collection = collectionResponse.data.data; // ✅ Исправляем структуру ответа
    
    console.log('✅ Collection created:', collection.id);
    console.log('Ticket Price:', collection.ticketPrice, 'SOL');
    
    // Создаем Collection NFT
    console.log('🎨 Creating Collection NFT...');
    const nftResponse = await axios.post(`http://localhost:3000/api/collections/${collection.id}/nft`);
    const collectionNftAddress = nftResponse.data.data.nftAddress; // ✅ Исправляем структуру ответа
    
    console.log('✅ Collection NFT created:', collectionNftAddress);
    
    // Создаем Candy Machine
    console.log('🍭 Creating Candy Machine...');
    const candyMachineResponse = await axios.post(`http://localhost:3000/api/collections/${collection.id}/candy-machine`);
    const candyMachineAddress = candyMachineResponse.data.data.candyMachineAddress; // ✅ Исправляем структуру ответа
    
    console.log('✅ Candy Machine created:', candyMachineAddress);
    
    // Проверяем статус Candy Machine
    console.log('🔍 Checking Candy Machine status...');
    const statusResponse = await axios.get(`http://localhost:3000/api/collections/${collection.id}/candy-machine`);
    const status = statusResponse.data.data; // ✅ Исправляем структуру ответа
    
    console.log('📊 Candy Machine Status:');
    console.log('- Address:', status.address);
    console.log('- Items Available:', status.itemsAvailable);
    console.log('- Items Minted:', status.itemsMinted);
    console.log('- Price:', status.price, 'SOL');
    console.log('- Symbol:', status.symbol);
    
    return {
      collectionId: collection.id,
      collectionNftAddress,
      candyMachineAddress,
      status
    };
  } catch (error) {
    console.error('❌ Error creating Candy Machine:', error.response?.data || error.message);
    throw error;
  }
}

// Run the function
createCandyMachineWithPrice()
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
