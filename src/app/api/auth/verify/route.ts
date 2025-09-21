// src/app/api/auth/verify/route.ts - Real Database Integration
import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Token verification API called');
    
    // Connect to database
    await connectDB();
    
    const authHeader = request.headers.get('authorization');
    let token = authHeader?.substring(7); // Remove 'Bearer ' prefix

    // If no token in header, try to get from cookies
    if (!token) {
      token = request.cookies.get('authToken')?.value;
    }

    if (!token) {
      return NextResponse.json(
        { message: 'No token provided', valid: false },
        { status: 401 }
      );
    }

    // Check environment variables
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('JWT_SECRET environment variable is not set');
      return NextResponse.json(
        { message: 'Server configuration error', valid: false },
        { status: 500 }
      );
    }

    // Verify JWT token
    const secret = new TextEncoder().encode(jwtSecret);
    let userId: string;

    try {
      const { payload } = await jwtVerify(token, secret);
      userId = payload.userId as string;
      console.log('✅ Token verified for user:', userId);
    } catch (jwtError) {
      console.error('❌ JWT verification failed:', jwtError);
      return NextResponse.json(
        { message: 'Invalid or expired token', valid: false },
        { status: 401 }
      );
    }

    // Find user in database
    const user = await User.findById(userId);
    if (!user) {
      console.log('❌ User not found in database');
      return NextResponse.json(
        { message: 'User not found', valid: false },
        { status: 404 }
      );
    }

    // Check if user is still active
    if (!user.isActive) {
      console.log('❌ User account is inactive');
      return NextResponse.json(
        { message: 'Account has been deactivated', valid: false },
        { status: 403 }
      );
    }

    console.log('✅ User verification successful');

    // Prepare user data for response
    const userData = {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      avatar: user.avatar,
      address: user.address,
      preferences: user.preferences,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
      emailVerified: user.emailVerified,
      role: user.role,
    };

    return NextResponse.json({
      valid: true,
      user: userData
    });

  } catch (error) {
    console.error('❌ Token verification error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });

    return NextResponse.json(
      { message: 'Token verification failed', valid: false },
      { status: 401 }
    );
  }
}