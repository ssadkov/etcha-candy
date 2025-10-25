console.log('🎫 Testing Complete Minting Flow...');
console.log('==================================\n');

const API_BASE_URL = 'http://localhost:3000';

async function testCompleteMintingFlow() {
  try {
    // Step 1: Create a new collection
    console.log('📝 Step 1: Creating new collection...');
    const collectionData = {
      eventCreatorName: "Test Minting Organizer",
      description: "Testing complete minting flow",
      ticketPrice: 0.1,
      imageUrl: "https://example.com/minting-test.jpg",
      eventName: "Minting Test Event",
      name: "Minting Test Collection",
      eventCreator: "4ezFV6pcyYYT6HaFoK9vXoLrzZZ3bz5roD7eSkFLyqNV",
      maxTickets: 10, // Small number for testing
      eventDate: "2024-12-31",
      eventLocation: "Test Arena"
    };

    const createResponse = await fetch(`${API_BASE_URL}/api/collections`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(collectionData)
    });

    const createResult = await createResponse.json();
    
    console.log('Create response:', JSON.stringify(createResult, null, 2));
    
    if (!createResult.success) {
      console.log('❌ Collection creation failed:', createResult.error);
      return;
    }

    const collectionId = createResult.data.id;
    console.log('✅ Collection created:', collectionId);

    // Step 2: Create Candy Machine (Collection NFT already exists)
    console.log('\n🍭 Step 2: Creating Candy Machine...');
    const candyMachineResponse = await fetch(`${API_BASE_URL}/api/collections/${collectionId}/candy-machine`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const candyMachineResult = await candyMachineResponse.json();
    
    console.log('Candy Machine response:', JSON.stringify(candyMachineResult, null, 2));
    
    if (!candyMachineResult.success) {
      console.log('❌ Candy Machine creation failed:', candyMachineResult.error);
      return;
    }

    console.log('✅ Candy Machine created:', candyMachineResult.data.candyMachineAddress);

    // Step 3: Test minting
    console.log('\n🎫 Step 3: Testing ticket minting...');
    const userWallet = '5ZLxvtmcpbUgHJdfAtHREwT3gLey4TWU3JHteqGzciED'; // Alice
    
    const mintRequest = {
      collectionId: collectionId,
      userWallet: userWallet,
      quantity: 1
    };

    const mintResponse = await fetch(`${API_BASE_URL}/api/tickets/mint`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mintRequest)
    });

    const mintResult = await mintResponse.json();
    
    if (mintResult.success) {
      console.log('✅ Minting successful!');
      console.log('🎫 Ticket NFT Addresses:', mintResult.data.ticketNftAddresses);
      console.log('🔢 Ticket Numbers:', mintResult.data.ticketNumbers);
    } else {
      console.log('❌ Minting failed:', mintResult.error);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testCompleteMintingFlow();
