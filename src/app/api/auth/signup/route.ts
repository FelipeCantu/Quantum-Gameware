// src/app/api/auth/signup/route.ts
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';
import { User } from '@/models/User';
import { connectDB } from '@/lib/mongodb';
import crypto from 'crypto';

interface SignUpRequest {
  name: string;
  email: string;
  password: string;
  agreeToTerms: boolean;
  subscribeToMarketing?: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const { 
      name, 
      email, 
      password, 
      agreeToTerms, 
      subscribeToMarketing = false 
    }: SignUpRequest = await request.json();

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
    await connectDB();

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { message: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Generate email verification token
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');

    // Create user
    const user = new User({
      name: name.trim(),
      email: email.toLowerCase(),
      password: hashedPassword,
      emailVerificationToken,
      preferences: {
        emailNotifications: true,
        smsNotifications: false,
        marketingEmails: subscribeToMarketing,
        theme: 'system',
        currency: 'USD',
        language: 'en'
      },
      role: 'customer',
      isActive: true,
      emailVerified: false
    });

    await user.save();

    // Create JWT token
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || 'your-super-secret-jwt-key'
    );

    const token = await new SignJWT({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(secret);

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

    const response = NextResponse.json({
      user: userData,
      token,
      message: 'Account created successfully'
    }, { status: 201 });

    // Set HTTP-only cookie
    response.cookies.set({
      name: 'authToken',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    // TODO: Send email verification email in production
    // await sendEmailVerification(user.email, emailVerificationToken);

    return response;
  } catch (error) {
    console.error('Sign up error:', error);
    
    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { message: messages[0] || 'Validation error' },
        { status: 400 }
      );
    }

    // Handle duplicate key error
    if (error.code === 11000) {
      return NextResponse.json(
        { message: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}