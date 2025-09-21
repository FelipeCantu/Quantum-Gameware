// src/app/api/auth/signup/route.ts - Real Database Integration
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
    
    // Connect to database
    await connectDB();
    
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

    console.log('✅ Validation passed, checking for existing user');

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return NextResponse.json(
        { message: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    console.log('✅ No existing user found, creating new user');

    // Create new user
    const newUser = new User({
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

    // Create JWT token
    let token: string;
    try {
      const secret = new TextEncoder().encode(
        process.env.JWT_SECRET || 'fallback-secret-for-development'
      );

      token = await new SignJWT({
        userId: savedUser._id.toString(),
        email: savedUser.email,
        role: savedUser.role,
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
      id: savedUser._id.toString(),
      email: savedUser.email,
      name: savedUser.name,
      firstName: savedUser.firstName,
      lastName: savedUser.lastName,
      phone: savedUser.phone,
      avatar: savedUser.avatar,
      address: savedUser.address,
      preferences: savedUser.preferences,
      createdAt: savedUser.createdAt.toISOString(),
      updatedAt: savedUser.updatedAt.toISOString(),
      emailVerified: savedUser.emailVerified,
      role: savedUser.role,
    };

    // Create response
    const response = NextResponse.json({
      user: userData,
      token,
      message: 'Account created successfully'
    }, { status: 201 });

    // Set HTTP-only cookie
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