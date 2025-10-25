const axios = require('axios');

async function createCollectionWithCorrectPrice() {
  try {
    console.log('🎯 Creating new collection with correct price (0.1 SOL)...');
    
    const collectionData = {
      name: "Price Test", // ✅ Короткое имя
      eventName: "Price Test", // ✅ Короткое имя события
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
    
    console.log('✅ Collection created successfully!');
    console.log('📊 Collection Details:');
    console.log('- ID:', collection.id);
    console.log('- Name:', collection.name);
    console.log('- Event Name:', collection.eventName);
    console.log('- Ticket Price:', collection.ticketPrice, 'SOL');
    console.log('- Max Tickets:', collection.maxTickets);
    console.log('- Collection NFT Address:', collection.collectionNftAddress);
    
    return collection;
  } catch (error) {
    console.error('❌ Error creating collection:', error.response?.data || error.message);
    throw error;
  }
}

// Run the function
createCollectionWithCorrectPrice()
  .then(collection => {
    console.log('\n🎉 Collection creation completed!');
    console.log('Collection ID:', collection.id);
    console.log('Collection NFT Address:', collection.collectionNftAddress);
    console.log('Ticket Price:', collection.ticketPrice, 'SOL');
    console.log('\nNext step: Create Candy Machine for this collection');
  })
  .catch(error => {
    console.error('❌ Failed to create collection:', error.message);
    process.exit(1);
  });
