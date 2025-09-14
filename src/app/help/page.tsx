// src/app/help/page.tsx
'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const categories = [
    {
      icon: '📦',
      title: 'Orders & Shipping',
      description: 'Track orders, shipping info, delivery updates',
      articles: ['Order Status', 'Shipping Times', 'Tracking Package', 'Delivery Options']
    },
    {
      icon: '↩️',
      title: 'Returns & Exchanges',
      description: 'Return policy, exchange process, refunds',
      articles: ['Return Policy', 'Start a Return', 'Exchange Items', 'Refund Status']
    },
    {
      icon: '🔧',
      title: 'Product Support',
      description: 'Setup guides, troubleshooting, warranties',
      articles: ['Setup Guides', 'Troubleshooting', 'Warranty Info', 'Driver Downloads']
    },
    {
      icon: '👤',
      title: 'Account & Billing',
      description: 'Account settings, payment methods, billing',
      articles: ['Create Account', 'Payment Options', 'Update Info', 'Order History']
    },
    {
      icon: '🎮',
      title: 'Gaming Guides',
      description: 'Product recommendations, gaming tips',
      articles: ['Product Comparisons', 'Gaming Setups', 'Compatibility', 'Performance Tips']
    },
    {
      icon: '🛡️',
      title: 'Security & Privacy',
      description: 'Privacy policy, data security, account safety',
      articles: ['Privacy Policy', 'Data Security', 'Account Safety', 'Cookie Policy']
    }
  ];

  const faqs = [
    {
      question: "How can I track my order?",
      answer: "Once your order ships, you'll receive a tracking number via email. You can also track your order by logging into your account and viewing your order history."
    },
    {
      question: "What is your return policy?",
      answer: "We offer a 30-day return policy for most items. Items must be in original condition with all packaging. Digital downloads and customized items cannot be returned."
    },
    {
      question: "Do you offer international shipping?",
      answer: "Yes! We ship to over 200 countries worldwide. International shipping is free, but delivery times may vary from 7-14 business days depending on your location."
    },
    {
      question: "How do I set up my gaming headset?",
      answer: "Most gaming headsets are plug-and-play. Connect via USB or 3.5mm jack, install any required drivers from our support page, and configure audio settings in your system preferences."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, Apple Pay, Google Pay, and Shop Pay for your convenience."
    },
    {
      question: "How do I contact customer support?",
      answer: "You can reach us via live chat (available 24/7), email at support@quantumgameware.com, or phone at (123) 456-7890 during business hours."
    }
  ];

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background with gradient and pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Cpath d='m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-white/80 mb-8">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-white font-medium">Help Center</span>
          </nav>

          {/* Header */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 overflow-hidden mb-8">
            <div className="p-8 lg:p-12 text-center text-white">
              <h1 className="text-4xl lg:text-5xl font-bold mb-4">
                How Can We Help?
              </h1>
              <p className="text-xl text-white/80 max-w-3xl mx-auto mb-8">
                Find answers to common questions, browse help articles, or get in touch with our support team.
              </p>

              {/* Search Bar */}
              <div className="max-w-2xl mx-auto">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for help articles, guides, or FAQs..."
                    className="w-full px-6 py-4 pl-14 bg-white/10 border border-white/30 rounded-2xl text-white placeholder-white/60 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                  />
                  <svg className="absolute left-5 top-1/2 transform -translate-y-1/2 w-6 h-6 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Help Categories */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Browse by Category</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category, index) => (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 p-6 hover:bg-white/15 hover:border-white/30 transition-all duration-300 hover:scale-105 cursor-pointer group"
                >
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {category.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{category.title}</h3>
                  <p className="text-white/80 mb-4 text-sm">{category.description}</p>
                  <div className="space-y-2">
                    {category.articles.map((article, articleIndex) => (
                      <div key={articleIndex} className="flex items-center text-white/70 hover:text-white transition-colors">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        <span className="text-sm">{article}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 p-8 mb-12">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Frequently Asked Questions</h2>
            
            <div className="space-y-4">
              {filteredFaqs.map((faq, index) => (
                <div key={index} className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                    className="w-full p-6 text-left flex items-center justify-between hover:bg-white/10 transition-colors"
                  >
                    <h3 className="font-semibold text-white text-lg">{faq.question}</h3>
                    <svg
                      className={`w-6 h-6 text-white/70 transition-transform duration-300 ${
                        expandedFaq === index ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {expandedFaq === index && (
                    <div className="px-6 pb-6">
                      <p className="text-white/80 leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {filteredFaqs.length === 0 && searchQuery && (
              <div className="text-center py-8">
                <div className="text-white/60 mb-4">No results found for "{searchQuery}"</div>
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-blue-300 hover:text-blue-200 font-medium"
                >
                  Clear search and show all FAQs
                </button>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-lg rounded-3xl border border-blue-400/30 p-6 text-center">
              <div className="w-16 h-16 bg-blue-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Track Your Order</h3>
              <p className="text-blue-200 text-sm mb-4">Check the status of your recent purchases</p>
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-xl transition-colors">
                Track Order
              </button>
            </div>

            <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-lg rounded-3xl border border-green-400/30 p-6 text-center">
              <div className="w-16 h-16 bg-green-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Start a Return</h3>
              <p className="text-green-200 text-sm mb-4">Easy returns within 30 days</p>
              <Link
                href="/returns"
                className="inline-block bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-xl transition-colors"
              >
                Return Item
              </Link>
            </div>

            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-lg rounded-3xl border border-purple-400/30 p-6 text-center">
              <div className="w-16 h-16 bg-purple-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Live Chat</h3>
              <p className="text-purple-200 text-sm mb-4">Get instant help from our team</p>
              <button className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-xl transition-colors">
                Start Chat
              </button>
            </div>
          </div>

          {/* Popular Articles */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 p-8 mb-12">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Popular Help Articles</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: "How to Set Up Your Gaming Keyboard",
                  category: "Product Setup",
                  readTime: "3 min read",
                  icon: "⌨️"
                },
                {
                  title: "Choosing the Right Gaming Mouse",
                  category: "Buying Guide",
                  readTime: "5 min read",
                  icon: "🖱️"
                },
                {
                  title: "Troubleshooting Audio Issues",
                  category: "Troubleshooting",
                  readTime: "4 min read",
                  icon: "🔧"
                },
                {
                  title: "Understanding Our Warranty Policy",
                  category: "Warranty",
                  readTime: "2 min read",
                  icon: "🛡️"
                },
                {
                  title: "Gaming Setup Optimization Tips",
                  category: "Gaming Guides",
                  readTime: "8 min read",
                  icon: "🎮"
                },
                {
                  title: "How to Update Product Drivers",
                  category: "Technical Support",
                  readTime: "3 min read",
                  icon: "💾"
                }
              ].map((article, index) => (
                <div
                  key={index}
                  className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-300 cursor-pointer group"
                >
                  <div className="flex items-start">
                    <div className="text-2xl mr-4 group-hover:scale-110 transition-transform duration-300">
                      {article.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-white mb-2 group-hover:text-blue-300 transition-colors">
                        {article.title}
                      </h3>
                      <div className="flex items-center justify-between text-white/60 text-sm">
                        <span>{article.category}</span>
                        <span>{article.readTime}</span>
                      </div>
                    </div>
                    <svg className="w-5 h-5 text-white/40 group-hover:text-white/70 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Support */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Still Need Help?</h2>
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
              Can't find what you're looking for? Our support team is available 24/7 to help you with any questions or issues.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
                <div className="w-12 h-12 bg-white/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="font-semibold mb-2">Live Chat</h3>
                <p className="text-blue-100 text-sm mb-4">Average response: 30 seconds</p>
                <button className="bg-white text-blue-600 hover:bg-gray-100 px-4 py-2 rounded-lg transition-colors font-medium">
                  Start Chat
                </button>
              </div>

              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
                <div className="w-12 h-12 bg-white/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="font-semibold mb-2">Email Support</h3>
                <p className="text-blue-100 text-sm mb-4">Response within 24 hours</p>
                <a
                  href="mailto:support@quantumgameware.com"
                  className="bg-white text-blue-600 hover:bg-gray-100 px-4 py-2 rounded-lg transition-colors font-medium inline-block"
                >
                  Send Email
                </a>
              </div>

              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
                <div className="w-12 h-12 bg-white/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <h3 className="font-semibold mb-2">Phone Support</h3>
                <p className="text-blue-100 text-sm mb-4">Mon-Fri 9AM-6PM EST</p>
                <a
                  href="tel:+11234567890"
                  className="bg-white text-blue-600 hover:bg-gray-100 px-4 py-2 rounded-lg transition-colors font-medium inline-block"
                >
                  Call Now
                </a>
              </div>
            </div>

            <Link
              href="/contact"
              className="inline-flex items-center bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
            >
              <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
              </svg>
              Visit Full Contact Page
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}