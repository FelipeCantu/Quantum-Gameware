// src/app/terms/page.tsx: Terms of service, set as a document (DocPage, styles/pages.css).
// The policy text is unchanged from the previous version; only the styling moved to the system.
import DocPage from '@/components/ui/DocPage';

const toc = [
  { id: "acceptance-of-terms", label: "Acceptance of Terms" },
  { id: "use-license", label: "Use License" },
  { id: "user-accounts", label: "User Accounts" },
  { id: "product-information-and-pricing", label: "Product Information and Pricing" },
  { id: "orders-and-payment", label: "Orders and Payment" },
  { id: "shipping-and-delivery", label: "Shipping and Delivery" },
  { id: "returns-and-refunds", label: "Returns and Refunds" },
  { id: "prohibited-uses", label: "Prohibited Uses" },
  { id: "intellectual-property", label: "Intellectual Property" },
  { id: "disclaimer", label: "Disclaimer" },
  { id: "limitation-of-liability", label: "Limitation of Liability" },
  { id: "indemnification", label: "Indemnification" },
  { id: "termination", label: "Termination" },
  { id: "governing-law", label: "Governing Law" },
  { id: "changes-to-terms", label: "Changes to Terms" },
  { id: "contact-information", label: "Contact Information" },
];

export default function TermsPage() {
  return (
    <DocPage
      title="Terms of Service"
      text="Please read these terms carefully before using our services. By using our website, you agree to these terms."
      meta="Last updated: November 3, 2025"
      toc={toc}
    >
<section id="acceptance-of-terms">
        <h2>Acceptance of Terms</h2>
          <p>By accessing and using the Quantum Gameware website ("Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.</p>
          <p>These Terms of Service ("Terms") govern your use of our website located at quantum-gameware.vercel.app (the "Service") operated by Quantum Gameware ("us", "we", or "our").</p>
        </section>

<section id="use-license">
        <h2>Use License</h2>
          <p>Permission is granted to temporarily download one copy of the materials on Quantum Gameware's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:</p>
          <ul>
            <li>Modify or copy the materials</li>
            <li>Use the materials for any commercial purpose or for any public display</li>
            <li>Attempt to reverse engineer any software contained on the website</li>
            <li>Remove any copyright or other proprietary notations from the materials</li>
          </ul>
          <p>This license shall automatically terminate if you violate any of these restrictions and may be terminated by us at any time.</p>
        </section>

<section id="user-accounts">
        <h2>User Accounts</h2>
          <h3>Account Creation</h3>
          <p>To access certain features of our Service, you may be required to create an account. You agree to:</p>
          <ul>
            <li>Provide accurate, current, and complete information</li>
            <li>Maintain and promptly update your account information</li>
            <li>Maintain the security of your password</li>
            <li>Accept responsibility for all activities under your account</li>
            <li>Notify us immediately of any unauthorized use</li>
          </ul>

          <h3>Account Termination</h3>
          <p>We reserve the right to suspend or terminate your account if you violate these Terms or engage in conduct that we deem harmful to other users or our business.</p>
        </section>

<section id="product-information-and-pricing">
        <h2>Product Information and Pricing</h2>
          <h3>Product Descriptions</h3>
          <p>We strive to provide accurate product descriptions and images. However, we do not warrant that product descriptions or other content is accurate, complete, reliable, current, or error-free.</p>

          <h3>Pricing</h3>
          <ul>
            <li>All prices are subject to change without notice</li>
            <li>Prices do not include applicable taxes and shipping costs</li>
            <li>We reserve the right to correct pricing errors</li>
            <li>Special offers and promotions are subject to specific terms</li>
          </ul>

          <h3>Availability</h3>
          <p>Product availability is subject to change. We reserve the right to discontinue products or limit quantities without prior notice.</p>
        </section>

<section id="orders-and-payment">
        <h2>Orders and Payment</h2>
          <h3>Order Acceptance</h3>
          <p>Your order constitutes an offer to purchase products. We reserve the right to accept or decline any order for any reason. Factors that may result in order cancellation include:</p>
          <ul>
            <li>Product unavailability</li>
            <li>Pricing errors</li>
            <li>Payment processing issues</li>
            <li>Suspected fraudulent activity</li>
          </ul>

          <h3>Payment Terms</h3>
          <ul>
            <li>Payment is due at the time of order</li>
            <li>We accept major credit cards and PayPal</li>
            <li>All payments are processed securely through third-party processors</li>
            <li>You authorize us to charge your payment method for all purchases</li>
          </ul>
        </section>

<section id="shipping-and-delivery">
        <h2>Shipping and Delivery</h2>
          <h3>Shipping Policy</h3>
          <ul>
            <li>We ship to addresses within the United States and internationally to 200+ countries</li>
            <li>Free standard shipping on all orders</li>
            <li>Processing time: 1-3 business days (up to 5 days during peak periods)</li>
            <li>Standard delivery: 5-15 business days (US), 10-25 business days (International)</li>
            <li>Delivery times are estimates and not guaranteed</li>
            <li>Tracking information provided once order ships</li>
            <li>Risk of loss and title transfer to you upon delivery</li>
          </ul>

          <h3>International Shipping</h3>
          <p>International customers are responsible for all customs duties, taxes, import fees, and clearance charges. These fees are not included in your order total and must be paid upon delivery. Delivery times may vary significantly due to customs processing, which is beyond our control.</p>

          <h3>Shipping Address</h3>
          <p>You are responsible for providing accurate shipping information. We cannot be held responsible for orders shipped to incorrect addresses provided by the customer. Address changes after order placement may not be possible once processing has begun.</p>
        </section>

<section id="returns-and-refunds">
        <h2>Returns and Refunds</h2>
          <h3>Return Policy</h3>
          <p>We offer a 30-day return policy from the delivery date for most items. To be eligible for a return:</p>
          <ul>
            <li>Items must be unused, unworn, and in original condition with all tags attached</li>
            <li>All original packaging, accessories, manuals, and cables must be included</li>
            <li>Return must be initiated within 30 days of delivery</li>
            <li>Valid proof of purchase required</li>
            <li>Items must pass inspection upon return</li>
            <li>Customer is responsible for return shipping costs unless item is defective or incorrect</li>
          </ul>

          <h3>Refund Process</h3>
          <p>Refunds will be processed within 5-10 business days after we receive and inspect the returned item. Refunds will be issued to the original payment method. Please allow an additional 3-5 business days for your financial institution to process the refund.</p>
          <p>Refund amount includes the product price. Original shipping fees are non-refundable unless the item was defective or we made an error with your order.</p>

          <h3>Non-Returnable Items</h3>
          <ul>
            <li>Customized or personalized products</li>
            <li>Software products or digital downloads</li>
            <li>Items damaged by misuse, abuse, or normal wear and tear</li>
            <li>Items without original packaging or missing components</li>
            <li>Clearance or final sale items (when indicated at time of purchase)</li>
          </ul>

          <h3>Damaged or Defective Items</h3>
          <p>If you receive a damaged or defective item, contact us within 48 hours of delivery with photos. We will provide a prepaid return label and process a replacement or full refund including original shipping costs.</p>
        </section>

<section id="prohibited-uses">
        <h2>Prohibited Uses</h2>
          <p>You may not use our Service:</p>
          <ul>
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
        </section>

<section id="intellectual-property">
        <h2>Intellectual Property</h2>
          <p>The Service and its original content, features, and functionality are and will remain the exclusive property of Quantum Gameware and its licensors. The Service is protected by copyright, trademark, and other laws. Our trademarks and trade dress may not be used in connection with any product or service without our prior written consent.</p>
        </section>

<section id="disclaimer">
        <h2>Disclaimer</h2>
          <p>The information on this website is provided on an "as is" basis. To the fullest extent permitted by law, this Company:</p>
          <ul>
            <li>Excludes all representations and warranties relating to this website and its contents</li>
            <li>Excludes all liability for damages arising out of or in connection with your use of this website</li>
          </ul>
        </section>

<section id="limitation-of-liability">
        <h2>Limitation of Liability</h2>
          <p>In no event shall Quantum Gameware, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, punitive, consequential, or special damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the Service.</p>
          <p>Our total liability to you for all claims arising out of or relating to the use of or any inability to use any portion of the Service shall not exceed the amount actually paid by you to us during the twelve (12) months prior to the event giving rise to the liability.</p>
        </section>

<section id="indemnification">
        <h2>Indemnification</h2>
          <p>You agree to defend, indemnify, and hold harmless Quantum Gameware and its licensee and licensors, and their employees, contractors, agents, officers and directors, from and against any and all claims, damages, obligations, losses, liabilities, costs or debt, and expenses (including but not limited to attorney's fees).</p>
        </section>

<section id="termination">
        <h2>Termination</h2>
          <p>We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever including without limitation if you breach the Terms.</p>
          <p>If you wish to terminate your account, you may simply discontinue using the Service.</p>
        </section>

<section id="governing-law">
        <h2>Governing Law</h2>
          <p>These Terms shall be interpreted and governed by the laws of the United States, without regard to conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.</p>
          <p>Any disputes arising out of or relating to these Terms or your use of our Service shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association, except where prohibited by law. You agree to waive your right to participate in class action lawsuits or class-wide arbitrations.</p>
        </section>

<section id="changes-to-terms">
        <h2>Changes to Terms</h2>
          <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect.</p>
          <p>What constitutes a material change will be determined at our sole discretion. By continuing to access or use our Service after any revisions become effective, you agree to be bound by the revised terms.</p>
        </section>

<section id="contact-information">
        <h2>Contact Information</h2>
          <p>If you have any questions about these Terms of Service, please contact us:</p>
          <div>
            <div>
              <div>
                <h4>Email</h4>
                <p><a href="/contact">Contact form</a></p>
              </div>
              <div>
                <h4>Mail</h4>
                <p>
                  Legal Department<br />
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
