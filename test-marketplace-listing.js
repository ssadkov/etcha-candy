const API_BASE_URL = 'http://localhost:3000';

// Test data
const BOB_WALLET = 'GcUxE5YPjFtK4ri1CZ2vG9tK9Mrt6hFSZ38cLCoC5tf7';
const BOB_NFT_ADDRESS = 'G2jAUxWjpn1xho8YFPBtEvjiSTQj321cCqdumcF2USzs'; // Bob's real NFT
const PRICE_IN_SOL = 0.5; // 0.5 SOL for test

let auctionHouseAddress = null;

async function createMarketplace() {
  try {
    console.log('🏪 Creating Auction House marketplace...');
    
    const response = await fetch(`${API_BASE_URL}/api/marketplace/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const result = await response.json();
    
    if (result.success) {
      auctionHouseAddress = result.data.auctionHouseAddress;
      console.log('✅ Marketplace created successfully!');
      console.log('📍 Auction House Address:', auctionHouseAddress);
      return auctionHouseAddress;
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    console.error('❌ Error creating marketplace:', error.message);
    throw error;
  }
}

async function listBobNFT() {
  try {
    console.log('\n🏷️ Listing Bob\'s NFT for sale...');
    console.log('   NFT Address:', BOB_NFT_ADDRESS);
    console.log('   Price:', PRICE_IN_SOL, 'SOL');
    console.log('   Seller:', BOB_WALLET);
    
    const response = await fetch(`${API_BASE_URL}/api/marketplace/list`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nftMintAddress: BOB_NFT_ADDRESS,
        priceInSol: PRICE_IN_SOL,
        userWallet: BOB_WALLET,
        auctionHouseAddress: auctionHouseAddress,
      })
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('✅ NFT listed successfully!');
      console.log('📋 Listing Details:');
      console.log('   Listing Address:', result.data.listingAddress);
      console.log('   Price:', result.data.price, 'SOL');
      console.log('\n🔗 Explorer links:');
      console.log('   NFT:', `https://explorer.solana.com/address/${BOB_NFT_ADDRESS}?cluster=devnet`);
      console.log('   Auction House:', `https://explorer.solana.com/address/${auctionHouseAddress}?cluster=devnet`);
      return result.data;
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    console.error('❌ Error listing NFT:', error.message);
    throw error;
  }
}

async function getActiveListings() {
  try {
    console.log('\n📊 Getting active listings...');
    
    const response = await fetch(`${API_BASE_URL}/api/marketplace/listings/${auctionHouseAddress}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Found', result.data.count, 'active listing(s)');
      
      if (result.data.listings.length > 0) {
        console.log('\n📋 Active Listings:');
        result.data.listings.forEach((listing, index) => {
          console.log(`\n   Listing ${index + 1}:`);
          console.log('     NFT:', listing.nftAddress);
          console.log('     Price:', listing.price, 'SOL');
          console.log('     Seller:', listing.seller);
          console.log('     Listing Address:', listing.listingAddress);
          console.log('     Created:', listing.createdAt || 'unknown');
        });
      } else {
        console.log('   (No active listings)');
      }
      
      return result.data;
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    console.error('❌ Error getting listings:', error.message);
    throw error;
  }
}

async function runTest() {
  try {
    console.log('🎯 Testing Marketplace Listing');
    console.log('=' .repeat(50));
    
    // Step 1: Use existing Auction House
    console.log('📋 Using existing Auction House...');
    auctionHouseAddress = 'FWYve9qBwuXePpZhWRy72UWydDadeDse4youJrix7Et1';
    console.log('📍 Auction House Address:', auctionHouseAddress);
    
    // Step 2: List Bob's NFT
    const listingResult = await listBobNFT();
    
    // Step 3: Get all active listings
    await getActiveListings();
    
    console.log('\n' + '='.repeat(50));
    console.log('🎉 Test completed successfully!');
    console.log('\n📋 Summary:');
    console.log('   Marketplace created at:', auctionHouseAddress);
    console.log('   Bob\'s NFT listed at:', listingResult.listingAddress);
    console.log('   Price:', PRICE_IN_SOL, 'SOL');
    
    console.log('\n💡 Next steps:');
    console.log('   1. Check listing on blockchain');
    console.log('   2. Test buying with Alice or Charlie');
    console.log('   3. Verify NFT transfer');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run the test
runTest();

