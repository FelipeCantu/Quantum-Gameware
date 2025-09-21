// src/app/api/auth/signin/route.ts - Real Database Integration
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
    
    // Connect to database
    await connectDB();
    
    let body: SignInRequest;
    try {
      body = await request.json();
      console.log('✅ Request body parsed');
    } catch (parseError) {
      console.error('❌ JSON parse error:', parseError);
      return NextResponse.json(
        { message: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    const { email, password, rememberMe = false } = body;

    // Validation
    if (!email?.trim()) {
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 }
      );
    }

    if (!password) {
      return NextResponse.json(
        { message: 'Password is required' },
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

    console.log('✅ Validation passed, looking up user:', email);

    // Find user by email (including password field for comparison)
    const user = await User.findByEmail(email.toLowerCase().trim());
    
    if (!user) {
      console.log('❌ User not found');
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    console.log('✅ User found, checking password');

    // Check if user is active
    if (!user.isActive) {
      console.log('❌ User account is inactive');
      return NextResponse.json(
        { message: 'Your account has been deactivated. Please contact support.' },
        { status: 403 }
      );
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      console.log('❌ Invalid password');
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    console.log('✅ Password verified, updating last login');

    // Update last login
    await user.updateLastLogin();

    // Create JWT token
    let token: string;
    try {
      const secret = new TextEncoder().encode(
        process.env.JWT_SECRET || 'fallback-secret-for-development'
      );

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

    // Prepare user data for response (exclude sensitive fields)
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

    // Set HTTP-only cookie
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
      console.log('✅ Cookie set successfully');
    } catch (cookieError) {
      console.error('⚠️ Cookie setting error:', cookieError);
    }

    console.log('🎉 Signin completed successfully for:', user.email);
    return response;

  } catch (error) {
    console.error('❌ Signin route error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });

    return NextResponse.json(
      { 
        message: 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && {
          error: error instanceof Error ? error.message : 'Unknown error'
        })
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