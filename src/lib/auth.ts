// src/lib/auth.ts - Shared JWT helpers for API routes
import { NextRequest } from 'next/server';
import { jwtVerify, JWTPayload } from 'jose';

export interface AuthPayload extends JWTPayload {
  userId: string;
  email: string;
  role?: string;
}

// Never fall back to a default secret: a known secret lets anyone forge tokens
export function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not set');
  }
  return new TextEncoder().encode(secret);
}

export async function verifyToken(token: string): Promise<AuthPayload> {
  const { payload } = await jwtVerify(token, getJwtSecret(), {
    algorithms: ['HS256'],
  });

  if (typeof payload.userId !== 'string') {
    throw new Error('Invalid token');
  }

  return payload as AuthPayload;
}

// Error messages are matched by route handlers to return 401s
export async function verifyAuthToken(request: NextRequest): Promise<AuthPayload> {
  const authHeader = request.headers.get('authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Missing or invalid authorization header');
  }

  try {
    return await verifyToken(authHeader.substring(7));
  } catch (error) {
    console.error('JWT verification failed:', error);
    throw new Error('Invalid token');
  }
}
