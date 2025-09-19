// src/app/api/auth/signout/route.ts - Vercel-optimized version
// ================================================================

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // For signout, we mainly just need to clear the cookie
    // In production with a real database, you might want to blacklist the token
    
    const response = NextResponse.json({
      message: 'Signed out successfully'
    });

    // Clear the auth cookie
    response.cookies.set({
      name: 'authToken',
      value: '',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/',
    });

    return response;

  } catch (error) {
    console.error('Sign out error:', error);
    
    // Even if there's an error, we should still clear the cookie
    const response = NextResponse.json({
      message: 'Signed out successfully'
    });

    response.cookies.set({
      name: 'authToken',
      value: '',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/',
    });

    return response;
  }
}