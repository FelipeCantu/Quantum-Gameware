// src/app/api/auth/signin/route.ts - SIMPLIFIED VERSION FOR VERCEL
import { NextRequest, NextResponse } from 'next/server';
import { SignJWT } from 'jose';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/models/User';

interface SignInRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔑 Signin API called');
    
    // Check environment variables first
    if (!process.env.JWT_SECRET) {
      console.error('❌ JWT_SECRET is not set');
      return NextResponse.json(
        { message: 'Server configuration error: JWT_SECRET missing' },
        { status: 500 }
      );
    }

    if (!process.env.MONGODB_URI) {
      console.error('❌ MONGODB_URI is not set');
      return NextResponse.json(
        { message: 'Server configuration error: MONGODB_URI missing' },
        { status: 500 }
      );
    }

    // Parse request body
    let body: SignInRequest;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error('❌ JSON parse error:', parseError);
      return NextResponse.json(
        { message: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    const { email, password, rememberMe = false } = body;

    // Basic validation
    if (!email?.trim() || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Invalid email format' },
        { status: 400 }
      );
    }

    console.log('✅ Validation passed, connecting to database...');

    // Connect to database
    try {
      await connectDB();
      console.log('✅ Database connected');
    } catch (dbError) {
      console.error('❌ Database connection failed:', dbError);
      return NextResponse.json(
        { message: 'Database connection failed' },
        { status: 500 }
      );
    }

    // Find user
    let user;
    try {
      user = await User.findByEmail(email.toLowerCase().trim());
    } catch (userError) {
      console.error('❌ User lookup failed:', userError);
      return NextResponse.json(
        { message: 'User lookup failed' },
        { status: 500 }
      );
    }
    
    if (!user) {
      console.log('❌ User not found');
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check if user is active
    if (!user.isActive) {
      return NextResponse.json(
        { message: 'Account has been deactivated' },
        { status: 403 }
      );
    }

    // Verify password
    let isPasswordValid;
    try {
      isPasswordValid = await user.comparePassword(password);
    } catch (passwordError) {
      console.error('❌ Password comparison failed:', passwordError);
      return NextResponse.json(
        { message: 'Authentication failed' },
        { status: 500 }
      );
    }
    
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    console.log('✅ Password verified, creating token...');

    // Create JWT token
    let token: string;
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);

      token = await new SignJWT({
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
      })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime(rememberMe ? '30d' : '7d')
        .sign(secret);
      
      console.log('✅ JWT token created');
    } catch (jwtError) {
      console.error('❌ JWT creation error:', jwtError);
      return NextResponse.json(
        { message: 'Failed to create authentication token' },
        { status: 500 }
      );
    }

    // Update last login (don't fail if this fails)
    try {
      await user.updateLastLogin();
    } catch (loginUpdateError) {
      console.warn('⚠️ Failed to update last login:', loginUpdateError);
    }

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

    // Create response
    const response = NextResponse.json({
      user: userData,
      token,
      message: 'Sign in successful'
    });

    // Set cookie (don't fail if this fails)
    try {
      response.cookies.set({
        name: 'authToken',
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: rememberMe ? 30 * 24 * 60 * 60 : 7 * 24 * 60 * 60,
        path: '/',
      });
    } catch (cookieError) {
      console.error('⚠️ Cookie setting error:', cookieError);
    }

    console.log('🎉 Signin completed successfully for:', user.email);
    return response;

  } catch (error) {
    console.error('❌ Signin route error:', error);
    return NextResponse.json(
      { 
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? 
          (error instanceof Error ? error.message : 'Unknown error') : undefined
      },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}