const API_BASE_URL = 'http://localhost:3000';

const CHARLIE_WALLET = '4LJ9wbTJW3y9LJ4ZzcR3BFXJoWLJkZR4NdYzPFm72nLy';
const LISTING_ADDRESS = '6yFnu78vBn582T4qyHUuq3VybKTaMUAHmjrXTxfHhD9M'; // 0.11 SOL listing
const AUCTION_HOUSE_ADDRESS = 'FWYve9qBwuXePpZhWRy72UWydDadeDse4youJrix7Et1';

async function charlieBuysNFT() {
  try {
    console.log('🛒 Charlie buying NFT on marketplace...');
    console.log('   Listing:', LISTING_ADDRESS);
    console.log('   Buyer:', CHARLIE_WALLET);
    console.log('   Price: 0.11 SOL');
    
    const response = await fetch(`${API_BASE_URL}/api/marketplace/buy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        listingAddress: LISTING_ADDRESS,
        userWallet: CHARLIE_WALLET,
        auctionHouseAddress: AUCTION_HOUSE_ADDRESS,
      }),
    });

    const data = await response.json();

    if (data.success) {
      console.log('✅ NFT purchased successfully!');
      console.log('\n📋 Purchase Details:');
      console.log('   Purchase Receipt:', data.data.purchaseAddress);
      console.log('   NFT Address:', data.data.nftAddress);
      console.log('   Buyer:', CHARLIE_WALLET);
      console.log('   Price paid: 0.11 SOL');
      
      console.log('\n🔗 Explorer links:');
      console.log('   NFT:', `https://explorer.solana.com/address/${data.data.nftAddress}?cluster=devnet`);
      console.log('   Purchase:', `https://explorer.solana.com/address/${data.data.purchaseAddress}?cluster=devnet`);
      
      console.log('\n✅ Transaction complete!');
      console.log('   - NFT transferred: Bob → Charlie');
      console.log('   - Payment sent: Charlie → Bob (0.10875 SOL)');
      console.log('   - Marketplace fee: 0.00125 SOL (2.5%)');
      
      return data.data;
    } else {
      console.error('❌ Error purchasing NFT:', data.error);
      throw new Error(data.error);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  }
}

charlieBuysNFT()
  .then(() => {
    console.log('\n🎉 Purchase completed successfully!');
  })
  .catch(error => {
    console.error('\n❌ Purchase failed:', error.message);
    process.exit(1);
  });

