const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';

async function testUserTicketsAPI() {
  try {
    console.log('🧪 Testing User Tickets API...\n');

    // Test wallets from our platform
    const testWallets = [
      '5ZLxvtmcpbUgHJdfAtHREwT3gLey4TWU3JHteqGzciED', // Alice (platform wallet)
      'GcUxE5YPjFtK4ri1CZ2vG9tK9Mrt6hFSZ38cLCoC5tf7', // Bob
      '4LJ9wbTJW3y9LJ4ZzcR3BFXJoWLJkZR4NdYzPFm72nLy'  // Charlie
    ];

    for (const wallet of testWallets) {
      console.log(`🔍 Testing wallet: ${wallet}`);
      
      // Test 1: Get all user tickets (filtered by platform)
      try {
        const response1 = await axios.get(`${BASE_URL}/tickets/user/${wallet}`);
        console.log('✅ GET /tickets/user/:wallet');
        console.log('   Response:', {
          success: response1.data.success,
          count: response1.data.data.count,
          platformWallet: response1.data.data.platformWallet,
          filteredByPlatform: response1.data.data.filteredByPlatform
        });
        console.log('   Tickets:', response1.data.data.tickets);
      } catch (error) {
        console.log('❌ GET /tickets/user/:wallet failed:', error.response?.data || error.message);
      }

      // Test 2: Get user tickets from platform only
      try {
        const response2 = await axios.get(`${BASE_URL}/tickets/platform/${wallet}`);
        console.log('✅ GET /tickets/platform/:wallet');
        console.log('   Response:', {
          success: response2.data.success,
          count: response2.data.data.count,
          platformWallet: response2.data.data.platformWallet,
          filteredByPlatform: response2.data.data.filteredByPlatform
        });
        console.log('   Tickets:', response2.data.data.tickets);
      } catch (error) {
        console.log('❌ GET /tickets/platform/:wallet failed:', error.response?.data || error.message);
      }

      console.log('---');
    }

    // Test 3: Test with collection filter
    console.log('🔍 Testing with collection filter...');
    try {
      const response = await axios.get(`${BASE_URL}/tickets/user/5ZLxvtmcpbUgHJdfAtHREwT3gLey4TWU3JHteqGzciED?collectionId=collection_1761427859093_v5a9hfr1h`);
      console.log('✅ GET /tickets/user/:wallet?collectionId=...');
      console.log('   Response:', {
        success: response.data.success,
        count: response.data.data.count,
        message: response.data.message
      });
      console.log('   Tickets:', response.data.data.tickets);
    } catch (error) {
      console.log('❌ GET /tickets/user/:wallet?collectionId=... failed:', error.response?.data || error.message);
    }

    console.log('\n🎉 User Tickets API test completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testUserTicketsAPI();
