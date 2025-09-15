// src/app/api/auth/verify/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: 'Missing or invalid authorization header' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // For demo purposes, accept any token that starts with 'demo_token_'
    // In production, you would verify the JWT and check the database
    if (token.startsWith('demo_token_')) {
      // Mock user data for demo
      const mockUser = {
        id: 'user_demo',
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
    } else {
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