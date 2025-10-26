const API_BASE_URL = 'http://localhost:3000';

const BOB_WALLET = 'GcUxE5YPjFtK4ri1CZ2vG9tK9Mrt6hFSZ38cLCoC5tf7';
const BOB_SECOND_NFT = '96ofUut1KoJxcxYbpAhvoMLJ9ZjL9J8uLi6ggZ7y8L2D'; // Short Event Ticket #002
const PRICE_IN_SOL = 0.11; // 0.11 SOL
const AUCTION_HOUSE_ADDRESS = 'FWYve9qBwuXePpZhWRy72UWydDadeDse4youJrix7Et1';

async function listBobSecondNFT() {
  try {
    console.log('🏷️  Listing Bob\'s second NFT for sale...');
    console.log('   NFT:', BOB_SECOND_NFT);
    console.log('   Price:', PRICE_IN_SOL, 'SOL');
    console.log('   Seller:', BOB_WALLET);
    
    const response = await fetch(`${API_BASE_URL}/api/marketplace/list`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nftMintAddress: BOB_SECOND_NFT,
        priceInSol: PRICE_IN_SOL,
        userWallet: BOB_WALLET,
        auctionHouseAddress: AUCTION_HOUSE_ADDRESS,
      }),
    });

    const data = await response.json();

    if (data.success) {
      console.log('✅ Second NFT listed successfully!');
      console.log('📋 Listing Details:');
      console.log('   Listing Address:', data.data.listingAddress);
      console.log('   Price:', data.data.price, 'SOL');
      
      console.log('\n🔗 Explorer link:');
      console.log(`   https://explorer.solana.com/address/${data.data.listingAddress}?cluster=devnet`);
      
      return data.data;
    } else {
      console.error('❌ Error listing second NFT:', data.error);
      throw new Error(data.error);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  }
}

listBobSecondNFT()
  .then(() => {
    console.log('\n✅ Second listing completed successfully!');
    console.log('\n📊 Total active listings: 2');
    console.log('   1. Bob NFT #1: 0.5 SOL');
    console.log('   2. Bob NFT #2: 0.11 SOL');
  })
  .catch(error => {
    console.error('\n❌ Failed:', error.message);
    process.exit(1);
  });

