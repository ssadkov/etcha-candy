const { Connection, PublicKey } = require('@solana/web3.js');
const { Metaplex } = require('@metaplex-foundation/js');

async function checkTradeState() {
  try {
    const connection = new Connection('https://api.devnet.solana.com');
    const metaplex = Metaplex.make(connection);
    
    const tradeStateAddress = 'CtK2YnhKAi3zJATbYCgYiTQNgi4oZchHU5Yx6JfF4Wk8';
    const auctionHouseAddress = 'FWYve9qBwuXePpZhWRy72UWydDadeDse4youJrix7Et1';
    
    console.log('🔍 Checking Trade State Address...');
    console.log('Trade State:', tradeStateAddress);
    console.log('Auction House:', auctionHouseAddress);
    
    // Get account info
    const accountInfo = await connection.getAccountInfo(new PublicKey(tradeStateAddress));
    
    if (accountInfo) {
      console.log('\n✅ Trade State exists on blockchain!');
      console.log('Size:', accountInfo.data.length, 'bytes');
      console.log('Owner:', accountInfo.owner.toBase58());
      console.log('Data:', accountInfo.data.toString('base64'));
    } else {
      console.log('❌ Trade State not found');
    }
    
    // Try to load listing
    try {
      const auctionHouse = await metaplex.auctionHouse().findByAddress({
        address: new PublicKey(auctionHouseAddress),
      });
      
      const lazyListing = await metaplex.auctionHouse().findListingByTradeState({
        auctionHouse,
        tradeStateAddress: new PublicKey(tradeStateAddress),
      });
      
      console.log('\n✅ Listing found!');
      console.log('Model:', lazyListing.model);
      if (lazyListing.model === 'lazyListing') {
        console.log('Metadata:', lazyListing.metadataAddress.toBase58());
      }
      
      // Load full listing
      const listing = await metaplex.auctionHouse().loadListing({ lazyListing });
      console.log('\n📋 Listing details:');
      console.log('Price:', listing.price.basisPoints.toNumber() / 1e9, 'SOL');
      console.log('Seller:', listing.sellerAddress.toBase58());
      console.log('Canceled:', listing.canceledAt ? 'Yes' : 'No');
      
    } catch (error) {
      console.log('ℹ️  Could not load listing:', error.message);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkTradeState();

