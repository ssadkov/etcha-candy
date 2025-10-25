const axios = require('axios');

async function testFinalCorrectPriceMinting() {
  try {
    console.log('🎫 Testing minting with FINAL CORRECT price (0.1 SOL)...');
    
    const collectionId = 'collection_1761427859093_v5a9hfr1h';
    
    // Сначала добавим элементы
    console.log('📝 Adding items to Candy Machine...');
    const addItemsResponse = await axios.post(`http://localhost:3000/api/candy-machine/add-items`, {
      collectionId: collectionId
    });
    console.log('✅ Items added successfully!');
    
    // Теперь протестируем минтинг
    const userWallet = '5ZLxvtmcpbUgHJdfAtHREwT3gLey4TWU3JHteqGzciED'; // Alice's wallet
    
    console.log('📝 Attempting to mint ticket...');
    const mintResponse = await axios.post('http://localhost:3000/api/tickets/mint', {
      collectionId: collectionId,
      userWallet: userWallet,
      quantity: 1
    });
    
    const result = mintResponse.data.data;
    
    console.log('✅ Ticket minted successfully!');
    console.log('📊 Minting Results:');
    console.log('- Collection ID:', collectionId);
    console.log('- User Wallet:', userWallet);
    console.log('- NFT Addresses:', result.nftAddresses);
    console.log('- Ticket Numbers:', result.ticketNumbers);
    
    return result;
  } catch (error) {
    console.error('❌ Error minting ticket:', error.response?.data || error.message);
    throw error;
  }
}

// Run the function
testFinalCorrectPriceMinting()
  .then(result => {
    console.log('\n🎉 Minting test completed!');
    console.log('NFT Addresses:', result.nftAddresses);
    console.log('Ticket Numbers:', result.ticketNumbers);
    console.log('\nNext step: Check wallet balance to verify 0.1 SOL deduction');
  })
  .catch(error => {
    console.error('❌ Failed to mint ticket:', error.message);
    process.exit(1);
  });
