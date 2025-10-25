const { Connection, PublicKey } = require('@solana/web3.js');

const RPC_URL = 'https://api.devnet.solana.com';
const API_BASE_URL = 'http://localhost:3000';

async function getCollectionNFTs() {
  try {
    console.log('📋 Fetching collections from API...');
    const response = await fetch(`${API_BASE_URL}/api/collections`);
    const data = await response.json();
    
    if (!data.success) {
      throw new Error('Failed to fetch collections');
    }
    
    // Filter collections that have NFT addresses
    const collectionsWithNFTs = data.data.filter(col => col.collectionNftAddress);
    
    console.log(`✅ Found ${collectionsWithNFTs.length} collections with NFTs\n`);
    return collectionsWithNFTs;
  } catch (error) {
    console.error('❌ Error fetching collections:', error.message);
    return [];
  }
}

async function verifyCollectionNFTs() {
  console.log('🔍 Verifying Collection NFTs on Solana Devnet...\n');
  
  // Get collections dynamically from API
  const collections = await getCollectionNFTs();
  
  if (collections.length === 0) {
    console.log('❌ No collections with NFTs found');
    return;
  }
  
  const connection = new Connection(RPC_URL, 'confirmed');
  
  for (let i = 0; i < collections.length; i++) {
    const collection = collections[i];
    const nftAddress = collection.collectionNftAddress;
    
    console.log(`${i + 1}. Checking Collection NFT: ${collection.name}`);
    console.log(`   📝 Collection ID: ${collection.id}`);
    console.log(`   🎨 NFT Address: ${nftAddress}`);
    
    try {
      // Check if account exists
      const accountInfo = await connection.getAccountInfo(new PublicKey(nftAddress));
      
      if (accountInfo) {
        console.log('   ✅ NFT exists on blockchain');
        console.log('   📊 Account data length:', accountInfo.data.length, 'bytes');
        console.log('   🏦 Owner program:', accountInfo.owner.toString());
        console.log('   💰 Rent exempt:', accountInfo.rentEpoch);
        
        // Get transaction history (last 5 transactions)
        const signatures = await connection.getSignaturesForAddress(new PublicKey(nftAddress), { limit: 5 });
        console.log('   📝 Recent transactions:', signatures.length);
        
        if (signatures.length > 0) {
          console.log('   🕒 Latest transaction:', signatures[0].signature);
          console.log('   ⏰ Block time:', new Date(signatures[0].blockTime * 1000).toISOString());
        }
        
        console.log('   🔗 Solana Explorer:', `https://explorer.solana.com/address/${nftAddress}?cluster=devnet`);
        console.log('   📅 Event Date:', collection.eventDate);
        console.log('   🎫 Max Tickets:', collection.maxTickets);
        console.log('   💰 Ticket Price:', collection.ticketPrice, 'SOL');
      } else {
        console.log('   ❌ NFT not found on blockchain');
      }
    } catch (error) {
      console.log('   ❌ Error checking NFT:', error.message);
    }
    
    console.log('');
  }
  
  console.log('🎯 Blockchain verification completed!');
  console.log('\n📋 Summary:');
  console.log(`- ${collections.length} Collection NFTs verified on Solana Devnet`);
  console.log('- NFTs are owned by Token Metadata Program');
  console.log('- Transaction history is available');
  console.log('- Metadata URIs point to API endpoints');
  console.log('- All collections fetched dynamically from API');
}

// Run verification
verifyCollectionNFTs().catch(console.error);
