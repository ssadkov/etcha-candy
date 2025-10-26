const { Connection, PublicKey } = require('@solana/web3.js');
const { Metaplex, keypairIdentity } = require('@metaplex-foundation/js');

async function checkBobTokenAccount() {
  try {
    const connection = new Connection('https://api.devnet.solana.com');
    
    // Bob's wallet
    const BOB_PRIVATE_KEY = [200, 234, 197, 98, 220, 102, 157, 103, 72, 192, 60, 55, 158, 105, 214, 57, 72, 85, 172, 28, 61, 144, 202, 214, 172, 62, 93, 182, 249, 185, 46, 72, 231, 246, 60, 226, 26, 4, 88, 178, 130, 252, 216, 103, 7, 207, 237, 166, 250, 179, 213, 157, 208, 231, 242, 215, 168, 244, 240, 116, 37, 128, 95, 30];
    const bobKeypair = {
      publicKey: new PublicKey('GcUxE5YPjFtK4ri1CZ2vG9tK9Mrt6hFSZ38cLCoC5tf7'),
      secretKey: new Uint8Array(BOB_PRIVATE_KEY)
    };
    
    const nftMintAddress = '2m1UCxTzQHjdUYmShRyPm2KZiXPz8DqyxCffUG1FEqnU';
    
    console.log('🔍 Checking Bob\'s token account for NFT:', nftMintAddress);
    
    const metaplex = Metaplex.make(connection).use(keypairIdentity(bobKeypair));
    
    // Get all NFTs owned by Bob
    const nfts = await metaplex.nfts().findAllByOwner({
      owner: bobKeypair.publicKey
    });
    
    console.log('\n📋 Found', nfts.length, 'NFT(s) owned by Bob:');
    
    nfts.forEach((nft, index) => {
      console.log(`\n${index + 1}. ${nft.name || 'Unnamed'}`);
      console.log('   Mint:', nft.mintAddress.toBase58());
      console.log('   Symbol:', nft.symbol);
      if (nft.address) {
        console.log('   Address:', nft.address.toBase58());
      }
    });
    
    // Check specific NFT
    console.log('\n🎯 Checking specific NFT:', nftMintAddress);
    try {
      const nft = await metaplex.nfts().findByMint({
        mintAddress: new PublicKey(nftMintAddress)
      });
      
      console.log('✅ NFT found!');
      console.log('   Name:', nft.name);
      console.log('   Owner:', nft.creators[0]?.address.toBase58());
      
      // Get token accounts for this mint
      const tokenAccounts = await connection.getTokenAccountsByOwner(
        bobKeypair.publicKey,
        { mint: new PublicKey(nftMintAddress) }
      );
      
      console.log('   Token Accounts:', tokenAccounts.value.length);
      if (tokenAccounts.value.length > 0) {
        console.log('   Token Account:', tokenAccounts.value[0].pubkey.toBase58());
      } else {
        console.log('   ⚠️  No token account found for Bob!');
      }
      
    } catch (error) {
      console.error('❌ Error:', error.message);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkBobTokenAccount();

