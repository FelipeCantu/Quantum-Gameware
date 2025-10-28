// src/app/api/wishlist/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/models/User';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Helper function to verify JWT token
async function verifyToken(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return null;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    return decoded.userId;
  } catch (error) {
    return null;
  }
}

// GET /api/wishlist - Get user's wishlist
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const userId = await verifyToken(request);
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized - Please sign in to view your wishlist' },
        { status: 401 }
      );
    }

    const user = await User.findById(userId).select('wishlist');
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      wishlist: user.wishlist || []
    });
  } catch (error) {
    console.error('Get wishlist error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch wishlist' },
      { status: 500 }
    );
  }
}

// POST /api/wishlist - Add item to wishlist
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const userId = await verifyToken(request);
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized - Please sign in to add items to your wishlist' },
        { status: 401 }
      );
    }

    const { productId } = await request.json();

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Initialize wishlist if it doesn't exist
    if (!user.wishlist) {
      user.wishlist = [];
    }

    // Check if item is already in wishlist
    if (user.wishlist.includes(productId)) {
      return NextResponse.json(
        { error: 'Item already in wishlist' },
        { status: 400 }
      );
    }

    // Add item to wishlist
    user.wishlist.push(productId);
    await user.save();

    return NextResponse.json({
      success: true,
      message: 'Item added to wishlist',
      wishlist: user.wishlist
    });
  } catch (error) {
    console.error('Add to wishlist error:', error);
    return NextResponse.json(
      { error: 'Failed to add item to wishlist' },
      { status: 500 }
    );
  }
}

// DELETE /api/wishlist - Remove item from wishlist
export async function DELETE(request: NextRequest) {
  try {
    await connectDB();

    const userId = await verifyToken(request);
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized - Please sign in to manage your wishlist' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Remove item from wishlist
    if (user.wishlist) {
      user.wishlist = user.wishlist.filter((id: string) => id !== productId);
      await user.save();
    }

    return NextResponse.json({
      success: true,
      message: 'Item removed from wishlist',
      wishlist: user.wishlist || []
    });
  } catch (error) {
    console.error('Remove from wishlist error:', error);
    return NextResponse.json(
      { error: 'Failed to remove item from wishlist' },
      { status: 500 }
    );
  }
}
