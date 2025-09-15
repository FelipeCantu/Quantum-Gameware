// src/app/api/auth/profile/route.ts
import { NextRequest, NextResponse } from 'next/server';

interface TokenPayload {
  userId: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: 'Missing or invalid authorization header' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const updates = await request.json() as Record<string, unknown>;

    // Remove sensitive fields that shouldn't be updated via this endpoint
    delete updates.password;
    delete updates.email;
    delete updates.role;

    // For demo purposes, accept any token that starts with 'demo_token_'
    // In production, you would verify the JWT and update the database
    if (token.startsWith('demo_token_')) {
      // Mock updated user data for demo
      const updatedUser = {
        id: 'user_demo',
        email: 'demo@quantumgameware.com',
        name: (updates.name as string) || 'Demo User',
        firstName: (updates.firstName as string) || 'Demo',
        lastName: (updates.lastName as string) || 'User',
        avatar: (updates.avatar as string) || null,
        phone: (updates.phone as string) || null,
        address: updates.address || null,
        preferences: {
          emailNotifications: true,
          smsNotifications: false,
          marketingEmails: false,
          theme: 'system' as const,
          currency: 'USD',
          language: 'en',
          ...(updates.preferences as Record<string, unknown> || {})
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        emailVerified: true,
        role: 'customer' as const,
      };

      return NextResponse.json({
        user: updatedUser,
        message: 'Profile updated successfully'
      });
    } else {
      return NextResponse.json(
        { message: 'Invalid token' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}