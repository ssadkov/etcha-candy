console.log('🎫 Testing Minting with Existing Blockchain Collection...');
console.log('====================================================\n');

const API_BASE_URL = 'http://localhost:3000';

async function testMintingWithExistingCollection() {
  try {
    // Используем существующую коллекцию с блокчейна
    const collectionId = 'collection_1761415240951_mdvi5yqwt'; // FIXED Collection NFT
    console.log('📝 Using existing collection:', collectionId);
    console.log('🎨 Collection NFT:', 'EVhit261jZVzzsv1Pw7f8f4rWTjk1LwDHbjzBJix6i9m');
    console.log('🍭 Candy Machine:', 'jUn8Z1kLAqM3nKsdThPzRs6vNNQaCd6YTav9xMv8Q5G');
    console.log('');

    // Step 1: Проверим состояние Candy Machine
    console.log('🔍 Step 1: Checking Candy Machine status...');
    const candyMachineResponse = await fetch(`${API_BASE_URL}/api/collections/${collectionId}/candy-machine`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const candyMachineResult = await candyMachineResponse.json();
    
    if (candyMachineResult.success) {
      console.log('✅ Candy Machine info:', JSON.stringify(candyMachineResult.data, null, 2));
    } else {
      console.log('❌ Candy Machine check failed:', candyMachineResult.error);
    }

    // Step 2: Попробуем добавить элементы в существующую Candy Machine
    console.log('\n🎫 Step 2: Adding items to existing Candy Machine...');
    const addItemsRequest = {
      collectionId: collectionId
    };

    const addItemsResponse = await fetch(`${API_BASE_URL}/api/candy-machine/add-items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(addItemsRequest)
    });

    const addItemsResult = await addItemsResponse.json();
    
    if (addItemsResult.success) {
      console.log('✅ Items added successfully!');
      console.log('📝 Result:', addItemsResult.data);
    } else {
      console.log('❌ Adding items failed:', addItemsResult.error);
    }

    // Step 3: Тестируем минтинг
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
testMintingWithExistingCollection();
