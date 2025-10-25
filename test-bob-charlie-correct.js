const axios = require('axios');

async function testBobCharlieMintingCorrect() {
  try {
    console.log('🎫 Testing minting for Bob and Charlie with correct addresses...');
    
    const collectionId = 'collection_1761426689709_s5xgkn31k';
    
    // Правильные адреса кошельков
    const bobWallet = 'GcUxE5YPjFtK4ri1CZ2vG9tK9Mrt6hFSZ38cLCoC5tf7';
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
testBobCharlieMintingCorrect()
  .then(results => {
    console.log('\n🎉 Bob and Charlie minting completed!');
    console.log('Bob NFT Addresses:', results.bob.nftAddresses);
    console.log('Bob Ticket Numbers:', results.bob.ticketNumbers);
    console.log('Charlie NFT Addresses:', results.charlie.nftAddresses);
    console.log('Charlie Ticket Numbers:', results.charlie.ticketNumbers);
  })
  .catch(error => {
    console.error('❌ Failed to mint for Bob/Charlie:', error.message);
    process.exit(1);
  });
