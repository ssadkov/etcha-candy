const { Connection, PublicKey } = require('@solana/web3.js');
const { Metaplex } = require('@metaplex-foundation/js');

async function checkBlockchainListings() {
  try {
    const connection = new Connection('https://api.devnet.solana.com');
    const metaplex = Metaplex.make(connection);
    
    const auctionHouseAddress = 'FWYve9qBwuXePpZhWRy72UWydDadeDse4youJrix7Et1';
    
    console.log('🔍 Checking Auction House listings on blockchain...');
    console.log('Auction House:', auctionHouseAddress);
    console.log('');
    
    // Get Auction House
    const auctionHouse = await metaplex.auctionHouse().findByAddress({
      address: new PublicKey(auctionHouseAddress),
    });
    
    // Get all listings
    const listings = await metaplex.auctionHouse().findListings({
      auctionHouse,
    });
    
    console.log(`✅ Found ${listings.length} active listing(s)\n`);
    
    for (let i = 0; i < listings.length; i++) {
      const listing = listings[i];
      
      // Load full listing
      const fullListing = listing.model === 'listing' 
        ? listing 
        : await metaplex.auctionHouse().loadListing({ lazyListing: listing });
      
      console.log(`📋 Listing ${i + 1}:`);
      console.log('   Trade State:', fullListing.tradeStateAddress.toBase58());
      console.log('   Seller:', fullListing.sellerAddress.toBase58());
      console.log('   Price:', fullListing.price.basisPoints.toNumber() / 1e9, 'SOL');
      
      // Try to get NFT info
      try {
        const nftAddress = fullListing.asset?.address?.toBase58() || 
                           fullListing.metadataAddress?.toBase58() || 
                           'unknown';
        console.log('   NFT:', nftAddress);
      } catch (e) {
        console.log('   NFT:', 'unknown');
      }
      
      console.log('');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkBlockchainListings();

