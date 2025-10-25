#!/usr/bin/env node

// Test script for Collection NFT creation
// Run with: node test-collection-nft.js

const API_BASE = 'http://localhost:3000/api';

async function testCollectionNFTCreation() {
  console.log('🎨 Testing Collection NFT Creation...\n');

  try {
    // Test 1: Health check
    console.log('1. Checking server health...');
    const healthResponse = await fetch('http://localhost:3000/health');
    const healthData = await healthResponse.json();
    console.log('✅ Server is running');
    console.log('   Platform:', healthData.config.platform);
    console.log('   Network:', healthData.config.network);
    console.log('');

    // Test 2: Create a collection with NFT
    console.log('2. Creating collection with Collection NFT...');
    const collectionData = {
      eventCreator: "4ezFV6pcyYYT6HaFoK9vXoLrzZZ3bz5roD7eSkFLyqNV",
      eventCreatorName: "NFT Test Organizer",
      name: "NFT Test Collection",
      description: "Testing Collection NFT creation",
      eventName: "NFT Test Event",
      eventDate: "2024-12-31",
      eventLocation: "NFT Test Arena",
      ticketPrice: 0.1,
      maxTickets: 50,
      imageUrl: "https://example.com/nft-test.jpg"
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
      console.log('✅ Collection created successfully!');
      console.log('   ID:', createResult.data.id);
      console.log('   Name:', createResult.data.name);
      
      if (createResult.data.collectionNftAddress) {
        console.log('🎉 Collection NFT created!');
        console.log('   NFT Address:', createResult.data.collectionNftAddress);
        console.log('   View on Solana Explorer: https://explorer.solana.com/address/' + createResult.data.collectionNftAddress + '?cluster=devnet');
      } else {
        console.log('⚠️  Collection NFT creation failed (likely due to insufficient SOL)');
        console.log('   Collection saved without NFT address');
      }
      
      console.log('');

      // Test 3: Get all collections
      console.log('3. Getting all collections...');
      const getResponse = await fetch(`${API_BASE}/collections`);
      const getResult = await getResponse.json();
      
      console.log('✅ Collections retrieved:', getResult.data.length, 'collections');
      
      // Show NFT addresses
      getResult.data.forEach((collection, index) => {
        console.log(`   Collection ${index + 1}:`);
        console.log(`     Name: ${collection.name}`);
        console.log(`     NFT Address: ${collection.collectionNftAddress || 'Not created'}`);
      });

    } else {
      console.log('❌ Collection creation failed:', createResult.error);
    }

  } catch (error) {
    console.log('❌ Test failed:', error.message);
    console.log('Make sure the server is running on http://localhost:3000');
  }

  console.log('\n🎉 Collection NFT testing completed!');
  console.log('\n📝 Notes:');
  console.log('- If Collection NFT creation fails, it\'s likely due to insufficient SOL');
  console.log('- Get SOL from devnet faucet: https://faucet.solana.com/');
  console.log('- Collection is still saved even if NFT creation fails');
}

// Run the test
testCollectionNFTCreation();
