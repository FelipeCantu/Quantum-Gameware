// src/app/api/auth/signup/route.ts - VERCEL OPTIMIZED VERSION
import { NextRequest, NextResponse } from 'next/server';
import { SignJWT } from 'jose';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/models/User';

interface SignUpRequest {
  name: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  agreeToTerms: boolean;
  subscribeToMarketing?: boolean;
}

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Signup API called');
    
    // Parse request body first
    let body: SignUpRequest;
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

    const { 
      name, 
      email, 
      password,
      firstName,
      lastName,
      phone,
      agreeToTerms, 
      subscribeToMarketing = false 
    } = body;

    // Comprehensive validation
    if (!name?.trim()) {
      return NextResponse.json(
        { message: 'Name is required' },
        { status: 400 }
      );
    }

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

    if (!agreeToTerms) {
      return NextResponse.json(
        { message: 'You must agree to the terms and conditions' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Password validation
    if (password.length < 8) {
      return NextResponse.json(
        { message: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // Check environment variables before database connection
    const jwtSecret = process.env.JWT_SECRET;
    const mongoUri = process.env.MONGODB_URI;
    
    if (!jwtSecret) {
      console.error('❌ JWT_SECRET is not set');
      return NextResponse.json(
        { message: 'Server configuration error' },
        { status: 500 }
      );
    }

    if (!mongoUri) {
      console.error('❌ MONGODB_URI is not set');
      return NextResponse.json(
        { message: 'Database configuration error' },
        { status: 500 }
      );
    }

    console.log('✅ Environment variables validated');

    // Connect to database with timeout
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

    console.log('✅ Validation passed, checking for existing user');

    // Check if user already exists
    let existingUser;
    try {
      existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    } catch (findError) {
      console.error('❌ User lookup failed:', findError);
      return NextResponse.json(
        { message: 'User lookup failed' },
        { status: 500 }
      );
    }

    if (existingUser) {
      return NextResponse.json(
        { message: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    console.log('✅ No existing user found, creating new user');

    // Create new user
    let newUser;
    try {
      newUser = new User({
        name: name.trim(),
        firstName: firstName?.trim() || name.trim().split(' ')[0] || '',
        lastName: lastName?.trim() || name.trim().split(' ').slice(1).join(' ') || '',
        email: email.toLowerCase().trim(),
        password: password, // Will be hashed by the pre-save middleware
        phone: phone?.trim() || undefined,
        preferences: {
          emailNotifications: true,
          smsNotifications: false,
          marketingEmails: subscribeToMarketing,
          theme: 'system',
          currency: 'USD',
          language: 'en'
        },
        role: 'customer',
        isActive: true,
        emailVerified: false
      });

      const savedUser = await newUser.save();
      console.log('✅ User created successfully:', savedUser.email);
    } catch (saveError) {
      console.error('❌ User creation failed:', saveError);
      
      // Handle specific MongoDB errors
      if (saveError instanceof Error && 'code' in saveError && saveError.code === 11000) {
        return NextResponse.json(
          { message: 'An account with this email already exists' },
          { status: 409 }
        );
      }

      // Handle validation errors
      if (saveError instanceof Error && saveError.name === 'ValidationError') {
        const validationErrors = Object.values((saveError as any).errors).map((err: any) => err.message);
        return NextResponse.json(
          { message: validationErrors[0] || 'Validation failed' },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { message: 'Failed to create user account' },
        { status: 500 }
      );
    }

    // Create JWT token
    let token: string;
    try {
      const secret = new TextEncoder().encode(jwtSecret);

      token = await new SignJWT({
        userId: newUser._id.toString(),
        email: newUser.email,
        role: newUser.role,
      })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d')
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
      id: newUser._id.toString(),
      email: newUser.email,
      name: newUser.name,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      phone: newUser.phone,
      avatar: newUser.avatar,
      address: newUser.address,
      preferences: newUser.preferences,
      createdAt: newUser.createdAt.toISOString(),
      updatedAt: newUser.updatedAt.toISOString(),
      emailVerified: newUser.emailVerified,
      role: newUser.role,
    };

    // Create response
    const response = NextResponse.json({
      user: userData,
      token,
      message: 'Account created successfully'
    }, { status: 201 });

    // Set HTTP-only cookie (don't fail if this fails)
    try {
      response.cookies.set({
        name: 'authToken',
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60, // 7 days
        path: '/',
      });
      console.log('✅ Cookie set successfully');
    } catch (cookieError) {
      console.error('⚠️ Cookie setting error:', cookieError);
      // Don't fail the request if cookie setting fails
    }

    console.log('🎉 Signup completed successfully');
    return response;

  } catch (error) {
    // Handle MongoDB duplicate key error
    if (error instanceof Error && 'code' in error && error.code === 11000) {
      return NextResponse.json(
        { message: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    // Handle validation errors
    if (error instanceof Error && error.name === 'ValidationError') {
      const validationErrors = Object.values((error as any).errors).map((err: any) => err.message);
      return NextResponse.json(
        { message: validationErrors[0] || 'Validation failed' },
        { status: 400 }
      );
    }

    console.error('❌ Signup route error:', {
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