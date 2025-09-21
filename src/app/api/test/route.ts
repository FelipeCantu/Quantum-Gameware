// src/app/api/test/route.ts - CREATE THIS FILE TO TEST BASIC FUNCTIONALITY
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Test 1: Environment variables
    const envTest = {
      nodeEnv: process.env.NODE_ENV,
      hasMongoUri: !!process.env.MONGODB_URI,
      mongoUriLength: process.env.MONGODB_URI?.length || 0,
      mongoUriStart: process.env.MONGODB_URI?.substring(0, 30) || 'Not found',
      hasJwtSecret: !!process.env.JWT_SECRET,
      jwtSecretLength: process.env.JWT_SECRET?.length || 0,
    };

    console.log('Environment test:', envTest);

    // Test 2: Try importing mongoose
    let mongooseTest = { success: false, error: '', version: '' };
    try {
      const mongoose = await import('mongoose');
      mongooseTest = {
        success: true,
        error: '',
        version: mongoose.version || 'unknown'
      };
    } catch (mongooseError) {
      mongooseTest = {
        success: false,
        error: mongooseError instanceof Error ? mongooseError.message : 'Unknown mongoose error',
        version: ''
      };
    }

    // Test 3: Try MongoDB connection WITHOUT our wrapper
    let directConnectionTest = { success: false, error: '', details: '' };
    if (process.env.MONGODB_URI) {
      try {
        const mongoose = await import('mongoose');
        
        // Simple connection test
        const connection = await mongoose.default.connect(process.env.MONGODB_URI, {
          serverSelectionTimeoutMS: 5000, // 5 second timeout
          bufferCommands: false,
        });
        
        directConnectionTest = {
          success: true,
          error: '',
          details: `Connected to: ${connection.connection.db?.databaseName || 'unknown'}`
        };
        
        // Disconnect immediately
        await mongoose.default.disconnect();
        
      } catch (directError) {
        directConnectionTest = {
          success: false,
          error: directError instanceof Error ? directError.message : 'Unknown connection error',
          details: directError instanceof Error ? directError.name : 'Unknown error type'
        };
      }
    }

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      tests: {
        environment: envTest,
        mongoose: mongooseTest,
        directConnection: directConnectionTest
      }
    });

  } catch (error) {
    console.error('Test route error:', error);
    return NextResponse.json({
      error: 'Test failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}