console.log('🎫 Testing Minting for All 3 Wallets...');
console.log('=====================================\n');

const API_BASE_URL = 'http://localhost:3000';

async function testMintingForAllWallets() {
  try {
    // Используем последнюю созданную коллекцию
    const collectionId = 'collection_1761421533360_4xrteague';
    const candyMachineAddress = '8rVpkqC55YWTL83r9rLCfVyL1LRoeQ5MgGNnz7jNwFed';
    
    console.log('📝 Using collection:', collectionId);
    console.log('🍭 Candy Machine:', candyMachineAddress);
    console.log('');

    // Тестовые кошельки
    const wallets = [
      { name: 'Alice', wallet: '5ZLxvtmcpbUgHJdfAtHREwT3gLey4TWU3JHteqGzciED' },
      { name: 'Bob', wallet: 'GcUxE5YPjFtK4ri1CZ2vG9tK9Mrt6hFSZ38cLCoC5tf7' },
      { name: 'Charlie', wallet: '4LJ9wbTJW3y9LJ4ZzcR3BFXJoWLJkZR4NdYzPFm72nLy' }
    ];

    for (let i = 0; i < wallets.length; i++) {
      const wallet = wallets[i];
      console.log(`🎫 Testing minting for ${wallet.name} (${wallet.wallet})...`);
      
      const mintRequest = {
        collectionId: collectionId,
        userWallet: wallet.wallet,
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
        console.log(`✅ ${wallet.name} minting successful!`);
        console.log(`🎫 NFT Address: ${mintResult.data.ticketNftAddresses[0]}`);
        console.log(`🔢 Ticket Number: ${mintResult.data.ticketNumbers[0]}`);
        console.log(`🔗 Explorer: https://explorer.solana.com/address/${mintResult.data.ticketNftAddresses[0]}?cluster=devnet`);
      } else {
        console.log(`❌ ${wallet.name} minting failed:`, mintResult.error);
      }
      
      console.log('');
    }

    // Проверим информацию о Candy Machine
    console.log('🔍 Checking Candy Machine status...');
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

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testMintingForAllWallets();
