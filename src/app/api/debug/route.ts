// src/app/api/debug/route.ts - SIMPLE VERSION TO TEST VERCEL DEPLOYMENT
import { NextResponse } from 'next/server';
import { connectDB, getConnectionStatus } from '@/lib/mongodb';

export async function GET() {
  try {
    const debugInfo = {
      timestamp: new Date().toISOString(),
      environment: {
        nodeEnv: process.env.NODE_ENV,
        vercelRegion: process.env.VERCEL_REGION || 'unknown',
      },
      environmentVariables: {
        hasMongoUri: !!process.env.MONGODB_URI,
        hasJwtSecret: !!process.env.JWT_SECRET,
        mongoUriPreview: process.env.MONGODB_URI ? 
          process.env.MONGODB_URI.substring(0, 25) + '...' : 'Not found',
      },
      database: {
        initialStatus: getConnectionStatus(),
        connectionTest: null as any,
      },
    };

    // Test database connection
    try {
      console.log('🔍 Testing database connection...');
      await connectDB();
      debugInfo.database.connectionTest = { 
        success: true, 
        status: getConnectionStatus(),
        message: 'Connection successful' 
      };
      console.log('✅ Database connection test passed');
    } catch (dbError) {
      console.error('❌ Database connection test failed:', dbError);
      debugInfo.database.connectionTest = { 
        success: false, 
        error: dbError instanceof Error ? dbError.message : 'Unknown database error',
        status: getConnectionStatus()
      };
    }

    return NextResponse.json(debugInfo, { status: 200 });

  } catch (error) {
    console.error('❌ Debug route error:', error);
    return NextResponse.json({
      error: 'Debug route failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}