const API_BASE_URL = 'http://localhost:3000';

async function createBobCharlieTestCollection() {
  try {
    console.log('🎯 Step 1: Creating Bob & Charlie Test Collection...');
    
    const collectionData = {
      name: 'Bob & Charlie Test Collection',
      description: 'Test collection for Bob and Charlie minting functionality',
      eventName: 'Bob Charlie Test Event',
      eventCreator: 'Test Platform',
      eventCreatorName: 'Test Platform Creator',
      maxTickets: 100,
      ticketPrice: 0.1,
      eventDate: '2025-12-31T23:59:59Z',
      eventLocation: 'Test Venue',
      imageUrl: 'https://api.etcha-candy.com/images/test-collection.jpg'
    };
    
    console.log('📋 Collection data:', collectionData);
    
    const response = await fetch(`${API_BASE_URL}/api/collections`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(collectionData)
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Collection created successfully!');
      console.log('📊 Collection details:', result.data);
      
      const collectionId = result.data.id;
      console.log(`\n🎯 Collection ID: ${collectionId}`);
      
      return {
        collectionId,
        collectionData: result.data
      };
    } else {
      console.log('❌ Failed to create collection:', result.error);
      return null;
    }

  } catch (error) {
    console.error('❌ Error creating collection:', error.message);
    return null;
  }
}

createBobCharlieTestCollection().then(result => {
  if (result) {
    console.log('\n🎉 Collection created successfully!');
    console.log('📊 Summary:');
    console.log(`   Collection ID: ${result.collectionId}`);
    console.log(`   Name: ${result.collectionData.name}`);
    console.log(`   Max Tickets: ${result.collectionData.maxTickets}`);
    console.log(`   Ticket Price: ${result.collectionData.ticketPrice} SOL`);
    console.log(`   Status: ${result.collectionData.status}`);
  } else {
    console.log('\n❌ Failed to create collection');
  }
});
