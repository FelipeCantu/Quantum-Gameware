// src/app/api/user/delete/route.ts - Delete user account
import { NextRequest, NextResponse } from 'next/server';
import { verifyAuthToken } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/models/User';
import Order from '@/models/Order';

// DELETE /api/user/delete - Delete user account permanently
export async function DELETE(request: NextRequest) {
  try {
    console.log('🗑️ Delete account API called');

    // Verify authentication
    const payload = await verifyAuthToken(request);
    console.log('✅ User authenticated:', payload.email);

    // Get password confirmation from request body
    const body = await request.json();
    const { password, confirmation } = body;

    if (!password) {
      return NextResponse.json(
        { success: false, message: 'Password is required to delete account' },
        { status: 400 }
      );
    }

    if (confirmation !== 'DELETE') {
      return NextResponse.json(
        { success: false, message: 'Please type DELETE to confirm account deletion' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Get user with password
    const user = await User.findById(payload.userId).select('+password');
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: 'Invalid password' },
        { status: 401 }
      );
    }

    // Archive or anonymize orders instead of deleting
    // This preserves business records while protecting user privacy
    await Order.updateMany(
      { userId: user._id },
      {
        $set: {
          'shipping.address.name': '[DELETED USER]',
          'shipping.address.phone': '[DELETED]',
          notes: 'User account deleted',
          userId: null // Remove user reference
        }
      }
    );

    console.log(`📦 Anonymized ${await Order.countDocuments({ userId: user._id })} orders`);

    // Delete the user account
    await User.findByIdAndDelete(user._id);

    console.log('✅ User account deleted:', user.email);

    return NextResponse.json({
      success: true,
      message: 'Account deleted successfully. We\'re sorry to see you go.'
    });

  } catch (error) {
    console.error('❌ Delete account error:', error);

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
