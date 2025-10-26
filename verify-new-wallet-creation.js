const { Connection, PublicKey } = require('@solana/web3.js');
const { Metaplex } = require('@metaplex-foundation/js');

async function verifyNewWalletCreation() {
  try {
    console.log('🔍 Verifying wallet used for collection creation...');
    console.log('');
    
    const connection = new Connection('https://api.devnet.solana.com');
    const metaplex = Metaplex.make(connection);
    
    const candyMachineAddress = '4Ds7LEtAUq5J5grFWkDz7NeLt5TemRkZd2ZBG1cDhebT';
    
    console.log('Fetching Candy Machine...');
    const cm = await metaplex.candyMachines().findByAddress({ address: new PublicKey(candyMachineAddress) });
    
    console.log('');
    console.log('✅ Candy Machine Details:');
    console.log('='.repeat(60));
    console.log('Address:', candyMachineAddress);
    console.log('Authority:', cm.authorityAddress.toString());
    console.log('Collection:', cm.collectionMintAddress.toString());
    console.log('');
    
    const newWallet = 'syhurEG8zZwZZ5921bnLXWw8Ta8JsrGt2qKvR8FgxKK';
    const oldWallet = '5ZLxvtmcpbUgHJdfAtHREwT3gLey4TWU3JHteqGzciED';
    
    if (cm.authorityAddress.toString() === newWallet) {
      console.log('✅ SUCCESS! Candy Machine created with NEW wallet!');
      console.log('   Platform Wallet:', newWallet);
    } else if (cm.authorityAddress.toString() === oldWallet) {
      console.log('❌ ERROR! Candy Machine created with OLD wallet!');
      console.log('   Old Wallet:', oldWallet);
    } else {
      console.log('⚠️  Unexpected wallet:', cm.authorityAddress.toString());
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

verifyNewWalletCreation();

