// src/app/api/auth/signup/route.ts - Vercel Compatible
import { NextRequest, NextResponse } from 'next/server';
import { SignJWT } from 'jose';

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
    // Add comprehensive logging for Vercel debugging
    console.log('Signup API route called');
    
    // Parse request body with error handling
    let body: SignUpRequest;
    try {
      body = await request.json();
      console.log('Request body parsed successfully');
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
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

    console.log('Validation passed, creating user');

    // For production deployment, we'll use mock data first
    // Once this works, you can add your MongoDB logic
    
    // Create mock user data
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();
    
    const userData = {
      id: userId,
      email: email.toLowerCase().trim(),
      name: name.trim(),
      firstName: firstName?.trim() || name.trim().split(' ')[0] || '',
      lastName: lastName?.trim() || name.trim().split(' ').slice(1).join(' ') || '',
      phone: phone?.trim() || null,
      avatar: null,
      address: null,
      preferences: {
        emailNotifications: true,
        smsNotifications: false,
        marketingEmails: subscribeToMarketing,
        theme: 'system' as const,
        currency: 'USD',
        language: 'en'
      },
      createdAt: now,
      updatedAt: now,
      emailVerified: false,
      role: 'customer' as const,
    };

    console.log('User data prepared, creating JWT');

    // Create JWT token with better error handling
    let token: string;
    try {
      const secret = new TextEncoder().encode(
        process.env.JWT_SECRET || 'fallback-secret-for-development'
      );

      token = await new SignJWT({
        userId: userData.id,
        email: userData.email,
        role: userData.role,
      })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(secret);
      
      console.log('JWT token created successfully');
    } catch (jwtError) {
      console.error('JWT creation error:', jwtError);
      return NextResponse.json(
        { message: 'Failed to create authentication token' },
        { status: 500 }
      );
    }

    // Create response
    const response = NextResponse.json({
      user: userData,
      token,
      message: 'Account created successfully'
    }, { status: 201 });

    // Set HTTP-only cookie with proper settings for Vercel
    try {
      response.cookies.set({
        name: 'authToken',
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60, // 7 days
        path: '/',
        // Add domain for production if needed
        ...(process.env.NODE_ENV === 'production' && process.env.NEXTAUTH_URL && {
          domain: new URL(process.env.NEXTAUTH_URL).hostname
        })
      });
      console.log('Cookie set successfully');
    } catch (cookieError) {
      console.error('Cookie setting error:', cookieError);
      // Don't fail the request if cookie setting fails
    }

    console.log('Signup completed successfully');
    return response;

  } catch (error) {
    // Comprehensive error logging for Vercel
    console.error('Signup route error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : 'UnknownError'
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

// Add OPTIONS handler for CORS if needed
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