// src/app/api/auth/forgot-password/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/models/User';
import { EmailService } from '@/services/emailService';

/**
 * POST /api/auth/forgot-password - Request password reset
 * Body: { email: string }
 */
export async function POST(request: NextRequest) {
  try {
    console.log('🔐 Forgot password API called');

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

    // Validate input
    if (!email) {
      return NextResponse.json(
        { message: 'Email is required' },
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

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      // For security, don't reveal if user exists
      return NextResponse.json({
        message: 'If an account exists with this email, a password reset code has been sent.'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return NextResponse.json({
        message: 'If an account exists with this email, a password reset code has been sent.'
      });
    }

    // Generate password reset code
    const resetCode = user.generatePasswordResetCode();
    await user.save();

    console.log('✅ Password reset code generated for:', user.email);

    // Send password reset email
    try {
      await EmailService.sendPasswordResetCode(
        user.email,
        user.name || user.firstName || 'User',
        resetCode
      );
      console.log('✅ Password reset email sent to:', user.email);
    } catch (emailError) {
      console.error('⚠️ Failed to send password reset email:', emailError);
      return NextResponse.json(
        { message: 'Failed to send password reset email. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'If an account exists with this email, a password reset code has been sent.'
    });

  } catch (error) {
    console.error('❌ Forgot password error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });

    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
