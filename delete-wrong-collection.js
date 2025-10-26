const fs = require('fs');
const path = require('path');

const wrongCollectionId = 'collection_1761508436340_kw9g4u427';

async function deleteWrongCollection() {
  try {
    console.log('🗑️  Deleting wrong collection (created with old wallet)...');
    console.log('   Wrong ID:', wrongCollectionId);
    
    const collectionsPath = path.join(__dirname, 'data', 'collections.json');
    
    if (!fs.existsSync(collectionsPath)) {
      console.log('❌ Collections file not found');
      return;
    }
    
    const collectionsData = JSON.parse(fs.readFileSync(collectionsPath, 'utf8'));
    
    console.log('Current collections:', collectionsData.collections.length);
    
    // Delete both old and wrong collections
    const toDelete = collectionsData.collections.filter(c => 
      c.id === wrongCollectionId || c.id === 'collection_1761507837674_w780dr9if'
    );
    
    console.log('Collections to delete:', toDelete.length);
    toDelete.forEach(c => console.log('  -', c.id, c.name));
    
    collectionsData.collections = collectionsData.collections.filter(c => 
      c.id !== wrongCollectionId && c.id !== 'collection_1761507837674_w780dr9if'
    );
    
    fs.writeFileSync(collectionsPath, JSON.stringify(collectionsData, null, 2));
    
    console.log('✅ Wrong collections deleted');
    console.log('Remaining collections:', collectionsData.collections.length);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

deleteWrongCollection();

