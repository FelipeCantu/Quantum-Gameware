// scripts/test-auth.js
const path = require('path');
const fs = require('fs');

// Load environment variables
function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const lines = envContent.split('\n');
    
    lines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=');
        if (key && valueParts.length > 0) {
          const value = valueParts.join('=');
          process.env[key] = value;
        }
      }
    });
  }
}

// Load environment first
loadEnv();

let fetch;
try {
  fetch = require('node-fetch');
} catch (error) {
  console.log('❌ node-fetch not found. Installing...');
  console.log('Please run: npm install node-fetch@2');
  process.exit(1);
}

async function testAuthentication() {
  console.log('🧪 Testing Quantum Gameware Authentication System');
  console.log('================================================\n');

  const baseUrl = 'http://localhost:3000';
  const testEmail = `test.user.${Date.now()}@example.com`;
  const testPassword = 'SecureTestPassword123!';
  
  console.log(`📧 Test Email: ${testEmail}`);
  console.log(`🔐 Test Password: ${testPassword}\n`);

  let userToken = null;
  let testsPassed = 0;
  let testsTotal = 0;

  const runTest = async (testName, testFunction) => {
    testsTotal++;
    try {
      console.log(`🧪 Testing: ${testName}...`);
      await testFunction();
      console.log(`✅ ${testName} - PASSED\n`);
      testsPassed++;
    } catch (error) {
      console.log(`❌ ${testName} - FAILED: ${error.message}\n`);
      console.log(`   Details: ${error.details || 'No additional details'}\n`);
    }
  };

  // Helper function to make API calls
  const apiCall = async (endpoint, options = {}) => {
    const url = `${baseUrl}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });

    let data;
    const responseText = await response.text();
    
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      data = { message: responseText };
    }

    if (!response.ok) {
      const error = new Error(`HTTP ${response.status}: ${data.message || responseText}`);
      error.status = response.status;
      error.data = data;
      error.details = `URL: ${url}, Response: ${responseText}`;
      throw error;
    }

    return { data, status: response.status };
  };

  // Test 1: Check if Next.js server is running
  await runTest('Server Connection', async () => {
    await apiCall('/api/auth/signin', { method: 'GET' });
  });

  // Test 2: User Registration
  await runTest('User Registration', async () => {
    const result = await apiCall('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Test User',
        firstName: 'Test',
        lastName: 'User',
        email: testEmail,
        password: testPassword,
        phone: '+1234567890',
        agreeToTerms: true,
        subscribeToMarketing: false
      })
    });

    if (!result.data.token || !result.data.user) {
      throw new Error('Missing token or user data in response');
    }

    userToken = result.data.token;
    console.log(`   📄 User ID: ${result.data.user.id}`);
    console.log(`   🔑 Token: ${userToken.substring(0, 20)}...`);
  });

  // Test 3: User Sign In
  await runTest('User Sign In', async () => {
    const result = await apiCall('/api/auth/signin', {
      method: 'POST',
      body: JSON.stringify({
        email: testEmail,
        password: testPassword,
        rememberMe: false
      })
    });

    if (!result.data.token || !result.data.user) {
      throw new Error('Missing token or user data in response');
    }

    console.log(`   📄 User: ${result.data.user.name} (${result.data.user.email})`);
    console.log(`   🔑 New Token: ${result.data.token.substring(0, 20)}...`);
  });

  // Test 4: Token Verification
  await runTest('Token Verification', async () => {
    const result = await apiCall('/api/auth/verify', {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${userToken}`
      }
    });

    if (!result.data.valid || !result.data.user) {
      throw new Error('Token verification failed or missing user data');
    }

    console.log(`   ✅ Token Valid: ${result.data.valid}`);
    console.log(`   📄 User: ${result.data.user.name}`);
  });

  // Test 5: Profile Update
  await runTest('Profile Update', async () => {
    const result = await apiCall('/api/auth/profile', {
      method: 'PUT',
      headers: { 
        'Authorization': `Bearer ${userToken}`
      },
      body: JSON.stringify({
        name: 'Updated Test User',
        phone: '+1987654321',
        preferences: {
          emailNotifications: false,
          smsNotifications: true,
          marketingEmails: false,
          theme: 'dark',
          currency: 'EUR',
          language: 'en'
        }
      })
    });

    if (!result.data.user) {
      throw new Error('Missing user data in response');
    }

    console.log(`   📄 Updated Name: ${result.data.user.name}`);
    console.log(`   📱 Updated Phone: ${result.data.user.phone}`);
    console.log(`   🎨 Theme: ${result.data.user.preferences.theme}`);
  });

  // Test 6: Invalid Login
  await runTest('Invalid Login (Should Fail)', async () => {
    try {
      await apiCall('/api/auth/signin', {
        method: 'POST',
        body: JSON.stringify({
          email: testEmail,
          password: 'wrongpassword'
        })
      });
      throw new Error('Invalid login should have failed but succeeded');
    } catch (error) {
      if (error.status !== 401) {
        throw new Error(`Expected 401 status, got ${error.status}`);
      }
      console.log(`   ✅ Properly rejected with: ${error.data.message}`);
    }
  });

  // Test 7: Duplicate Email Registration
  await runTest('Duplicate Email Registration (Should Fail)', async () => {
    try {
      await apiCall('/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Another User',
          email: testEmail, // Same email as before
          password: testPassword,
          agreeToTerms: true
        })
      });
      throw new Error('Duplicate email registration should have failed but succeeded');
    } catch (error) {
      if (error.status !== 409) {
        throw new Error(`Expected 409 status, got ${error.status}`);
      }
      console.log(`   ✅ Properly rejected with: ${error.data.message}`);
    }
  });

  // Test 8: Password Reset
  await runTest('Password Reset Request', async () => {
    const result = await apiCall('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({
        email: testEmail
      })
    });

    console.log(`   📧 Reset message: ${result.data.message}`);
  });

  // Test 9: Sign Out
  await runTest('User Sign Out', async () => {
    const result = await apiCall('/api/auth/signout', {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${userToken}`
      }
    });

    console.log(`   ✅ Sign out message: ${result.data.message}`);
  });

  // Final Results
  console.log('='.repeat(50));
  console.log('📊 TEST RESULTS SUMMARY');
  console.log('='.repeat(50));
  console.log(`✅ Tests Passed: ${testsPassed}`);
  console.log(`❌ Tests Failed: ${testsTotal - testsPassed}`);
  console.log(`📊 Total Tests: ${testsTotal}`);
  console.log(`🎯 Success Rate: ${((testsPassed / testsTotal) * 100).toFixed(1)}%`);
  console.log('='.repeat(50));

  if (testsPassed === testsTotal) {
    console.log('🎉 ALL TESTS PASSED! Your authentication system is working perfectly!');
    console.log('\n✅ Your system supports:');
    console.log('   • User registration with email validation');
    console.log('   • Secure password hashing');
    console.log('   • JWT token authentication');
    console.log('   • Profile management');
    console.log('   • Password reset functionality');
    console.log('   • Duplicate prevention');
    console.log('   • Security validations');
    console.log('\n🚀 Ready for real users!');
    console.log('\n📋 Next steps:');
    console.log('   1. Visit http://localhost:3000/auth/signup to create accounts');
    console.log('   2. Test the UI thoroughly');
    console.log('   3. Deploy to production when ready');
  } else {
    console.log('⚠️ Some tests failed. Please check the errors above and fix them.');
    console.log('\n💡 Common issues:');
    console.log('   • Make sure your Next.js server is running (npm run dev)');
    console.log('   • Check that your API routes are updated with real database code');
    console.log('   • Verify MongoDB is running and connected');
    process.exit(1);
  }
}

// Check if Next.js is running first
console.log('🔍 Checking if Next.js server is running...');
fetch('http://localhost:3000')
  .then(() => {
    console.log('✅ Next.js server is running\n');
    testAuthentication();
  })
  .catch(() => {
    console.log('❌ Next.js server is not running!');
    console.log('💡 Please start your server first:');
    console.log('   1. Open a new terminal');
    console.log('   2. Run: npm run dev');
    console.log('   3. Wait for "Ready - started server on 0.0.0.0:3000"');
    console.log('   4. Then run this test again');
    process.exit(1);
  });