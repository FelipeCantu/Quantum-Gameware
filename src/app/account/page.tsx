// src/app/account/page.tsx - Enhanced User Account Dashboard with Beautiful Styling
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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

interface EditProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  preferences: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    marketingEmails: boolean;
    theme: 'light' | 'dark' | 'system';
    currency: string;
    language: string;
  };
}

function AccountPageContent() {
  const { user, signOut, updateProfile, loading } = useAuth();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  // Real user stats from API
  const [userStats, setUserStats] = useState<UserStats>({
    totalOrders: 0,
    totalSpent: 0,
    rewardPoints: 0,
    memberSince: ''
  });

  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loyaltyTier, setLoyaltyTier] = useState<string>('bronze');

  const [editData, setEditData] = useState<EditProfileData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    avatar: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'US'
    },
    preferences: {
      emailNotifications: true,
      smsNotifications: false,
      marketingEmails: false,
      theme: 'system',
      currency: 'USD',
      language: 'en'
    }
  });

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState('');

  // Email change state
  const [emailData, setEmailData] = useState({
    newEmail: '',
    password: '',
    verificationCode: ''
  });
  const [isChangingEmail, setIsChangingEmail] = useState(false);
  const [emailMessage, setEmailMessage] = useState('');
  const [showEmailChange, setShowEmailChange] = useState(false);
  const [pendingEmail, setPendingEmail] = useState('');
  const [showVerificationInput, setShowVerificationInput] = useState(false);

  // Image upload state
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');

  // Active sessions state
  const [showSessions, setShowSessions] = useState(false);
  const [sessions, setSessions] = useState<any[]>([]);
  const [isLoadingSessions, setIsLoadingSessions] = useState(false);

  // Delete account state
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [deletePassword, setDeletePassword] = useState('');
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState('');

  // Rewards info state
  const [showRewardsInfo, setShowRewardsInfo] = useState(false);

  // Fetch user stats from API
  useEffect(() => {
    const fetchUserStats = async () => {
      if (!user) return;

      try {
        setIsLoadingStats(true);
        const token = localStorage.getItem('authToken');
        if (!token) return;

        const response = await fetch('/api/user/stats', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.stats) {
            setUserStats({
              totalOrders: data.stats.totalOrders,
              totalSpent: data.stats.totalSpent,
              rewardPoints: data.stats.rewardPoints,
              memberSince: data.stats.memberSince
            });
            setRecentOrders(data.stats.recentOrders || []);
            setLoyaltyTier(data.stats.loyaltyTier || 'bronze');
          }
        }
      } catch (error) {
        console.error('Failed to fetch user stats:', error);
      } finally {
        setIsLoadingStats(false);
      }
    };

    fetchUserStats();
  }, [user]);

  // Initialize edit data when user loads
  useEffect(() => {
    if (user) {
      setEditData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        avatar: user.avatar || '',
        address: user.address || {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: 'US'
        },
        preferences: user.preferences || {
          emailNotifications: true,
          smsNotifications: false,
          marketingEmails: false,
          theme: 'system',
          currency: 'USD',
          language: 'en'
        }
      });
      // Set image preview to current avatar
      setImagePreview(user.avatar || '');
    }
  }, [user]);

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
      router.push('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setSaveMessage('');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSaveMessage('');
    // Reset to original user data
    if (user) {
      setEditData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        avatar: user.avatar || '',
        address: user.address || {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: 'US'
        },
        preferences: user.preferences || {
          emailNotifications: true,
          smsNotifications: false,
          marketingEmails: false,
          theme: 'system',
          currency: 'USD',
          language: 'en'
        }
      });
      // Reset image preview
      setImagePreview(user.avatar || '');
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage('');

    try {
      const updates = {
        firstName: editData.firstName,
        lastName: editData.lastName,
        name: `${editData.firstName} ${editData.lastName}`.trim(),
        phone: editData.phone,
        avatar: editData.avatar,
        address: editData.address,
        preferences: editData.preferences
      };

      const result = await updateProfile(updates);

      if (result.success) {
        setIsEditing(false);
        setSaveMessage('Profile updated successfully!');
        setTimeout(() => setSaveMessage(''), 3000);
      } else {
        setSaveMessage(result.error || 'Failed to update profile');
      }
    } catch (error) {
      setSaveMessage('An error occurred while updating your profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setEditData(prev => {
      if (field.includes('.')) {
        const [parent, child] = field.split('.');
        return {
          ...prev,
          [parent]: {
            ...prev[parent as keyof EditProfileData],
            [child]: value
          }
        };
      }
      return {
        ...prev,
        [field]: value
      };
    });
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsChangingPassword(true);
    setPasswordMessage('');

    // Validation
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setPasswordMessage('All password fields are required');
      setIsChangingPassword(false);
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMessage('New passwords do not match');
      setIsChangingPassword(false);
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setPasswordMessage('New password must be at least 8 characters long');
      setIsChangingPassword(false);
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setPasswordMessage('Authentication token not found');
        setIsChangingPassword(false);
        return;
      }

      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setPasswordMessage('Password updated successfully!');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setTimeout(() => setPasswordMessage(''), 5000);
      } else {
        setPasswordMessage(data.message || 'Failed to update password');
      }
    } catch (error) {
      setPasswordMessage('An error occurred while updating your password');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleEmailChangeRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsChangingEmail(true);
    setEmailMessage('');

    // Validation
    if (!emailData.newEmail || !emailData.password) {
      setEmailMessage('All fields are required');
      setIsChangingEmail(false);
      return;
    }

    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(emailData.newEmail)) {
      setEmailMessage('Invalid email format');
      setIsChangingEmail(false);
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setEmailMessage('Authentication token not found');
        setIsChangingEmail(false);
        return;
      }

      const response = await fetch('/api/auth/change-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          newEmail: emailData.newEmail,
          password: emailData.password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setEmailMessage('Verification code sent! Check your new email address.');
        setPendingEmail(data.pendingEmail || emailData.newEmail);
        setShowVerificationInput(true);
        setEmailData(prev => ({ ...prev, password: '' })); // Clear password for security
      } else {
        setEmailMessage(data.message || 'Failed to request email change');
      }
    } catch (error) {
      setEmailMessage('An error occurred while requesting email change');
    } finally {
      setIsChangingEmail(false);
    }
  };

  const handleEmailVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsChangingEmail(true);
    setEmailMessage('');

    // Validation
    if (!emailData.verificationCode) {
      setEmailMessage('Verification code is required');
      setIsChangingEmail(false);
      return;
    }

    if (emailData.verificationCode.length !== 6) {
      setEmailMessage('Verification code must be 6 digits');
      setIsChangingEmail(false);
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setEmailMessage('Authentication token not found');
        setIsChangingEmail(false);
        return;
      }

      const response = await fetch('/api/auth/change-email', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          verificationCode: emailData.verificationCode
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setEmailMessage('Email updated successfully!');
        setEmailData({ newEmail: '', password: '', verificationCode: '' });
        setShowEmailChange(false);
        setShowVerificationInput(false);
        setPendingEmail('');

        // Update user data in context and localStorage
        if (data.user) {
          localStorage.setItem('userData', JSON.stringify(data.user));
          // Refresh the page to update user context
          setTimeout(() => window.location.reload(), 1500);
        }
      } else {
        setEmailMessage(data.message || 'Failed to verify email');
      }
    } catch (error) {
      setEmailMessage('An error occurred while verifying email');
    } finally {
      setIsChangingEmail(false);
    }
  };

  const handleViewSessions = async () => {
    setShowSessions(true);
    setIsLoadingSessions(true);

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        alert('Authentication token not found');
        return;
      }

      const response = await fetch('/api/user/sessions', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSessions(data.sessions || []);
      } else {
        alert(data.message || 'Failed to fetch sessions');
      }
    } catch (error) {
      console.error('Failed to fetch sessions:', error);
      alert('An error occurred while fetching sessions');
    } finally {
      setIsLoadingSessions(false);
    }
  };

  const handleRemoveSession = async (token: string) => {
    if (!confirm('Are you sure you want to remove this session?')) {
      return;
    }

    try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        alert('Authentication token not found');
        return;
      }

      const response = await fetch(`/api/user/sessions?token=${encodeURIComponent(token)}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Refresh sessions list
        await handleViewSessions();
        alert('Session removed successfully');
      } else {
        alert(data.message || 'Failed to remove session');
      }
    } catch (error) {
      console.error('Failed to remove session:', error);
      alert('An error occurred while removing session');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    setIsUploadingImage(true);

    try {
      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload to ImgBB (free image hosting)
      const formData = new FormData();
      formData.append('image', file);

      // Using ImgBB API (you'll need to get a free API key from https://api.imgbb.com/)
      // For now, we'll use base64 encoding as a fallback
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });

      // Update the avatar field with base64 image
      handleInputChange('avatar', base64);
      setImagePreview(base64);

    } catch (error) {
      console.error('Image upload error:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsDeletingAccount(true);
    setDeleteMessage('');

    // Validation
    if (!deletePassword) {
      setDeleteMessage('Password is required');
      setIsDeletingAccount(false);
      return;
    }

    if (deleteConfirmation !== 'DELETE') {
      setDeleteMessage('Please type DELETE to confirm');
      setIsDeletingAccount(false);
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setDeleteMessage('Authentication token not found');
        setIsDeletingAccount(false);
        return;
      }

      const response = await fetch('/api/user/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          password: deletePassword,
          confirmation: deleteConfirmation
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setDeleteMessage('Account deleted successfully. Redirecting...');
        // Clear all local storage
        localStorage.clear();
        // Redirect to home page
        setTimeout(() => {
          router.push('/');
        }, 2000);
      } else {
        setDeleteMessage(data.message || 'Failed to delete account');
      }
    } catch (error) {
      setDeleteMessage('An error occurred while deleting account');
    } finally {
      setIsDeletingAccount(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'security', label: 'Security', icon: '🔒' },
    { id: 'preferences', label: 'Preferences', icon: '⚙️' }
  ];

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Welcome back, {user.name}!
            </h1>
            <p className="text-white/80 text-lg">
              Manage your account, orders, and preferences all in one place.
            </p>
          </div>

          {/* Mobile Profile Header */}
          <div className="lg:hidden mb-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-4">
            <div className="flex items-center space-x-3">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-white text-blue-600 flex items-center justify-center font-bold text-lg">
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-white truncate">{user.name}</div>
                <div className="text-sm text-white/70 truncate">{user.email}</div>
              </div>
              {user.role === 'admin' && (
                <div className="text-xs bg-purple-500/20 text-purple-200 px-2 py-1 rounded-full">
                  Admin
                </div>
              )}
            </div>
          </div>

          {/* Mobile Horizontal Scrolling Navigation */}
          <div className="lg:hidden mb-6 -mx-4 sticky top-20 z-[60] bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 py-3">
            <div className="px-4">
              {/* Scrollable container with custom scrollbar */}
              <div
                className="overflow-x-auto overflow-y-hidden scroll-smooth"
                style={{
                  scrollbarWidth: 'thin',
                  scrollbarColor: 'rgba(255, 255, 255, 0.3) transparent',
                  WebkitOverflowScrolling: 'touch'
                }}
              >
                <nav className="flex gap-2 min-w-max pb-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300 whitespace-nowrap font-medium text-sm ${
                        activeTab === tab.id
                          ? 'bg-white text-blue-600 shadow-lg scale-105'
                          : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                      }`}
                    >
                      <span className="text-base">{tab.icon}</span>
                      <span>{tab.label}</span>
                    </button>
                  ))}
                  <Link
                    href="/orders"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 text-white hover:bg-white/20 border border-white/20 transition-all duration-300 whitespace-nowrap font-medium text-sm"
                  >
                    <span className="text-base">📦</span>
                    <span>Orders</span>
                  </Link>
                  <Link
                    href="/wishlist"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 text-white hover:bg-white/20 border border-white/20 transition-all duration-300 whitespace-nowrap font-medium text-sm"
                  >
                    <span className="text-base">❤️</span>
                    <span>Wishlist</span>
                  </Link>
                  <Link
                    href="/settings"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 text-white hover:bg-white/20 border border-white/20 transition-all duration-300 whitespace-nowrap font-medium text-sm"
                  >
                    <span className="text-base">⚙️</span>
                    <span>Settings</span>
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/20 text-red-200 hover:bg-red-500/30 border border-red-500/30 transition-all duration-300 whitespace-nowrap font-medium text-sm"
                  >
                    <span className="text-base">🚪</span>
                    <span>Sign Out</span>
                  </button>
                </nav>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Desktop Sidebar Navigation */}
            <div className="hidden lg:block lg:col-span-1">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 overflow-hidden sticky top-24">
                <div className="p-6 border-b border-white/20">
                  <div className="flex items-center space-x-3">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-white text-blue-600 flex items-center justify-center font-bold text-lg">
                        {user.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                    )}
                    <div>
                      <div className="font-semibold text-white">{user.name}</div>
                      <div className="text-sm text-white/70">{user.email}</div>
                      {user.role === 'admin' && (
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
                    <Link
                      href="/orders"
                      className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-white/80 hover:bg-white/10 hover:text-white transition-all duration-300"
                    >
                      <span className="text-lg">📦</span>
                      <span className="font-medium">My Orders</span>
                    </Link>
                    <Link
                      href="/wishlist"
                      className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-white/80 hover:bg-white/10 hover:text-white transition-all duration-300"
                    >
                      <span className="text-lg">❤️</span>
                      <span className="font-medium">Wishlist</span>
                    </Link>
                    <Link
                      href="/settings"
                      className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-white/80 hover:bg-white/10 hover:text-white transition-all duration-300"
                    >
                      <span className="text-lg">⚙️</span>
                      <span className="font-medium">Settings</span>
                    </Link>
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 overflow-visible relative z-50">
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

                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 relative group cursor-help overflow-visible">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                          <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                          </svg>
                        </div>
                        <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-white/70 text-xs font-bold">
                          ?
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-white mb-1">{userStats.rewardPoints.toLocaleString()}</div>
                      <div className="text-white/70 text-sm">Reward Points</div>

                      {/* Tooltip */}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-72 p-4 bg-gray-900 rounded-xl shadow-2xl border border-white/20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[9999]">
                        {/* Arrow */}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-[-1px]">
                          <div className="border-8 border-transparent border-b-gray-900"></div>
                        </div>
                        <div className="text-white font-semibold mb-2 flex items-center gap-2">
                          <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                          How Rewards Work
                        </div>
                        <div className="text-white/80 text-sm space-y-2">
                          <p className="flex items-start gap-2">
                            <span className="text-green-400 font-bold">•</span>
                            <span>Earn 1 point for every $1 spent</span>
                          </p>
                          <p className="flex items-start gap-2">
                            <span className="text-green-400 font-bold">•</span>
                            <span>100 points = $5 discount on your next order</span>
                          </p>
                          <p className="flex items-start gap-2">
                            <span className="text-green-400 font-bold">•</span>
                            <span>Points never expire</span>
                          </p>
                          <p className="flex items-start gap-2">
                            <span className="text-green-400 font-bold">•</span>
                            <span>Bonus points on special promotions</span>
                          </p>
                        </div>
                      </div>
                    </div>

                    <Link href="/membership" className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all duration-300 group cursor-pointer block">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                          <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-4 8a2 2 0 100-4 2 2 0 000 4z" />
                          </svg>
                        </div>
                        <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-white/70 text-xs group-hover:bg-white/30 transition-colors">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                      <div className="text-lg font-bold text-white mb-1 capitalize">
                        {isLoadingStats ? '...' : loyaltyTier}
                      </div>
                      <div className="text-white/70 text-sm">Member Status</div>
                      <div className="text-white/50 text-xs mt-2 group-hover:text-white/70 transition-colors">
                        Learn more →
                      </div>
                    </Link>
                  </div>

                  {/* Recent Orders */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 overflow-hidden">
                    <div className="p-6 border-b border-white/20">
                      <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-white">Recent Orders</h2>
                        <Link
                          href="/orders"
                          className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                        >
                          View All
                        </Link>
                      </div>
                    </div>
                    
                    <div className="divide-y divide-white/10">
                      {recentOrders.map((order) => (
                        <div key={order.id} className="p-4 sm:p-6 hover:bg-white/5 transition-colors">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                            <div className="flex items-center flex-wrap gap-2 sm:gap-3">
                              <div className="font-semibold text-white text-sm sm:text-base">{order.id}</div>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </span>
                            </div>
                            <div className="text-white font-semibold">${order.total}</div>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm">
                            <div className="text-white/70">
                              {new Date(order.date).toLocaleDateString()} • {order.items} items
                            </div>
                            <Link
                              href={`/orders/${order.id}`}
                              className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                            >
                              View Details
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'profile' && (
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white">Profile Information</h2>
                    {!isEditing ? (
                      <button
                        onClick={handleEdit}
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-colors font-medium"
                      >
                        Edit Profile
                      </button>
                    ) : (
                      <div className="space-x-3">
                        <button
                          onClick={handleCancel}
                          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSave}
                          disabled={isSaving}
                          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-colors font-medium disabled:opacity-50"
                        >
                          {isSaving ? 'Saving...' : 'Save Changes'}
                        </button>
                      </div>
                    )}
                  </div>

                  {saveMessage && (
                    <div className={`mb-6 p-4 rounded-xl ${
                      saveMessage.includes('success')
                        ? 'bg-green-500/20 text-green-200 border border-green-500/30'
                        : 'bg-red-500/20 text-red-200 border border-red-500/30'
                    }`}>
                      {saveMessage}
                    </div>
                  )}

                  {/* Avatar Section */}
                  <div className="mb-8 p-6 bg-white/5 rounded-xl">
                    <h3 className="text-lg font-semibold text-white mb-4">Profile Picture</h3>
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                      {/* Avatar Preview */}
                      <div className="flex-shrink-0">
                        {(imagePreview || editData.avatar || user.avatar) ? (
                          <img
                            src={imagePreview || editData.avatar || user.avatar}
                            alt="Profile"
                            className="w-32 h-32 rounded-full object-cover border-4 border-white/20"
                          />
                        ) : (
                          <div className="w-32 h-32 rounded-full bg-white/10 border-4 border-white/20 flex items-center justify-center">
                            <span className="text-white text-4xl font-bold">
                              {user.name?.charAt(0).toUpperCase() || 'U'}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Upload Controls */}
                      {isEditing && (
                        <div className="flex-1 space-y-3">
                          <div>
                            <label className="block text-white text-sm font-medium mb-2">
                              Upload New Picture
                            </label>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload}
                              disabled={isUploadingImage}
                              className="block w-full text-sm text-white/70
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-lg file:border-0
                                file:text-sm file:font-semibold
                                file:bg-blue-600 file:text-white
                                hover:file:bg-blue-700
                                file:cursor-pointer file:transition-colors
                                disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                            <p className="text-xs text-white/50 mt-1">
                              JPG, PNG, or GIF (max 5MB)
                            </p>
                          </div>

                          <div>
                            <label className="block text-white text-sm font-medium mb-2">
                              Or Paste Image URL
                            </label>
                            <input
                              type="url"
                              value={editData.avatar}
                              onChange={(e) => {
                                handleInputChange('avatar', e.target.value);
                                setImagePreview(e.target.value);
                              }}
                              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                              placeholder="https://example.com/avatar.jpg"
                            />
                          </div>

                          {isUploadingImage && (
                            <p className="text-blue-400 text-sm">Uploading image...</p>
                          )}
                        </div>
                      )}

                      {!isEditing && (
                        <div className="text-white/70 text-sm">
                          Click "Edit Profile" to change your picture
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-white font-medium mb-2">First Name</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editData.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      ) : (
                        <div className="text-white p-3">{user.firstName || 'Not provided'}</div>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-white font-medium mb-2">Last Name</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editData.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      ) : (
                        <div className="text-white p-3">{user.lastName || 'Not provided'}</div>
                      )}
                    </div>

                    <div>
                      <label className="block text-white font-medium mb-2">Email</label>
                      <div className="text-white p-3 bg-white/5 rounded-xl">{user.email}</div>
                      <p className="text-xs text-white/50 mt-1">Email cannot be changed here</p>
                    </div>

                    <div>
                      <label className="block text-white font-medium mb-2">Phone Number</label>
                      {isEditing ? (
                        <input
                          type="tel"
                          value={editData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="+1 (555) 123-4567"
                        />
                      ) : (
                        <div className="text-white p-3">{user.phone || 'Not provided'}</div>
                      )}
                    </div>
                  </div>

                  {/* Address Section */}
                  <div className="mt-8 pt-8 border-t border-white/20">
                    <h3 className="text-xl font-semibold text-white mb-6">Address Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-white font-medium mb-2">Street Address</label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editData.address.street}
                            onChange={(e) => handleInputChange('address.street', e.target.value)}
                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="123 Main Street"
                          />
                        ) : (
                          <div className="text-white p-3">{user.address?.street || 'Not provided'}</div>
                        )}
                      </div>

                      <div>
                        <label className="block text-white font-medium mb-2">City</label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editData.address.city}
                            onChange={(e) => handleInputChange('address.city', e.target.value)}
                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="New York"
                          />
                        ) : (
                          <div className="text-white p-3">{user.address?.city || 'Not provided'}</div>
                        )}
                      </div>

                      <div>
                        <label className="block text-white font-medium mb-2">State/Province</label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editData.address.state}
                            onChange={(e) => handleInputChange('address.state', e.target.value)}
                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="NY"
                          />
                        ) : (
                          <div className="text-white p-3">{user.address?.state || 'Not provided'}</div>
                        )}
                      </div>

                      <div>
                        <label className="block text-white font-medium mb-2">ZIP/Postal Code</label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editData.address.zipCode}
                            onChange={(e) => handleInputChange('address.zipCode', e.target.value)}
                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="10001"
                          />
                        ) : (
                          <div className="text-white p-3">{user.address?.zipCode || 'Not provided'}</div>
                        )}
                      </div>

                      <div>
                        <label className="block text-white font-medium mb-2">Country</label>
                        {isEditing ? (
                          <select
                            value={editData.address.country}
                            onChange={(e) => handleInputChange('address.country', e.target.value)}
                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="US" className="bg-gray-800">United States</option>
                            <option value="CA" className="bg-gray-800">Canada</option>
                            <option value="GB" className="bg-gray-800">United Kingdom</option>
                            <option value="AU" className="bg-gray-800">Australia</option>
                            <option value="DE" className="bg-gray-800">Germany</option>
                            <option value="FR" className="bg-gray-800">France</option>
                            <option value="ES" className="bg-gray-800">Spain</option>
                            <option value="IT" className="bg-gray-800">Italy</option>
                            <option value="JP" className="bg-gray-800">Japan</option>
                            <option value="CN" className="bg-gray-800">China</option>
                          </select>
                        ) : (
                          <div className="text-white p-3">{user.address?.country || 'Not provided'}</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-6">
                  {/* Change Password */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6">
                    <h2 className="text-2xl font-bold text-white mb-6">Security Settings</h2>

                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-4">Change Password</h3>

                        {passwordMessage && (
                          <div className={`mb-4 p-4 rounded-xl ${
                            passwordMessage.includes('success')
                              ? 'bg-green-500/20 text-green-200 border border-green-500/30'
                              : 'bg-red-500/20 text-red-200 border border-red-500/30'
                          }`}>
                            {passwordMessage}
                          </div>
                        )}

                        <form onSubmit={handlePasswordChange} className="space-y-4">
                          <div>
                            <label className="block text-white font-medium mb-2">Current Password</label>
                            <input
                              type="password"
                              value={passwordData.currentPassword}
                              onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Enter your current password"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-white font-medium mb-2">New Password</label>
                            <input
                              type="password"
                              value={passwordData.newPassword}
                              onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Enter new password (min 8 characters)"
                              required
                              minLength={8}
                            />
                            <p className="text-xs text-white/50 mt-1">
                              Must be at least 8 characters with uppercase, lowercase, and numbers
                            </p>
                          </div>

                          <div>
                            <label className="block text-white font-medium mb-2">Confirm New Password</label>
                            <input
                              type="password"
                              value={passwordData.confirmPassword}
                              onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Confirm your new password"
                              required
                            />
                          </div>

                          <button
                            type="submit"
                            disabled={isChangingPassword}
                            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isChangingPassword ? 'Updating...' : 'Update Password'}
                          </button>
                        </form>
                      </div>

                      {/* Change Email */}
                      <div className="border-t border-white/20 pt-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-white">Email Address</h3>
                          {!showEmailChange && !showVerificationInput && (
                            <button
                              onClick={() => setShowEmailChange(true)}
                              className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors text-sm font-medium"
                            >
                              Change Email
                            </button>
                          )}
                        </div>

                        <div className="mb-4 p-4 bg-white/5 rounded-xl border border-white/10">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-white font-medium">{user.email}</div>
                              <div className="text-white/70 text-sm flex items-center gap-2">
                                {user.emailVerified ? (
                                  <>
                                    <span className="text-green-400">✓</span>
                                    Verified
                                  </>
                                ) : (
                                  <>
                                    <span className="text-yellow-400">!</span>
                                    Not verified
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {emailMessage && (
                          <div className={`mb-4 p-4 rounded-xl ${
                            emailMessage.includes('success') || emailMessage.includes('sent')
                              ? 'bg-green-500/20 text-green-200 border border-green-500/30'
                              : 'bg-red-500/20 text-red-200 border border-red-500/30'
                          }`}>
                            {emailMessage}
                          </div>
                        )}

                        {/* Step 1: Request Email Change */}
                        {showEmailChange && !showVerificationInput && (
                          <div className="mt-4">
                            <div className="mb-4 p-4 bg-blue-500/10 rounded-xl border border-blue-500/30">
                              <p className="text-blue-200 text-sm">
                                <strong>Step 1 of 2:</strong> Enter your new email and confirm your password. A 6-digit verification code will be sent to your new email address.
                              </p>
                            </div>

                            <form onSubmit={handleEmailChangeRequest} className="space-y-4">
                              <div>
                                <label className="block text-white font-medium mb-2">New Email Address</label>
                                <input
                                  type="email"
                                  value={emailData.newEmail}
                                  onChange={(e) => setEmailData(prev => ({ ...prev, newEmail: e.target.value }))}
                                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  placeholder="Enter new email address"
                                  required
                                  disabled={isChangingEmail}
                                />
                              </div>

                              <div>
                                <label className="block text-white font-medium mb-2">Confirm Password</label>
                                <input
                                  type="password"
                                  value={emailData.password}
                                  onChange={(e) => setEmailData(prev => ({ ...prev, password: e.target.value }))}
                                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  placeholder="Confirm your password"
                                  required
                                  disabled={isChangingEmail}
                                />
                              </div>

                              <div className="flex gap-3">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setShowEmailChange(false);
                                    setEmailData({ newEmail: '', password: '', verificationCode: '' });
                                    setEmailMessage('');
                                  }}
                                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                                  disabled={isChangingEmail}
                                >
                                  Cancel
                                </button>
                                <button
                                  type="submit"
                                  disabled={isChangingEmail}
                                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  {isChangingEmail ? 'Sending Code...' : 'Send Verification Code'}
                                </button>
                              </div>
                            </form>
                          </div>
                        )}

                        {/* Step 2: Verify with Code */}
                        {showVerificationInput && (
                          <div className="mt-4">
                            <div className="mb-4 p-4 bg-green-500/10 rounded-xl border border-green-500/30">
                              <p className="text-green-200 text-sm">
                                <strong>Step 2 of 2:</strong> A 6-digit verification code has been sent to <strong>{pendingEmail}</strong>. Enter the code below to complete the email change.
                              </p>
                              <p className="text-green-200/70 text-xs mt-2">
                                Code expires in 30 minutes. Check your spam folder if you don't see it.
                              </p>
                            </div>

                            <form onSubmit={handleEmailVerification} className="space-y-4">
                              <div>
                                <label className="block text-white font-medium mb-2">Verification Code</label>
                                <input
                                  type="text"
                                  value={emailData.verificationCode}
                                  onChange={(e) => setEmailData(prev => ({ ...prev, verificationCode: e.target.value.replace(/\D/g, '').slice(0, 6) }))}
                                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-2xl tracking-widest font-mono"
                                  placeholder="000000"
                                  required
                                  maxLength={6}
                                  pattern="[0-9]{6}"
                                  disabled={isChangingEmail}
                                />
                                <p className="text-xs text-white/50 mt-1 text-center">
                                  Enter the 6-digit code from your email
                                </p>
                              </div>

                              <div className="flex gap-3">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setShowVerificationInput(false);
                                    setShowEmailChange(false);
                                    setPendingEmail('');
                                    setEmailData({ newEmail: '', password: '', verificationCode: '' });
                                    setEmailMessage('');
                                  }}
                                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                                  disabled={isChangingEmail}
                                >
                                  Cancel
                                </button>
                                <button
                                  type="submit"
                                  disabled={isChangingEmail || emailData.verificationCode.length !== 6}
                                  className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl hover:from-green-700 hover:to-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  {isChangingEmail ? 'Verifying...' : 'Verify & Update Email'}
                                </button>
                              </div>

                              <button
                                type="button"
                                onClick={() => {
                                  setShowVerificationInput(false);
                                  setShowEmailChange(true);
                                  setEmailMessage('');
                                }}
                                className="w-full text-sm text-blue-400 hover:text-blue-300 transition-colors"
                                disabled={isChangingEmail}
                              >
                                Didn't receive the code? Try again
                              </button>
                            </form>
                          </div>
                        )}
                      </div>

                      {/* Account Actions */}
                      <div className="border-t border-white/20 pt-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Account Actions</h3>
                        <div className="space-y-3">
                          {/* Active Sessions */}
                          <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <div className="text-white font-medium">Active Sessions</div>
                                <div className="text-white/70 text-sm">Manage your active login sessions</div>
                              </div>
                              <button
                                onClick={handleViewSessions}
                                className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors font-medium"
                              >
                                {showSessions ? 'Refresh' : 'View'}
                              </button>
                            </div>

                            {showSessions && (
                              <div className="mt-4 space-y-2">
                                {isLoadingSessions ? (
                                  <div className="text-center text-white/60 py-4">Loading sessions...</div>
                                ) : sessions.length === 0 ? (
                                  <div className="text-center text-white/60 py-4">No active sessions found</div>
                                ) : (
                                  sessions.map((session, index) => (
                                    <div key={index} className="p-3 bg-white/10 rounded-lg border border-white/20">
                                      <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                          <div className="text-white font-medium">{session.device}</div>
                                          <div className="text-white/70 text-sm">{session.browser}</div>
                                          <div className="text-white/50 text-xs mt-1">
                                            IP: {session.ipAddress} • Last active: {new Date(session.lastActive).toLocaleString()}
                                          </div>
                                        </div>
                                        <button
                                          onClick={() => handleRemoveSession(session.token)}
                                          className="ml-3 px-3 py-1 text-sm bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
                                        >
                                          Remove
                                        </button>
                                      </div>
                                    </div>
                                  ))
                                )}
                              </div>
                            )}
                          </div>

                          {/* Delete Account */}
                          <div className="p-4 bg-red-500/10 rounded-xl border border-red-500/20">
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <div className="text-red-200 font-medium">Delete Account</div>
                                <div className="text-red-300/70 text-sm">Permanently delete your account and all data</div>
                              </div>
                              <button
                                onClick={() => setShowDeleteAccount(!showDeleteAccount)}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
                              >
                                {showDeleteAccount ? 'Cancel' : 'Delete'}
                              </button>
                            </div>

                            {showDeleteAccount && (
                              <div className="mt-4">
                                <div className="mb-4 p-3 bg-red-600/20 rounded-lg border border-red-500/30">
                                  <p className="text-red-200 text-sm font-medium mb-2">⚠️ Warning: This action cannot be undone!</p>
                                  <p className="text-red-300/80 text-xs">
                                    All your account data, orders, and preferences will be permanently deleted.
                                    Order history will be anonymized for business records.
                                  </p>
                                </div>

                                {deleteMessage && (
                                  <div className={`mb-4 p-3 rounded-lg ${
                                    deleteMessage.includes('success')
                                      ? 'bg-green-500/20 text-green-200 border border-green-500/30'
                                      : 'bg-red-500/20 text-red-200 border border-red-500/30'
                                  }`}>
                                    {deleteMessage}
                                  </div>
                                )}

                                <form onSubmit={handleDeleteAccount} className="space-y-3">
                                  <div>
                                    <label className="block text-red-200 font-medium mb-2 text-sm">
                                      Type DELETE to confirm
                                    </label>
                                    <input
                                      type="text"
                                      value={deleteConfirmation}
                                      onChange={(e) => setDeleteConfirmation(e.target.value)}
                                      className="w-full px-4 py-2 bg-white/10 border border-red-500/30 rounded-lg text-white placeholder-white/60 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                      placeholder="Type DELETE"
                                      required
                                      disabled={isDeletingAccount}
                                    />
                                  </div>

                                  <div>
                                    <label className="block text-red-200 font-medium mb-2 text-sm">
                                      Confirm your password
                                    </label>
                                    <input
                                      type="password"
                                      value={deletePassword}
                                      onChange={(e) => setDeletePassword(e.target.value)}
                                      className="w-full px-4 py-2 bg-white/10 border border-red-500/30 rounded-lg text-white placeholder-white/60 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                      placeholder="Enter your password"
                                      required
                                      disabled={isDeletingAccount}
                                    />
                                  </div>

                                  <button
                                    type="submit"
                                    disabled={isDeletingAccount || deleteConfirmation !== 'DELETE'}
                                    className="w-full px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    {isDeletingAccount ? 'Deleting Account...' : 'Delete My Account Permanently'}
                                  </button>
                                </form>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'preferences' && (
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white">Preferences</h2>
                    {!isEditing ? (
                      <button
                        onClick={handleEdit}
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-colors font-medium"
                      >
                        Edit Preferences
                      </button>
                    ) : (
                      <div className="space-x-3">
                        <button
                          onClick={handleCancel}
                          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSave}
                          disabled={isSaving}
                          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-colors font-medium disabled:opacity-50"
                        >
                          {isSaving ? 'Saving...' : 'Save Changes'}
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">Notifications</h3>
                      <div className="space-y-4">
                        {[
                          { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive order updates and news via email' },
                          { key: 'smsNotifications', label: 'SMS Notifications', description: 'Receive order updates via SMS' },
                          { key: 'marketingEmails', label: 'Marketing Emails', description: 'Receive promotional offers and deals' }
                        ].map((item) => (
                          <div key={item.key} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                            <div>
                              <div className="text-white font-medium">{item.label}</div>
                              <div className="text-white/70 text-sm">{item.description}</div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input 
                                type="checkbox" 
                                checked={isEditing ? editData.preferences[item.key as keyof typeof editData.preferences] : user.preferences?.[item.key as keyof typeof user.preferences]}
                                onChange={(e) => isEditing && handleInputChange(`preferences.${item.key}`, e.target.checked)}
                                disabled={!isEditing}
                                className="sr-only peer" 
                              />
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
                          {isEditing ? (
                            <select 
                              value={editData.preferences.currency}
                              onChange={(e) => handleInputChange('preferences.currency', e.target.value)}
                              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              <option value="USD" className="bg-gray-800">USD ($)</option>
                              <option value="EUR" className="bg-gray-800">EUR (€)</option>
                              <option value="GBP" className="bg-gray-800">GBP (£)</option>
                              <option value="CAD" className="bg-gray-800">CAD ($)</option>
                            </select>
                          ) : (
                            <div className="text-white p-3">{user.preferences?.currency || 'USD'}</div>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-white font-medium mb-2">Language</label>
                          {isEditing ? (
                            <select 
                              value={editData.preferences.language}
                              onChange={(e) => handleInputChange('preferences.language', e.target.value)}
                              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              <option value="en" className="bg-gray-800">English</option>
                              <option value="es" className="bg-gray-800">Español</option>
                              <option value="fr" className="bg-gray-800">Français</option>
                              <option value="de" className="bg-gray-800">Deutsch</option>
                            </select>
                          ) : (
                            <div className="text-white p-3">{user.preferences?.language || 'English'}</div>
                          )}
                        </div>

                        <div>
                          <label className="block text-white font-medium mb-2">Theme</label>
                          {isEditing ? (
                            <select 
                              value={editData.preferences.theme}
                              onChange={(e) => handleInputChange('preferences.theme', e.target.value)}
                              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              <option value="light" className="bg-gray-800">Light</option>
                              <option value="dark" className="bg-gray-800">Dark</option>
                              <option value="system" className="bg-gray-800">System</option>
                            </select>
                          ) : (
                            <div className="text-white p-3 capitalize">{user.preferences?.theme || 'System'}</div>
                          )}
                        </div>
                      </div>
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