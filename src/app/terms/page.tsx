// src/app/terms/page.tsx
import Link from 'next/link';

export default function TermsPage() {
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-white/80 mb-8">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-white font-medium">Terms of Service</span>
          </nav>

          {/* Header */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 overflow-hidden mb-8">
            <div className="p-8 lg:p-12 text-center text-white">
              <h1 className="text-4xl lg:text-5xl font-bold mb-4">
                Terms of Service
              </h1>
              <p className="text-xl text-white/80 max-w-2xl mx-auto">
                Please read these terms carefully before using our services. By using our website, you agree to these terms.
              </p>
              <div className="mt-6 text-sm text-white/70">
                Last updated: November 3, 2025
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 p-8 lg:p-12">
            <div className="prose prose-lg prose-invert max-w-none">
              
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
                <div className="text-white/90 space-y-4">
                  <p>By accessing and using the Quantum Gameware website ("Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.</p>
                  <p>These Terms of Service ("Terms") govern your use of our website located at quantumgameware.com (the "Service") operated by Quantum Gameware ("us", "we", or "our").</p>
                </div>
              </section>

              <section className="mb-10">
                <h2 className="text-2xl font-bold text-white mb-4">2. Use License</h2>
                <div className="text-white/90 space-y-4">
                  <p>Permission is granted to temporarily download one copy of the materials on Quantum Gameware's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Modify or copy the materials</li>
                    <li>Use the materials for any commercial purpose or for any public display</li>
                    <li>Attempt to reverse engineer any software contained on the website</li>
                    <li>Remove any copyright or other proprietary notations from the materials</li>
                  </ul>
                  <p>This license shall automatically terminate if you violate any of these restrictions and may be terminated by us at any time.</p>
                </div>
              </section>

              <section className="mb-10">
                <h2 className="text-2xl font-bold text-white mb-4">3. User Accounts</h2>
                <div className="text-white/90 space-y-4">
                  <h3 className="text-xl font-semibold text-white">Account Creation</h3>
                  <p>To access certain features of our Service, you may be required to create an account. You agree to:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Provide accurate, current, and complete information</li>
                    <li>Maintain and promptly update your account information</li>
                    <li>Maintain the security of your password</li>
                    <li>Accept responsibility for all activities under your account</li>
                    <li>Notify us immediately of any unauthorized use</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-white mt-6">Account Termination</h3>
                  <p>We reserve the right to suspend or terminate your account if you violate these Terms or engage in conduct that we deem harmful to other users or our business.</p>
                </div>
              </section>

              <section className="mb-10">
                <h2 className="text-2xl font-bold text-white mb-4">4. Product Information and Pricing</h2>
                <div className="text-white/90 space-y-4">
                  <h3 className="text-xl font-semibold text-white">Product Descriptions</h3>
                  <p>We strive to provide accurate product descriptions and images. However, we do not warrant that product descriptions or other content is accurate, complete, reliable, current, or error-free.</p>

                  <h3 className="text-xl font-semibold text-white mt-4">Pricing</h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>All prices are subject to change without notice</li>
                    <li>Prices do not include applicable taxes and shipping costs</li>
                    <li>We reserve the right to correct pricing errors</li>
                    <li>Special offers and promotions are subject to specific terms</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-white mt-4">Availability</h3>
                  <p>Product availability is subject to change. We reserve the right to discontinue products or limit quantities without prior notice.</p>
                </div>
              </section>

              <section className="mb-10">
                <h2 className="text-2xl font-bold text-white mb-4">5. Orders and Payment</h2>
                <div className="text-white/90 space-y-4">
                  <h3 className="text-xl font-semibold text-white">Order Acceptance</h3>
                  <p>Your order constitutes an offer to purchase products. We reserve the right to accept or decline any order for any reason. Factors that may result in order cancellation include:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Product unavailability</li>
                    <li>Pricing errors</li>
                    <li>Payment processing issues</li>
                    <li>Suspected fraudulent activity</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-white mt-4">Payment Terms</h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Payment is due at the time of order</li>
                    <li>We accept major credit cards and PayPal</li>
                    <li>All payments are processed securely through third-party processors</li>
                    <li>You authorize us to charge your payment method for all purchases</li>
                  </ul>
                </div>
              </section>

              <section className="mb-10">
                <h2 className="text-2xl font-bold text-white mb-4">6. Shipping and Delivery</h2>
                <div className="text-white/90 space-y-4">
                  <h3 className="text-xl font-semibold text-white">Shipping Policy</h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>We ship to addresses within the United States and internationally to 200+ countries</li>
                    <li>Free standard shipping on all orders</li>
                    <li>Processing time: 1-3 business days (up to 5 days during peak periods)</li>
                    <li>Standard delivery: 5-15 business days (US), 10-25 business days (International)</li>
                    <li>Delivery times are estimates and not guaranteed</li>
                    <li>Tracking information provided once order ships</li>
                    <li>Risk of loss and title transfer to you upon delivery</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-white mt-4">International Shipping</h3>
                  <p>International customers are responsible for all customs duties, taxes, import fees, and clearance charges. These fees are not included in your order total and must be paid upon delivery. Delivery times may vary significantly due to customs processing, which is beyond our control.</p>

                  <h3 className="text-xl font-semibold text-white mt-4">Shipping Address</h3>
                  <p>You are responsible for providing accurate shipping information. We cannot be held responsible for orders shipped to incorrect addresses provided by the customer. Address changes after order placement may not be possible once processing has begun.</p>
                </div>
              </section>

              <section className="mb-10">
                <h2 className="text-2xl font-bold text-white mb-4">7. Returns and Refunds</h2>
                <div className="text-white/90 space-y-4">
                  <h3 className="text-xl font-semibold text-white">Return Policy</h3>
                  <p>We offer a 30-day return policy from the delivery date for most items. To be eligible for a return:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Items must be unused, unworn, and in original condition with all tags attached</li>
                    <li>All original packaging, accessories, manuals, and cables must be included</li>
                    <li>Return must be initiated within 30 days of delivery</li>
                    <li>Valid proof of purchase required</li>
                    <li>Items must pass inspection upon return</li>
                    <li>Customer is responsible for return shipping costs unless item is defective or incorrect</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-white mt-4">Refund Process</h3>
                  <p>Refunds will be processed within 5-10 business days after we receive and inspect the returned item. Refunds will be issued to the original payment method. Please allow an additional 3-5 business days for your financial institution to process the refund.</p>
                  <p className="mt-2">Refund amount includes the product price. Original shipping fees are non-refundable unless the item was defective or we made an error with your order.</p>

                  <h3 className="text-xl font-semibold text-white mt-4">Non-Returnable Items</h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Customized or personalized products</li>
                    <li>Software products or digital downloads</li>
                    <li>Items damaged by misuse, abuse, or normal wear and tear</li>
                    <li>Items without original packaging or missing components</li>
                    <li>Clearance or final sale items (when indicated at time of purchase)</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-white mt-4">Damaged or Defective Items</h3>
                  <p>If you receive a damaged or defective item, contact us within 48 hours of delivery with photos. We will provide a prepaid return label and process a replacement or full refund including original shipping costs.</p>
                </div>
              </section>

              <section className="mb-10">
                <h2 className="text-2xl font-bold text-white mb-4">8. Prohibited Uses</h2>
                <div className="text-white/90 space-y-4">
                  <p>You may not use our Service:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>For any unlawful purpose or to solicit others to unlawful acts</li>
                    <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
                    <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
                    <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
                    <li>To submit false or misleading information</li>
                    <li>To upload or transmit viruses or any other type of malicious code</li>
                    <li>To collect or track the personal information of others</li>
                    <li>To spam, phish, pharm, pretext, spider, crawl, or scrape</li>
                    <li>For any obscene or immoral purpose</li>
                    <li>To interfere with or circumvent the security features of the Service</li>
                  </ul>
                </div>
              </section>

              <section className="mb-10">
                <h2 className="text-2xl font-bold text-white mb-4">9. Intellectual Property</h2>
                <div className="text-white/90 space-y-4">
                  <p>The Service and its original content, features, and functionality are and will remain the exclusive property of Quantum Gameware and its licensors. The Service is protected by copyright, trademark, and other laws. Our trademarks and trade dress may not be used in connection with any product or service without our prior written consent.</p>
                </div>
              </section>

              <section className="mb-10">
                <h2 className="text-2xl font-bold text-white mb-4">10. Disclaimer</h2>
                <div className="text-white/90 space-y-4">
                  <p>The information on this website is provided on an "as is" basis. To the fullest extent permitted by law, this Company:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Excludes all representations and warranties relating to this website and its contents</li>
                    <li>Excludes all liability for damages arising out of or in connection with your use of this website</li>
                  </ul>
                </div>
              </section>

              <section className="mb-10">
                <h2 className="text-2xl font-bold text-white mb-4">11. Limitation of Liability</h2>
                <div className="text-white/90 space-y-4">
                  <p>In no event shall Quantum Gameware, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, punitive, consequential, or special damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the Service.</p>
                  <p>Our total liability to you for all claims arising out of or relating to the use of or any inability to use any portion of the Service shall not exceed the amount actually paid by you to us during the twelve (12) months prior to the event giving rise to the liability.</p>
                </div>
              </section>

              <section className="mb-10">
                <h2 className="text-2xl font-bold text-white mb-4">12. Indemnification</h2>
                <div className="text-white/90 space-y-4">
                  <p>You agree to defend, indemnify, and hold harmless Quantum Gameware and its licensee and licensors, and their employees, contractors, agents, officers and directors, from and against any and all claims, damages, obligations, losses, liabilities, costs or debt, and expenses (including but not limited to attorney's fees).</p>
                </div>
              </section>

              <section className="mb-10">
                <h2 className="text-2xl font-bold text-white mb-4">13. Termination</h2>
                <div className="text-white/90 space-y-4">
                  <p>We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever including without limitation if you breach the Terms.</p>
                  <p>If you wish to terminate your account, you may simply discontinue using the Service.</p>
                </div>
              </section>

              <section className="mb-10">
                <h2 className="text-2xl font-bold text-white mb-4">14. Governing Law</h2>
                <div className="text-white/90 space-y-4">
                  <p>These Terms shall be interpreted and governed by the laws of the United States, without regard to conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.</p>
                  <p className="mt-4">Any disputes arising out of or relating to these Terms or your use of our Service shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association, except where prohibited by law. You agree to waive your right to participate in class action lawsuits or class-wide arbitrations.</p>
                </div>
              </section>

              <section className="mb-10">
                <h2 className="text-2xl font-bold text-white mb-4">15. Changes to Terms</h2>
                <div className="text-white/90 space-y-4">
                  <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect.</p>
                  <p>What constitutes a material change will be determined at our sole discretion. By continuing to access or use our Service after any revisions become effective, you agree to be bound by the revised terms.</p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">16. Contact Information</h2>
                <div className="text-white/90 space-y-4">
                  <p>If you have any questions about these Terms of Service, please contact us:</p>
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-white mb-2">Email</h4>
                        <p>legal@quantumgameware.com</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-white mb-2">Mail</h4>
                        <p>
                          Legal Department<br />
                          Quantum Gameware<br />
                          123 Gaming Street<br />
                          Tech City, TC 12345
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}