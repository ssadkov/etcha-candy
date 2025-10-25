#!/usr/bin/env node

// Test script for Etcha Candy Backend API
// Run with: node test-api.js

const API_BASE = 'http://localhost:3000/api';

async function testAPI() {
  console.log('🧪 Testing Etcha Candy Backend API...\n');

  try {
    // Test 1: Health check
    console.log('1. Testing health check...');
    const healthResponse = await fetch('http://localhost:3000/health');
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData.message);
    console.log('   Platform:', healthData.config.platform);
    console.log('   Network:', healthData.config.network);
    console.log('');

    // Test 2: Create a collection
    console.log('2. Testing collection creation...');
    const collectionData = {
      eventCreator: '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM',
      eventCreatorName: 'Test Event Organizer',
      name: 'Test Concert Collection',
      description: 'NFT tickets for Test Concert 2024',
      eventName: 'Test Concert 2024',
      eventDate: '2024-12-31',
      eventLocation: 'Test Arena',
      ticketPrice: 0.1,
      maxTickets: 100,
      imageUrl: 'https://example.com/concert.jpg'
    };

    const createResponse = await fetch(`${API_BASE}/collections`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(collectionData),
    });

    const createResult = await createResponse.json();
    if (createResult.success) {
      console.log('✅ Collection created:', createResult.data.name);
      console.log('   ID:', createResult.data.id);
      const collectionId = createResult.data.id;
      console.log('');

      // Test 3: Get collections
      console.log('3. Testing get collections...');
      const getResponse = await fetch(`${API_BASE}/collections`);
      const getResult = await getResponse.json();
      console.log('✅ Collections retrieved:', getResult.data.length, 'collections');
      console.log('');

      // Test 4: Create Candy Machine
      console.log('4. Testing Candy Machine creation...');
      const cmResponse = await fetch(`${API_BASE}/collections/${collectionId}/candy-machine`, {
        method: 'POST',
      });
      const cmResult = await cmResponse.json();
      if (cmResult.success) {
        console.log('✅ Candy Machine created:', cmResult.data.candyMachineAddress);
        console.log('');

        // Test 5: Mint ticket
        console.log('5. Testing ticket minting...');
        const mintData = {
          collectionId: collectionId,
          userWallet: '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM',
          quantity: 1
        };

        const mintResponse = await fetch(`${API_BASE}/tickets/mint`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(mintData),
        });

        const mintResult = await mintResponse.json();
        if (mintResult.success) {
          console.log('✅ Ticket minted:', mintResult.data.mintedNfts[0]);
          console.log('   Quantity:', mintResult.data.quantity);
          console.log('');

          // Test 6: Get user tickets
          console.log('6. Testing get user tickets...');
          const userTicketsResponse = await fetch(`${API_BASE}/tickets/user/${mintData.userWallet}`);
          const userTicketsResult = await userTicketsResponse.json();
          console.log('✅ User tickets retrieved:', userTicketsResult.data.tickets.length, 'tickets');
          console.log('');

          // Test 7: Validate ticket
          console.log('7. Testing ticket validation...');
          const validateData = {
            mintAddress: mintResult.data.mintedNfts[0],
            collectionId: collectionId
          };

          const validateResponse = await fetch(`${API_BASE}/tickets/validate`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(validateData),
          });

          const validateResult = await validateResponse.json();
          console.log('✅ Ticket validation:', validateResult.data.isValid ? 'Valid' : 'Invalid');
          console.log('   Event:', validateResult.data.collection.eventName);
        } else {
          console.log('❌ Ticket minting failed:', mintResult.error);
        }
      } else {
        console.log('❌ Candy Machine creation failed:', cmResult.error);
      }
    } else {
      console.log('❌ Collection creation failed:', createResult.error);
    }

  } catch (error) {
    console.log('❌ Test failed:', error.message);
    console.log('Make sure the server is running on http://localhost:3000');
  }

  console.log('\n🎉 API testing completed!');
}

// Run the test
testAPI();
