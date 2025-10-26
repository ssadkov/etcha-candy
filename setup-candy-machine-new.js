const API_BASE_URL = 'http://localhost:3000';

const collectionId = 'collection_1761509102908_5mw3h07tz';
const candyMachineConfig = {
  maxSupply: 200,
  price: 0.25
};

async function setupCandyMachine() {
  try {
    console.log('🍬 Setting up Candy Machine...');
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
      console.log('='.repeat(60));
      console.log('Collection ID:', collectionId);
      console.log('Candy Machine:', data.data.candyMachineAddress);
      console.log('Items:', data.data.itemsAdded || 200);
      console.log('Price:', data.data.itemPrice || 0.25, 'SOL');
      console.log('Platform Wallet: syhurEG8zZwZZ5921bnLXWw8Ta8JsrGt2qKvR8FgxKK');
      console.log('');
      console.log('🔗 Explorer:');
      console.log(`   https://explorer.solana.com/address/${data.data.candyMachineAddress}?cluster=devnet`);
      console.log('');
      console.log('✅ Collection ready with NEW wallet!');
      
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
    console.log('\n✅ Done!');
  })
  .catch(error => {
    console.error('\n❌ Failed:', error.message);
    process.exit(1);
  });

