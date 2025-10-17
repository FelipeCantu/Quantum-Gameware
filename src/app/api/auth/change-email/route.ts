// src/app/api/auth/change-email/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/models/User';
import { EmailService } from '@/services/emailService';

/**
 * POST /api/auth/change-email - Request email change (sends verification code)
 * Body: { newEmail: string; password: string }
 */
export async function POST(request: NextRequest) {
  try {
    console.log('📧 Email change request API called');

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

    let body: { newEmail: string; password: string };
    try {
      body = await request.json();
    } catch (error) {
      return NextResponse.json(
        { message: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    const { newEmail, password } = body;

    // Validate inputs
    if (!newEmail || !password) {
      return NextResponse.json(
        { message: 'New email and password are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(newEmail)) {
      return NextResponse.json(
        { message: 'Invalid email format' },
        { status: 400 }
      );
    }

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

    // Find user with password field (it's excluded by default)
    const user = await User.findById(userId).select('+password');
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Check if new email is same as current
    if (user.email.toLowerCase() === newEmail.toLowerCase()) {
      return NextResponse.json(
        { message: 'New email must be different from current email' },
        { status: 400 }
      );
    }

    console.log('✅ User found, verifying password');

    // Verify password for security
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: 'Password is incorrect' },
        { status: 401 }
      );
    }

    // Check if email is already in use
    const existingUser = await User.findOne({ email: newEmail.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { message: 'This email is already registered' },
        { status: 409 }
      );
    }

    // Generate verification code (6 digits)
    const verificationCode = user.generateEmailChangeCode();

    // Store the pending email (don't change the actual email yet)
    user.pendingEmail = newEmail.toLowerCase();

    await user.save();

    console.log('✅ Verification code generated, sending email...');

    // Send verification email to NEW email address
    const emailSent = await EmailService.sendEmailChangeVerificationCode(
      newEmail,
      user.name || user.firstName || 'User',
      verificationCode
    );

    if (!emailSent) {
      console.warn('⚠️ Failed to send verification email, but continuing...');
    }

    return NextResponse.json({
      message: 'Verification code sent to your new email address. Please check your inbox.',
      pendingEmail: newEmail,
    });

  } catch (error) {
    // Handle duplicate email error
    if (error instanceof Error && (error as any).code === 11000) {
      return NextResponse.json(
        { message: 'This email is already registered' },
        { status: 409 }
      );
    }

    console.error('❌ Email change request error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });

    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/auth/change-email - Verify email change with code
 * Body: { verificationCode: string }
 */
export async function PUT(request: NextRequest) {
  try {
    console.log('✅ Email verification API called');

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

    let body: { verificationCode: string };
    try {
      body = await request.json();
    } catch (error) {
      return NextResponse.json(
        { message: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    const { verificationCode } = body;

    if (!verificationCode) {
      return NextResponse.json(
        { message: 'Verification code is required' },
        { status: 400 }
      );
    }

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

    // Find user with verification fields
    const user = await User.findById(userId).select('+emailChangeCode +emailChangeExpires +pendingEmail');
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Check if there's a pending email change
    if (!user.pendingEmail) {
      return NextResponse.json(
        { message: 'No pending email change found' },
        { status: 400 }
      );
    }

    // Check if code expired
    if (!user.emailChangeExpires || user.emailChangeExpires < new Date()) {
      return NextResponse.json(
        { message: 'Verification code has expired. Please request a new one.' },
        { status: 400 }
      );
    }

    // Verify the code
    if (user.emailChangeCode !== verificationCode) {
      return NextResponse.json(
        { message: 'Invalid verification code' },
        { status: 400 }
      );
    }

    console.log('✅ Verification code valid, updating email...');

    // Update email and clear verification fields
    user.email = user.pendingEmail;
    user.emailVerified = true; // Mark as verified since they proved they own the email
    user.pendingEmail = undefined;
    user.emailChangeToken = undefined;
    user.emailChangeCode = undefined;
    user.emailChangeExpires = undefined;

    await user.save();

    console.log('✅ Email updated successfully');

    return NextResponse.json({
      message: 'Email updated successfully!',
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        avatar: user.avatar,
        address: user.address,
        preferences: user.preferences,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
        emailVerified: user.emailVerified,
        role: user.role,
      }
    });

  } catch (error) {
    console.error('❌ Email verification error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });

    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
