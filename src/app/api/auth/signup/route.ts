// src/app/api/auth/signup/route.ts
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/models/User';

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

    // Connect to database
    await connectToDatabase();

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { message: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newUser = new User({
      name: name.trim(),
      email: email.toLowerCase(),
      password: hashedPassword,
      preferences: {
        emailNotifications: true,
        smsNotifications: false,
        marketingEmails: subscribeToMarketing || false,
        theme: 'system',
        currency: 'USD',
        language: 'en'
      },
      role: 'customer',
      emailVerified: false,
    });

    await newUser.save();

    // Generate JWT token
    const tokenPayload = {
      userId: newUser._id,
      email: newUser.email,
      role: newUser.role,
    };

    const token = jwt.sign(
      tokenPayload,
      process.env.JWT_SECRET || 'your-super-secret-jwt-key',
      { expiresIn: '7d' }
    );

    // Create response with user data (excluding password)
    const userData = {
      id: newUser._id,
      email: newUser.email,
      name: newUser.name,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      avatar: newUser.avatar,
      phone: newUser.phone,
      address: newUser.address,
      preferences: newUser.preferences,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt,
      emailVerified: newUser.emailVerified,
      role: newUser.role,
    };

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