// src/components/ui/Footer.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription here
    setIsSubscribed(true);
    setEmail('');
    setTimeout(() => setIsSubscribed(false), 3000);
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="footer-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <circle cx="30" cy="30" r="1.5" fill="currentColor" opacity="0.3" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#footer-pattern)" />
        </svg>
      </div>

      <div className="relative">
        {/* Main Footer Content */}
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            
            {/* Company Info */}
            <div className="lg:col-span-1">
              <Link href="/" className="flex items-center space-x-3 mb-6 group">
                <div className="relative w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-1.5 shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <div className="w-full h-full bg-white rounded-lg flex items-center justify-center">
                    <Image
                      src="/nextgens-logo.png"
                      alt="Quantum Gameware Logo"
                      fill
                      className="object-contain p-1"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                </div>
                <div>
                  <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Quantum
                  </span>
                  <div className="text-sm text-gray-300 -mt-1">Gameware</div>
                </div>
              </Link>
              <p className="text-gray-300 leading-relaxed mb-6">
                Premium gaming accessories designed for competitive gamers who demand excellence. Level up your performance with our cutting-edge gear.
              </p>
              
              {/* Social Links */}
              <div className="flex space-x-4">
                {[
                  { name: 'Twitter', icon: '𝕏', href: '#' },
                  { name: 'Discord', icon: '💬', href: '#' },
                  { name: 'YouTube', icon: '📺', href: '#' },
                  { name: 'Twitch', icon: '🎮', href: '#' }
                ].map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    className="w-10 h-10 bg-gray-800/50 hover:bg-gradient-to-r hover:from-blue-500/20 hover:to-purple-500/20 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg group"
                    aria-label={social.name}
                  >
                    <span className="text-lg group-hover:scale-110 transition-transform duration-300">
                      {social.icon}
                    </span>
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="lg:col-span-1">
              <h4 className="text-lg font-semibold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Quick Links
              </h4>
              <ul className="space-y-3">
                {[
                  { label: 'Home', href: '/' },
                  { label: 'All Products', href: '/products' },
                  { label: 'Categories', href: '/categories' },
                  { label: 'Featured Products', href: '/#featured' },
                  { label: 'New Arrivals', href: '/products?filter=new' },
                  { label: 'Sale Items', href: '/products?filter=sale' }
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-gray-300 hover:text-white transition-all duration-300 hover:translate-x-1 flex items-center group"
                    >
                      <span className="w-1 h-1 bg-blue-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div className="lg:col-span-1">
              <h4 className="text-lg font-semibold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Support
              </h4>
              <ul className="space-y-3">
                {[
                  { label: 'Help Center', href: '/help' },
                  { label: 'Contact Us', href: '/contact' },
                  { label: 'Shipping Info', href: '/shipping' },
                  { label: 'Returns', href: '/returns' },
                  { label: 'Warranty', href: '/warranty' },
                  { label: 'FAQ', href: '/faq' }
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-gray-300 hover:text-white transition-all duration-300 hover:translate-x-1 flex items-center group"
                    >
                      <span className="w-1 h-1 bg-purple-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter & Contact */}
            <div className="lg:col-span-1">
              <h4 className="text-lg font-semibold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Stay Connected
              </h4>
              
              {/* Newsletter Signup */}
              <div className="mb-6">
                <p className="text-gray-300 text-sm mb-4">
                  Get the latest gaming gear updates and exclusive offers.
                </p>
                <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-white placeholder-gray-400"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubscribed}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-3 rounded-lg font-medium transition-all duration-300 hover:shadow-lg hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubscribed ? '✓ Subscribed!' : 'Subscribe'}
                  </button>
                </form>
              </div>

              {/* Contact Info */}
              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-3 text-gray-300">
                  <span className="text-blue-400">📧</span>
                  <a href="mailto:info@quantumgameware.com" className="hover:text-white transition-colors">
                    info@quantumgameware.com
                  </a>
                </div>
                <div className="flex items-center space-x-3 text-gray-300">
                  <span className="text-purple-400">📞</span>
                  <a href="tel:+11234567890" className="hover:text-white transition-colors">
                    (123) 456-7890
                  </a>
                </div>
                <div className="flex items-start space-x-3 text-gray-300">
                  <span className="text-blue-400 mt-0.5">📍</span>
                  <address className="not-italic">
                    123 Gaming Street<br />
                    Tech City, TC 12345
                  </address>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800/50 bg-gray-900/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 text-sm text-gray-400">
                <p>&copy; {currentYear} Quantum Gameware. All rights reserved.</p>
                <div className="flex space-x-4">
                  <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                  <span className="text-gray-600">•</span>
                  <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                  <span className="text-gray-600">•</span>
                  <Link href="/cookies" className="hover:text-white transition-colors">Cookie Policy</Link>
                </div>
              </div>
              
              {/* Payment Methods */}
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-400 mr-2">We accept:</span>
                <div className="flex space-x-2">
                  {['💳', '🏦', '💰', '📱'].map((payment, index) => (
                    <div
                      key={index}
                      className="w-8 h-6 bg-gray-800 rounded flex items-center justify-center text-xs opacity-70 hover:opacity-100 transition-opacity"
                    >
                      {payment}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}