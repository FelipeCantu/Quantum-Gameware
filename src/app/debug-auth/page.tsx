// src/app/debug-auth/page.tsx - Debug authentication flow
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function AuthDebugPage() {
  const { user, isAuthenticated, loading, initialized } = useAuth();
  const [localStorageData, setLocalStorageData] = useState<any>(null);
  const [cookieData, setCookieData] = useState<string>('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Get localStorage data
      const token = localStorage.getItem('authToken');
      const userData = localStorage.getItem('userData');
      
      setLocalStorageData({
        token: token ? `${token.substring(0, 20)}...` : 'None',
        userData: userData ? JSON.parse(userData) : null
      });

      // Get cookie data
      const cookies = document.cookie;
      setCookieData(cookies || 'No cookies');
    }
  }, []);

  const testApiEndpoint = async (endpoint: string) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify({})
      });

      const data = await response.json();
      return {
        status: response.status,
        statusText: response.statusText,
        data
      };
    } catch (error) {
      return {
        status: 'Error',
        statusText: 'Network Error',
        data: { error: (error as Error).message }
      };
    }
  };

  const [apiTests, setApiTests] = useState<any>({});

  const runApiTests = async () => {
    const endpoints = [
      '/api/auth/verify',
      '/api/auth/signin',
      '/api/auth/profile'
    ];

    const results: any = {};
    for (const endpoint of endpoints) {
      results[endpoint] = await testApiEndpoint(endpoint);
    }
    setApiTests(results);
  };

  const clearAuth = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
    window.location.reload();
  };

  const createTestAccount = async () => {
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Debug Test User',
          email: `debug${Date.now()}@example.com`,
          password: 'TestPass123',
          agreeToTerms: true,
          subscribeToMarketing: false
        })
      });

      const data = await response.json();
      if (response.ok) {
        alert('Test account created! Check the console and refresh the page.');
        console.log('Test account created:', data);
      } else {
        alert(`Account creation failed: ${data.message}`);
      }
    } catch (error) {
      alert(`Error: ${(error as Error).message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 p-8">
          <h1 className="text-3xl font-bold text-white mb-8">🔍 Authentication Debug</h1>
          
          {/* Auth Context Status */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Auth Context Status</h2>
            <div className="bg-white/5 rounded-xl p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-white/70">Initialized:</span>
                <span className={initialized ? 'text-green-400' : 'text-red-400'}>
                  {initialized ? '✅ Yes' : '❌ No'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Loading:</span>
                <span className={loading ? 'text-yellow-400' : 'text-green-400'}>
                  {loading ? '⏳ Yes' : '✅ No'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Authenticated:</span>
                <span className={isAuthenticated ? 'text-green-400' : 'text-red-400'}>
                  {isAuthenticated ? '✅ Yes' : '❌ No'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">User Email:</span>
                <span className="text-white">{user?.email || 'None'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">User Role:</span>
                <span className="text-white">{user?.role || 'None'}</span>
              </div>
            </div>
          </div>

          {/* Local Storage */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Local Storage</h2>
            <div className="bg-white/5 rounded-xl p-4">
              <pre className="text-white text-xs overflow-auto">
                {JSON.stringify(localStorageData, null, 2)}
              </pre>
            </div>
          </div>

          {/* Cookies */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Cookies</h2>
            <div className="bg-white/5 rounded-xl p-4">
              <p className="text-white text-xs break-all">{cookieData}</p>
            </div>
          </div>

          {/* API Tests */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">API Tests</h2>
            <button
              onClick={runApiTests}
              className="mb-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Run API Tests
            </button>
            {Object.keys(apiTests).length > 0 && (
              <div className="bg-white/5 rounded-xl p-4">
                <pre className="text-white text-xs overflow-auto">
                  {JSON.stringify(apiTests, null, 2)}
                </pre>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
            <div className="flex gap-4 flex-wrap">
              <button
                onClick={createTestAccount}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                Create Test Account
              </button>
              <button
                onClick={clearAuth}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Clear All Auth Data
              </button>
              <Link
                href="/auth/signin"
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors inline-block"
              >
                Go to Sign In
              </Link>
              <Link
                href="/account"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors inline-block"
              >
                Go to Account
              </Link>
            </div>
          </div>

          {/* Browser Info */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Browser Environment</h2>
            <div className="bg-white/5 rounded-xl p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-white/70">User Agent:</span>
                <span className="text-white text-xs">{navigator.userAgent}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Current URL:</span>
                <span className="text-white text-xs">{window.location.href}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Local Storage Available:</span>
                <span className="text-white">{typeof Storage !== 'undefined' ? '✅ Yes' : '❌ No'}</span>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="text-white/70 text-sm">
            <h3 className="font-semibold mb-2">Debug Instructions:</h3>
            <ol className="list-decimal list-inside space-y-1">
              <li>Check if initialized and loading states are correct</li>
              <li>Verify localStorage contains valid token and user data</li>
              <li>Run API tests to check server connectivity</li>
              <li>Create a test account if needed</li>
              <li>Clear auth data if you need to start fresh</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}