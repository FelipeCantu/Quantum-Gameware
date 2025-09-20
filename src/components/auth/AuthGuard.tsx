// src/components/auth/AuthGuard.tsx - SIMPLE VERSION (manual redirects only)
'use client';

import { useEffect } from 'react';
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
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Only redirect if we're sure the user is not authenticated and loading is done
    if (!loading && requireAuth && !isAuthenticated) {
      const currentPath = window.location.pathname;
      const redirectUrl = `${redirectTo}?redirect=${encodeURIComponent(currentPath)}`;
      router.push(redirectUrl);
    }

    if (!loading && adminOnly && (!user || user.role !== 'admin')) {
      router.push('/');
    }
  }, [isAuthenticated, loading, user, requireAuth, adminOnly, redirectTo, router]);

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if auth requirements aren't met
  if (requireAuth && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-lg">Redirecting to sign in...</p>
        </div>
      </div>
    );
  }

  if (adminOnly && (!user || user.role !== 'admin')) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-lg">Redirecting...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}