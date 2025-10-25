console.log('🎫 Adding items to existing Candy Machine...');
console.log('==================================\n');

const API_BASE_URL = 'http://localhost:3000';

async function addItemsToCandyMachine() {
  try {
    // Collection with Candy Machine
    const collectionId = 'collection_1761415240951_mdvi5yqwt'; // FIXED Collection NFT
    
    console.log('🎫 Adding items to Candy Machine...');
    console.log(`   Collection ID: ${collectionId}`);
    console.log('');

    const addItemsRequest = {
      collectionId: collectionId
    };

    console.log('   🚀 Sending add items request...');
    
    const addItemsResponse = await fetch(`${API_BASE_URL}/api/candy-machine/add-items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(addItemsRequest)
    });

    const addItemsResult = await addItemsResponse.json();
    
    if (addItemsResult.success) {
      console.log('   ✅ Items added successfully!');
      console.log('   📝 Result:', addItemsResult.data);
    } else {
      console.log('   ❌ Adding items failed:', addItemsResult.error);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
addItemsToCandyMachine();
