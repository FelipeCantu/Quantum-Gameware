// src/app/api/auth/verify/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { User } from '@/models/User';
import { connectDB } from '@/lib/mongodb';

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
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || 'your-super-secret-jwt-key'
    );

    const { payload } = await jwtVerify(token, secret);

    // Connect to database and get user
    await connectDB();
    const user = await User.findById(payload.userId);

    if (!user || !user.isActive) {
      return NextResponse.json(
        { message: 'User not found or inactive', valid: false },
        { status: 401 }
      );
    }

    // Prepare user data for response
    const userData = {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar,
      phone: user.phone,
      address: user.address,
      preferences: {
        emailNotifications: user.preferences?.emailNotifications ?? true,
        smsNotifications: user.preferences?.smsNotifications ?? false,
        marketingEmails: user.preferences?.marketingEmails ?? false,
        theme: user.preferences?.theme || 'system',
        currency: user.preferences?.currency || 'USD',
        language: user.preferences?.language || 'en'
      },
      createdAt: user.createdAt?.toISOString(),
      updatedAt: user.updatedAt?.toISOString(),
      emailVerified: user.emailVerified,
      role: user.role,
    };

    return NextResponse.json({
      valid: true,
      user: userData
    });
  } catch (error) {
    console.error('Token verification error:', error);
    return NextResponse.json(
      { message: 'Invalid token', valid: false },
      { status: 401 }
    );
  }
}