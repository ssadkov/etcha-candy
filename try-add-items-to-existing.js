const API_BASE_URL = 'http://localhost:3000';

async function tryAddItemsToExistingCandyMachine() {
  try {
    console.log('🔍 Step 2: Trying to add items to existing Candy Machine...');
    
    const collectionId = 'collection_1761415240951_mdvi5yqwt';
    
    console.log(`\n🎫 Attempting to add items to Candy Machine for collection: ${collectionId}`);
    
    const response = await fetch(`${API_BASE_URL}/api/candy-machine/add-items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        collectionId: collectionId
      })
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Successfully added items to Candy Machine!');
      console.log('📊 Result:', result.data);
      
      // Check Candy Machine status after adding items
      console.log('\n🔍 Checking Candy Machine status after adding items...');
      const statusResponse = await fetch(`${API_BASE_URL}/api/collections/${collectionId}/candy-machine`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const statusResult = await statusResponse.json();
      
      if (statusResult.success) {
        const candyMachine = statusResult.data;
        console.log('✅ Updated Candy Machine status:');
        console.log(`   Items Available: ${candyMachine.itemsAvailable}`);
        console.log(`   Items Minted: ${candyMachine.itemsMinted}`);
        console.log(`   Items Remaining: ${candyMachine.itemsAvailable - candyMachine.itemsMinted}`);
        
        const remainingItems = candyMachine.itemsAvailable - candyMachine.itemsMinted;
        if (remainingItems > 0) {
          console.log(`\n🎯 Ready for minting! ${remainingItems} tickets available`);
          return {
            collectionId,
            candyMachineAddress: candyMachine.address,
            remainingItems,
            ticketPrice: 0.1 // Default price
          };
        } else {
          console.log(`\n❌ Still no tickets available`);
          return null;
        }
      } else {
        console.log('❌ Failed to get updated Candy Machine status:', statusResult.error);
        return null;
      }
    } else {
      console.log('❌ Failed to add items to Candy Machine:', result.error);
      return null;
    }

  } catch (error) {
    console.error('❌ Error trying to add items to Candy Machine:', error.message);
    return null;
  }
}

tryAddItemsToExistingCandyMachine().then(result => {
  if (result) {
    console.log('\n🎉 Success! Candy Machine is now ready for testing!');
    console.log('📊 Summary:');
    console.log(`   Collection ID: ${result.collectionId}`);
    console.log(`   Candy Machine: ${result.candyMachineAddress}`);
    console.log(`   Available Tickets: ${result.remainingItems}`);
    console.log(`   Price per Ticket: ${result.ticketPrice} SOL`);
  } else {
    console.log('\n❌ Failed to add items to existing Candy Machine');
    console.log('💡 We need to create a new collection instead');
  }
});
