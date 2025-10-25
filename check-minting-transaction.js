const axios = require('axios');

async function checkMintingTransaction() {
  try {
    console.log('🔍 Checking minting transaction details...');
    
    // Получаем последние транзакции для кошелька Alice
    const userWallet = '5ZLxvtmcpbUgHJdfAtHREwT3gLey4TWU3JHteqGzciED';
    
    console.log('📝 Getting recent transactions...');
    const transactionsResponse = await axios.get(`https://api.devnet.solana.com`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        jsonrpc: '2.0',
        id: 1,
        method: 'getSignaturesForAddress',
        params: [
          userWallet,
          { limit: 5 }
        ]
      }
    });
    
    const signatures = transactionsResponse.data.result;
    
    if (signatures && signatures.length > 0) {
      const latestSignature = signatures[0].signature;
      console.log('✅ Latest transaction signature:', latestSignature);
      
      // Получаем детали транзакции
      const transactionResponse = await axios.get(`https://api.devnet.solana.com`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          jsonrpc: '2.0',
          id: 1,
          method: 'getTransaction',
          params: [
            latestSignature,
            { encoding: 'json', maxSupportedTransactionVersion: 0 }
          ]
        }
      });
      
      const transaction = transactionResponse.data.result;
      
      if (transaction) {
        console.log('📊 Transaction Details:');
        console.log('- Signature:', latestSignature);
        console.log('- Block Time:', new Date(transaction.blockTime * 1000).toISOString());
        console.log('- Fee:', transaction.meta.fee, 'lamports');
        console.log('- Status:', transaction.meta.err ? 'Failed' : 'Success');
        
        // Проверяем изменения баланса
        if (transaction.meta.preBalances && transaction.meta.postBalances) {
          const preBalance = transaction.meta.preBalances[0] / 1e9;
          const postBalance = transaction.meta.postBalances[0] / 1e9;
          const balanceChange = preBalance - postBalance;
          
          console.log('- Pre Balance:', preBalance, 'SOL');
          console.log('- Post Balance:', postBalance, 'SOL');
          console.log('- Balance Change:', balanceChange, 'SOL');
          
          if (Math.abs(balanceChange - 0.1) < 0.01) {
            console.log('✅ Price is correct: ~0.1 SOL');
          } else {
            console.log('❌ Price seems incorrect:', balanceChange, 'SOL');
          }
        }
        
        console.log('\n🔗 View on Solscan:');
        console.log(`https://solscan.io/tx/${latestSignature}?cluster=devnet`);
      }
    }
    
    return signatures;
  } catch (error) {
    console.error('❌ Error checking transaction:', error.response?.data || error.message);
    throw error;
  }
}

// Run the function
checkMintingTransaction()
  .then(signatures => {
    console.log('\n🎉 Transaction check completed!');
  })
  .catch(error => {
    console.error('❌ Failed to check transaction:', error.message);
    process.exit(1);
  });
