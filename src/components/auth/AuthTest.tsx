// src/components/auth/AuthTest.tsx - Simple auth test component
'use client';

import { useAuth } from '@/context/AuthContext';

export default function AuthTest() {
  const { user, isAuthenticated, loading, initialized } = useAuth();

  // Only show if user is authenticated (for debugging)
  if (!isAuthenticated) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white text-xs p-3 rounded-lg max-w-xs">
      <div className="font-bold mb-2">🔍 Auth Debug</div>
      <div>Init: {initialized ? '✅' : '❌'}</div>
      <div>Loading: {loading ? '⏳' : '✅'}</div>
      <div>Auth: {isAuthenticated ? '✅' : '❌'}</div>
      <div>User: {user?.email || 'None'}</div>
      <div className="mt-2 text-xs opacity-70">
        {typeof window !== 'undefined' && localStorage.getItem('authToken') ? 'Has Token' : 'No Token'}
      </div>
    </div>
  );
}