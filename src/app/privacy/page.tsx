// src/app/privacy/page.tsx
import Link from 'next/link';

export default function PrivacyPage() {
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
            <span className="text-white font-medium">Privacy Policy</span>
          </nav>

          {/* Header */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 overflow-hidden mb-8">
            <div className="p-8 lg:p-12 text-center text-white">
              <h1 className="text-4xl lg:text-5xl font-bold mb-4">
                Privacy Policy
              </h1>
              <p className="text-xl text-white/80 max-w-2xl mx-auto">
                Your privacy is important to us. Learn how we collect, use, and protect your personal information.
              </p>
              <div className="mt-6 text-sm text-white/70">
                Last updated: January 1, 2024
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 p-8 lg:p-12">
            <div className="prose prose-lg prose-invert max-w-none">
              
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-white mb-4">1. Information We Collect</h2>
                <div className="text-white/90 space-y-4">
                  <h3 className="text-xl font-semibold text-white">Personal Information</h3>
                  <p>When you use our services, we may collect the following personal information:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Name, email address, phone number, and shipping address</li>
                    <li>Payment information (processed securely through third-party payment processors)</li>
                    <li>Account credentials and preferences</li>
                    <li>Order history and shopping preferences</li>
                    <li>Customer service communications</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-white mt-6">Usage Information</h3>
                  <p>We automatically collect certain information about your use of our website:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Browser type, device information, and operating system</li>
                    <li>IP address and general location information</li>
                    <li>Pages visited, time spent on pages, and click patterns</li>
                    <li>Referral sources and search terms</li>
                    <li>Cookies and similar tracking technologies</li>
                  </ul>
                </div>
              </section>

              <section className="mb-10">
                <h2 className="text-2xl font-bold text-white mb-4">2. How We Use Your Information</h2>
                <div className="text-white/90 space-y-4">
                  <p>We use the information we collect for the following purposes:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Process and fulfill your orders</li>
                    <li>Provide customer support and respond to inquiries</li>
                    <li>Send order confirmations, shipping updates, and important notices</li>
                    <li>Improve our website, products, and services</li>
                    <li>Personalize your shopping experience</li>
                    <li>Send marketing communications (with your consent)</li>
                    <li>Detect and prevent fraud and security threats</li>
                    <li>Comply with legal obligations</li>
                  </ul>
                </div>
              </section>

              <section className="mb-10">
                <h2 className="text-2xl font-bold text-white mb-4">3. Information Sharing</h2>
                <div className="text-white/90 space-y-4">
                  <p>We do not sell, trade, or rent your personal information to third parties. We may share your information in the following circumstances:</p>
                  
                  <h3 className="text-xl font-semibold text-white">Service Providers</h3>
                  <p>We work with trusted third-party service providers who help us operate our business:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Payment processors (Stripe, PayPal, etc.)</li>
                    <li>Shipping and logistics partners</li>
                    <li>Email marketing services</li>
                    <li>Analytics and website optimization tools</li>
                    <li>Customer support platforms</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-white mt-6">Legal Requirements</h3>
                  <p>We may disclose your information when required by law or to:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Comply with legal processes or government requests</li>
                    <li>Protect our rights, property, or safety</li>
                    <li>Prevent fraud or illegal activities</li>
                    <li>Enforce our terms of service</li>
                  </ul>
                </div>
              </section>

              <section className="mb-10">
                <h2 className="text-2xl font-bold text-white mb-4">4. Data Security</h2>
                <div className="text-white/90 space-y-4">
                  <p>We implement appropriate technical and organizational measures to protect your personal information:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>SSL/TLS encryption for data transmission</li>
                    <li>Secure server infrastructure and data centers</li>
                    <li>Regular security audits and vulnerability assessments</li>
                    <li>Access controls and authentication measures</li>
                    <li>Employee training on data protection practices</li>
                  </ul>
                  <p className="mt-4">While we strive to protect your information, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security but will notify you of any material security breaches as required by law.</p>
                </div>
              </section>

              <section className="mb-10">
                <h2 className="text-2xl font-bold text-white mb-4">5. Your Rights and Choices</h2>
                <div className="text-white/90 space-y-4">
                  <p>Depending on your location, you may have the following rights regarding your personal information:</p>
                  
                  <h3 className="text-xl font-semibold text-white">Access and Portability</h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Request a copy of the personal information we hold about you</li>
                    <li>Receive your data in a portable format</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-white mt-4">Correction and Deletion</h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Update or correct inaccurate personal information</li>
                    <li>Request deletion of your personal information (subject to legal obligations)</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-white mt-4">Marketing Communications</h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Opt out of marketing emails by clicking unsubscribe links</li>
                    <li>Manage your communication preferences in your account settings</li>
                  </ul>

                  <p className="mt-4">To exercise these rights, please contact us at privacy@quantumgameware.com.</p>
                </div>
              </section>

              <section className="mb-10">
                <h2 className="text-2xl font-bold text-white mb-4">6. Cookies and Tracking</h2>
                <div className="text-white/90 space-y-4">
                  <p>We use cookies and similar technologies to enhance your browsing experience:</p>
                  
                  <h3 className="text-xl font-semibold text-white">Essential Cookies</h3>
                  <p>Required for basic website functionality, including shopping cart and checkout processes.</p>

                  <h3 className="text-xl font-semibold text-white mt-4">Analytics Cookies</h3>
                  <p>Help us understand how visitors use our website to improve performance and user experience.</p>

                  <h3 className="text-xl font-semibold text-white mt-4">Marketing Cookies</h3>
                  <p>Used to deliver relevant advertisements and track campaign effectiveness.</p>

                  <p className="mt-4">You can manage cookie preferences through your browser settings or our cookie preference center.</p>
                </div>
              </section>

              <section className="mb-10">
                <h2 className="text-2xl font-bold text-white mb-4">7. International Transfers</h2>
                <div className="text-white/90 space-y-4">
                  <p>Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place for international transfers, including:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Adequacy decisions by relevant authorities</li>
                    <li>Standard contractual clauses</li>
                    <li>Certification schemes and codes of conduct</li>
                  </ul>
                </div>
              </section>

              <section className="mb-10">
                <h2 className="text-2xl font-bold text-white mb-4">8. Children's Privacy</h2>
                <div className="text-white/90 space-y-4">
                  <p>Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If we become aware that we have collected personal information from a child under 13, we will take steps to delete such information.</p>
                </div>
              </section>

              <section className="mb-10">
                <h2 className="text-2xl font-bold text-white mb-4">9. Changes to This Policy</h2>
                <div className="text-white/90 space-y-4">
                  <p>We may update this Privacy Policy from time to time to reflect changes in our practices or applicable laws. We will notify you of any material changes by:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Posting the updated policy on our website</li>
                    <li>Sending email notifications for significant changes</li>
                    <li>Providing prominent notice on our website</li>
                  </ul>
                  <p className="mt-4">Your continued use of our services after changes become effective constitutes acceptance of the updated policy.</p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">10. Contact Us</h2>
                <div className="text-white/90 space-y-4">
                  <p>If you have questions about this Privacy Policy or our data practices, please contact us:</p>
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-white mb-2">Email</h4>
                        <p>privacy@quantumgameware.com</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-white mb-2">Mail</h4>
                        <p>
                          Privacy Officer<br />
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