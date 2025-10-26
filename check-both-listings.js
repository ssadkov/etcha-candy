const API_BASE_URL = 'http://localhost:3000';
const AUCTION_HOUSE_ADDRESS = 'FWYve9qBwuXePpZhWRy72UWydDadeDse4youJrix7Et1';

async function checkListings() {
  try {
    console.log('📊 Getting active listings...');
    
    const response = await fetch(`${API_BASE_URL}/api/marketplace/listings/${AUCTION_HOUSE_ADDRESS}`);
    const data = await response.json();

    if (data.success) {
      console.log(`✅ Found ${data.data.length} active listing(s)\n`);
      
      data.data.forEach((listing, index) => {
        console.log(`📋 Listing ${index + 1}:`);
        console.log('   NFT:', listing.nftAddress);
        console.log('   Price:', listing.price, 'SOL');
        console.log('   Seller:', listing.seller);
        console.log('   Listing Address:', listing.listingAddress);
        console.log('   Created:', listing.createdAt || 'unknown');
        console.log('');
      });
    } else {
      console.error('❌ Error:', data.error);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkListings();

