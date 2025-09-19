// debug-password.js - Debug the password hashing process
const bcrypt = require('bcryptjs');

async function debugPasswordHashing() {
  console.log('🔐 Debugging Password Hashing Process...\n');

  const testPassword = 'SecurePass123';
  console.log(`Original password: "${testPassword}"`);
  console.log(`Password length: ${testPassword.length}`);
  console.log(`Password type: ${typeof testPassword}`);
  console.log('');

  // Test 1: Manual bcrypt hashing
  console.log('1️⃣ Testing manual bcrypt hashing...');
  
  try {
    const manualHash = await bcrypt.hash(testPassword, 12);
    console.log(`   Manual hash: ${manualHash}`);
    console.log(`   Manual hash length: ${manualHash.length}`);
    
    const manualComparison = await bcrypt.compare(testPassword, manualHash);
    console.log(`   Manual comparison: ${manualComparison ? '✅ Match' : '❌ No match'}`);
  } catch (error) {
    console.log(`   ❌ Manual hashing failed: ${error.message}`);
  }

  // Test 2: Check what might be happening in the User model
  console.log('\n2️⃣ Testing User model hashing simulation...');
  
  // Simulate the pre-save middleware logic
  function simulatePreSave(password) {
    console.log(`   Input password: "${password}"`);
    console.log(`   Input type: ${typeof password}`);
    console.log(`   Input length: ${password.length}`);
    
    // Check for any transformations that might happen
    const trimmed = password.trim();
    const normalized = password.normalize();
    
    console.log(`   After trim: "${trimmed}" (length: ${trimmed.length})`);
    console.log(`   After normalize: "${normalized}" (length: ${normalized.length})`);
    
    return password;
  }
  
  const processedPassword = simulatePreSave(testPassword);

  // Test 3: Check the actual database hash
  console.log('\n3️⃣ Checking actual database hash...');
  
  try {
    const { MongoClient } = require('mongodb');
    const client = new MongoClient('mongodb://localhost:27017');
    await client.connect();
    
    const db = client.db('quantum-gameware');
    const usersCollection = db.collection('users');
    
    // Get the latest test user
    const latestUser = await usersCollection.findOne(
      { email: { $regex: /test.*@example\.com/ } },
      { sort: { createdAt: -1 } }
    );
    
    if (latestUser) {
      console.log(`   Database hash: ${latestUser.password}`);
      console.log(`   Database hash length: ${latestUser.password.length}`);
      
      // Test multiple password variations against the database hash
      console.log('\n🧪 Testing variations against database hash...');
      
      const variations = [
        'SecurePass123',
        'SecurePass123\n',
        'SecurePass123\r',
        'SecurePass123\r\n',
        ' SecurePass123',
        'SecurePass123 ',
        ' SecurePass123 ',
        JSON.stringify('SecurePass123').slice(1, -1) // Remove quotes from stringified
      ];
      
      for (const variation of variations) {
        try {
          const result = await bcrypt.compare(variation, latestUser.password);
          console.log(`   "${variation}" (${variation.length} chars): ${result ? '✅ MATCH!' : '❌'}`);
          if (result) {
            console.log(`   🎉 FOUND THE ISSUE! The password has extra characters.`);
          }
        } catch (error) {
          console.log(`   "${variation}": Error - ${error.message}`);
        }
      }
      
      // Test if the hash itself is valid
      console.log('\n🔍 Validating hash format...');
      const hashParts = latestUser.password.split('$');
      console.log(`   Hash parts: ${hashParts.length} (should be 4)`);
      console.log(`   Algorithm: ${hashParts[1]} (should be 2b or 2a)`);
      console.log(`   Cost: ${hashParts[2]} (should be 12)`);
      
    } else {
      console.log('   ❌ No test users found in database');
    }
    
    await client.close();
    
  } catch (error) {
    console.log(`   ❌ Database check failed: ${error.message}`);
  }

  // Test 4: Check what happens during API signup
  console.log('\n4️⃣ Testing what happens during API signup...');
  
  // Let's create a test to see what actually gets sent to the API
  const signupData = {
    name: 'Debug Test User',
    email: `debug${Date.now()}@example.com`,
    password: testPassword,
    agreeToTerms: true,
    subscribeToMarketing: false
  };
  
  console.log('   Signup data:');
  console.log(`     Password: "${signupData.password}"`);
  console.log(`     Password length: ${signupData.password.length}`);
  console.log(`     JSON stringified: ${JSON.stringify(signupData)}`);
  
  // Check what JSON.parse does to the password
  const jsonString = JSON.stringify(signupData);
  const parsedData = JSON.parse(jsonString);
  
  console.log(`   After JSON parse: "${parsedData.password}"`);
  console.log(`   After parse length: ${parsedData.password.length}`);
  console.log(`   Are they equal? ${signupData.password === parsedData.password}`);
}

// Run the debug
console.log('🔐 Password Hashing Debug Tool');
console.log('This will help identify why password comparison is failing\n');

debugPasswordHashing().catch(console.error);