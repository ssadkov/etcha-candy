const axios = require('axios');

async function checkAPI() {
  try {
    console.log('🔍 Checking API endpoints...');
    
    // Проверяем доступные коллекции
    const collectionsResponse = await axios.get('http://localhost:3000/api/collections');
    console.log('✅ Collections API working');
    console.log('Response data:', collectionsResponse.data);
    console.log('Response type:', typeof collectionsResponse.data);
    console.log('Collections count:', collectionsResponse.data?.length);
    
    if (collectionsResponse.data.data.length > 0) {
      const collections = collectionsResponse.data.data;
      console.log('Collections count:', collections.length);
      
      // Найдем коллекцию с NFT
      const collectionWithNFT = collections.find(c => c.collectionNftAddress);
      if (collectionWithNFT) {
        console.log('Collection with NFT:', collectionWithNFT.id);
        console.log('NFT Address:', collectionWithNFT.collectionNftAddress);
        console.log('Candy Machine Address:', collectionWithNFT.candyMachineAddress);
      }
    }
    
  } catch (error) {
    console.error('❌ API Error:', error.response?.data || error.message);
  }
}

checkAPI();
