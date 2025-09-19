// src/app/api/auth/signout/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { User } from '@/models/User';
import { connectDB } from '@/lib/mongodb';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    let token = authHeader?.substring(7); // Remove 'Bearer ' prefix

    // If no token in header, try to get from cookies
    if (!token) {
      token = request.cookies.get('authToken')?.value;
    }

    // For real tokens, you might want to add to a blacklist or invalidate in some way
    if (token && !token.startsWith('demo_token_')) {
      try {
        const secret = new TextEncoder().encode(
          process.env.JWT_SECRET || 'your-super-secret-jwt-key'
        );
        
        const { payload } = await jwtVerify(token, secret);
        
        // Connect to database and optionally update user's last activity
        await connectDB();
        const user = await User.findById(payload.userId);
        if (user) {
          // You could add logout timestamp here if needed
          // user.lastLogout = new Date();
          // await user.save();
        }
      } catch (error) {
        // Token might be expired or invalid, but we still want to clear the cookie
        console.error('Error during token verification in signout:', error);
      }
    }

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