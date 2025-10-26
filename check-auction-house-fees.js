const { Connection, PublicKey } = require('@solana/web3.js');
const { Metaplex } = require('@metaplex-foundation/js');

async function checkAuctionHouseFees() {
  try {
    const connection = new Connection('https://api.devnet.solana.com');
    const metaplex = Metaplex.make(connection);
    
    const auctionHouseAddress = 'FWYve9qBwuXePpZhWRy72UWydDadeDse4youJrix7Et1';
    const platformWallet = '5ZLxvtmcpbUgHJdfAtHREwT3gLey4TWU3JHteqGzciED';
    
    console.log('🔍 Checking Auction House fee structure...');
    console.log('Auction House:', auctionHouseAddress);
    console.log('Platform Wallet:', platformWallet);
    console.log('');
    
    // Get Auction House
    const auctionHouse = await metaplex.auctionHouse().findByAddress({
      address: new PublicKey(auctionHouseAddress),
    });
    
    console.log('📋 Auction House Details:');
    console.log('   Authority:', auctionHouse.authorityAddress.toBase58());
    console.log('   Treasury:', auctionHouse.treasuryMintAddress?.toBase58() || 'SOL (Native)');
    console.log('   Fee:', auctionHouse.sellerFeeBasisPoints / 100 + '%');
    console.log('');
    
    // Check platform wallet balance
    const platformBalance = await connection.getBalance(new PublicKey(platformWallet));
    const platformBalanceSOL = platformBalance / 1e9;
    
    console.log('💰 Platform Wallet Balance:');
    console.log('   Address:', platformWallet);
    console.log('   Balance:', platformBalanceSOL, 'SOL');
    console.log('');
    
    // Check if this is the platform wallet
    const isPlatformAuthority = auctionHouse.authorityAddress.toBase58() === platformWallet;
    
    console.log('🎯 Fee Destination:');
    if (isPlatformAuthority) {
      console.log('   ✅ Fees go to: PLATFORM WALLET');
      console.log('   ✅ This is OUR marketplace fee!');
      console.log('   ✅ Authority matches platform wallet');
    } else {
      console.log('   ❌ Authority:', auctionHouse.authorityAddress.toBase58());
      console.log('   ❌ Different from platform wallet');
    }
    
    console.log('');
    console.log('📊 Transaction Analysis:');
    console.log('   Buyer paid: 0.11 SOL');
    console.log('   Seller received: 0.10875 SOL (98.75%)');
    console.log('   Marketplace fee: 0.00125 SOL (1.25%) - 2.5% of 0.05 (price after fee deduction?)');
    console.log('');
    
    // Check fee account
    const treasuryAddress = auctionHouse.auctionHouseFeeAccount;
    console.log('   Treasury Address:', treasuryAddress.toBase58());
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkAuctionHouseFees();

