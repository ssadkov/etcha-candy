const { Connection, PublicKey } = require('@solana/web3.js');
const { Metaplex } = require('@metaplex-foundation/js');

async function verifyCharlieOwnership() {
  try {
    const connection = new Connection('https://api.devnet.solana.com');
    const metaplex = Metaplex.make(connection);
    
    const charlieWallet = '4LJ9wbTJW3y9LJ4ZzcR3BFXJoWLJkZR4NdYzPFm72nLy';
    const nftMint = '96ofUut1KoJxcxYbpAhvoMLJ9ZjL9J8uLi6ggZ7y8L2D';
    
    console.log('🔍 Verifying NFT ownership...');
    console.log('   NFT:', nftMint);
    console.log('   Expected owner: Charlie');
    console.log('');
    
    // Get NFT by mint
    const nft = await metaplex.nfts().findByMint({
      mintAddress: new PublicKey(nftMint),
    });
    
    console.log('✅ NFT found!');
    console.log('   Name:', nft.name);
    console.log('   Symbol:', nft.symbol);
    
    // Check token account
    const tokenAccounts = await connection.getTokenAccountsByOwner(
      new PublicKey(charlieWallet),
      { mint: new PublicKey(nftMint) }
    );
    
    if (tokenAccounts.value.length > 0) {
      const tokenAccount = tokenAccounts.value[0];
      const tokenData = await connection.getTokenAccountBalance(tokenAccount.pubkey);
      
      console.log('   Token Account:', tokenAccount.pubkey.toBase58());
      console.log('   Balance:', tokenData.value.uiAmount);
      console.log('');
      console.log('✅ Charlie owns this NFT!');
    } else {
      console.log('❌ Charlie does not own this NFT');
    }
    
    // Get all NFTs owned by Charlie
    console.log('\n📋 All NFTs owned by Charlie:');
    const charlieNfts = await metaplex.nfts().findAllByOwner({
      owner: new PublicKey(charlieWallet)
    });
    
    charlieNfts.forEach((nft, index) => {
      console.log(`${index + 1}. ${nft.name || 'Unnamed'}`);
      console.log(`   Mint: ${nft.mintAddress.toBase58()}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

verifyCharlieOwnership();

