// test-exact-signup.js - Test the exact signup and signin process
async function testExactProcess() {
  console.log('🧪 Testing Exact Signup -> Signin Process...\n');

  const baseUrl = 'http://localhost:3000';
  const testEmail = `test${Date.now()}@example.com`;
  const testPassword = 'SecurePass123';
  
  console.log('📧 Test credentials:');
  console.log(`   Email: ${testEmail}`);
  console.log(`   Password: ${testPassword}`);
  console.log('');

  try {
    // Step 1: Sign up a new user
    console.log('1️⃣ Testing Signup...');
    
    const signupResponse = await fetch(`${baseUrl}/api/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Debug Test User',
        email: testEmail,
        password: testPassword,
        agreeToTerms: true,
        subscribeToMarketing: false
      })
    });

    const signupText = await signupResponse.text();
    console.log(`   Signup Status: ${signupResponse.status}`);
    
    if (signupResponse.ok) {
      const signupResult = JSON.parse(signupText);
      console.log('   ✅ Signup successful!');
      console.log(`   User ID: ${signupResult.user.id}`);
      console.log(`   Email: ${signupResult.user.email}`);
    } else {
      console.log(`   ❌ Signup failed: ${signupText}`);
      return;
    }

    // Step 2: Wait a moment for database to sync
    console.log('\n⏳ Waiting 1 second for database sync...');
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Step 3: Try to sign in with the EXACT same credentials
    console.log('\n2️⃣ Testing Signin with exact same credentials...');
    
    const signinResponse = await fetch(`${baseUrl}/api/auth/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword,
        rememberMe: false
      })
    });

    const signinText = await signinResponse.text();
    console.log(`   Signin Status: ${signinResponse.status}`);

    if (signinResponse.ok) {
      const signinResult = JSON.parse(signinText);
      console.log('   ✅ Signin successful!');
      console.log(`   Token received: ${signinResult.token ? 'Yes' : 'No'}`);
      console.log(`   User ID: ${signinResult.user.id}`);
    } else {
      console.log(`   ❌ Signin failed: ${signinText}`);
      
      // Let's check what's in the database
      console.log('\n🔍 Checking database for this user...');
      
      const { MongoClient } = require('mongodb');
      const client = new MongoClient('mongodb://localhost:27017');
      await client.connect();
      
      const db = client.db('quantum-gameware');
      const usersCollection = db.collection('users');
      
      const user = await usersCollection.findOne({ email: testEmail });
      
      if (user) {
        console.log('   📄 User found in database:');
        console.log(`      Email: ${user.email}`);
        console.log(`      Password hash starts with: ${user.password.substring(0, 10)}...`);
        console.log(`      Password hash length: ${user.password.length}`);
        console.log(`      Is active: ${user.isActive}`);
        
        // Test bcrypt comparison directly
        const bcrypt = require('bcryptjs');
        const directComparison = await bcrypt.compare(testPassword, user.password);
        console.log(`      Direct bcrypt comparison: ${directComparison ? '✅ Match' : '❌ No match'}`);
        
        // Test with different variations
        console.log('\n🧪 Testing password variations...');
        const variations = [
          testPassword,
          testPassword.trim(),
          testPassword.toLowerCase(),
          testPassword.toUpperCase()
        ];
        
        for (const variation of variations) {
          const result = await bcrypt.compare(variation, user.password);
          console.log(`      "${variation}": ${result ? '✅' : '❌'}`);
        }
        
      } else {
        console.log('   ❌ User not found in database!');
      }
      
      await client.close();
    }

    // Step 4: Test the User model methods directly
    console.log('\n3️⃣ Testing User model methods...');
    
    // This requires connecting to your app's User model
    // We'll test this if signin failed
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n💡 Make sure your Next.js app is running:');
    console.log('   npm run dev');
  }
}

// Instructions
console.log('🧪 Exact Process Test');
console.log('This will signup a new user and immediately test signin');
console.log('Make sure your Next.js app is running: npm run dev\n');

// Run the test
testExactProcess().catch(console.error);