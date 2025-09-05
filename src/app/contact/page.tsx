// src/app/contact/page.tsx
'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
    
    // Reset success message after 5 seconds
    setTimeout(() => setIsSubmitted(false), 5000);
  };

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-white/80 mb-8">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-white font-medium">Contact</span>
          </nav>

          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Get in Touch
            </h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Have questions about our products or need support? We're here to help! 
              Reach out to our team and we'll get back to you as soon as possible.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Information */}
            <div className="lg:col-span-1">
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 p-8 sticky top-32">
                <h2 className="text-2xl font-bold text-white mb-8">Contact Information</h2>
                
                <div className="space-y-8">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-500/20 border border-blue-400/30 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-1">Email</h3>
                      <a href="mailto:info@quantumgameware.com" className="text-white/80 hover:text-blue-300 transition-colors">
                        info@quantumgameware.com
                      </a>
                      <p className="text-sm text-white/60 mt-1">We reply within 24 hours</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-purple-500/20 border border-purple-400/30 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-1">Phone</h3>
                      <a href="tel:+11234567890" className="text-white/80 hover:text-purple-300 transition-colors">
                        +1 (123) 456-7890
                      </a>
                      <p className="text-sm text-white/60 mt-1">Mon-Fri 9AM-6PM EST</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-indigo-500/20 border border-indigo-400/30 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-1">Address</h3>
                      <address className="text-white/80 not-italic">
                        123 Gaming Street<br />
                        Tech City, TC 12345<br />
                        United States
                      </address>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-green-500/20 border border-green-400/30 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-1">Live Chat</h3>
                      <p className="text-white/80">Available 24/7 for instant support</p>
                      <button className="text-sm text-green-300 hover:text-green-200 font-medium mt-1">
                        Start Chat →
                      </button>
                    </div>
                  </div>
                </div>

                {/* Social Links */}
                <div className="mt-10 pt-8 border-t border-white/20">
                  <h3 className="font-semibold text-white mb-4">Follow Us</h3>
                  <div className="flex space-x-3">
                    {[
                      { name: 'Twitter', icon: '𝕏', color: 'bg-white/10 hover:bg-white/20' },
                      { name: 'Discord', icon: '💬', color: 'bg-indigo-500/20 hover:bg-indigo-500/30' },
                      { name: 'YouTube', icon: '📺', color: 'bg-red-500/20 hover:bg-red-500/30' },
                      { name: 'Twitch', icon: '🎮', color: 'bg-purple-500/20 hover:bg-purple-500/30' }
                    ].map((social) => (
                      <a
                        key={social.name}
                        href="#"
                        className={`w-10 h-10 ${social.color} border border-white/30 rounded-xl flex items-center justify-center transition-colors group`}
                        aria-label={social.name}
                      >
                        <span className="text-lg group-hover:scale-110 transition-transform duration-300">
                          {social.icon}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 p-8 lg:p-12">
                <h2 className="text-2xl font-bold text-white mb-8">Send us a Message</h2>
                
                {isSubmitted && (
                  <div className="bg-green-500/20 border border-green-400/30 rounded-2xl p-6 mb-8">
                    <div className="flex items-center">
                      <svg className="w-6 h-6 text-green-300 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <h3 className="font-semibold text-green-200">Message Sent Successfully!</h3>
                        <p className="text-green-300 text-sm mt-1">We'll get back to you within 24 hours.</p>
                      </div>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-white mb-3">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-4 border border-white/30 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white/10 backdrop-blur-sm text-white placeholder-white/60"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-white mb-3">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-4 border border-white/30 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white/10 backdrop-blur-sm text-white placeholder-white/60"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-white mb-3">
                      Subject *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-4 border border-white/30 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white/10 backdrop-blur-sm text-white"
                    >
                      <option value="" className="bg-gray-800 text-white">Select a subject</option>
                      <option value="product-inquiry" className="bg-gray-800 text-white">Product Inquiry</option>
                      <option value="technical-support" className="bg-gray-800 text-white">Technical Support</option>
                      <option value="order-status" className="bg-gray-800 text-white">Order Status</option>
                      <option value="returns-exchanges" className="bg-gray-800 text-white">Returns & Exchanges</option>
                      <option value="partnership" className="bg-gray-800 text-white">Partnership Opportunity</option>
                      <option value="feedback" className="bg-gray-800 text-white">Feedback</option>
                      <option value="other" className="bg-gray-800 text-white">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-white mb-3">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-4 border border-white/30 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none bg-white/10 backdrop-blur-sm text-white placeholder-white/60"
                      placeholder="Tell us how we can help you..."
                    />
                  </div>

                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id="newsletter"
                      className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-white/30 rounded bg-white/10"
                    />
                    <label htmlFor="newsletter" className="text-sm text-white/80">
                      I'd like to receive updates about new products and exclusive offers via email.
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`
                      w-full px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 active:scale-95
                      ${isSubmitting 
                        ? 'bg-gray-600 text-white cursor-not-allowed' 
                        : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl'
                      }
                    `}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending Message...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                        Send Message
                      </div>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-white/80 max-w-3xl mx-auto">
                Find quick answers to common questions. Can't find what you're looking for? Contact us directly.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  question: "What's your return policy?",
                  answer: "We offer a 30-day money-back guarantee on all products. Items must be in original condition with all accessories included."
                },
                {
                  question: "Do you offer international shipping?",
                  answer: "Yes! We ship worldwide with free shipping on orders over $50. International delivery typically takes 7-14 business days."
                },
                {
                  question: "How can I track my order?",
                  answer: "Once your order ships, you'll receive a tracking number via email. You can also check your order status in your account dashboard."
                },
                {
                  question: "Do you offer warranty on products?",
                  answer: "All our products come with a minimum 1-year manufacturer warranty. Premium products may include extended warranty options."
                },
                {
                  question: "Can I change or cancel my order?",
                  answer: "Orders can be modified or cancelled within 2 hours of placement. After that, please contact our support team for assistance."
                },
                {
                  question: "Do you offer bulk/corporate discounts?",
                  answer: "Yes! We offer special pricing for bulk orders and corporate partnerships. Contact our sales team for custom quotes."
                }
              ].map((faq, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:border-white/30 hover:bg-white/15 transition-all duration-300">
                  <h3 className="font-semibold text-white mb-3 text-lg">{faq.question}</h3>
                  <p className="text-white/80 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link
                href="/faq"
                className="inline-flex items-center text-blue-300 hover:text-blue-200 font-medium transition-colors"
              >
                View All FAQs
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Support Options */}
          <div className="mt-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 lg:p-12 text-white">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                Need Immediate Help?
              </h2>
              <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                Choose the support option that works best for you. Our team is here to help 24/7.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20 hover:bg-white/20 transition-colors">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">Live Chat</h3>
                <p className="text-blue-100 mb-4">Get instant answers from our support team</p>
                <button className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 rounded-xl font-semibold transition-colors">
                  Start Chat
                </button>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20 hover:bg-white/20 transition-colors">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">Phone Support</h3>
                <p className="text-blue-100 mb-4">Speak directly with our experts</p>
                <a 
                  href="tel:+11234567890"
                  className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 rounded-xl font-semibold transition-colors inline-block"
                >
                  Call Now
                </a>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20 hover:bg-white/20 transition-colors">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">Help Center</h3>
                <p className="text-blue-100 mb-4">Browse guides and tutorials</p>
                <Link 
                  href="/help"
                  className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 rounded-xl font-semibold transition-colors inline-block"
                >
                  Visit Help Center
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}