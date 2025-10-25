const axios = require('axios');

async function testBobCharlieMinting() {
  try {
    console.log('🎫 Testing minting for Bob and Charlie with correct price...');
    
    const collectionId = 'collection_1761426689709_s5xgkn31k';
    
    // Bob's wallet
    const bobWallet = '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM';
    
    // Charlie's wallet  
    const charlieWallet = 'GjVEqKyFJzF6V3Qj8Z5XKz8Y9Q2W3E4R5T6Y7U8I9O0P1A';
    
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
testBobCharlieMinting()
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
