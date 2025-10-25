const API_BASE_URL = 'http://localhost:3000';

async function testBobCharlieMintingShort() {
  try {
    console.log('🎯 Testing Bob & Charlie Minting with Short Collection...');
    
    // Use the new short collection
    const collectionId = 'collection_1761424771087_lqluhspsk';
    
    console.log(`\n📋 Testing with collection: ${collectionId}`);
    
    // Get test wallets
    console.log('\n🔍 Getting test wallets...');
    const walletsResponse = await fetch(`${API_BASE_URL}/api/test-wallets`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const walletsResult = await walletsResponse.json();
    
    if (walletsResult.success) {
      console.log('✅ Test wallets found:');
      
      // Check if data is an array
      const wallets = Array.isArray(walletsResult.data) ? walletsResult.data : walletsResult.data.wallets || walletsResult.data.testWallets || [];
      
      wallets.forEach((wallet, index) => {
        console.log(`   ${index + 1}. ${wallet.name}: ${wallet.wallet}`);
      });
      
      // Find Bob and Charlie wallets
      const bobWallet = wallets.find(w => w.name.toLowerCase().includes('bob'));
      const charlieWallet = wallets.find(w => w.name.toLowerCase().includes('charlie'));
      
      if (!bobWallet || !charlieWallet) {
        console.log('❌ Bob or Charlie wallet not found in test wallets');
        console.log('Available wallets:', wallets.map(w => w.name));
        return null;
      }
      
      console.log(`\n👤 Bob wallet: ${bobWallet.wallet}`);
      console.log(`👤 Charlie wallet: ${charlieWallet.wallet}`);
      
      // Test minting with Bob
      console.log('\n🎫 Testing minting with Bob...');
      const bobMintResponse = await fetch(`${API_BASE_URL}/api/tickets/mint`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          collectionId: collectionId,
          userWallet: bobWallet.wallet,
          quantity: 1
        })
      });

      const bobMintResult = await bobMintResponse.json();
      
      if (bobMintResult.success) {
        console.log('✅ Bob minting successful!');
        console.log('📊 Bob minting result:', bobMintResult.data);
      } else {
        console.log('❌ Bob minting failed:', bobMintResult.error);
      }
      
      // Wait a bit between mints
      console.log('\n⏳ Waiting 3 seconds before Charlie mint...');
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Test minting with Charlie
      console.log('\n🎫 Testing minting with Charlie...');
      const charlieMintResponse = await fetch(`${API_BASE_URL}/api/tickets/mint`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          collectionId: collectionId,
          userWallet: charlieWallet.wallet,
          quantity: 1
        })
      });

      const charlieMintResult = await charlieMintResponse.json();
      
      if (charlieMintResult.success) {
        console.log('✅ Charlie minting successful!');
        console.log('📊 Charlie minting result:', charlieMintResult.data);
      } else {
        console.log('❌ Charlie minting failed:', charlieMintResult.error);
      }
      
      return {
        bobResult: bobMintResult,
        charlieResult: charlieMintResult
      };
    } else {
      console.log('❌ Failed to get test wallets:', walletsResult.error);
      return null;
    }

  } catch (error) {
    console.error('❌ Error testing Bob & Charlie minting:', error.message);
    return null;
  }
}

testBobCharlieMintingShort().then(result => {
  if (result) {
    console.log('\n🎉 Bob & Charlie minting test completed!');
    console.log('📊 Results:');
    console.log(`   Bob: ${result.bobResult.success ? 'SUCCESS' : 'FAILED'}`);
    if (result.bobResult.success) {
      console.log(`   Bob NFT: ${result.bobResult.data.ticketNftAddresses[0]}`);
      console.log(`   Bob Ticket: ${result.bobResult.data.ticketNumbers[0]}`);
    }
    console.log(`   Charlie: ${result.charlieResult.success ? 'SUCCESS' : 'FAILED'}`);
    if (result.charlieResult.success) {
      console.log(`   Charlie NFT: ${result.charlieResult.data.ticketNftAddresses[0]}`);
      console.log(`   Charlie Ticket: ${result.charlieResult.data.ticketNumbers[0]}`);
    }
  } else {
    console.log('\n❌ Bob & Charlie minting test failed');
  }
});
