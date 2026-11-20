// src/app/privacy/page.tsx: Privacy policy, set as a document (DocPage, styles/pages.css).
// The policy text is unchanged from the previous version; only the styling moved to the system.
import DocPage from '@/components/ui/DocPage';

const toc = [
  { id: "information-we-collect", label: "Information We Collect" },
  { id: "how-we-use-your-information", label: "How We Use Your Information" },
  { id: "information-sharing", label: "Information Sharing" },
  { id: "data-security", label: "Data Security" },
  { id: "your-rights-and-choices", label: "Your Rights and Choices" },
  { id: "cookies-and-tracking", label: "Cookies and Tracking" },
  { id: "data-retention", label: "Data Retention" },
  { id: "international-transfers", label: "International Transfers" },
  { id: "childrens-privacy", label: "Children's Privacy" },
  { id: "changes-to-this-policy", label: "Changes to This Policy" },
  { id: "contact-us", label: "Contact Us" },
];

export default function PrivacyPage() {
  return (
    <DocPage
      title="Privacy Policy"
      text="Your privacy is important to us. Learn how we collect, use, and protect your personal information."
      meta="Last updated: November 3, 2025"
      toc={toc}
    >
<section id="information-we-collect">
        <h2>Information We Collect</h2>
          <h3>Personal Information</h3>
          <p>When you use our services, we may collect the following personal information:</p>
          <ul>
            <li>Name, email address, phone number, and shipping address</li>
            <li>Payment information (processed securely through third-party payment processors)</li>
            <li>Account credentials and preferences</li>
            <li>Order history and shopping preferences</li>
            <li>Customer service communications</li>
          </ul>

          <h3>Usage Information</h3>
          <p>We automatically collect certain information about your use of our website:</p>
          <ul>
            <li>Browser type, device information, and operating system</li>
            <li>IP address and general location information</li>
            <li>Pages visited, time spent on pages, and click patterns</li>
            <li>Referral sources and search terms</li>
            <li>Cookies and similar tracking technologies</li>
          </ul>
        </section>

<section id="how-we-use-your-information">
        <h2>How We Use Your Information</h2>
          <p>We use the information we collect for the following purposes:</p>
          <ul>
            <li>Process and fulfill your orders</li>
            <li>Provide customer support and respond to inquiries</li>
            <li>Send order confirmations, shipping updates, and important notices</li>
            <li>Improve our website, products, and services</li>
            <li>Personalize your shopping experience</li>
            <li>Send marketing communications (with your consent)</li>
            <li>Detect and prevent fraud and security threats</li>
            <li>Comply with legal obligations</li>
          </ul>
        </section>

<section id="information-sharing">
        <h2>Information Sharing</h2>
          <p>We do not sell, trade, or rent your personal information to third parties. We may share your information in the following circumstances:</p>
          
          <h3>Service Providers</h3>
          <p>We work with trusted third-party service providers who help us operate our business:</p>
          <ul>
            <li>Payment processors (Stripe, PayPal, etc.)</li>
            <li>Shipping and logistics partners</li>
            <li>Email marketing services</li>
            <li>Analytics and website optimization tools</li>
            <li>Customer support platforms</li>
          </ul>

          <h3>Legal Requirements</h3>
          <p>We may disclose your information when required by law or to:</p>
          <ul>
            <li>Comply with legal processes or government requests</li>
            <li>Protect our rights, property, or safety</li>
            <li>Prevent fraud or illegal activities</li>
            <li>Enforce our terms of service</li>
          </ul>
        </section>

<section id="data-security">
        <h2>Data Security</h2>
          <p>We implement appropriate technical and organizational measures to protect your personal information:</p>
          <ul>
            <li>SSL/TLS encryption for data transmission</li>
            <li>Secure server infrastructure and data centers</li>
            <li>Regular security audits and vulnerability assessments</li>
            <li>Access controls and authentication measures</li>
            <li>Employee training on data protection practices</li>
          </ul>
          <p>While we strive to protect your information, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security but will notify you of any material security breaches as required by law.</p>
        </section>

<section id="your-rights-and-choices">
        <h2>Your Rights and Choices</h2>
          <p>Depending on your location, you may have the following rights regarding your personal information:</p>
          
          <h3>Access and Portability</h3>
          <ul>
            <li>Request a copy of the personal information we hold about you</li>
            <li>Receive your data in a portable format</li>
          </ul>

          <h3>Correction and Deletion</h3>
          <ul>
            <li>Update or correct inaccurate personal information</li>
            <li>Request deletion of your personal information (subject to legal obligations)</li>
          </ul>

          <h3>Marketing Communications</h3>
          <ul>
            <li>Opt out of marketing emails by clicking unsubscribe links</li>
            <li>Manage your communication preferences in your account settings</li>
          </ul>

          <p>To exercise these rights, please contact us through our contact page.</p>
        </section>

<section id="cookies-and-tracking">
        <h2>Cookies and Tracking</h2>
          <p>We use cookies and similar technologies to enhance your browsing experience:</p>
          
          <h3>Essential Cookies</h3>
          <p>Required for basic website functionality, including shopping cart and checkout processes.</p>

          <h3>Analytics Cookies</h3>
          <p>Help us understand how visitors use our website to improve performance and user experience.</p>

          <h3>Marketing Cookies</h3>
          <p>Used to deliver relevant advertisements and track campaign effectiveness.</p>

          <p>You can manage cookie preferences through your browser settings or our cookie preference center.</p>
        </section>

<section id="data-retention">
        <h2>Data Retention</h2>
          <p>We retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required by law. Our retention periods vary based on data type:</p>
          <ul>
            <li>Account information: Retained while your account is active and for up to 3 years after account closure</li>
            <li>Order history and transaction data: Retained for 7 years for tax and legal compliance</li>
            <li>Marketing data: Retained until you opt out or for 2 years of inactivity</li>
            <li>Support communications: Retained for 3 years after resolution</li>
            <li>Analytics data: Aggregated and anonymized after 24 months</li>
          </ul>
          <p>When we no longer need your information, we securely delete or anonymize it in accordance with data protection best practices.</p>
        </section>

<section id="international-transfers">
        <h2>International Transfers</h2>
          <p>Your information may be transferred to and processed in countries other than your own, including the United States and other regions where our service providers operate. We ensure appropriate safeguards are in place for international transfers, including:</p>
          <ul>
            <li>Adequacy decisions by relevant authorities</li>
            <li>Standard contractual clauses approved by the European Commission</li>
            <li>Certification schemes (EU-U.S. Data Privacy Framework)</li>
            <li>Binding corporate rules and codes of conduct</li>
          </ul>
          <p>By using our services, you consent to the transfer of your information to countries that may have different data protection laws than your country of residence.</p>
        </section>

<section id="childrens-privacy">
        <h2>Children's Privacy</h2>
          <p>Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If we become aware that we have collected personal information from a child under 13, we will take steps to delete such information promptly.</p>
          <p>If you are a parent or guardian and believe your child has provided us with personal information, please contact us through our contact page so we can take appropriate action.</p>
        </section>

<section id="changes-to-this-policy">
        <h2>Changes to This Policy</h2>
          <p>We may update this Privacy Policy from time to time to reflect changes in our practices or applicable laws. We will notify you of any material changes by:</p>
          <ul>
            <li>Posting the updated policy on our website</li>
            <li>Sending email notifications for significant changes</li>
            <li>Providing prominent notice on our website</li>
          </ul>
          <p>Your continued use of our services after changes become effective constitutes acceptance of the updated policy.</p>
        </section>

<section id="contact-us">
        <h2>Contact Us</h2>
          <p>If you have questions about this Privacy Policy or our data practices, please contact us:</p>
          <div>
            <div>
              <div>
                <h4>Email</h4>
                <p><a href="/contact">Contact form</a></p>
              </div>
              <div>
                <h4>Mail</h4>
                <p>
                  Privacy Officer<br />
                  Quantum Gameware<br />
                  123 Gaming Street<br />
                  Tech City, TC 12345
                </p>
              </div>
            </div>
          </div>
        </section>
    </DocPage>
  );
}
