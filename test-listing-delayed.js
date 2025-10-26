const API_BASE_URL = 'http://localhost:3000';

// Wait for server to be ready
async function waitForServer(maxWait = 30000) {
  const startTime = Date.now();
  
  while (Date.now() - startTime < maxWait) {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      if (response.ok) {
        console.log('✅ Server is ready!');
        return true;
      }
    } catch (error) {
      // Server not ready yet
    }
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    process.stdout.write('.');
  }
  
  console.log('\n❌ Server timeout');
  return false;
}

const BOB_WALLET = 'GcUxE5YPjFtK4ri1CZ2vG9tK9Mrt6hFSZ38cLCoC5tf7';
const BOB_NFT_ADDRESS = '2m1UCxTzQHjdUYmShRyPm2KZiXPz8DqyxCffUG1FEqnU';
const PRICE_IN_SOL = 0.5;

async function createMarketplace() {
  console.log('🏪 Creating Auction House marketplace...');
  
  const response = await fetch(`${API_BASE_URL}/api/marketplace/create`, {
    method: 'POST',
  });

  const result = await response.json();
  
  if (result.success) {
    console.log('✅ Marketplace created!');
    console.log('   Address:', result.data.auctionHouseAddress);
    return result.data.auctionHouseAddress;
  } else {
    throw new Error(result.error || 'Unknown error');
  }
}

async function listNFT(auctionHouseAddress) {
  console.log('\n🏷️ Listing Bob\'s NFT...');
  console.log('   NFT:', BOB_NFT_ADDRESS);
  console.log('   Price:', PRICE_IN_SOL, 'SOL');
  
  const response = await fetch(`${API_BASE_URL}/api/marketplace/list`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nftMintAddress: BOB_NFT_ADDRESS,
      priceInSol: PRICE_IN_SOL,
      userWallet: BOB_WALLET,
      auctionHouseAddress,
    })
  });

  const result = await response.json();
  
  if (result.success) {
    console.log('✅ NFT listed successfully!');
    console.log('   Listing Address:', result.data.listingAddress);
    return result.data;
  } else {
    throw new Error(result.error || 'Unknown error');
  }
}

async function main() {
  try {
    console.log('⏳ Waiting for server...');
    const ready = await waitForServer();
    
    if (!ready) {
      console.log('❌ Server not ready after 30 seconds');
      process.exit(1);
    }
    
    console.log('\n🎯 Starting test...\n');
    
    // Create marketplace
    const auctionHouseAddress = await createMarketplace();
    
    // List NFT
    const listing = await listNFT(auctionHouseAddress);
    
    console.log('\n🎉 Test completed!');
    console.log('\n📋 Summary:');
    console.log('   Marketplace:', auctionHouseAddress);
    console.log('   Listing:', listing.listingAddress);
    console.log('   NFT Explorer: https://explorer.solana.com/address/' + BOB_NFT_ADDRESS + '?cluster=devnet');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();

