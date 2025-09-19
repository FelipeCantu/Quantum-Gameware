// src/middleware.ts - Fixed for Vercel deployment
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

  console.log(`🛡️ Middleware checking: ${pathname}`, {
    hasToken: !!token,
    tokenType: token?.startsWith('demo_token_') ? 'demo' : 'jwt'
  });

  // Check if the route requires authentication
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

  // Skip middleware for API routes and static files
  if (pathname.startsWith('/api/') || 
      pathname.startsWith('/_next/') || 
      pathname.includes('.')) {
    return NextResponse.next();
  }

  // Handle authentication routes
  if (isAuthRoute) {
    if (token) {
      try {
        const verified = await verifyToken(token);
        if (verified) {
          console.log('↩️ Authenticated user accessing auth route, redirecting to home');
          return NextResponse.redirect(new URL('/', request.url));
        }
      } catch {
        // Token is invalid, clear it and allow access to auth routes
        console.log('🧹 Clearing invalid token');
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
    // No token or invalid token, allow access to auth routes
    return NextResponse.next();
  }

  // Handle protected routes
  if (isProtectedRoute) {
    if (!token) {
      console.log('🚫 No token for protected route, redirecting to signin');
      const signinUrl = new URL('/auth/signin', request.url);
      signinUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(signinUrl);
    }

    try {
      const payload = await verifyToken(token);
      
      // Check admin access for admin routes
      if (isAdminRoute && payload.role !== 'admin') {
        console.log('🚫 Non-admin accessing admin route, redirecting home');
        return NextResponse.redirect(new URL('/', request.url));
      }
      
      console.log('✅ Access granted to protected route');
      // Token is valid, continue
      return NextResponse.next();
    } catch (error) {
      console.log('❌ Token verification failed, redirecting to signin');
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

  // For all other routes, just continue
  return NextResponse.next();
}

async function verifyToken(token: string) {
  // Handle demo tokens for backward compatibility
  if (token.startsWith('demo_token_')) {
    console.log('✅ Demo token verified');
    return {
      userId: 'demo_user',
      email: 'demo@quantumgameware.com',
      role: 'customer'
    };
  }

  // Verify JWT tokens
  try {
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || 'your-super-secret-jwt-key'
    );
    
    const { payload } = await jwtVerify(token, secret);
    console.log('✅ JWT token verified');
    return payload;
  } catch (error) {
    console.log('❌ JWT verification failed:', error);
    throw error;
  }
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