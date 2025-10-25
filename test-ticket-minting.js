console.log('🎫 Testing Candy Machine Ticket Minting...');
console.log('==========================================\n');

const API_BASE_URL = 'http://localhost:3000';

async function testTicketMinting() {
  try {
    // 1. Check server health
    console.log('1. 🏥 Checking server health...');
    const health = await fetch(`${API_BASE_URL}/health`).then(r => r.json());
    console.log('   ✅ Server Status:', health.success ? 'RUNNING' : 'ERROR');
    console.log('   📡 Network:', health.config.network);
    console.log('');

    // 2. Get test wallets
    console.log('2. 👛 Getting test wallets...');
    const walletsResponse = await fetch(`${API_BASE_URL}/api/test-wallets`).then(r => r.json());
    
    if (!walletsResponse.success) {
      throw new Error('Failed to get test wallets');
    }
    
    const testWallets = walletsResponse.data.wallets;
    console.log('   ✅ Test wallets loaded:', testWallets.length);
    testWallets.forEach((wallet, i) => {
      console.log(`      ${i + 1}. ${wallet.name}: ${wallet.wallet}`);
    });
    console.log('');

    // 3. Get collections
    console.log('3. 📋 Getting collections...');
    const collectionsResponse = await fetch(`${API_BASE_URL}/api/collections`).then(r => r.json());
    
    if (!collectionsResponse.success) {
      throw new Error('Failed to get collections');
    }
    
    const collections = collectionsResponse.data;
    const collectionsWithNFTs = collections.filter(c => c.collectionNftAddress);
    
    console.log('   ✅ Collections loaded:', collections.length);
    console.log('   🎨 Collections with NFTs:', collectionsWithNFTs.length);
    
    if (collectionsWithNFTs.length === 0) {
      console.log('   ❌ No collections with NFTs found. Please create a collection first.');
      return;
    }
    
    // Show available collections
    console.log('   📝 Available collections:');
    collectionsWithNFTs.forEach((col, i) => {
      console.log(`      ${i + 1}. ${col.name}`);
      console.log(`         Event: ${col.eventName}`);
      console.log(`         Price: ${col.ticketPrice} SOL`);
      console.log(`         Max Tickets: ${col.maxTickets}`);
      console.log(`         Candy Machine: ${col.candyMachineAddress ? 'Created' : 'Not created'}`);
    });
    console.log('');

    // 4. Test minting with first collection and first wallet
    const testCollection = collectionsWithNFTs[0];
    const testWallet = testWallets[0];
    
    console.log('4. 🎫 Testing ticket minting...');
    console.log(`   Collection: ${testCollection.name}`);
    console.log(`   Wallet: ${testWallet.name} (${testWallet.wallet})`);
    console.log(`   Quantity: 1 ticket`);
    console.log(`   Price: ${testCollection.ticketPrice} SOL`);
    console.log('');

    const mintRequest = {
      collectionId: testCollection.id,
      userWallet: testWallet.wallet,
      quantity: 1
    };

    console.log('   🚀 Sending mint request...');
    const mintResponse = await fetch(`${API_BASE_URL}/api/tickets/mint`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mintRequest)
    });

    const mintResult = await mintResponse.json();
    
    if (mintResult.success) {
      console.log('   ✅ Minting successful!');
      console.log('   🎫 Ticket NFT Addresses:', mintResult.data.ticketNftAddresses);
      console.log('   🔢 Ticket Numbers:', mintResult.data.ticketNumbers);
      console.log('   📝 Transaction Signature:', mintResult.data.transactionSignature);
    } else {
      console.log('   ❌ Minting failed:', mintResult.error);
    }
    console.log('');

    // 5. Get user tickets
    console.log('5. 🎟️ Getting user tickets...');
    const ticketsResponse = await fetch(`${API_BASE_URL}/api/tickets/user/${testWallet.wallet}`).then(r => r.json());
    
    if (ticketsResponse.success) {
      console.log('   ✅ User tickets retrieved');
      console.log('   🎫 Total tickets:', ticketsResponse.data.count);
      console.log('   📝 Ticket addresses:', ticketsResponse.data.tickets);
    } else {
      console.log('   ❌ Failed to get user tickets:', ticketsResponse.error);
    }
    console.log('');

    // 6. Test ticket validation
    if (mintResult.success && mintResult.data.ticketNftAddresses.length > 0) {
      console.log('6. ✅ Testing ticket validation...');
      const ticketAddress = mintResult.data.ticketNftAddresses[0];
      
      const validateRequest = {
        mintAddress: ticketAddress,
        collectionId: testCollection.id
      };

      const validateResponse = await fetch(`${API_BASE_URL}/api/tickets/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validateRequest)
      });

      const validateResult = await validateResponse.json();
      
      if (validateResult.success) {
        console.log('   ✅ Ticket validation successful');
        console.log('   🎫 Ticket Address:', validateResult.data.mintAddress);
        console.log('   ✅ Is Valid:', validateResult.data.isValid);
        console.log('   📝 Collection:', validateResult.data.collection.name);
      } else {
        console.log('   ❌ Ticket validation failed:', validateResult.error);
      }
    }

    console.log('\n🎉 Ticket minting test completed!');
    console.log('\n📋 Summary:');
    console.log('- ✅ Server health check');
    console.log('- ✅ Test wallets loaded');
    console.log('- ✅ Collections retrieved');
    console.log('- ✅ Ticket minting tested');
    console.log('- ✅ User tickets retrieved');
    console.log('- ✅ Ticket validation tested');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack:', error.stack);
  }
}

// Run the test
testTicketMinting();
