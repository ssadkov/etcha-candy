const axios = require('axios');

async function createNewCollectionWithCorrectPrice() {
  try {
    console.log('🎯 Creating new collection with correct price (0.1 SOL)...');
    
    const collectionData = {
      name: "Correct Price Collection",
      eventName: "Correct Price Event",
      description: "Collection with correct 0.1 SOL pricing",
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
    const collection = collectionResponse.data.data;
    
    console.log('✅ Collection created:');
    console.log('- ID:', collection.id);
    console.log('- Name:', collection.name);
    console.log('- Ticket Price:', collection.ticketPrice, 'SOL');
    console.log('- Max Tickets:', collection.maxTickets);
    
    // Создаем Collection NFT
    console.log('🎨 Creating Collection NFT...');
    const nftResponse = await axios.post(`http://localhost:3000/api/collections/${collection.id}/nft`);
    const collectionNftAddress = nftResponse.data.data.nftAddress;
    
    console.log('✅ Collection NFT created:', collectionNftAddress);
    
    // Создаем Candy Machine
    console.log('🍭 Creating Candy Machine...');
    const candyMachineResponse = await axios.post(`http://localhost:3000/api/collections/${collection.id}/candy-machine`);
    const candyMachineAddress = candyMachineResponse.data.data.candyMachineAddress;
    
    console.log('✅ Candy Machine created:', candyMachineAddress);
    
    // Проверяем статус Candy Machine
    console.log('🔍 Checking Candy Machine status...');
    const statusResponse = await axios.get(`http://localhost:3000/api/collections/${collection.id}/candy-machine`);
    const status = statusResponse.data.data;
    
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
    console.error('❌ Error creating collection:', error.response?.data || error.message);
    throw error;
  }
}

// Run the function
createNewCollectionWithCorrectPrice()
  .then(result => {
    console.log('\n🎉 Collection creation completed!');
    console.log('Collection ID:', result.collectionId);
    console.log('Candy Machine Address:', result.candyMachineAddress);
    console.log('Price:', result.status.price, 'SOL');
    console.log('\nNext step: Test minting with Bob and Charlie');
  })
  .catch(error => {
    console.error('❌ Failed to create collection:', error.message);
    process.exit(1);
  });
