// src/app/api/auth/profile/route.ts - Real Database Integration
import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/models/User';

export async function PUT(request: NextRequest) {
  try {
    console.log('📝 Profile update API called');
    
    // Connect to database
    await connectDB();
    
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

    // Verify JWT token
    const secret = new TextEncoder().encode(jwtSecret);
    let userId: string;

    try {
      const { payload } = await jwtVerify(token, secret);
      userId = payload.userId as string;
      console.log('✅ Token verified for user:', userId);
    } catch (jwtError) {
      console.error('❌ JWT verification failed:', jwtError);
      return NextResponse.json(
        { message: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Find and update user
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    console.log('✅ User found, updating profile');

    // Update user fields
    if (updates.name) user.name = updates.name as string;
    if (updates.firstName) user.firstName = updates.firstName as string;
    if (updates.lastName) user.lastName = updates.lastName as string;
    if (updates.phone !== undefined) user.phone = updates.phone as string;
    if (updates.avatar !== undefined) user.avatar = updates.avatar as string;
    
    // Update address if provided
    if (updates.address && typeof updates.address === 'object') {
      const addressUpdates = updates.address as Record<string, string>;
      user.address = {
        street: addressUpdates.street || user.address?.street || '',
        city: addressUpdates.city || user.address?.city || '',
        state: addressUpdates.state || user.address?.state || '',
        zipCode: addressUpdates.zipCode || user.address?.zipCode || '',
        country: addressUpdates.country || user.address?.country || 'US'
      };
    }

    // Update preferences if provided
    if (updates.preferences && typeof updates.preferences === 'object') {
      const prefUpdates = updates.preferences as Record<string, unknown>;
      user.preferences = {
        emailNotifications: prefUpdates.emailNotifications !== undefined 
          ? prefUpdates.emailNotifications as boolean 
          : user.preferences?.emailNotifications ?? true,
        smsNotifications: prefUpdates.smsNotifications !== undefined 
          ? prefUpdates.smsNotifications as boolean 
          : user.preferences?.smsNotifications ?? false,
        marketingEmails: prefUpdates.marketingEmails !== undefined 
          ? prefUpdates.marketingEmails as boolean 
          : user.preferences?.marketingEmails ?? false,
        theme: (prefUpdates.theme as 'light' | 'dark' | 'system') || user.preferences?.theme || 'system',
        currency: (prefUpdates.currency as string) || user.preferences?.currency || 'USD',
        language: (prefUpdates.language as string) || user.preferences?.language || 'en'
      };
    }

    // Save updated user
    const updatedUser = await user.save();
    console.log('✅ Profile updated successfully');

    // Prepare user data for response
    const userData = {
      id: updatedUser._id.toString(),
      email: updatedUser.email,
      name: updatedUser.name,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      phone: updatedUser.phone,
      avatar: updatedUser.avatar,
      address: updatedUser.address,
      preferences: updatedUser.preferences,
      createdAt: updatedUser.createdAt.toISOString(),
      updatedAt: updatedUser.updatedAt.toISOString(),
      emailVerified: updatedUser.emailVerified,
      role: updatedUser.role,
    };

    return NextResponse.json({
      user: userData,
      message: 'Profile updated successfully'
    });

  } catch (error) {
    // Handle validation errors
    if (error instanceof Error && error.name === 'ValidationError') {
      const validationErrors = Object.values((error as any).errors).map((err: any) => err.message);
      return NextResponse.json(
        { message: validationErrors[0] || 'Validation failed' },
        { status: 400 }
      );
    }

    console.error('❌ Profile update error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });

    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}