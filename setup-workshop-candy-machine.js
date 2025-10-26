const API_BASE_URL = 'http://localhost:3000';

const collectionId = 'collection_1761507837674_w780dr9if';
const candyMachineConfig = {
  maxSupply: 200,
  price: 0.25
};

async function setupCandyMachine() {
  try {
    console.log('🍬 Setting up Candy Machine for collection...');
    console.log('Collection ID:', collectionId);
    console.log('Config:', candyMachineConfig);
    console.log('');
    
    const response = await fetch(`${API_BASE_URL}/api/collections/${collectionId}/candy-machine`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(candyMachineConfig),
    });

    const data = await response.json();

    if (data.success) {
      console.log('✅ Candy Machine created successfully!');
      console.log('');
      console.log('📋 Candy Machine Details:');
      console.log('='.repeat(50));
      console.log('Collection ID:', data.data.collectionId);
      console.log('Candy Machine Address:', data.data.candyMachineAddress);
      console.log('Items:', data.data.itemsAdded);
      console.log('Price:', data.data.itemPrice, 'SOL');
      console.log('Status:', data.data.status);
      console.log('');
      console.log('🔗 Explorer:');
      console.log(`   https://explorer.solana.com/address/${data.data.candyMachineAddress}?cluster=devnet`);
      
      return data.data;
    } else {
      console.error('❌ Error creating Candy Machine:', data.error);
      throw new Error(data.error);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  }
}

setupCandyMachine()
  .then(() => {
    console.log('\n✅ Done! Candy Machine is ready.');
    console.log('\n✅ Collection is ready for ticket minting!');
  })
  .catch(error => {
    console.error('\n❌ Failed:', error.message);
    process.exit(1);
  });

