// src/app/api/auth/reset-password/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/models/User';
import jwt from 'jsonwebtoken';

/**
 * POST /api/auth/reset-password - Reset password with verified reset token
 * Body: { resetToken: string, newPassword: string }
 * The resetToken is obtained from the verify-reset-code endpoint
 */
export async function POST(request: NextRequest) {
  try {
    console.log('🔐 Reset password API called');

    // Connect to database
    await connectDB();

    let body: { resetToken: string; newPassword: string };
    try {
      body = await request.json();
    } catch (error) {
      return NextResponse.json(
        { message: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    const { resetToken, newPassword } = body;

    // Validate inputs
    if (!resetToken || !newPassword) {
      return NextResponse.json(
        { message: 'Reset token and new password are required' },
        { status: 400 }
      );
    }

    // Validate password
    if (newPassword.length < 8) {
      return NextResponse.json(
        { message: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // Verify the JWT reset token
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('❌ JWT_SECRET not configured');
      return NextResponse.json(
        { message: 'Server configuration error' },
        { status: 500 }
      );
    }

    let decoded: { userId: string; email: string; purpose: string };
    try {
      decoded = jwt.verify(resetToken, jwtSecret) as { userId: string; email: string; purpose: string };
    } catch (error) {
      return NextResponse.json(
        { message: 'Invalid or expired reset token. Please verify your code again.' },
        { status: 400 }
      );
    }

    // Verify the token purpose
    if (decoded.purpose !== 'password-reset') {
      return NextResponse.json(
        { message: 'Invalid token purpose' },
        { status: 400 }
      );
    }

    // Find user by ID from token
    const user = await User.findById(decoded.userId)
      .select('+passwordResetCode +passwordResetExpires');

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Verify user still has an active reset request
    if (!user.passwordResetCode || !user.passwordResetExpires) {
      return NextResponse.json(
        { message: 'No active password reset request found' },
        { status: 400 }
      );
    }

    // Check if reset request expired
    if (user.passwordResetExpires < new Date()) {
      return NextResponse.json(
        { message: 'Password reset request has expired. Please request a new code.' },
        { status: 400 }
      );
    }

    console.log('✅ Reset token verified, updating password...');

    // Update password and clear reset fields
    user.password = newPassword; // Will be hashed by pre-save middleware
    user.passwordResetToken = undefined;
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    console.log('✅ Password reset successfully for:', user.email);

    return NextResponse.json({
      message: 'Password reset successfully! You can now sign in with your new password.'
    });

  } catch (error) {
    console.error('❌ Reset password error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });

    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
