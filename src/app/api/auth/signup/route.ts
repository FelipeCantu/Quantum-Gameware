// src/app/api/auth/signup/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, agreeToTerms, subscribeToMarketing } = await request.json();

    // Validate input
    if (!name || !email || !password || !agreeToTerms) {
      return NextResponse.json(
        { message: 'Name, email, password are required and you must agree to terms' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { message: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // For demo purposes, create a mock user
    // In production, you would save to your database
    const userData = {
      id: 'user_' + Date.now(),
      email: email.toLowerCase(),
      name: name.trim(),
      firstName: name.trim().split(' ')[0],
      lastName: name.trim().split(' ').slice(1).join(' ') || '',
      avatar: null,
      phone: null,
      address: null,
      preferences: {
        emailNotifications: true,
        smsNotifications: false,
        marketingEmails: subscribeToMarketing || false,
        theme: 'system',
        currency: 'USD',
        language: 'en'
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      emailVerified: false,
      role: 'customer' as const,
    };

    // Generate mock token
    const token = 'demo_token_' + Date.now();

    const response = NextResponse.json({
      user: userData,
      token,
      message: 'Account created successfully'
    });

    // Set HTTP-only cookie
    response.cookies.set({
      name: 'authToken',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Sign up error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}