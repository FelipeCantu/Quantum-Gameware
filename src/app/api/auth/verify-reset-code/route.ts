// src/app/api/auth/verify-reset-code/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/models/User';
import jwt from 'jsonwebtoken';

/**
 * POST /api/auth/verify-reset-code - Verify password reset code
 * Body: { email: string, resetCode: string }
 * Returns: { resetToken: string } - Token to use for password reset
 */
export async function POST(request: NextRequest) {
  try {
    console.log('🔐 Verify reset code API called');

    // Connect to database
    await connectDB();

    let body: { email: string; resetCode: string };
    try {
      body = await request.json();
    } catch (error) {
      return NextResponse.json(
        { message: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    const { email, resetCode } = body;

    // Validate inputs
    if (!email || !resetCode) {
      return NextResponse.json(
        { message: 'Email and reset code are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate reset code format (6 digits)
    if (!/^\d{6}$/.test(resetCode)) {
      return NextResponse.json(
        { message: 'Invalid reset code format' },
        { status: 400 }
      );
    }

    // Find user with reset code
    const user = await User.findOne({ email: email.toLowerCase() })
      .select('+passwordResetCode +passwordResetExpires');

    if (!user) {
      return NextResponse.json(
        { message: 'Invalid or expired reset code' },
        { status: 400 }
      );
    }

    // Check if reset code exists
    if (!user.passwordResetCode) {
      return NextResponse.json(
        { message: 'No password reset request found' },
        { status: 400 }
      );
    }

    // Check if code expired
    if (!user.passwordResetExpires || user.passwordResetExpires < new Date()) {
      return NextResponse.json(
        { message: 'Reset code has expired. Please request a new one.' },
        { status: 400 }
      );
    }

    // Verify the code
    if (user.passwordResetCode !== resetCode) {
      return NextResponse.json(
        { message: 'Invalid reset code' },
        { status: 400 }
      );
    }

    console.log('✅ Reset code verified for:', user.email);

    // Generate a short-lived token for password reset (10 minutes)
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('❌ JWT_SECRET not configured');
      return NextResponse.json(
        { message: 'Server configuration error' },
        { status: 500 }
      );
    }

    const resetToken = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
        purpose: 'password-reset'
      },
      jwtSecret,
      { expiresIn: '10m' } // 10-minute expiration
    );

    return NextResponse.json({
      message: 'Reset code verified successfully',
      resetToken
    });

  } catch (error) {
    console.error('❌ Verify reset code error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });

    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
