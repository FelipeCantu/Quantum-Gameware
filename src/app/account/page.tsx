// src/app/account/page.tsx
"use client";

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import AuthGuard from '@/components/auth/AuthGuard';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';

interface UserStats {
  totalOrders: number;
  totalSpent: number;
  rewardPoints: number;
  memberSince: string;
}

interface RecentOrder {
  id: string;
  date: string;
  total: number;
  status: 'delivered' | 'shipped' | 'processing' | 'cancelled';
  items: number;
}

function AccountPageContent() {
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data - replace with real API calls
  const [userStats] = useState<UserStats>({
    totalOrders: 12,
    totalSpent: 2847.99,
    rewardPoints: 1420,
    memberSince: 'March 2023'
  });

  const [recentOrders] = useState<RecentOrder[]>([
    {
      id: 'ORD-2024-001',
      date: '2024-09-15',
      total: 299.99,
      status: 'delivered',
      items: 2
    },
    {
      id: 'ORD-2024-002',
      date: '2024-09-10',
      total: 149.99,
      status: 'shipped',
      items: 1
    },
    {
      id: 'ORD-2024-003',
      date: '2024-09-05',
      total: 79.99,
      status: 'processing',
      items: 3
    }
  ]);

  const getStatusColor = (status: RecentOrder['status']) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      // AuthGuard will handle redirect
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'security', label: 'Security', icon: '🔒' },
    { id: 'preferences', label: 'Preferences', icon: '⚙️' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-white/80 text-lg">
              Manage your account, orders, and preferences all in one place.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 overflow-hidden">
                <div className="p-6 border-b border-white/20">
                  <div className="flex items-center space-x-3">
                    {user?.avatar ? (
                      <img 
                        src={user.avatar} 
                        alt={user.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-white text-blue-600 flex items-center justify-center font-bold text-lg">
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                    )}
                    <div>
                      <div className="font-semibold text-white">{user?.name}</div>
                      <div className="text-sm text-white/70">{user?.email}</div>
                      {user?.role === 'admin' && (
                        <div className="text-xs bg-purple-500/20 text-purple-200 px-2 py-1 rounded-full inline-block mt-1">
                          Admin
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <nav className="p-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 text-left ${
                        activeTab === tab.id
                          ? 'bg-white/20 text-white border border-white/30'
                          : 'text-white/80 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <span className="text-lg">{tab.icon}</span>
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  ))}
                </nav>

                {/* Quick Actions */}
                <div className="p-4 border-t border-white/20">
                  <div className="space-y-2">
                    <a
                      href="/orders"
                      className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-white/80 hover:bg-white/10 hover:text-white transition-all duration-300"
                    >
                      <span className="text-lg">📦</span>
                      <span className="font-medium">My Orders</span>
                    </a>
                    <a
                      href="/wishlist"
                      className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-white/80 hover:bg-white/10 hover:text-white transition-all duration-300"
                    >
                      <span className="text-lg">❤️</span>
                      <span className="font-medium">Wishlist</span>
                    </a>
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-300 hover:bg-red-500/20 hover:text-red-200 transition-all duration-300 text-left"
                    >
                      <span className="text-lg">🚪</span>
                      <span className="font-medium">Sign Out</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                          <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                          </svg>
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-white mb-1">{userStats.totalOrders}</div>
                      <div className="text-white/70 text-sm">Total Orders</div>
                    </div>

                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                          <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                          </svg>
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-white mb-1">${userStats.totalSpent.toLocaleString()}</div>
                      <div className="text-white/70 text-sm">Total Spent</div>
                    </div>

                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                          <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                          </svg>
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-white mb-1">{userStats.rewardPoints.toLocaleString()}</div>
                      <div className="text-white/70 text-sm">Reward Points</div>
                    </div>

                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                          <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-4 8a2 2 0 100-4 2 2 0 000 4z" />
                          </svg>
                        </div>
                      </div>
                      <div className="text-lg font-bold text-white mb-1">Gold</div>
                      <div className="text-white/70 text-sm">Member Status</div>
                    </div>
                  </div>

                  {/* Recent Orders */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 overflow-hidden">
                    <div className="p-6 border-b border-white/20">
                      <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-white">Recent Orders</h2>
                        <a
                          href="/orders"
                          className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                        >
                          View All
                        </a>
                      </div>
                    </div>
                    
                    <div className="divide-y divide-white/10">
                      {recentOrders.map((order) => (
                        <div key={order.id} className="p-6 hover:bg-white/5 transition-colors">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <div className="font-semibold text-white">{order.id}</div>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </span>
                            </div>
                            <div className="text-white font-semibold">${order.total}</div>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <div className="text-white/70">
                              {new Date(order.date).toLocaleDateString()} • {order.items} items
                            </div>
                            <a
                              href={`/orders/${order.id}`}
                              className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                            >
                              View Details
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'profile' && (
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6">
                  <h2 className="text-2xl font-bold text-white mb-6">Profile Information</h2>
                  
                  <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-white font-medium mb-2">Full Name</label>
                        <input
                          type="text"
                          defaultValue={user?.name}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-white font-medium mb-2">Email</label>
                        <input
                          type="email"
                          defaultValue={user?.email}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-white font-medium mb-2">Phone Number</label>
                      <input
                        type="tel"
                        defaultValue={user?.phone}
                        placeholder="+1 (555) 123-4567"
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-white font-medium mb-2">Avatar URL</label>
                      <input
                        type="url"
                        defaultValue={user?.avatar}
                        placeholder="https://example.com/avatar.jpg"
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-colors font-medium"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-6">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6">
                    <h2 className="text-2xl font-bold text-white mb-6">Security Settings</h2>
                    
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-4">Change Password</h3>
                        <form className="space-y-4">
                          <div>
                            <label className="block text-white font-medium mb-2">Current Password</label>
                            <input
                              type="password"
                              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-white font-medium mb-2">New Password</label>
                            <input
                              type="password"
                              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-white font-medium mb-2">Confirm New Password</label>
                            <input
                              type="password"
                              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>

                          <button
                            type="submit"
                            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-colors font-medium"
                          >
                            Update Password
                          </button>
                        </form>
                      </div>

                      <div className="border-t border-white/20 pt-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Two-Factor Authentication</h3>
                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                          <div>
                            <div className="text-white font-medium">SMS Authentication</div>
                            <div className="text-white/70 text-sm">Receive codes via text message</div>
                          </div>
                          <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium">
                            Enable
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'preferences' && (
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6">
                  <h2 className="text-2xl font-bold text-white mb-6">Preferences</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">Notifications</h3>
                      <div className="space-y-4">
                        {[
                          { label: 'Order Updates', description: 'Get notified about order status changes' },
                          { label: 'New Products', description: 'Receive alerts about new gaming gear' },
                          { label: 'Sales & Promotions', description: 'Be the first to know about deals' },
                          { label: 'Newsletter', description: 'Monthly gaming tips and product reviews' }
                        ].map((item, index) => (
                          <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                            <div>
                              <div className="text-white font-medium">{item.label}</div>
                              <div className="text-white/70 text-sm">{item.description}</div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" className="sr-only peer" defaultChecked />
                              <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">Display</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-white font-medium mb-2">Currency</label>
                          <select className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            <option value="USD" className="bg-gray-800">USD ($)</option>
                            <option value="EUR" className="bg-gray-800">EUR (€)</option>
                            <option value="GBP" className="bg-gray-800">GBP (£)</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-white font-medium mb-2">Language</label>
                          <select className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            <option value="en" className="bg-gray-800">English</option>
                            <option value="es" className="bg-gray-800">Español</option>
                            <option value="fr" className="bg-gray-800">Français</option>
                            <option value="de" className="bg-gray-800">Deutsch</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-colors font-medium"
                      >
                        Save Preferences
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function AccountPage() {
  return (
    <AuthGuard requireAuth={true}>
      <AccountPageContent />
    </AuthGuard>
  );
}