// src/app/api/auth/forgot-password/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/models/User';
import { EmailService } from '@/services/emailService';
import { rateLimit } from '@/lib/rateLimit';

/**
 * POST /api/auth/forgot-password - Request password reset
 * Body: { email: string }
 */
export async function POST(request: NextRequest) {
  try {
    console.log('🔐 Forgot password API called');

    const limited = rateLimit(request, 'forgot-password', 5, 15 * 60 * 1000);
    if (limited) return limited;

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

    // Limit reset emails per address, not just per IP
    const emailLimited = rateLimit(request, 'forgot-password-email', 3, 60 * 60 * 1000, String(email).toLowerCase());
    if (emailLimited) return emailLimited;

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
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
      // Respond the same as success so the endpoint can't reveal which emails have accounts
      console.error('⚠️ Failed to send password reset email:', emailError);
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
