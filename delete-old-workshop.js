const fs = require('fs');
const path = require('path');

const oldCollectionId = 'collection_1761507837674_w780dr9if';

async function deleteOldCollection() {
  try {
    console.log('🗑️  Deleting old Solana Workshop collection...');
    console.log('   Old ID:', oldCollectionId);
    
    const collectionsPath = path.join(__dirname, 'data', 'collections.json');
    
    if (!fs.existsSync(collectionsPath)) {
      console.log('❌ Collections file not found');
      return;
    }
    
    const collectionsData = JSON.parse(fs.readFileSync(collectionsPath, 'utf8'));
    
    const index = collectionsData.collections.findIndex(c => c.id === oldCollectionId);
    
    if (index === -1) {
      console.log('⚠️  Old collection not found, skipping...');
      return;
    }
    
    collectionsData.collections.splice(index, 1);
    
    fs.writeFileSync(collectionsPath, JSON.stringify(collectionsData, null, 2));
    
    console.log('✅ Old collection deleted from database');
    console.log('   Note: NFT and Candy Machine remain on blockchain');
    console.log('   (This is just removing from local database)');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

deleteOldCollection();

