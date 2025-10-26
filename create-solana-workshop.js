const API_BASE_URL = 'http://localhost:3000';

const collectionData = {
  name: 'Solana workshop',
  description: 'Interactive workshop on Solana blockchain development',
  eventCreator: 'Solana Foundation',
  eventCreatorName: 'Solana Foundation',
  eventName: 'Solana Workshop 2025',
  eventDate: '2025-03-15',
  eventLocation: 'Online',
  maxTickets: 200,
  ticketPrice: 0.25,
  imageUrl: 'https://via.placeholder.com/512x512.png?text=Solana+Workshop'
};

async function createWorkshopCollection() {
  try {
    console.log('🎨 Creating Solana Workshop Collection...');
    console.log('Collection:', collectionData);
    console.log('');
    
    const response = await fetch(`${API_BASE_URL}/api/collections`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(collectionData),
    });

    const data = await response.json();

    if (data.success) {
      console.log('✅ Collection created successfully!');
      console.log('');
      console.log('📋 Collection Details:');
      console.log('=' .repeat(50));
      console.log('ID:', data.data.id);
      console.log('Name:', data.data.name);
      console.log('Event Creator:', data.data.eventCreator);
      console.log('Max Tickets:', data.data.maxTickets);
      console.log('Price:', data.data.priceInSol, 'SOL');
      console.log('');
      console.log('📍 Blockchain Addresses:');
      console.log('   Collection NFT:', data.data.collectionNftAddress);
      console.log('   Candy Machine:', data.data.candyMachineAddress || 'Not created yet');
      console.log('');
      console.log('💰 Important for accounting:');
      console.log('   - Collection ID:', data.data.id);
      console.log('   - Collection NFT Address:', data.data.collectionNftAddress);
      console.log('   - Status:', data.data.status);
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
    throw error;
  }
}

createWorkshopCollection()
  .then(() => {
    console.log('\n✅ Done! Collection is ready.');
  })
  .catch(error => {
    console.error('\n❌ Failed:', error.message);
    process.exit(1);
  });

