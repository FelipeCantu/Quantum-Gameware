// src/app/api/auth/verify/route.ts - Vercel-optimized version
import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function POST(request: NextRequest) {
  try {
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

    // For demo tokens (backward compatibility)
    if (token.startsWith('demo_token_')) {
      const mockUser = {
        id: 'demo_user',
        email: 'demo@quantumgameware.com',
        name: 'Demo User',
        firstName: 'Demo',
        lastName: 'User',
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
        role: 'customer',
      };

      return NextResponse.json({
        valid: true,
        user: mockUser
      });
    }

    // Verify JWT token
    const secret = new TextEncoder().encode(jwtSecret);

    try {
      const { payload } = await jwtVerify(token, secret);

      // Create mock user from payload for demo
      const userData = {
        id: payload.userId as string,
        email: payload.email as string,
        name: 'Demo User',
        firstName: 'Demo',
        lastName: 'User',
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
        role: payload.role as string,
      };

      return NextResponse.json({
        valid: true,
        user: userData
      });

    } catch (jwtError) {
      console.error('JWT verification failed:', jwtError);
      return NextResponse.json(
        { message: 'Invalid token', valid: false },
        { status: 401 }
      );
    }

  } catch (error) {
    console.error('Token verification error:', error);
    return NextResponse.json(
      { message: 'Invalid token', valid: false },
      { status: 401 }
    );
  }
}
