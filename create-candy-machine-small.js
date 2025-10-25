const API_BASE_URL = 'http://localhost:3000';

async function createCandyMachineForSmallCollection() {
  try {
    console.log('🍭 Creating Candy Machine for small test collection...');
    
    const collectionId = 'collection_1761424601200_mjwjwo9cp';
    
    console.log(`\n🎯 Creating Candy Machine for collection: ${collectionId}`);
    
    const response = await fetch(`${API_BASE_URL}/api/collections/${collectionId}/candy-machine`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Candy Machine created successfully!');
      console.log('📊 Candy Machine details:', result.data);
      
      const candyMachineAddress = result.data.candyMachineAddress;
      console.log(`\n🍭 Candy Machine Address: ${candyMachineAddress}`);
      
      // Wait a moment for the Candy Machine to be fully set up
      console.log('\n⏳ Waiting for Candy Machine to be fully configured...');
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      // Check Candy Machine status
      console.log('\n🔍 Checking Candy Machine status...');
      const statusResponse = await fetch(`${API_BASE_URL}/api/collections/${collectionId}/candy-machine`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const statusResult = await statusResponse.json();
      
      if (statusResult.success) {
        const candyMachine = statusResult.data;
        console.log('✅ Candy Machine status:');
        console.log(`   Address: ${candyMachine.address}`);
        console.log(`   Items Available: ${candyMachine.itemsAvailable}`);
        console.log(`   Items Minted: ${candyMachine.itemsMinted}`);
        console.log(`   Items Remaining: ${candyMachine.itemsAvailable - candyMachine.itemsMinted}`);
        console.log(`   Price: ${candyMachine.price} SOL`);
        console.log(`   Is Active: ${candyMachine.isActive}`);
        console.log(`   Is Fully Loaded: ${candyMachine.isFullyLoaded}`);
        
        const remainingItems = candyMachine.itemsAvailable - candyMachine.itemsMinted;
        if (remainingItems > 0) {
          console.log(`\n🎯 Ready for minting! ${remainingItems} tickets available`);
          return {
            collectionId,
            candyMachineAddress: candyMachine.address,
            remainingItems,
            ticketPrice: 0.1
          };
        } else {
          console.log(`\n❌ No tickets available`);
          return null;
        }
      } else {
        console.log('❌ Failed to get Candy Machine status:', statusResult.error);
        return null;
      }
    } else {
      console.log('❌ Failed to create Candy Machine:', result.error);
      return null;
    }

  } catch (error) {
    console.error('❌ Error creating Candy Machine:', error.message);
    return null;
  }
}

createCandyMachineForSmallCollection().then(result => {
  if (result) {
    console.log('\n🎉 Candy Machine is ready for testing!');
    console.log('📊 Summary:');
    console.log(`   Collection ID: ${result.collectionId}`);
    console.log(`   Candy Machine: ${result.candyMachineAddress}`);
    console.log(`   Available Tickets: ${result.remainingItems}`);
    console.log(`   Price per Ticket: ${result.ticketPrice} SOL`);
  } else {
    console.log('\n❌ Failed to create Candy Machine');
  }
});
