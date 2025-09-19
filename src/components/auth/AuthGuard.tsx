// src/components/auth/AuthGuard.tsx
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
    if (loading) return; // Wait for auth to load

    if (requireAuth && !isAuthenticated) {
      // Redirect to sign in with return URL
      const currentPath = window.location.pathname;
      router.push(`${redirectTo}?redirect=${encodeURIComponent(currentPath)}`);
      return;
    }

    if (adminOnly && (!user || user.role !== 'admin')) {
      // Redirect non-admin users
      router.push('/');
      return;
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
    return null;
  }

  if (adminOnly && (!user || user.role !== 'admin')) {
    return null;
  }

  return <>{children}</>;
}