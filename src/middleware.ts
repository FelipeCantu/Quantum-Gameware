// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Routes that require authentication
const protectedRoutes = [
  '/account',
  '/orders',
  '/wishlist',
  '/settings',
  '/admin',
  '/checkout'
];

// Admin-only routes
const adminRoutes = [
  '/admin'
];

// Routes that should redirect authenticated users away
const authRoutes = [
  '/auth/signin',
  '/auth/signup'
];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const token = request.cookies.get('authToken')?.value;

  // Check if the route requires authentication
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

  // If accessing auth routes while already authenticated, redirect to home
  if (isAuthRoute && token) {
    try {
      const verified = await verifyToken(token);
      if (verified) {
        return NextResponse.redirect(new URL('/', request.url));
      }
    } catch {
      // Token is invalid, allow access to auth routes
      // Clear the invalid cookie
      const response = NextResponse.next();
      response.cookies.set({
        name: 'authToken',
        value: '',
        maxAge: 0,
        path: '/',
      });
      return response;
    }
  }

  // If accessing protected routes without authentication, redirect to signin
  if (isProtectedRoute && !token) {
    const signinUrl = new URL('/auth/signin', request.url);
    signinUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(signinUrl);
  }

  // If accessing protected routes with token, verify it
  if (isProtectedRoute && token) {
    try {
      const payload = await verifyToken(token);
      
      // Check admin access for admin routes
      if (isAdminRoute && payload.role !== 'admin') {
        return NextResponse.redirect(new URL('/', request.url));
      }
      
      // Token is valid, continue
      return NextResponse.next();
    } catch {
      // Token is invalid, redirect to signin and clear cookie
      const signinUrl = new URL('/auth/signin', request.url);
      signinUrl.searchParams.set('redirect', pathname);
      
      const response = NextResponse.redirect(signinUrl);
      response.cookies.set({
        name: 'authToken',
        value: '',
        maxAge: 0,
        path: '/',
      });
      return response;
    }
  }

  return NextResponse.next();
}

async function verifyToken(token: string) {
  // Handle demo tokens for backward compatibility
  if (token.startsWith('demo_token_')) {
    return {
      userId: 'demo_user',
      email: 'demo@quantumgameware.com',
      role: 'customer'
    };
  }

  const secret = new TextEncoder().encode(
    process.env.JWT_SECRET || 'your-super-secret-jwt-key'
  );
  
  const { payload } = await jwtVerify(token, secret);
  return payload;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - static assets
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};