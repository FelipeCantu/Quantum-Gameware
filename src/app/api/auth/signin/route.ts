// src/app/api/auth/signin/route.ts - Vercel Compatible
import { NextRequest, NextResponse } from 'next/server';
import { SignJWT } from 'jose';

interface SignInRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export async function POST(request: NextRequest) {
  try {
    console.log('Signin API route called');
    
    let body: SignInRequest;
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

    console.log('Validation passed, checking credentials');

    // For now, use mock authentication
    // Replace this with your actual database logic once basic routing works
    
    // Simple mock authentication - accepts any email/password combo that's valid format
    // In production, you'll replace this with actual database lookup
    const isValidCredentials = password.length >= 6; // Simple check for demo
    
    if (!isValidCredentials) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Create mock user data
    const userData = {
      id: `user_${email.replace('@', '_').replace('.', '_')}`,
      email: email.toLowerCase().trim(),
      name: email.split('@')[0], // Use email prefix as name for demo
      firstName: email.split('@')[0],
      lastName: 'User',
      avatar: null,
      phone: null,
      address: null,
      preferences: {
        emailNotifications: true,
        smsNotifications: false,
        marketingEmails: false,
        theme: 'system' as const,
        currency: 'USD',
        language: 'en'
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      emailVerified: true,
      role: 'customer' as const,
    };

    console.log('User authenticated, creating JWT');

    // Create JWT token
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
        .setExpirationTime(rememberMe ? '30d' : '7d')
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
        ...(process.env.NODE_ENV === 'production' && process.env.NEXTAUTH_URL && {
          domain: new URL(process.env.NEXTAUTH_URL).hostname
        })
      });
      console.log('Cookie set successfully');
    } catch (cookieError) {
      console.error('Cookie setting error:', cookieError);
    }

    console.log('Signin completed successfully');
    return response;

  } catch (error) {
    console.error('Signin route error:', {
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