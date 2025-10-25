const API_BASE_URL = 'http://localhost:3000';

async function checkReadyCollection() {
  try {
    console.log('🔍 Step 1: Checking ready collection...');
    
    const collectionId = 'collection_1761415240951_mdvi5yqwt';
    
    // Get collection details
    console.log(`\n📋 Checking collection: ${collectionId}`);
    const collectionResponse = await fetch(`${API_BASE_URL}/api/collections/${collectionId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const collectionResult = await collectionResponse.json();
    
    if (collectionResult.success) {
      const collection = collectionResult.data;
      console.log('✅ Collection found:');
      console.log(`   Name: ${collection.name}`);
      console.log(`   Max Tickets: ${collection.maxTickets}`);
      console.log(`   Ticket Price: ${collection.ticketPrice} SOL`);
      console.log(`   Collection NFT: ${collection.collectionNftAddress || 'Not created'}`);
      console.log(`   Candy Machine: ${collection.candyMachineAddress || 'Not created'}`);
      console.log(`   Status: ${collection.status}`);
      
      // Check Candy Machine status if it exists
      if (collection.candyMachineAddress && collection.candyMachineAddress !== 'Not created') {
        console.log(`\n🍭 Checking Candy Machine: ${collection.candyMachineAddress}`);
        
        const candyMachineResponse = await fetch(`${API_BASE_URL}/api/collections/${collectionId}/candy-machine`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        const candyMachineResult = await candyMachineResponse.json();
        
        if (candyMachineResult.success) {
          const candyMachine = candyMachineResult.data;
          console.log('✅ Candy Machine status:');
          console.log(`   Address: ${candyMachine.address}`);
          console.log(`   Items Available: ${candyMachine.itemsAvailable}`);
          console.log(`   Items Minted: ${candyMachine.itemsMinted}`);
          console.log(`   Items Remaining: ${candyMachine.itemsAvailable - candyMachine.itemsMinted}`);
          console.log(`   Price: ${candyMachine.price} SOL`);
          console.log(`   Is Active: ${candyMachine.isActive}`);
          console.log(`   Is Fully Loaded: ${candyMachine.isFullyLoaded}`);
          
          // Check if we can mint
          const remainingItems = candyMachine.itemsAvailable - candyMachine.itemsMinted;
          if (remainingItems > 0) {
            console.log(`\n🎯 Ready for minting! ${remainingItems} tickets available`);
            return {
              collectionId,
              candyMachineAddress: collection.candyMachineAddress,
              remainingItems,
              ticketPrice: collection.ticketPrice
            };
          } else {
            console.log(`\n❌ Candy Machine is empty - all tickets minted`);
            return null;
          }
        } else {
          console.log('❌ Failed to get Candy Machine info:', candyMachineResult.error);
          return null;
        }
      } else {
        console.log('\n❌ No Candy Machine found for this collection');
        return null;
      }
    } else {
      console.log('❌ Failed to get collection:', collectionResult.error);
      return null;
    }

  } catch (error) {
    console.error('❌ Error checking ready collection:', error.message);
    return null;
  }
}

checkReadyCollection().then(result => {
  if (result) {
    console.log('\n🎉 Collection is ready for testing!');
    console.log('📊 Summary:');
    console.log(`   Collection ID: ${result.collectionId}`);
    console.log(`   Candy Machine: ${result.candyMachineAddress}`);
    console.log(`   Available Tickets: ${result.remainingItems}`);
    console.log(`   Price per Ticket: ${result.ticketPrice} SOL`);
  } else {
    console.log('\n❌ Collection is not ready for testing');
  }
});
