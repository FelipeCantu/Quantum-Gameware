// src/app/api/auth/profile/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { User } from '@/models/User';
import { connectDB } from '@/lib/mongodb';

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

    const updates = await request.json() as Record<string, unknown>;

    // Remove sensitive fields that shouldn't be updated via this endpoint
    delete updates.password;
    delete updates.email;
    delete updates.role;
    delete updates._id;
    delete updates.id;

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
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || 'your-super-secret-jwt-key'
    );

    const { payload } = await jwtVerify(token, secret);

    // Connect to database and get user
    await connectDB();
    const user = await User.findById(payload.userId);

    if (!user || !user.isActive) {
      return NextResponse.json(
        { message: 'User not found or inactive' },
        { status: 401 }
      );
    }

    // Update user with provided data
    Object.keys(updates).forEach(key => {
      if (key === 'preferences' && updates.preferences && typeof updates.preferences === 'object') {
        // Merge preferences
        user.preferences = {
          ...user.preferences,
          ...(updates.preferences as any)
        };
      } else {
        (user as any)[key] = updates[key];
      }
    });

    // Save the updated user
    await user.save();

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
      user: userData,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}