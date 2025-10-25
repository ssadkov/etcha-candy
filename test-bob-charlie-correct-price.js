const axios = require('axios');

async function testBobCharlieCorrectPrice() {
  try {
    console.log('🎫 Testing Bob and Charlie minting with CORRECT price...');
    
    const collectionId = 'collection_1761427515287_2b5m46rin';
    
    // Bob's wallet
    const bobWallet = 'GcUxE5YPjFtK4ri1CZ2vG9tK9Mrt6hFSZ38cLCoC5tf7';
    
    // Charlie's wallet  
    const charlieWallet = '4LJ9wbTJW3y9LJ4ZzcR3BFXJoWLJkZR4NdYzPFm72nLy';
    
    console.log('📝 Minting for Bob...');
    const bobResponse = await axios.post('http://localhost:3000/api/tickets/mint', {
      collectionId: collectionId,
      userWallet: bobWallet,
      quantity: 1
    });
    
    console.log('✅ Bob minted successfully!');
    console.log('Bob Result:', bobResponse.data.data);
    
    console.log('\n📝 Minting for Charlie...');
    const charlieResponse = await axios.post('http://localhost:3000/api/tickets/mint', {
      collectionId: collectionId,
      userWallet: charlieWallet,
      quantity: 1
    });
    
    console.log('✅ Charlie minted successfully!');
    console.log('Charlie Result:', charlieResponse.data.data);
    
    return {
      bob: bobResponse.data.data,
      charlie: charlieResponse.data.data
    };
  } catch (error) {
    console.error('❌ Error minting for Bob/Charlie:', error.response?.data || error.message);
    throw error;
  }
}

// Run the function
testBobCharlieCorrectPrice()
  .then(results => {
    console.log('\n🎉 Bob and Charlie minting completed!');
    console.log('Bob NFT Addresses:', results.bob.nftAddresses);
    console.log('Bob Ticket Numbers:', results.bob.ticketNumbers);
    console.log('Charlie NFT Addresses:', results.charlie.nftAddresses);
    console.log('Charlie Ticket Numbers:', results.charlie.ticketNumbers);
    console.log('\nNext step: Check final balances');
  })
  .catch(error => {
    console.error('❌ Failed to mint for Bob/Charlie:', error.message);
    process.exit(1);
  });
