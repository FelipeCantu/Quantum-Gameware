// src/app/api/user/sessions/route.ts - Manage active user sessions
import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/models/User';

async function verifyAuthToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Missing or invalid authorization header');
  }

  const token = authHeader.substring(7);

  // Verify JWT tokens
  try {
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || 'your-super-secret-jwt-key'
    );

    const { payload } = await jwtVerify(token, secret);
    return { payload, token };
  } catch (error) {
    console.error('JWT verification failed:', error);
    throw new Error('Invalid token');
  }
}

// GET /api/user/sessions - Get all active sessions
export async function GET(request: NextRequest) {
  try {
    console.log('🔐 Get sessions API called');

    // Verify authentication
    const { payload } = await verifyAuthToken(request);
    console.log('✅ User authenticated:', payload.email);

    // Connect to database
    await connectDB();

    // Get user with sessions
    const user = await User.findById(payload.userId);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Clean expired sessions before returning
    await user.cleanExpiredSessions();

    const sessions = (user.activeSessions || []).map(session => ({
      token: session.token.substring(0, 10) + '...', // Only show partial token
      device: session.device,
      browser: session.browser,
      ipAddress: session.ipAddress,
      lastActive: session.lastActive,
      createdAt: session.createdAt
    }));

    return NextResponse.json({
      success: true,
      sessions,
      total: sessions.length
    });

  } catch (error) {
    console.error('❌ Get sessions error:', error);

    if (error instanceof Error && (error.message.includes('authorization') || error.message.includes('Invalid token'))) {
      return NextResponse.json(
        {
          success: false,
          message: 'Authentication required'
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// DELETE /api/user/sessions - Remove a specific session or all sessions
export async function DELETE(request: NextRequest) {
  try {
    console.log('🔐 Delete session API called');

    // Verify authentication
    const { payload, token: currentToken } = await verifyAuthToken(request);
    console.log('✅ User authenticated:', payload.email);

    // Connect to database
    await connectDB();

    // Get user
    const user = await User.findById(payload.userId);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Get the token to remove from query params or body
    const { searchParams } = new URL(request.url);
    const tokenToRemove = searchParams.get('token');
    const removeAll = searchParams.get('all') === 'true';

    if (removeAll) {
      // Remove all sessions except current
      user.activeSessions = user.activeSessions?.filter(
        session => session.token === currentToken
      ) || [];
      await user.save();

      return NextResponse.json({
        success: true,
        message: 'All other sessions removed',
        remainingSessions: user.activeSessions.length
      });
    }

    if (tokenToRemove) {
      // Remove specific session
      await user.removeActiveSession(tokenToRemove);

      return NextResponse.json({
        success: true,
        message: 'Session removed successfully'
      });
    }

    return NextResponse.json(
      {
        success: false,
        message: 'Please specify a token to remove or use all=true to remove all sessions'
      },
      { status: 400 }
    );

  } catch (error) {
    console.error('❌ Delete session error:', error);

    if (error instanceof Error && (error.message.includes('authorization') || error.message.includes('Invalid token'))) {
      return NextResponse.json(
        {
          success: false,
          message: 'Authentication required'
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
