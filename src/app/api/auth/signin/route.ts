// src/app/api/auth/signin/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password, rememberMe } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // For demo purposes, accept any valid email/password combination
    // In production, you would validate against your database
    if (email.includes('@') && password.length >= 6) {
      // Generate mock user data
      const userData = {
        id: 'user_' + Date.now(),
        email: email.toLowerCase(),
        name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
        firstName: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
        lastName: '',
        avatar: null,
        phone: null,
        address: null,
        preferences: {
          emailNotifications: true,
          smsNotifications: false,
          marketingEmails: false,
          theme: 'system',
          currency: 'USD',
          language: 'en'
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        emailVerified: true,
        role: 'customer' as const,
      };

      // Generate mock token
      const token = 'demo_token_' + Date.now();

      const response = NextResponse.json({
        user: userData,
        token,
        message: 'Sign in successful'
      });

      // Set HTTP-only cookie for additional security
      response.cookies.set({
        name: 'authToken',
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: rememberMe ? 30 * 24 * 60 * 60 : 7 * 24 * 60 * 60, // 30 days or 7 days
      });

      return response;
    } else {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Sign in error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}