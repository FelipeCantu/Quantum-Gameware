// src/app/api/auth/verify-email/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/models/User';
import { EmailService } from '@/services/emailService';
import crypto from 'crypto';

/**
 * POST /api/auth/verify-email - Verify email with 6-digit code
 * Body: { email: string, verificationCode: string }
 */
export async function GET(request: NextRequest) {
  try {
    console.log('✉️ Email verification with code API called');

    // Connect to database
    await connectDB();

    // Get code from query params
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const email = searchParams.get('email');

    if (!code || !email) {
      return NextResponse.json(
        { message: 'Verification code and email are required' },
        { status: 400 }
      );
    }

    // Find user with this email and verification code
    const user = await User.findOne({ email: email.toLowerCase() })
      .select('+emailVerificationCode +emailVerificationExpires');

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Check if already verified
    if (user.emailVerified) {
      return NextResponse.json({
        success: true,
        message: 'Email is already verified!'
      });
    }

    // Check if code expired
    if (!user.emailVerificationExpires || user.emailVerificationExpires < new Date()) {
      return NextResponse.json(
        { message: 'Verification code has expired. Please request a new one.' },
        { status: 400 }
      );
    }

    // Verify the code
    if (user.emailVerificationCode !== code) {
      return NextResponse.json(
        { message: 'Invalid verification code' },
        { status: 400 }
      );
    }

    // Mark email as verified
    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationCode = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    console.log('✅ Email verified successfully for user:', user.email);

    // Return success page or redirect
    return NextResponse.json({
      success: true,
      message: 'Email verified successfully! You can now sign in.'
    });

  } catch (error) {
    console.error('❌ Email verification error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });

    return NextResponse.json(
      { message: 'Email verification failed' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/auth/verify-email - Resend verification code
 * Body: { email: string }
 */
export async function POST(request: NextRequest) {
  try {
    console.log('📧 Resend verification code API called');

    // Connect to database
    await connectDB();

    let body: { email: string };
    try {
      body = await request.json();
    } catch (error) {
      return NextResponse.json(
        { message: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      // Don't reveal if user exists or not for security
      return NextResponse.json({
        message: 'If an account exists with this email, a verification code has been sent.'
      });
    }

    // Check if already verified
    if (user.emailVerified) {
      return NextResponse.json({
        message: 'Email is already verified'
      });
    }

    // Generate new verification code
    const verificationCode = user.generateEmailVerificationCode();
    await user.save();

    // Send verification email
    try {
      await EmailService.sendEmailVerificationCode(
        user.email,
        user.name || user.firstName || 'User',
        verificationCode
      );
      console.log('✅ Verification code sent to:', user.email);
    } catch (emailError) {
      console.error('⚠️ Failed to send verification email:', emailError);
      return NextResponse.json(
        { message: 'Failed to send verification email. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'If an account exists with this email, a verification code has been sent.'
    });

  } catch (error) {
    console.error('❌ Resend verification error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });

    return NextResponse.json(
      { message: 'Failed to send verification email' },
      { status: 500 }
    );
  }
}
