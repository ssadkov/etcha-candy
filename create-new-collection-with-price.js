const axios = require('axios');

async function createNewCollectionWithPrice() {
  try {
    console.log('🎯 Creating new collection with correct price (0.1 SOL)...');
    
    const collectionData = {
      name: "Price Test Collection",
      description: "Collection for testing correct 0.1 SOL pricing",
      eventCreator: "Platform",
      eventCreatorName: "Platform",
      eventDate: "2025-01-01",
      eventLocation: "Test Location",
      maxTickets: 10,
      ticketPrice: 0.1, // ✅ Правильная цена 0.1 SOL
      imageUrl: "https://api.etcha-candy.com/images/test-collection.jpg",
      isActive: true,
      createdAt: new Date().toISOString()
    };

    console.log('📝 Collection data:', collectionData);

    const response = await axios.post('http://localhost:3000/api/collections', collectionData);
    
    console.log('✅ Collection created successfully!');
    console.log('Collection ID:', response.data.id);
    console.log('Collection Name:', response.data.name);
    console.log('Ticket Price:', response.data.ticketPrice, 'SOL');
    console.log('Max Tickets:', response.data.maxTickets);
    
    return response.data;
  } catch (error) {
    console.error('❌ Error creating collection:', error.response?.data || error.message);
    throw error;
  }
}

// Run the function
createNewCollectionWithPrice()
  .then(collection => {
    console.log('\n🎉 Collection creation completed!');
    console.log('Next step: Create Candy Machine for this collection');
  })
  .catch(error => {
    console.error('❌ Failed to create collection:', error.message);
    process.exit(1);
  });
