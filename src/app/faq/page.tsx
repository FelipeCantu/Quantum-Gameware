// src/app/faq/page.tsx
'use client';
import Link from 'next/link';
import { useState } from 'react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const faqData: FAQItem[] = [
  // Ordering & Payment
  {
    id: 'order-1',
    category: 'Ordering & Payment',
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, MasterCard, American Express, Discover), PayPal, Apple Pay, Google Pay, and Shop Pay. All payments are processed securely through encrypted channels.'
  },
  {
    id: 'order-2',
    category: 'Ordering & Payment',
    question: 'Can I modify or cancel my order after placing it?',
    answer: 'You can modify or cancel your order within 30 minutes of placing it by contacting our support team. After this window, orders enter processing and cannot be changed. However, you can always return items once received.'
  },
  {
    id: 'order-3',
    category: 'Ordering & Payment',
    question: 'Do you offer financing options?',
    answer: 'Yes! We partner with Affirm and Klarna to offer flexible payment plans. You can split your purchase into 4 interest-free payments or choose longer-term financing with competitive rates.'
  },
  {
    id: 'order-4',
    category: 'Ordering & Payment',
    question: 'Why was my payment declined?',
    answer: 'Payment declines can happen for various reasons: insufficient funds, billing address mismatch, or bank security measures. Try using a different payment method or contact your bank. Our support team can also help troubleshoot payment issues.'
  },

  // Shipping & Delivery
  {
    id: 'ship-1',
    category: 'Shipping & Delivery',
    question: 'How long does shipping take?',
    answer: 'Standard shipping takes 3-7 business days, expedited shipping takes 2-3 business days, and overnight shipping delivers the next business day. Processing time is typically 1-2 business days before shipment.'
  },
  {
    id: 'ship-2',
    category: 'Shipping & Delivery',
    question: 'Do you ship internationally?',
    answer: 'Currently, we ship to the United States, Canada, and select countries in Europe. International shipping times vary from 7-21 business days. Additional customs fees may apply and are the responsibility of the customer.'
  },
  {
    id: 'ship-3',
    category: 'Shipping & Delivery',
    question: 'Can I track my order?',
    answer: 'Absolutely! Once your order ships, you\'ll receive a tracking number via email. You can also track your order in real-time through your account dashboard or our order tracking page.'
  },
  {
    id: 'ship-4',
    category: 'Shipping & Delivery',
    question: 'What if my package is lost or damaged?',
    answer: 'We take full responsibility for packages until they reach you safely. If your package is lost or arrives damaged, contact us immediately with photos (for damage) and we\'ll send a replacement or issue a full refund.'
  },

  // Products & Compatibility
  {
    id: 'prod-1',
    category: 'Products & Compatibility',
    question: 'How do I know if a product is compatible with my setup?',
    answer: 'Each product page includes detailed compatibility information. You can also use our compatibility checker tool or contact our technical support team with your system specs for personalized recommendations.'
  },
  {
    id: 'prod-2',
    category: 'Products & Compatibility',
    question: 'Are your products authentic and new?',
    answer: 'Yes, all our products are 100% authentic and brand new unless specifically marked as refurbished or open-box. We\'re authorized retailers for all the brands we carry and every item comes with full manufacturer warranty.'
  },
  {
    id: 'prod-3',
    category: 'Products & Compatibility',
    question: 'Do you sell refurbished or used items?',
    answer: 'We occasionally offer manufacturer refurbished items that are clearly marked as such. These products have been tested and certified by the manufacturer and come with warranty coverage, though terms may vary from new items.'
  },
  {
    id: 'prod-4',
    category: 'Products & Compatibility',
    question: 'Can you recommend products for my budget?',
    answer: 'Absolutely! Our team loves helping customers find the perfect gear within their budget. Contact our support team with your budget and requirements, and we\'ll provide personalized recommendations.'
  },

  // Returns & Warranty
  {
    id: 'return-1',
    category: 'Returns & Warranty',
    question: 'What is your return policy?',
    answer: 'We offer a 30-day return window for most items in original condition. Gaming peripherals can be returned within 14 days if opened. Some items like custom PCs or special orders may have different return terms.'
  },
  {
    id: 'return-2',
    category: 'Returns & Warranty',
    question: 'How do I start a return?',
    answer: 'Log into your account and go to your order history, then click "Return Items" next to the relevant order. You can also contact our support team who will guide you through the process and provide a prepaid return label.'
  },
  {
    id: 'return-3',
    category: 'Returns & Warranty',
    question: 'Who pays for return shipping?',
    answer: 'We provide free return shipping for defective items, wrong items sent, or our error. For other returns like change of mind, customers are responsible for return shipping costs unless the order qualifies for free returns.'
  },
  {
    id: 'return-4',
    category: 'Returns & Warranty',
    question: 'How long do warranty claims take?',
    answer: 'Most warranty claims are processed within 3-5 business days. Simple replacements can be expedited, while repairs may take 1-2 weeks depending on the manufacturer. We keep you updated throughout the entire process.'
  },

  // Technical Support
  {
    id: 'tech-1',
    category: 'Technical Support',
    question: 'Do you provide technical support for products?',
    answer: 'Yes! Our technical support team can help with setup, troubleshooting, driver installation, and compatibility questions. We offer support via live chat, email, and phone during business hours.'
  },
  {
    id: 'tech-2',
    category: 'Technical Support',
    question: 'Can you help me build or upgrade my PC?',
    answer: 'Our experts can provide guidance on component selection, compatibility, and assembly tips. While we don\'t offer physical installation services, we can recommend trusted local technicians in your area.'
  },
  {
    id: 'tech-3',
    category: 'Technical Support',
    question: 'What if I need drivers or software?',
    answer: 'We maintain a comprehensive resource library with drivers, software, and setup guides for all products we sell. You can find these on individual product pages or in our support section.'
  },

  // Account & Security
  {
    id: 'account-1',
    category: 'Account & Security',
    question: 'Is it safe to create an account and shop with you?',
    answer: 'Absolutely! We use industry-standard SSL encryption, secure payment processing, and never store your payment information. Your personal data is protected according to our privacy policy and applicable laws.'
  },
  {
    id: 'account-2',
    category: 'Account & Security',
    question: 'I forgot my password. How do I reset it?',
    answer: 'Click "Forgot Password" on the login page and enter your email address. We\'ll send you a secure link to reset your password. If you don\'t receive the email, check your spam folder or contact support.'
  },
  {
    id: 'account-3',
    category: 'Account & Security',
    question: 'Can I change my email address or personal information?',
    answer: 'Yes, you can update your email, shipping address, and personal information in your account settings. For security reasons, some changes may require email verification or contacting our support team.'
  }
];

const categories = [...new Set(faqData.map(item => item.category))];

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');

  const toggleItem = (id: string) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id);
    } else {
      newOpenItems.add(id);
    }
    setOpenItems(newOpenItems);
  };

  const filteredFAQs = faqData.filter(item => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
            <span className="text-white font-medium">Frequently Asked Questions</span>
          </nav>

          {/* Header */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 overflow-hidden mb-8">
            <div className="p-8 lg:p-12 text-center text-white">
              <h1 className="text-4xl lg:text-5xl font-bold mb-4">
                Frequently Asked Questions
              </h1>
              <p className="text-xl text-white/80 max-w-3xl mx-auto mb-8">
                Find quick answers to common questions about orders, shipping, returns, and technical support.
              </p>
              
              {/* Search Bar */}
              <div className="max-w-md mx-auto relative">
                <input
                  type="text"
                  placeholder="Search FAQs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white/10 border border-white/30 rounded-2xl px-6 py-3 pl-12 text-white placeholder-white/60 focus:outline-none focus:border-white/50 focus:bg-white/20 transition-all"
                />
                <svg className="w-5 h-5 text-white/60 absolute left-4 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Category Filter */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 mb-8">
            <div className="flex flex-wrap gap-3 justify-center">
              <button
                onClick={() => setActiveCategory('All')}
                className={`px-6 py-2 rounded-xl font-medium transition-all ${
                  activeCategory === 'All'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white/10 text-white/80 hover:bg-white/20 hover:text-white'
                }`}
              >
                All Questions
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-6 py-2 rounded-xl font-medium transition-all ${
                    activeCategory === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-white/10 text-white/80 hover:bg-white/20 hover:text-white'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* FAQ Items */}
          <div className="space-y-4 mb-8">
            {filteredFAQs.map((item) => (
              <div key={item.id} className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden">
                <button
                  onClick={() => toggleItem(item.id)}
                  className="w-full p-6 text-left hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-blue-300 mb-1">{item.category}</div>
                      <h3 className="text-lg font-semibold text-white">{item.question}</h3>
                    </div>
                    <svg 
                      className={`w-6 h-6 text-white/60 transition-transform ${openItems.has(item.id) ? 'rotate-180' : ''}`}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>
                
                {openItems.has(item.id) && (
                  <div className="px-6 pb-6">
                    <div className="bg-white/5 rounded-xl p-4 border-l-4 border-blue-400">
                      <p className="text-white/90 leading-relaxed">{item.answer}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* No Results */}
          {filteredFAQs.length === 0 && (
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-12 text-center">
              <div className="w-16 h-16 bg-gray-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No questions found</h3>
              <p className="text-white/80">Try adjusting your search or category filter.</p>
            </div>
          )}

          {/* Still Need Help CTA */}
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-lg rounded-3xl border border-blue-400/30 p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">Still Have Questions?</h3>
            <p className="text-white/80 mb-6 max-w-2xl mx-auto">
              Can't find the answer you're looking for? Our support team is here to help with personalized assistance for your specific needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/support" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-2xl font-medium transition-colors inline-flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Contact Support
              </Link>
              <Link 
                href="/contact" 
                className="bg-white/10 hover:bg-white/20 text-white border border-white/30 px-8 py-3 rounded-2xl font-medium transition-colors inline-flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Send Message
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}