const axios = require('axios');

async function testCSRF() {
  try {
    console.log('Testing CSRF implementation...\n');
    
    // Test 1: Get CSRF token
    console.log('1. Getting CSRF token...');
    const tokenResponse = await axios.get('http://localhost:3000/csrf-token');
    console.log('✅ CSRF token received:', tokenResponse.data.csrfToken.substring(0, 20) + '...');
    
    // Test 2: Try request without CSRF token (should fail)
    console.log('\n2. Testing request without CSRF token...');
    try {
      await axios.post('http://localhost:3000/auth/login', {
        email: 'test@example.com',
        password: 'password'
      });
      console.log('❌ Request succeeded without CSRF token (this should not happen)');
    } catch (error) {
      if (error.response && error.response.status === 403) {
        console.log('✅ Request blocked without CSRF token:', error.response.data.message);
      } else {
        console.log('⚠️ Unexpected error:', error.message);
      }
    }
    
    // Test 3: Try request with CSRF token (should succeed to validation step)
    console.log('\n3. Testing request with CSRF token...');
    try {
      await axios.post('http://localhost:3000/auth/login', {
        email: 'test@example.com',
        password: 'password'
      }, {
        headers: {
          'X-CSRF-Token': tokenResponse.data.csrfToken
        }
      });
      console.log('✅ Request passed CSRF validation (may fail at auth step, which is expected)');
    } catch (error) {
      if (error.response && error.response.status === 403 && error.response.data.error === 'CSRF token validation failed') {
        console.log('❌ CSRF token validation failed:', error.response.data.message);
      } else {
        console.log('✅ Request passed CSRF validation, failed at auth step (expected):', error.response?.data?.message || error.message);
      }
    }
    
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testCSRF();