// src/middleware.ts - Complete fixed version
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const protectedRoutes = [
  '/account',
  '/orders',
  '/wishlist',
  '/settings',
  '/admin',
  '/checkout'
];

const adminRoutes = [
  '/admin'
];

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

  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

  if (pathname.startsWith('/api/') || 
      pathname.startsWith('/_next/') || 
      pathname.includes('.')) {
    return NextResponse.next();
  }

  if (isAuthRoute) {
    if (token) {
      try {
        const verified = await verifyToken(token);
        if (verified) {
          console.log('↩️ Authenticated user accessing auth route, redirecting to home');
          return NextResponse.redirect(new URL('/', request.url));
        }
      } catch {
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
    return NextResponse.next();
  }

  if (isProtectedRoute) {
    if (!token) {
      console.log('🚫 No token for protected route, redirecting to signin');
      const signinUrl = new URL('/auth/signin', request.url);
      signinUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(signinUrl);
    }

    try {
      const payload = await verifyToken(token);
      
      if (isAdminRoute && payload.role !== 'admin') {
        console.log('🚫 Non-admin accessing admin route, redirecting home');
        return NextResponse.redirect(new URL('/', request.url));
      }
      
      console.log('✅ Access granted to protected route');
      return NextResponse.next();
    } catch (error) {
      console.log('❌ Token verification failed, redirecting to signin');
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
  if (token.startsWith('demo_token_')) {
    console.log('✅ Demo token verified');
    return {
      userId: 'demo_user',
      email: 'demo@quantumgameware.com',
      role: 'customer'
    };
  }

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
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};