const API_BASE_URL = 'http://localhost:3000';

async function checkCandyMachineStatus() {
  try {
    const collectionId = 'collection_1761421533360_4xrteague';
    console.log('🔍 Checking Candy Machine status for collection:', collectionId);
    
    const response = await fetch(`${API_BASE_URL}/api/collections/${collectionId}/candy-machine`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Candy Machine info:', JSON.stringify(result.data, null, 2));
    } else {
      console.log('❌ Candy Machine check failed:', result.error);
    }

  } catch (error) {
    console.error('❌ Error checking Candy Machine:', error.message);
  }
}

checkCandyMachineStatus();
