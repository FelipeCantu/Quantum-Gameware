// scripts/test-db-connection.js
const path = require('path');
const fs = require('fs');

// Load environment variables exactly like Next.js does
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const { MongoClient } = require('mongodb');

async function testConnection() {
  const uri = process.env.MONGODB_URI;
  
  console.log('🔍 Testing Database Connection...');
  console.log(`📍 URI from environment: ${uri ? uri.substring(0, 30) + '...' : 'NOT FOUND'}`);
  
  if (!uri) {
    console.log('❌ MONGODB_URI not found in environment');
    console.log('Environment variables loaded:');
    Object.keys(process.env).filter(key => key.includes('MONGO')).forEach(key => {
      console.log(`   ${key}: ${process.env[key]}`);
    });
    return;
  }
  
  // Determine if it's local or Atlas
  const isAtlas = uri.includes('mongodb+srv://');
  const isLocal = uri.includes('localhost');
  
  console.log(`🌐 Database Type: ${isAtlas ? 'MongoDB Atlas (Cloud)' : isLocal ? 'Local MongoDB' : 'Unknown'}`);
  
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('✅ Connection successful!');
    
    const db = client.db();
    console.log(`📁 Database Name: ${db.databaseName}`);
    
    // Count users to see which database we're connected to
    const usersCount = await db.collection('users').countDocuments();
    console.log(`👥 Users in database: ${usersCount}`);
    
    // Try to find a test document to verify connection
    const collections = await db.listCollections().toArray();
    console.log(`📚 Collections: ${collections.map(c => c.name).join(', ')}`);
    
  } catch (error) {
    console.log('❌ Connection failed:', error.message);
  } finally {
    await client.close();
  }
}

testConnection();