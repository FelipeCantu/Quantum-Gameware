// verify-setup.js - Complete setup verification
const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

async function verifyCompleteSetup() {
  console.log('🔍 Verifying Complete Project Setup...\n');

  let allGood = true;
  const issues = [];

  // 1. Check Environment Variables
  console.log('1️⃣ Checking Environment Variables...');
  
  const envPath = path.join(process.cwd(), '.env.local');
  if (!fs.existsSync(envPath)) {
    console.log('❌ .env.local file not found');
    issues.push('Create .env.local file');
    allGood = false;
  } else {
    console.log('✅ .env.local file exists');
    
    const envContent = fs.readFileSync(envPath, 'utf8');
    const requiredVars = [
      'MONGODB_URI',
      'JWT_SECRET',
      'NEXT_PUBLIC_SANITY_PROJECT_ID',
      'NEXT_PUBLIC_SANITY_DATASET'
    ];
    
    requiredVars.forEach(varName => {
      if (envContent.includes(varName + '=')) {
        console.log(`   ✅ ${varName} is set`);
      } else {
        console.log(`   ❌ ${varName} is missing`);
        issues.push(`Add ${varName} to .env.local`);
        allGood = false;
      }
    });
  }

  // 2. Test MongoDB Connection
  console.log('\n2️⃣ Testing MongoDB Connection...');
  
  try {
    // Try to extract MONGODB_URI from .env.local
    let mongoUri = 'mongodb://localhost:27017/quantum-gameware';
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      const match = envContent.match(/MONGODB_URI=(.+)/);
      if (match) {
        mongoUri = match[1].replace(/"/g, '');
      }
    }
    
    const client = new MongoClient(mongoUri, {
      serverSelectionTimeoutMS: 5000
    });
    
    await client.connect();
    console.log('✅ MongoDB connection successful');
    console.log(`   📍 Connected to: ${mongoUri}`);
    
    // Test database operations
    const db = client.db('quantum-gameware');
    const usersCollection = db.collection('users');
    
    const userCount = await usersCollection.countDocuments();
    console.log(`   📊 Users in database: ${userCount}`);
    
    await client.close();
    
  } catch (error) {
    console.log('❌ MongoDB connection failed:', error.message);
    issues.push('Set up MongoDB (install MongoDB Community Server or use Docker)');
    allGood = false;
  }

  // 3. Test Sanity Connection
  console.log('\n3️⃣ Testing Sanity CMS Connection...');
  
  try {
    // Simple fetch to Sanity API
    const sanityProjectId = 'bth1xywo'; // From your config
    const sanityDataset = 'production';
    const apiVersion = '2025-09-02';
    
    const sanityUrl = `https://${sanityProjectId}.api.sanity.io/v${apiVersion}/data/query/${sanityDataset}?query=*[_type == "product"] | length`;
    
    const response = await fetch(sanityUrl);
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Sanity CMS connection successful');
      console.log(`   📦 Products in Sanity: ${data.result || 0}`);
    } else {
      console.log('⚠️  Sanity API responded but might need authentication');
      console.log(`   Status: ${response.status}`);
    }
  } catch (error) {
    console.log('❌ Sanity connection failed:', error.message);
    issues.push('Check Sanity configuration');
    allGood = false;
  }

  // 4. Check Required Files
  console.log('\n4️⃣ Checking Required Files...');
  
  const requiredFiles = [
    'src/models/User.ts',
    'src/lib/mongodb.ts',
    'src/context/AuthContext.tsx',
    'src/app/api/auth/signin/route.ts',
    'src/app/api/auth/signup/route.ts',
    'package.json'
  ];
  
  requiredFiles.forEach(filePath => {
    if (fs.existsSync(filePath)) {
      console.log(`   ✅ ${filePath}`);
    } else {
      console.log(`   ❌ ${filePath} missing`);
      issues.push(`Create ${filePath}`);
      allGood = false;
    }
  });

  // 5. Check package.json dependencies
  console.log('\n5️⃣ Checking Dependencies...');
  
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const requiredDeps = [
      'mongoose',
      'bcryptjs',
      'jose',
      'next',
      'react',
      '@sanity/client'
    ];
    
    const allDeps = { ...packageJson.dependencies, ...packageJson.devDependencies };
    
    requiredDeps.forEach(dep => {
      if (allDeps[dep]) {
        console.log(`   ✅ ${dep} v${allDeps[dep]}`);
      } else {
        console.log(`   ❌ ${dep} missing`);
        issues.push(`Install ${dep}: npm install ${dep}`);
        allGood = false;
      }
    });
  } catch (error) {
    console.log('❌ Could not read package.json');
    issues.push('Check package.json file');
    allGood = false;
  }

  // 6. Test Next.js API
  console.log('\n6️⃣ Testing Next.js API...');
  
  try {
    const response = await fetch('http://localhost:3000/api/auth/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'wrongpassword'
      })
    });
    
    if (response.status === 401) {
      console.log('✅ Next.js Auth API is working');
    } else if (response.status === 500) {
      console.log('⚠️  Next.js is running but there are server errors');
      issues.push('Check Next.js server logs for errors');
    } else {
      console.log(`⚠️  Unexpected API response: ${response.status}`);
    }
  } catch (error) {
    console.log('❌ Cannot reach Next.js API');
    issues.push('Start Next.js: npm run dev');
    allGood = false;
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  
  if (allGood) {
    console.log('🎉 ALL SYSTEMS GO! Your setup is complete!');
    console.log('\n✅ Ready to run:');
    console.log('   npm run dev');
    console.log('   node test-auth-complete.js');
  } else {
    console.log('⚠️  Setup needs attention. Issues found:');
    issues.forEach((issue, index) => {
      console.log(`   ${index + 1}. ${issue}`);
    });
    
    console.log('\n💡 Quick fixes:');
    console.log('1. Make sure MongoDB is running');
    console.log('2. Update .env.local with all required variables');
    console.log('3. Install missing dependencies: npm install');
    console.log('4. Start Next.js: npm run dev');
  }
  
  console.log('\n📋 Your Environment:');
  console.log(`   OS: ${process.platform}`);
  console.log(`   Node.js: ${process.version}`);
  console.log(`   Working Directory: ${process.cwd()}`);
}

// Run verification
console.log('🔍 Complete Setup Verification');
console.log('This will check all components of your project\n');

verifyCompleteSetup().catch(console.error);