// src/app/api/auth/reset-password/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    // Validate input
    if (!email) {
      return NextResponse.json(
        { message: 'Email is required' },
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

    // For demo purposes, always return success
    // In production, you would:
    // 1. Check if email exists in database
    // 2. Generate secure reset token
    // 3. Send email with reset link
    // 4. Store reset token with expiration

    console.log(`Password reset requested for: ${email}`);

    return NextResponse.json({
      message: 'If an account with that email exists, a password reset link has been sent.',
      success: true
    });
  } catch (error) {
    console.error('Password reset error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}