// src/components/auth/AuthGuard.tsx - Complete fixed version
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
  adminOnly?: boolean;
}

export default function AuthGuard({
  children,
  requireAuth = true,
  redirectTo = '/auth/signin',
  adminOnly = false
}: AuthGuardProps) {
  const { user, isAuthenticated, loading, initialized } = useAuth();
  const router = useRouter();
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (!initialized) {
      console.log('⏳ AuthGuard waiting for auth initialization...');
      return;
    }

    console.log('🛡️ AuthGuard checking access:', {
      requireAuth,
      isAuthenticated,
      adminOnly,
      userRole: user?.role,
      loading,
      initialized
    });

    if (requireAuth && !isAuthenticated) {
      console.log('🚫 Access denied: authentication required');
      const currentPath = window.location.pathname;
      const redirectUrl = `${redirectTo}?redirect=${encodeURIComponent(currentPath)}`;
      console.log('↩️ Redirecting to:', redirectUrl);
      router.replace(redirectUrl);
      return;
    }

    if (adminOnly && (!user || user.role !== 'admin')) {
      console.log('🚫 Access denied: admin required');
      router.replace('/');
      return;
    }

    console.log('✅ AuthGuard: Access granted');
    setShouldRender(true);
  }, [isAuthenticated, loading, user, requireAuth, adminOnly, redirectTo, router, initialized]);

  if (!initialized || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">
            {!initialized ? 'Initializing...' : 'Loading...'}
          </p>
        </div>
      </div>
    );
  }

  if (requireAuth && !isAuthenticated) {
    return null;
  }

  if (adminOnly && (!user || user.role !== 'admin')) {
    return null;
  }

  if (!shouldRender) {
    return null;
  }

  return <>{children}</>;
}