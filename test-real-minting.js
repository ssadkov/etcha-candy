console.log('🎫 Testing Real Ticket Minting...');
console.log('==================================\n');

const API_BASE_URL = 'http://localhost:3000';

async function testRealMinting() {
  try {
    // Collection with Collection NFT
    const collectionId = 'collection_1761415240951_mdvi5yqwt'; // FIXED Collection NFT
    const userWallet = '5ZLxvtmcpbUgHJdfAtHREwT3gLey4TWU3JHteqGzciED'; // Alice
    
    console.log('🎫 Testing ticket minting...');
    console.log(`   Collection ID: ${collectionId}`);
    console.log(`   User Wallet: ${userWallet}`);
    console.log(`   Quantity: 1 ticket`);
    console.log('');

    const mintRequest = {
      collectionId: collectionId,
      userWallet: userWallet,
      quantity: 1
    };

    console.log('   🚀 Sending mint request...');
    console.log('   🔍 Candy Machine address on blockchain:', 'jUn8Z1kLAqM3nKsdThPzRs6vNNQaCd6YTav9xMv8Q5G');
    console.log('   🔍 Solana Explorer:', 'https://explorer.solana.com/address/jUn8Z1kLAqM3nKsdThPzRs6vNNQaCd6YTav9xMv8Q5G?cluster=devnet');
    
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

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testRealMinting();
