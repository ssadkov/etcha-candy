const API_BASE_URL = 'http://localhost:3000';

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

async function recreateWorkshopCollection() {
  try {
    console.log('🔄 Recreating Solana Workshop Collection...');
    console.log('   Old Collection ID: collection_1761507837674_w780dr9if');
    console.log('   New Platform Wallet: syhurEG8zZwZZ5921bnLXWw8Ta8JsrGt2qKvR8FgxKK');
    console.log('');
    console.log('⚠️  IMPORTANT: Fund the new wallet first!');
    console.log('   1. Go to: https://faucet.solana.com/');
    console.log('   2. Enter: syhurEG8zZwZZ5921bnLXWw8Ta8JsrGt2qKvR8FgxKK');
    console.log('   3. Then run this script again');
    console.log('');
    
    // Check if wallet is funded
    const response = await fetch('http://localhost:3000/health');
    
    if (!response.ok) {
      console.log('❌ Server not running. Start server first: npm run dev');
      return;
    }
    
    console.log('🎨 Creating collection with NEW wallet...');
    console.log('Collection:', collectionData);
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
      console.log('📋 NEW Collection Details:');
      console.log('='.repeat(50));
      console.log('ID:', data.data.id);
      console.log('Collection NFT:', data.data.collectionNftAddress);
      console.log('Platform Wallet:', 'syhurEG8zZwZZ5921bnLXWw8Ta8JsrGt2qKvR8FgxKK');
      console.log('Price:', data.data.ticketPrice, 'SOL');
      console.log('Max Tickets:', data.data.maxTickets);
      console.log('');
      console.log('🔗 Explorer:');
      console.log(`   https://explorer.solana.com/address/${data.data.collectionNftAddress}?cluster=devnet`);
      
      return data.data;
    } else {
      console.error('❌ Error creating collection:', data.error);
      throw new Error(data.error);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.message.includes('fetch')) {
      console.log('');
      console.log('💡 Make sure server is running: npm run dev');
    }
    throw error;
  }
}

recreateWorkshopCollection()
  .then(() => {
    console.log('\n✅ Done! Collection recreated with NEW wallet.');
  })
  .catch(error => {
    console.error('\n❌ Failed:', error.message);
    process.exit(1);
  });

