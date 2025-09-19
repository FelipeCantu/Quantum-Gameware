// src/app/settings/page.tsx
"use client";

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import AuthGuard from '@/components/auth/AuthGuard';
import Link from 'next/link';

function SettingsPageContent() {
  const { user, updateProfile, signOut } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    emailNotifications: user?.preferences?.emailNotifications ?? true,
    smsNotifications: user?.preferences?.smsNotifications ?? false,
    marketingEmails: user?.preferences?.marketingEmails ?? false,
    theme: user?.preferences?.theme || 'system',
    currency: user?.preferences?.currency || 'USD',
    language: user?.preferences?.language || 'en'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setMessage(null);

    try {
      const result = await updateProfile({
        name: formData.name,
        phone: formData.phone,
        preferences: {
          emailNotifications: formData.emailNotifications,
          smsNotifications: formData.smsNotifications,
          marketingEmails: formData.marketingEmails,
          theme: formData.theme as 'light' | 'dark' | 'system',
          currency: formData.currency,
          language: formData.language
        }
      });

      if (result.success) {
        setMessage({ type: 'success', text: 'Settings updated successfully!' });
      } else {
        setMessage({ type: 'error', text: result.error || 'Update failed' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An unexpected error occurred' });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-white/80 mb-8">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <Link href="/account" className="hover:text-white transition-colors">Account</Link>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-white font-medium">Settings</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Settings</h1>
          <p className="text-white/80 text-lg">Customize your account preferences and notifications</p>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-xl border ${
            message.type === 'success' 
              ? 'bg-green-500/20 border-green-500/30 text-green-200'
              : 'bg-red-500/20 border-red-500/30 text-red-200'
          }`}>
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 p-6">
              {/* User Info */}
              <div className="text-center mb-6">
                <div className="w-20 h-20 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <h3 className="text-white font-semibold text-lg">{user?.name}</h3>
                <p className="text-white/70 text-sm">{user?.email}</p>
                {user?.role === 'admin' && (
                  <span className="inline-block px-3 py-1 bg-purple-500/20 text-purple-200 rounded-full text-xs font-medium mt-2">
                    Admin
                  </span>
                )}
              </div>

              {/* Quick Links */}
              <nav className="space-y-2">
                <Link
                  href="/account"
                  className="flex items-center space-x-3 px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300"
                >
                  <span className="text-lg">👤</span>
                  <span className="font-medium">Profile</span>
                </Link>
                <div className="flex items-center space-x-3 px-4 py-3 rounded-xl text-white bg-white/20 border border-white/30">
                  <span className="text-lg">⚙️</span>
                  <span className="font-medium">Settings</span>
                </div>
                <Link
                  href="/orders"
                  className="flex items-center space-x-3 px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300"
                >
                  <span className="text-lg">📦</span>
                  <span className="font-medium">Orders</span>
                </Link>
              </nav>

              {/* Sign Out */}
              <div className="mt-6 pt-6 border-t border-white/20">
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-3 px-4 py-3 rounded-xl text-red-300 hover:text-red-200 hover:bg-red-500/20 transition-all duration-300 w-full text-left"
                >
                  <span className="text-lg">🚪</span>
                  <span className="font-medium">Sign Out</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 p-8">
              <form onSubmit={handleProfileUpdate} className="space-y-8">
                
                {/* Profile Settings */}
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">Profile Information</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-white font-medium mb-2">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/60 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-white font-medium mb-2">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        disabled
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white/50 cursor-not-allowed"
                      />
                      <p className="text-white/60 text-sm mt-2">Email cannot be changed</p>
                    </div>

                    <div>
                      <label className="block text-white font-medium mb-2">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+1 (555) 123-4567"
                        className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/60 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Notification Settings */}
                <div className="border-t border-white/20 pt-8">
                  <h2 className="text-2xl font-bold text-white mb-6">Notifications</h2>
                  <div className="space-y-4">
                    {[
                      { 
                        key: 'emailNotifications', 
                        label: 'Email Notifications', 
                        description: 'Receive order updates and account notifications via email' 
                      },
                      { 
                        key: 'smsNotifications', 
                        label: 'SMS Notifications', 
                        description: 'Get shipping updates and delivery notifications via text' 
                      },
                      { 
                        key: 'marketingEmails', 
                        label: 'Marketing Emails', 
                        description: 'Receive promotional offers and product recommendations' 
                      }
                    ].map((item) => (
                      <div key={item.key} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                        <div>
                          <div className="text-white font-medium">{item.label}</div>
                          <div className="text-white/70 text-sm">{item.description}</div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            name={item.key}
                            checked={formData[item.key as keyof typeof formData] as boolean}
                            onChange={handleInputChange}
                            className="sr-only peer" 
                          />
                          <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Display Settings */}
                <div className="border-t border-white/20 pt-8">
                  <h2 className="text-2xl font-bold text-white mb-6">Display Preferences</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-white font-medium mb-2">Theme</label>
                      <select
                        name="theme"
                        value={formData.theme}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="system" className="bg-gray-800">System</option>
                        <option value="light" className="bg-gray-800">Light</option>
                        <option value="dark" className="bg-gray-800">Dark</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-white font-medium mb-2">Currency</label>
                      <select
                        name="currency"
                        value={formData.currency}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="USD" className="bg-gray-800">USD ($)</option>
                        <option value="EUR" className="bg-gray-800">EUR (€)</option>
                        <option value="GBP" className="bg-gray-800">GBP (£)</option>
                        <option value="CAD" className="bg-gray-800">CAD (C$)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-white font-medium mb-2">Language</label>
                      <select
                        name="language"
                        value={formData.language}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="en" className="bg-gray-800">English</option>
                        <option value="es" className="bg-gray-800">Español</option>
                        <option value="fr" className="bg-gray-800">Français</option>
                        <option value="de" className="bg-gray-800">Deutsch</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <div className="border-t border-white/20 pt-8">
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isUpdating}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-500 disabled:to-gray-600 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      {isUpdating ? (
                        <div className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Saving...
                        </div>
                      ) : (
                        'Save Changes'
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <AuthGuard requireAuth={true}>
      <SettingsPageContent />
    </AuthGuard>
  );
}