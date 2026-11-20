// src/app/account/page.tsx: the user dashboard (DESIGN.md, "Forms and account"). Data loading and
// every handler are unchanged; the markup moved to the system: a greeting head with an identity
// readout, the shared account rail, section tabs (ARIA tablist), stats as a readout, and forms built
// from styles/forms.css. The page no longer renders its own footer (the layout already does).
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import AuthGuard from '@/components/auth/AuthGuard';
import AccountNav from '@/components/ui/AccountNav';
import PasswordField from '@/components/auth/PasswordField';

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
  const rewardsDropdownRef = useRef<HTMLDivElement>(null);

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

  // Handle click outside rewards dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (rewardsDropdownRef.current && !rewardsDropdownRef.current.contains(event.target as Node)) {
        setShowRewardsInfo(false);
      }
    };

    if (showRewardsInfo) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showRewardsInfo]);

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
      case 'delivered': return 'status--delivered';
      case 'shipped': return 'status--shipped';
      case 'processing': return 'status--processing';
      case 'cancelled': return 'status--cancelled';
      default: return '';
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
            ...(prev[parent as keyof EditProfileData] as any),
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
    { id: 'overview', label: 'Overview' },
    { id: 'profile', label: 'Profile' },
    { id: 'security', label: 'Security' },
    { id: 'preferences', label: 'Preferences' }
  ];

  if (loading || !user) {
    return <div className="auth-wait" aria-busy="true">Loading your account</div>;
  }

  const money = (n: number) => `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const firstName = user.firstName || user.name?.split(' ')[0] || 'there';
  const initials = (user.name || 'You').split(/\s+/).map((p) => p[0]).slice(0, 2).join('').toUpperCase();
  const avatarSrc = imagePreview || editData.avatar || user.avatar;
  const isGood = (m: string) => /success|sent/i.test(m);

  const editActions = (
    <div className="dash-sec__actions">
      {!isEditing ? (
        <button type="button" onClick={handleEdit} className="btn btn--line btn--sm">
          <span className="btn__fill" aria-hidden="true" />
          <span className="btn__label">Edit</span>
        </button>
      ) : (
        <>
          <button type="button" onClick={handleCancel} className="btn btn--line btn--sm">
            <span className="btn__fill" aria-hidden="true" />
            <span className="btn__label">Cancel</span>
          </button>
          <button type="button" onClick={handleSave} disabled={isSaving} aria-busy={isSaving} className="btn btn--solid btn--sm">
            <span className="btn__fill" aria-hidden="true" />
            <span className="btn__label">{isSaving ? 'Saving…' : 'Save changes'}</span>
          </button>
        </>
      )}
    </div>
  );

  // One labelled value: a read-only readout, or an input while editing.
  const kv = (id: string, label: string, value: string | undefined, input: React.ReactNode) => (
    <div className="field">
      <label htmlFor={isEditing ? id : undefined} className="field__label">{label}</label>
      {isEditing ? input : <p className="kv__v">{value || <span className="kv__none">Not provided</span>}</p>}
    </div>
  );

  return (
    <>
      <header className="dash-head">
        <div className="dash-head__in">
          <nav aria-label="Breadcrumb">
            <ol className="page-head__crumbs">
              <li><Link href="/">Home</Link><span aria-hidden="true"> / </span></li>
              <li><span aria-current="page">Account</span></li>
            </ol>
          </nav>
          <div className="dash-head__row">
            <div className="dash-id" aria-hidden="true">
              {user.avatar
                // eslint-disable-next-line @next/next/no-img-element
                ? <img src={user.avatar} alt="" />
                : <span>{initials}</span>}
            </div>
            <div>
              <h1 className="dash-head__title">Hello, {firstName}.</h1>
              <p className="dash-head__meta mono">
                <span>{user.email}</span>
                <span>{user.emailVerified ? 'Verified' : 'Not verified'}</span>
                {userStats.memberSince && <span>Member since {new Date(userStats.memberSince).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>}
                {user.role === 'admin' && <span>Admin</span>}
              </p>
            </div>
          </div>
        </div>
      </header>
      <AccountNav />

      <div className="dash">
        <div className="seg" role="tablist" aria-label="Account sections">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              id={`tab-${tab.id}`}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`panel-${tab.id}`}
              tabIndex={activeTab === tab.id ? 0 : -1}
              className="seg__tab"
              onClick={() => setActiveTab(tab.id)}
              onKeyDown={(e) => {
                if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
                const i = tabs.findIndex((t) => t.id === activeTab);
                const next = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
                setActiveTab(next.id);
                document.getElementById(`tab-${next.id}`)?.focus();
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <section id="panel-overview" role="tabpanel" aria-labelledby="tab-overview" className="dash-panel">
            <div className="stats dash-stats" aria-busy={isLoadingStats}>
              <div className="stats__cell">
                <span className="stats__k">Orders</span>
                <span className="stats__v mono">{isLoadingStats ? '··' : userStats.totalOrders}</span>
                <Link href="/orders" className="stats__note text-link">See all orders</Link>
              </div>
              <div className="stats__cell">
                <span className="stats__k">Spent with us</span>
                <span className="stats__v mono">{isLoadingStats ? '··' : money(userStats.totalSpent)}</span>
                <span className="stats__note">Across every order</span>
              </div>
              <div className="stats__cell" ref={rewardsDropdownRef}>
                <span className="stats__k">Reward points</span>
                <span className="stats__v mono">{isLoadingStats ? '··' : userStats.rewardPoints.toLocaleString()}</span>
                <button type="button" className="stats__note text-link" style={{ justifySelf: 'start' }} aria-expanded={showRewardsInfo} aria-controls="rewards-how" onClick={() => setShowRewardsInfo(!showRewardsInfo)}>
                  How points work
                </button>
                <ul id="rewards-how" className="ticks dash-how" hidden={!showRewardsInfo}>
                  <li>Earn 1 point for every $1 spent</li>
                  <li>100 points take $5 off your next order</li>
                  <li>Points never expire</li>
                  <li>Bonus points on special promotions</li>
                </ul>
              </div>
              <Link href="/membership" className="stats__cell stats__cell--accent dash-tier">
                <span className="stats__k">Member tier</span>
                <span className="stats__v" style={{ textTransform: 'capitalize' }}>{isLoadingStats ? '··' : loyaltyTier}</span>
                <span className="stats__note">What each tier gets <span aria-hidden="true">→</span></span>
              </Link>
            </div>

            <div className="dash-sec">
              <div className="dash-sec__head">
                <h2 className="dash-sec__title">Recent orders</h2>
                <Link href="/orders" className="text-link" style={{ fontSize: 'var(--t-s)' }}>View all</Link>
              </div>
              {recentOrders.length === 0 ? (
                <div className="dash-empty">
                  <p>{isLoadingStats ? 'Loading your orders…' : 'No orders yet. Your first one will show up here with its status and tracking.'}</p>
                  {!isLoadingStats && (
                    <Link href="/products" className="btn btn--solid btn--sm">
                      <span className="btn__fill" aria-hidden="true" />
                      <span className="btn__label">Browse the gear</span>
                    </Link>
                  )}
                </div>
              ) : (
                <ul className="orders-list">
                  {recentOrders.map((order) => (
                    <li key={order.id} className="orders-list__row">
                      <span className="orders-list__id mono">{order.id}</span>
                      <span className="orders-list__meta">{new Date(order.date).toLocaleDateString()} · {order.items} item{order.items === 1 ? '' : 's'}</span>
                      <span className={`status ${getStatusColor(order.status)}`}>{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
                      <span className="orders-list__total mono">{money(order.total)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="dash-sec">
              <div className="dash-sec__head"><h2 className="dash-sec__title">Shortcuts</h2></div>
              <ul className="rows">
                {[
                  { t: 'Start or check a return', href: '/returns-status' },
                  { t: 'Your wishlist', href: '/wishlist' },
                  { t: 'Notification and display settings', href: '/settings' },
                  { t: 'Get help', href: '/help' },
                ].map((r) => (
                  <li key={r.href}>
                    <Link href={r.href}>
                      <span className="rows__t" style={{ fontSize: 'var(--t-body)' }}>{r.t}</span>
                      <span className="rows__go" aria-hidden="true">{r.href}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {activeTab === 'profile' && (
          <section id="panel-profile" role="tabpanel" aria-labelledby="tab-profile" className="dash-panel">
            <div className="dash-sec">
              <div className="dash-sec__head">
                <h2 className="dash-sec__title">Profile</h2>
                {editActions}
              </div>
              {saveMessage && (
                <div className={`alert ${isGood(saveMessage) ? 'alert--ok' : 'alert--error'}`} role={isGood(saveMessage) ? 'status' : 'alert'}>
                  <p className="alert__text" style={{ color: 'var(--c-fg)' }}>{saveMessage}</p>
                </div>
              )}

              <div className="dash-avatar">
                <div className="dash-id dash-id--lg">
                  {avatarSrc
                    // eslint-disable-next-line @next/next/no-img-element
                    ? <img src={avatarSrc} alt="Your profile picture" />
                    : <span aria-hidden="true">{initials}</span>}
                </div>
                {isEditing ? (
                  <div className="form" style={{ flex: 1, minWidth: 0 }}>
                    <div className="field">
                      <label htmlFor="avatar-file" className="field__label">Upload a picture</label>
                      <input id="avatar-file" type="file" accept="image/*" onChange={handleImageUpload} disabled={isUploadingImage} className="file-input" aria-describedby="avatar-hint" />
                      <p id="avatar-hint" className="field__hint">JPG, PNG or GIF, up to 5 MB{isUploadingImage ? '. Uploading…' : ''}</p>
                    </div>
                    <div className="field">
                      <label htmlFor="avatar-url" className="field__label">Or paste an image URL</label>
                      <input
                        id="avatar-url"
                        type="url"
                        className="field__input"
                        value={editData.avatar}
                        onChange={(e) => {
                          handleInputChange('avatar', e.target.value);
                          setImagePreview(e.target.value);
                        }}
                        placeholder="https://example.com/avatar.jpg"
                      />
                    </div>
                  </div>
                ) : (
                  <p className="field__hint">Choose Edit to change your picture.</p>
                )}
              </div>

              <div className="form__row form__row--2">
                {kv('firstName', 'First name', user.firstName,
                  <input id="firstName" type="text" autoComplete="given-name" className="field__input" value={editData.firstName} onChange={(e) => handleInputChange('firstName', e.target.value)} />)}
                {kv('lastName', 'Last name', user.lastName,
                  <input id="lastName" type="text" autoComplete="family-name" className="field__input" value={editData.lastName} onChange={(e) => handleInputChange('lastName', e.target.value)} />)}
                <div className="field">
                  <span className="field__label">Email</span>
                  <p className="kv__v">{user.email}</p>
                  <p className="field__hint">Change it under Security.</p>
                </div>
                {kv('phone', 'Phone', user.phone,
                  <input id="phone" type="tel" autoComplete="tel" className="field__input" value={editData.phone} onChange={(e) => handleInputChange('phone', e.target.value)} placeholder="+1 555 123 4567" />)}
              </div>
            </div>

            <div className="dash-sec">
              <div className="dash-sec__head"><h2 className="dash-sec__title">Shipping address</h2></div>
              <div className="form">
                {kv('street', 'Street address', user.address?.street,
                  <input id="street" type="text" autoComplete="street-address" className="field__input" value={editData.address.street} onChange={(e) => handleInputChange('address.street', e.target.value)} />)}
                <div className="form__row form__row--2">
                  {kv('city', 'City', user.address?.city,
                    <input id="city" type="text" autoComplete="address-level2" className="field__input" value={editData.address.city} onChange={(e) => handleInputChange('address.city', e.target.value)} />)}
                  {kv('state', 'State or province', user.address?.state,
                    <input id="state" type="text" autoComplete="address-level1" className="field__input" value={editData.address.state} onChange={(e) => handleInputChange('address.state', e.target.value)} />)}
                  {kv('zipCode', 'ZIP or postal code', user.address?.zipCode,
                    <input id="zipCode" type="text" autoComplete="postal-code" className="field__input" value={editData.address.zipCode} onChange={(e) => handleInputChange('address.zipCode', e.target.value)} />)}
                  {kv('country', 'Country', user.address?.country,
                    <select id="country" autoComplete="country" className="field__input" value={editData.address.country} onChange={(e) => handleInputChange('address.country', e.target.value)}>
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                      <option value="GB">United Kingdom</option>
                      <option value="AU">Australia</option>
                      <option value="DE">Germany</option>
                      <option value="FR">France</option>
                      <option value="ES">Spain</option>
                      <option value="IT">Italy</option>
                      <option value="JP">Japan</option>
                      <option value="CN">China</option>
                    </select>)}
                </div>
              </div>
              {isEditing && <div style={{ marginTop: '1.5rem' }}>{editActions}</div>}
            </div>
          </section>
        )}

        {activeTab === 'security' && (
          <section id="panel-security" role="tabpanel" aria-labelledby="tab-security" className="dash-panel">
            <div className="dash-sec">
              <div className="dash-sec__head"><h2 className="dash-sec__title">Password</h2></div>
              {passwordMessage && (
                <div className={`alert ${isGood(passwordMessage) ? 'alert--ok' : 'alert--error'}`} role={isGood(passwordMessage) ? 'status' : 'alert'}>
                  <p className="alert__text" style={{ color: 'var(--c-fg)' }}>{passwordMessage}</p>
                </div>
              )}
              <form onSubmit={handlePasswordChange} className="form dash-narrow">
                <PasswordField id="currentPassword" label="Current password" autoComplete="current-password" value={passwordData.currentPassword} onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))} />
                <PasswordField id="newPassword" label="New password" autoComplete="new-password" minLength={8} value={passwordData.newPassword} onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))} hint="At least 8 characters, with uppercase, lowercase and numbers." />
                <PasswordField id="confirmNewPassword" label="Confirm new password" autoComplete="new-password" value={passwordData.confirmPassword} onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))} />
                <div>
                  <button type="submit" disabled={isChangingPassword} aria-busy={isChangingPassword} className="btn btn--solid">
                    <span className="btn__fill" aria-hidden="true" />
                    <span className="btn__label">{isChangingPassword ? 'Updating…' : 'Update password'}</span>
                  </button>
                </div>
              </form>
            </div>

            <div className="dash-sec">
              <div className="dash-sec__head">
                <h2 className="dash-sec__title">Email</h2>
                {!showEmailChange && !showVerificationInput && (
                  <button type="button" onClick={() => setShowEmailChange(true)} className="btn btn--line btn--sm">
                    <span className="btn__fill" aria-hidden="true" />
                    <span className="btn__label">Change email</span>
                  </button>
                )}
              </div>
              <p className="kv__v">
                {user.email} <span className={`status ${user.emailVerified ? 'status--delivered' : 'status--processing'}`}>{user.emailVerified ? 'Verified' : 'Not verified'}</span>
              </p>
              {emailMessage && (
                <div className={`alert ${isGood(emailMessage) ? 'alert--ok' : 'alert--error'}`} role={isGood(emailMessage) ? 'status' : 'alert'} style={{ marginTop: '1rem' }}>
                  <p className="alert__text" style={{ color: 'var(--c-fg)' }}>{emailMessage}</p>
                </div>
              )}

              {showEmailChange && !showVerificationInput && (
                <form onSubmit={handleEmailChangeRequest} className="form dash-narrow" style={{ marginTop: '1.25rem' }}>
                  <p className="field__hint mono">Step 1 of 2</p>
                  <p>Enter the new address and your password. We send a 6-digit code to the new address.</p>
                  <div className="field">
                    <label htmlFor="newEmail" className="field__label">New email</label>
                    <input id="newEmail" type="email" autoComplete="email" className="field__input" value={emailData.newEmail} onChange={(e) => setEmailData(prev => ({ ...prev, newEmail: e.target.value }))} required disabled={isChangingEmail} />
                  </div>
                  <PasswordField id="emailPassword" label="Your password" autoComplete="current-password" value={emailData.password} onChange={(e) => setEmailData(prev => ({ ...prev, password: e.target.value }))} disabled={isChangingEmail} />
                  <div className="dash-sec__actions">
                    <button
                      type="button"
                      onClick={() => {
                        setShowEmailChange(false);
                        setEmailData({ newEmail: '', password: '', verificationCode: '' });
                        setEmailMessage('');
                      }}
                      disabled={isChangingEmail}
                      className="btn btn--line"
                    >
                      <span className="btn__fill" aria-hidden="true" />
                      <span className="btn__label">Cancel</span>
                    </button>
                    <button type="submit" disabled={isChangingEmail} aria-busy={isChangingEmail} className="btn btn--solid">
                      <span className="btn__fill" aria-hidden="true" />
                      <span className="btn__label">{isChangingEmail ? 'Sending the code…' : 'Send the code'}</span>
                    </button>
                  </div>
                </form>
              )}

              {showVerificationInput && (
                <form onSubmit={handleEmailVerification} className="form dash-narrow" style={{ marginTop: '1.25rem' }}>
                  <p className="field__hint mono">Step 2 of 2</p>
                  <p>We sent a 6-digit code to <strong>{pendingEmail}</strong>. It expires in 30 minutes; check spam if it is not there.</p>
                  <div className="field">
                    <label htmlFor="emailCode" className="field__label">6-digit code</label>
                    <input
                      id="emailCode"
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      className="field__input field__input--code"
                      value={emailData.verificationCode}
                      onChange={(e) => setEmailData(prev => ({ ...prev, verificationCode: e.target.value.replace(/\D/g, '').slice(0, 6) }))}
                      placeholder="______"
                      required
                      maxLength={6}
                      pattern="[0-9]{6}"
                      disabled={isChangingEmail}
                    />
                  </div>
                  <div className="dash-sec__actions">
                    <button
                      type="button"
                      onClick={() => {
                        setShowVerificationInput(false);
                        setShowEmailChange(false);
                        setPendingEmail('');
                        setEmailData({ newEmail: '', password: '', verificationCode: '' });
                        setEmailMessage('');
                      }}
                      disabled={isChangingEmail}
                      className="btn btn--line"
                    >
                      <span className="btn__fill" aria-hidden="true" />
                      <span className="btn__label">Cancel</span>
                    </button>
                    <button type="submit" disabled={isChangingEmail || emailData.verificationCode.length !== 6} aria-busy={isChangingEmail} className="btn btn--solid">
                      <span className="btn__fill" aria-hidden="true" />
                      <span className="btn__label">{isChangingEmail ? 'Verifying…' : 'Verify and update'}</span>
                    </button>
                  </div>
                  <button
                    type="button"
                    className="text-link"
                    style={{ justifySelf: 'start', fontSize: 'var(--t-s)' }}
                    onClick={() => {
                      setShowVerificationInput(false);
                      setShowEmailChange(true);
                      setEmailMessage('');
                    }}
                    disabled={isChangingEmail}
                  >
                    No code? Send it again
                  </button>
                </form>
              )}
            </div>

            <div className="dash-sec">
              <div className="dash-sec__head">
                <h2 className="dash-sec__title">Signed-in devices</h2>
                <button type="button" onClick={handleViewSessions} className="btn btn--line btn--sm">
                  <span className="btn__fill" aria-hidden="true" />
                  <span className="btn__label">{showSessions ? 'Refresh' : 'Show devices'}</span>
                </button>
              </div>
              {showSessions && (
                isLoadingSessions ? (
                  <p className="field__hint" aria-busy="true">Loading sessions…</p>
                ) : sessions.length === 0 ? (
                  <p className="field__hint">No active sessions found.</p>
                ) : (
                  <ul className="orders-list">
                    {sessions.map((session, index) => (
                      <li key={index} className="orders-list__row">
                        <span className="orders-list__id">{session.device}</span>
                        <span className="orders-list__meta">{session.browser} · IP {session.ipAddress} · Last active {new Date(session.lastActive).toLocaleString()}</span>
                        <span />
                        <button type="button" className="text-link" style={{ fontSize: 'var(--t-s)' }} onClick={() => handleRemoveSession(session.token)}>Sign out device</button>
                      </li>
                    ))}
                  </ul>
                )
              )}
            </div>

            <div className="dash-sec danger">
              <div className="dash-sec__head">
                <div>
                  <h2 className="dash-sec__title">Delete account</h2>
                  <p className="field__hint">Permanently removes your account and data. Order history is anonymized for business records.</p>
                </div>
                <button type="button" onClick={() => setShowDeleteAccount(!showDeleteAccount)} aria-expanded={showDeleteAccount} aria-controls="delete-form" className="btn btn--line btn--sm danger__btn">
                  <span className="btn__fill" aria-hidden="true" />
                  <span className="btn__label">{showDeleteAccount ? 'Keep my account' : 'Delete account'}</span>
                </button>
              </div>
              {showDeleteAccount && (
                <form id="delete-form" onSubmit={handleDeleteAccount} className="form dash-narrow">
                  <div className="alert alert--error">
                    <p className="alert__title">This cannot be undone</p>
                    <p className="alert__text">All your account data, orders and preferences are deleted.</p>
                  </div>
                  {deleteMessage && (
                    <div className={`alert ${isGood(deleteMessage) ? 'alert--ok' : 'alert--error'}`} role={isGood(deleteMessage) ? 'status' : 'alert'}>
                      <p className="alert__text" style={{ color: 'var(--c-fg)' }}>{deleteMessage}</p>
                    </div>
                  )}
                  <div className="field">
                    <label htmlFor="deleteConfirm" className="field__label">Type DELETE to confirm</label>
                    <input id="deleteConfirm" type="text" className="field__input mono" value={deleteConfirmation} onChange={(e) => setDeleteConfirmation(e.target.value)} required disabled={isDeletingAccount} autoComplete="off" />
                  </div>
                  <PasswordField id="deletePassword" label="Your password" autoComplete="current-password" value={deletePassword} onChange={(e) => setDeletePassword(e.target.value)} disabled={isDeletingAccount} />
                  <div>
                    <button type="submit" disabled={isDeletingAccount || deleteConfirmation !== 'DELETE'} aria-busy={isDeletingAccount} className="btn btn--solid danger__submit">
                      <span className="btn__fill" aria-hidden="true" />
                      <span className="btn__label">{isDeletingAccount ? 'Deleting…' : 'Delete my account permanently'}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </section>
        )}

        {activeTab === 'preferences' && (
          <section id="panel-preferences" role="tabpanel" aria-labelledby="tab-preferences" className="dash-panel">
            <div className="dash-sec">
              <div className="dash-sec__head">
                <h2 className="dash-sec__title">Notifications</h2>
                {editActions}
              </div>
              {saveMessage && (
                <div className={`alert ${isGood(saveMessage) ? 'alert--ok' : 'alert--error'}`} role={isGood(saveMessage) ? 'status' : 'alert'}>
                  <p className="alert__text" style={{ color: 'var(--c-fg)' }}>{saveMessage}</p>
                </div>
              )}
              <ul className="prefs">
                {[
                  { key: 'emailNotifications', label: 'Email notifications', description: 'Order updates and news by email' },
                  { key: 'smsNotifications', label: 'Text messages', description: 'Order updates by SMS' },
                  { key: 'marketingEmails', label: 'Offers and sales', description: 'Promotional emails' }
                ].map((item) => (
                  <li key={item.key} className="prefs__row">
                    <label className="switch">
                      <span className="switch__text">
                        <span className="switch__label">{item.label}</span>
                        <span className="field__hint">{item.description}</span>
                      </span>
                      <input
                        type="checkbox"
                        role="switch"
                        checked={Boolean(isEditing ? editData.preferences[item.key as keyof typeof editData.preferences] : user.preferences?.[item.key as keyof typeof user.preferences])}
                        onChange={(e) => isEditing && handleInputChange(`preferences.${item.key}`, e.target.checked)}
                        disabled={!isEditing}
                      />
                      <span className="switch__track" aria-hidden="true" />
                    </label>
                  </li>
                ))}
              </ul>
              {!isEditing && <p className="field__hint" style={{ marginTop: '0.75rem' }}>Choose Edit to change these.</p>}
            </div>

            <div className="dash-sec">
              <div className="dash-sec__head"><h2 className="dash-sec__title">Display</h2></div>
              <div className="form__row form__row--3">
                {kv('pref-currency', 'Currency', user.preferences?.currency || 'USD',
                  <select id="pref-currency" className="field__input" value={editData.preferences.currency} onChange={(e) => handleInputChange('preferences.currency', e.target.value)}>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="CAD">CAD ($)</option>
                  </select>)}
                {kv('pref-language', 'Language', ({ en: 'English', es: 'Español', fr: 'Français', de: 'Deutsch' } as Record<string, string>)[user.preferences?.language || 'en'] || user.preferences?.language,
                  <select id="pref-language" className="field__input" value={editData.preferences.language} onChange={(e) => handleInputChange('preferences.language', e.target.value)}>
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                    <option value="de">Deutsch</option>
                  </select>)}
                {kv('pref-theme', 'Theme', ({ light: 'Light', dark: 'Dark', system: 'System' } as Record<string, string>)[user.preferences?.theme || 'system'],
                  <select id="pref-theme" className="field__input" value={editData.preferences.theme} onChange={(e) => handleInputChange('preferences.theme', e.target.value)}>
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="system">System</option>
                  </select>)}
              </div>
              {isEditing && <div style={{ marginTop: '1.5rem' }}>{editActions}</div>}
            </div>
          </section>
        )}
      </div>
    </>
  );
}

export default function AccountPage() {
  return (
    <AuthGuard requireAuth={true}>
      <AccountPageContent />
    </AuthGuard>
  );
}
