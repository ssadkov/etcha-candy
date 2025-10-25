const { PublicKey } = require('@solana/web3.js');
const { Metaplex, keypairIdentity } = require('@metaplex-foundation/js');
const { Connection, Keypair } = require('@solana/web3.js');

async function checkCandyMachinePrice() {
  try {
    console.log('🔍 Checking Candy Machine price correctly...');
    
    // Подключение к devnet
    const connection = new Connection('https://api.devnet.solana.com');
    
    // Создаем ключ из приватного ключа
    const privateKeyArray = [149,148,143,202,169,187,184,148,215,237,214,44,60,28,106,132,60,116,254,205,157,166,244,7,165,25,46,94,158,98,233,214,67,183,232,68,166,218,234,48,186,46,35,183,102,67,37,234,234,223,199,12,225,158,96,57,236,154,85,13,144,176,133,170];
    const keypair = Keypair.fromSecretKey(new Uint8Array(privateKeyArray));
    
    // Создаем Metaplex instance
    const mx = Metaplex.make(connection).use(keypairIdentity(keypair));
    
    // Адреса Candy Machine для проверки
    const candyMachineAddresses = [
      '822siy6tNHxhVf2XDj6QniyVBdnaWri5n5cNBn882mck', // Последняя созданная с исправленной ценой
      'EBDiuSexmy37aQLWpDX31xetDvrMYnAxdeT9xgmD2gVb', // Предыдущая
      '8rVpkqC55YWTL83r9rLCfVyL1LRoeQ5MgGNnz7jNwFed'  // Еще более ранняя
    ];
    
    for (const cmAddress of candyMachineAddresses) {
      console.log(`\n📊 Checking Candy Machine: ${cmAddress}`);
      
      try {
        // Получаем Candy Machine
        const cm = await mx.candyMachines().findByAddress({
          address: new PublicKey(cmAddress),
        });
        
        console.log('✅ Candy Machine found');
        console.log('- Items Available:', cm.itemsAvailable.toString());
        console.log('- Items Minted:', cm.itemsMinted.toString());
        console.log('- Items Remaining:', cm.itemsRemaining.toString());
        
        // Получаем Candy Guard через candyGuard из модели CM
        const guard = cm.candyGuard;
        
        console.log('✅ Candy Guard found');
        
        // Проверяем базовую цену в SOL
        const defaultSolPriceLamports = guard.guards.solPayment?.amount.basisPoints ?? null;
        if (defaultSolPriceLamports) {
          const priceInSOL = Number(defaultSolPriceLamports) / 1e9;
          console.log(`💰 Default SOL Price: ${priceInSOL} SOL (${defaultSolPriceLamports} lamports)`);
        } else {
          console.log('💰 Default SOL Price: No SOL payment guard');
        }
        
        // Проверяем группы (если есть)
        if (guard.groups && guard.groups.length > 0) {
          console.log('📋 Groups:');
          for (const group of guard.groups) {
            const label = group.label;
            const lamports = group.guards.solPayment?.amount.basisPoints ?? null;
            const tokenAmount = group.guards.tokenPayment?.amount.basisPoints ?? null;
            
            if (lamports) {
              const priceInSOL = Number(lamports) / 1e9;
              console.log(`  - ${label}: ${priceInSOL} SOL (${lamports} lamports)`);
            }
            if (tokenAmount) {
              console.log(`  - ${label}: ${tokenAmount} tokens`);
            }
          }
        } else {
          console.log('📋 Groups: None');
        }
        
      } catch (error) {
        console.log(`❌ Error checking ${cmAddress}:`, error.message);
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  }
}

// Run the function
checkCandyMachinePrice()
  .then(() => {
    console.log('\n🎉 Price check completed!');
  })
  .catch(error => {
    console.error('❌ Failed to check prices:', error.message);
    process.exit(1);
  });
