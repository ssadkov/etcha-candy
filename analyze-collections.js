const API_BASE_URL = 'http://localhost:3000';

async function analyzeCollections() {
  try {
    console.log('🔍 Step 1: Analyzing existing collections...');
    
    // Get all collections
    const collectionsResponse = await fetch(`${API_BASE_URL}/api/collections`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const collectionsResult = await collectionsResponse.json();
    
    if (collectionsResult.success) {
      console.log('📝 Available collections:');
      collectionsResult.data.forEach((collection, index) => {
        console.log(`\n${index + 1}. Collection: ${collection.id}`);
        console.log(`   Name: ${collection.name}`);
        console.log(`   Max Tickets: ${collection.maxTickets}`);
        console.log(`   Ticket Price: ${collection.ticketPrice} SOL`);
        console.log(`   Collection NFT: ${collection.collectionNftAddress || 'Not created'}`);
        console.log(`   Candy Machine: ${collection.candyMachineAddress || 'Not created'}`);
        console.log(`   Status: ${collection.status}`);
      });
    } else {
      console.log('❌ Failed to get collections:', collectionsResult.error);
    }

  } catch (error) {
    console.error('❌ Error analyzing collections:', error.message);
  }
}

analyzeCollections();
