// src/app/api/auth/profile/route.ts - Vercel-optimized version  
// ================================================================

import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    let token = authHeader?.substring(7); // Remove 'Bearer ' prefix

    // If no token in header, try to get from cookies
    if (!token) {
      token = request.cookies.get('authToken')?.value;
    }

    if (!token) {
      return NextResponse.json(
        { message: 'Missing or invalid authorization header' },
        { status: 401 }
      );
    }

    let updates: Record<string, unknown>;
    try {
      updates = await request.json();
    } catch (error) {
      return NextResponse.json(
        { message: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    // Remove sensitive fields that shouldn't be updated via this endpoint
    delete updates.password;
    delete updates.email;
    delete updates.role;
    delete updates._id;
    delete updates.id;

    // Check environment variables
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('JWT_SECRET environment variable is not set');
      return NextResponse.json(
        { message: 'Server configuration error' },
        { status: 500 }
      );
    }

    // For demo tokens (backward compatibility)
    if (token.startsWith('demo_token_')) {
      const updatedUser = {
        id: 'demo_user',
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
    }

    // Verify JWT token
    const secret = new TextEncoder().encode(jwtSecret);

    try {
      const { payload } = await jwtVerify(token, secret);

      // Create updated user data (mock for demo)
      const updatedUser = {
        id: payload.userId as string,
        email: payload.email as string,
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
        role: payload.role as string,
      };

      return NextResponse.json({
        user: updatedUser,
        message: 'Profile updated successfully'
      });

    } catch (jwtError) {
      console.error('JWT verification failed:', jwtError);
      return NextResponse.json(
        { message: 'User not found or inactive' },
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