// src/app/membership/page.tsx - Membership Tiers & Rewards Program
'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';

export default function MembershipPage() {
  const router = useRouter();
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };
  const tiers = [
    {
      name: 'Bronze',
      color: 'from-orange-600 to-amber-700',
      iconBg: 'bg-orange-500/20',
      iconColor: 'text-orange-400',
      requirement: 'Join for free',
      benefits: [
        'Earn 1 point per $1 spent',
        'Birthday rewards',
        'Exclusive member-only sales',
        'Early access to new products'
      ]
    },
    {
      name: 'Silver',
      color: 'from-gray-400 to-gray-600',
      iconBg: 'bg-gray-400/20',
      iconColor: 'text-gray-300',
      requirement: 'Spend $500+ per year',
      benefits: [
        'All Bronze benefits',
        'Earn 1.5 points per $1 spent',
        'Free standard shipping',
        'Priority customer support',
        '5% discount on all purchases'
      ]
    },
    {
      name: 'Gold',
      color: 'from-yellow-400 to-yellow-600',
      iconBg: 'bg-yellow-500/20',
      iconColor: 'text-yellow-400',
      requirement: 'Spend $1,500+ per year',
      benefits: [
        'All Silver benefits',
        'Earn 2 points per $1 spent',
        'Free express shipping',
        'Dedicated VIP support',
        '10% discount on all purchases',
        'Exclusive Gold member gifts'
      ]
    },
    {
      name: 'Platinum',
      color: 'from-purple-400 to-indigo-600',
      iconBg: 'bg-purple-500/20',
      iconColor: 'text-purple-300',
      requirement: 'Spend $3,000+ per year',
      benefits: [
        'All Gold benefits',
        'Earn 3 points per $1 spent',
        'Free overnight shipping',
        'Personal gaming consultant',
        '15% discount on all purchases',
        'Exclusive Platinum events & previews',
        'Personalized product recommendations'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <Header />

      {/* Account Navigation - Mobile/Tablet Only */}
      <div className="lg:hidden sticky top-16 z-40 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 pt-6 pb-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
              <Link
                href="/account"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 text-white hover:bg-white/20 border border-white/20 transition-all duration-300 whitespace-nowrap font-medium text-sm"
              >
                <span className="text-base">📊</span>
                <span>Overview</span>
              </Link>
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
                href="/membership"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-blue-600 shadow-lg scale-105 transition-all duration-300 whitespace-nowrap font-medium text-sm"
              >
                <span className="text-base">⭐</span>
                <span>Membership</span>
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

      <main className="pb-16 pt-20 lg:pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Membership Rewards Program
            </h1>
            <p className="text-white/80 text-lg max-w-3xl mx-auto">
              Join our exclusive rewards program and enjoy incredible benefits as you level up through our membership tiers. The more you shop, the more you save!
            </p>
          </div>

          {/* How It Works Section */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-8 mb-12">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">1. Shop & Earn</h3>
                <p className="text-white/70">
                  Earn points on every purchase. Higher tiers earn more points per dollar spent.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">2. Redeem Rewards</h3>
                <p className="text-white/70">
                  Use your points for discounts. 100 points = $5 off your next order.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">3. Level Up</h3>
                <p className="text-white/70">
                  Increase your annual spending to unlock higher tiers with better benefits.
                </p>
              </div>
            </div>
          </div>

          {/* Membership Tiers */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {tiers.map((tier, index) => (
              <div
                key={tier.name}
                className={`bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6 hover:scale-105 transition-transform duration-300 ${
                  index === 3 ? 'md:col-span-2 lg:col-span-1' : ''
                }`}
              >
                <div className={`w-16 h-16 ${tier.iconBg} rounded-xl flex items-center justify-center mb-4`}>
                  <svg className={`w-8 h-8 ${tier.iconColor}`} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </div>
                <h3 className={`text-2xl font-bold mb-2 bg-gradient-to-r ${tier.color} bg-clip-text text-transparent`}>
                  {tier.name}
                </h3>
                <p className="text-white/70 text-sm mb-4">{tier.requirement}</p>
                <ul className="space-y-2">
                  {tier.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-white/80 text-sm">
                      <span className="text-green-400 font-bold mt-0.5">✓</span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Points System */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-8 mb-12">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">Points & Rewards</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Earning Points</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                    <span className="text-white/80">Bronze Tier</span>
                    <span className="text-white font-semibold">1 point per $1</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                    <span className="text-white/80">Silver Tier</span>
                    <span className="text-white font-semibold">1.5 points per $1</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                    <span className="text-white/80">Gold Tier</span>
                    <span className="text-white font-semibold">2 points per $1</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                    <span className="text-white/80">Platinum Tier</span>
                    <span className="text-white font-semibold">3 points per $1</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Redeeming Points</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                    <span className="text-white/80">100 points</span>
                    <span className="text-green-400 font-semibold">$5 discount</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                    <span className="text-white/80">500 points</span>
                    <span className="text-green-400 font-semibold">$25 discount</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                    <span className="text-white/80">1,000 points</span>
                    <span className="text-green-400 font-semibold">$50 discount</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                    <span className="text-white/80">2,000 points</span>
                    <span className="text-green-400 font-semibold">$100 discount</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-500/10 rounded-xl border border-blue-500/30">
              <p className="text-blue-200 text-sm text-center">
                <strong>💡 Pro Tip:</strong> Points never expire! Save them up for bigger discounts or use them whenever you like.
              </p>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-8 mb-12">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <div className="p-4 bg-white/5 rounded-xl">
                <h3 className="text-white font-semibold mb-2">How do I join the rewards program?</h3>
                <p className="text-white/70 text-sm">
                  Simply create an account and you're automatically enrolled as a Bronze member! Start earning points with your first purchase.
                </p>
              </div>
              <div className="p-4 bg-white/5 rounded-xl">
                <h3 className="text-white font-semibold mb-2">How do I level up to higher tiers?</h3>
                <p className="text-white/70 text-sm">
                  Tiers are based on your annual spending (rolling 12 months). Once you reach the spending threshold, you'll automatically be upgraded to the next tier.
                </p>
              </div>
              <div className="p-4 bg-white/5 rounded-xl">
                <h3 className="text-white font-semibold mb-2">Do my points expire?</h3>
                <p className="text-white/70 text-sm">
                  No! Your points never expire as long as your account remains active. Save them for as long as you'd like.
                </p>
              </div>
              <div className="p-4 bg-white/5 rounded-xl">
                <h3 className="text-white font-semibold mb-2">Can I combine tier discounts with reward points?</h3>
                <p className="text-white/70 text-sm">
                  Yes! You can use your reward points along with your tier discount for maximum savings on your purchases.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Earning Rewards?</h2>
            <p className="text-white/70 mb-6">
              Join thousands of gamers already enjoying exclusive benefits and savings.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/signup"
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-colors font-semibold text-lg"
              >
                Sign Up Now
              </Link>
              <Link
                href="/account"
                className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl hover:bg-white/20 transition-colors font-semibold text-lg border border-white/20"
              >
                View My Account
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
