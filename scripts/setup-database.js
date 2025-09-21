// scripts/setup-database.js
const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

async function setupDatabase() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/quantum-gameware';
  
  console.log('🚀 Setting up Quantum Gameware database...');
  console.log(`📍 Connecting to: ${uri.replace(/\/\/.*@/, '//***:***@')}`);
  
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db();
    const dbName = db.databaseName;
    console.log(`📁 Database: ${dbName}`);
    
    // Create users collection with indexes
    console.log('👥 Setting up users collection...');
    const usersCollection = db.collection('users');
    
    // Create indexes for better performance and constraints
    await usersCollection.createIndex({ email: 1 }, { unique: true });
    console.log('   ✅ Email unique index');
    
    await usersCollection.createIndex({ email: 1, isActive: 1 });
    console.log('   ✅ Email + active status index');
    
    await usersCollection.createIndex({ passwordResetToken: 1, passwordResetExpires: 1 });
    console.log('   ✅ Password reset token index');
    
    await usersCollection.createIndex({ emailVerificationToken: 1 });
    console.log('   ✅ Email verification token index');
    
    await usersCollection.createIndex({ createdAt: 1 });
    console.log('   ✅ Created date index');
    
    // Create orders collection with indexes
    console.log('📦 Setting up orders collection...');
    const ordersCollection = db.collection('orders');
    
    await ordersCollection.createIndex({ userId: 1 });
    console.log('   ✅ User ID index');
    
    await ordersCollection.createIndex({ createdAt: -1 });
    console.log('   ✅ Date index (descending)');
    
    await ordersCollection.createIndex({ status: 1 });
    console.log('   ✅ Status index');
    
    await ordersCollection.createIndex({ orderNumber: 1 }, { unique: true });
    console.log('   ✅ Order number unique index');
    
    // Create products collection with indexes (for future use)
    console.log('🛍️ Setting up products collection...');
    const productsCollection = db.collection('products');
    
    await productsCollection.createIndex({ name: 'text', description: 'text' });
    console.log('   ✅ Text search index');
    
    await productsCollection.createIndex({ category: 1 });
    console.log('   ✅ Category index');
    
    await productsCollection.createIndex({ brand: 1 });
    console.log('   ✅ Brand index');
    
    await productsCollection.createIndex({ price: 1 });
    console.log('   ✅ Price index');
    
    // Check current document counts
    const userCount = await usersCollection.countDocuments();
    const orderCount = await ordersCollection.countDocuments();
    const productCount = await productsCollection.countDocuments();
    
    console.log('\n📊 Database Statistics:');
    console.log(`   👥 Users: ${userCount}`);
    console.log(`   📦 Orders: ${orderCount}`);
    console.log(`   🛍️ Products: ${productCount}`);
    
    // Test database operations
    console.log('\n🧪 Testing database operations...');
    
    // Test writing to users collection
    const testWrite = await usersCollection.insertOne({
      _testDocument: true,
      createdAt: new Date()
    });
    console.log('   ✅ Write test successful');
    
    // Test reading from users collection
    const testRead = await usersCollection.findOne({ _testDocument: true });
    console.log('   ✅ Read test successful');
    
    // Clean up test document
    await usersCollection.deleteOne({ _testDocument: true });
    console.log('   ✅ Cleanup successful');
    
    console.log('\n🎉 Database setup completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Run: npm run dev (to start your application)');
    console.log('2. Run: npm run test-auth (to test authentication system)');
    console.log('3. Visit: http://localhost:3000/auth/signup (to create your first account)');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 MongoDB connection refused. Make sure MongoDB is running:');
      console.log('   - macOS: brew services start mongodb/brew/mongodb-community');
      console.log('   - Windows: Start MongoDB service');
      console.log('   - Linux: sudo systemctl start mongod');
      console.log('   - Or use MongoDB Atlas (cloud) by updating MONGODB_URI in .env.local');
    }
    
    process.exit(1);
  } finally {
    await client.close();
  }
}

setupDatabase();