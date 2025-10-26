const API_BASE_URL = 'http://localhost:3000';

async function waitForServer() {
  for (let i = 0; i < 10; i++) {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      if (response.ok) return true;
    } catch (e) {
      // Server not ready yet
    }
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('Waiting for server... (' + (i + 1) + '/10)');
  }
  return false;
}

const collectionData = {
  name: 'Solana workshop',
  description: 'Interactive workshop on Solana blockchain development',
  eventCreator: 'Solana Foundation',
  eventCreatorName: 'Solana Foundation',
  eventName: 'Solana Workshop 2025',
  eventDate: '2025-03-15',
  eventLocation: 'Online',
  ticketPrice: 0.25,
  maxTickets: 200,
  imageUrl: 'https://via.placeholder.com/512x512.png?text=Solana+Workshop'
};

async function createWorkshopCollection() {
  try {
    console.log('🔄 Waiting for server to start...');
    const serverReady = await waitForServer();
    
    if (!serverReady) {
      console.error('❌ Server did not start in time');
      return;
    }
    
    console.log('');
    console.log('🎨 Creating collection with NEW wallet...');
    console.log('Platform Wallet: syhurEG8zZwZZ5921bnLXWw8Ta8JsrGt2qKvR8FgxKK');
    console.log('Collection:', collectionData.name);
    console.log('');
    
    const createResponse = await fetch(`${API_BASE_URL}/api/collections`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(collectionData),
    });

    const data = await createResponse.json();

    if (data.success) {
      console.log('✅ Collection created successfully!');
      console.log('');
      console.log('📋 Collection Details:');
      console.log('='.repeat(60));
      console.log('ID:', data.data.id);
      console.log('Collection NFT:', data.data.collectionNftAddress);
      console.log('Platform Wallet:', 'syhurEG8zZwZZ5921bnLXWw8Ta8JsrGt2qKvR8FgxKK');
      console.log('Price:', data.data.ticketPrice, 'SOL');
      console.log('Max Tickets:', data.data.maxTickets);
      console.log('');
      console.log('🔗 Explorer:');
      console.log(`   https://explorer.solana.com/address/${data.data.collectionNftAddress}?cluster=devnet`);
      console.log('');
      console.log('✅ Now setup Candy Machine...');
      console.log('');
      console.log('Run: node setup-candy-machine.js');
      console.log('   Collection ID:', data.data.id);
      
      // Save collection ID for next step
      require('fs').writeFileSync(
        'next-collection-id.txt',
        data.data.id + '\n' + JSON.stringify(data.data, null, 2)
      );
      
      return data.data;
    } else {
      console.error('❌ Error creating collection:', data.error);
      throw new Error(data.error);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  }
}

createWorkshopCollection()
  .then(() => {
    console.log('\n✅ Done!');
  })
  .catch(error => {
    console.error('\n❌ Failed:', error.message);
    process.exit(1);
  });

