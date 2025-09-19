// quick-test.js - Test your current setup
const { MongoClient } = require('mongodb');

async function quickTest() {
  console.log('🧪 Quick Setup Test for Quantum Gameware\n');

  // Test 1: Environment Variables
  console.log('1️⃣ Checking Environment...');
  const fs = require('fs');
  
  if (fs.existsSync('.env.local')) {
    console.log('✅ .env.local file exists');
    const envContent = fs.readFileSync('.env.local', 'utf8');
    
    const hasMongoUri = envContent.includes('MONGODB_URI=mongodb://localhost:27017');
    const hasJwtSecret = envContent.includes('JWT_SECRET=85d38eee4a4610857cb16899b7366c82ed4a8144c9d744b650fffbb8b7b82827e938cbab2fbf9b073bb6f8fcfb0917d7621cb24f637947be3570f39367ed3ba6');
    const hasSanity = envContent.includes('NEXT_PUBLIC_SANITY_PROJECT_ID="bth1xywo"');
    
    console.log(`   MongoDB URI: ${hasMongoUri ? '✅' : '❌'}`);
    console.log(`   JWT Secret: ${hasJwtSecret ? '✅' : '❌'}`);
    console.log(`   Sanity Config: ${hasSanity ? '✅' : '❌'}`);
  } else {
    console.log('❌ .env.local file missing');
    return;
  }

  // Test 2: MongoDB Connection
  console.log('\n2️⃣ Testing MongoDB...');
  
  try {
    const client = new MongoClient('mongodb://localhost:27017', {
      serverSelectionTimeoutMS: 3000
    });
    
    await client.connect();
    console.log('✅ MongoDB connection successful!');
    
    const db = client.db('quantum-gameware');
    const usersCollection = db.collection('users');
    
    // Test database operations
    const userCount = await usersCollection.countDocuments();
    console.log(`   📊 Users in database: ${userCount}`);
    
    // Insert test document
    const testResult = await usersCollection.insertOne({
      name: 'Test User',
      email: 'test@setup.com',
      createdAt: new Date(),
      isTest: true
    });
    
    console.log('✅ Database write test successful');
    
    // Clean up
    await usersCollection.deleteOne({ _id: testResult.insertedId });
    console.log('✅ Database cleanup successful');
    
    await client.close();
    
  } catch (error) {
    console.log('❌ MongoDB connection failed:', error.message);
    console.log('\n💡 MongoDB Setup Options:');
    console.log('1. Download MongoDB Compass: https://www.mongodb.com/try/download/compass');
    console.log('2. Or use Docker: docker run -d -p 27017:27017 mongo:latest');
    return;
  }

  // Test 3: Check Required Files
  console.log('\n3️⃣ Checking Required Files...');
  
  const requiredFiles = [
    'src/models/User.ts',
    'src/lib/mongodb.ts',
    'src/context/AuthContext.tsx',
    'src/app/api/auth/signin/route.ts',
    'src/app/api/auth/signup/route.ts'
  ];
  
  let allFilesExist = true;
  requiredFiles.forEach(file => {
    if (fs.existsSync(file)) {
      console.log(`   ✅ ${file}`);
    } else {
      console.log(`   ❌ ${file} - MISSING!`);
      allFilesExist = false;
    }
  });

  // Test 4: Check User Model
  console.log('\n4️⃣ Checking User Model...');
  
  try {
    const userModelContent = fs.readFileSync('src/models/User.ts', 'utf8');
    
    if (userModelContent.includes('interface IUser') && userModelContent.includes('mongoose.Schema')) {
      console.log('✅ User model looks correct');
    } else if (userModelContent.includes('testCompleteAuth')) {
      console.log('❌ User model contains test code - needs to be replaced!');
      console.log('   Replace src/models/User.ts with the proper User model');
      allFilesExist = false;
    } else {
      console.log('⚠️  User model content unclear - please verify');
    }
  } catch (error) {
    console.log('❌ Cannot read User model file');
    allFilesExist = false;
  }

  // Test 5: Dependencies
  console.log('\n5️⃣ Checking Dependencies...');
  
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
    
    const required = ['mongoose', 'bcryptjs', 'jose', 'next', 'react'];
    required.forEach(dep => {
      if (deps[dep]) {
        console.log(`   ✅ ${dep} v${deps[dep]}`);
      } else {
        console.log(`   ❌ ${dep} - Install with: npm install ${dep}`);
        allFilesExist = false;
      }
    });
  } catch (error) {
    console.log('❌ Cannot read package.json');
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  
  if (allFilesExist) {
    console.log('🎉 SETUP COMPLETE! Ready to test authentication.');
    console.log('\n📋 Next steps:');
    console.log('1. Start your app: npm run dev');
    console.log('2. Test auth: node test-auth-complete.js');
    console.log('3. Visit: http://localhost:3000/auth/signup');
  } else {
    console.log('⚠️  Setup needs attention. Fix the issues above first.');
    console.log('\n🔧 Common fixes:');
    console.log('1. npm install mongoose bcryptjs jose');
    console.log('2. Replace User.ts with proper model');
    console.log('3. Make sure MongoDB is running');
  }
}

console.log('🔍 Quick Setup Test');
console.log('This will verify your current configuration\n');

quickTest().catch(console.error);