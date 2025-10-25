const axios = require('axios');

async function addItemsToCandyMachine() {
  try {
    console.log('🎫 Adding items to Candy Machine...');
    
    const collectionId = 'collection_1761426689709_s5xgkn31k';
    
    console.log('📝 Adding items to Candy Machine...');
    const addItemsResponse = await axios.post(`http://localhost:3000/api/candy-machine/add-items`, {
      collectionId: collectionId
    });
    
    const result = addItemsResponse.data.data;
    
    console.log('✅ Items added successfully!');
    console.log('📊 Add Items Results:');
    console.log('- Collection ID:', collectionId);
    console.log('- Items Added:', result.itemsAdded);
    console.log('- Total Items:', result.totalItems);
    
    return result;
  } catch (error) {
    console.error('❌ Error adding items:', error.response?.data || error.message);
    throw error;
  }
}

// Run the function
addItemsToCandyMachine()
  .then(result => {
    console.log('\n🎉 Items added successfully!');
    console.log('Items Added:', result.itemsAdded);
    console.log('Total Items:', result.totalItems);
    console.log('\nNext step: Test minting again');
  })
  .catch(error => {
    console.error('❌ Failed to add items:', error.message);
    process.exit(1);
  });