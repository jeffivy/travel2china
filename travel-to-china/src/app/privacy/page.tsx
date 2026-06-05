import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Travel to China Privacy Policy — how we collect, use, and protect your personal information.',
};

export default function PrivacyPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-[var(--primary)]/10 to-[var(--gold)]/10 py-16">
        <div className="container-content text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-lg text-[var(--muted)]">Last updated: June 5, 2026</p>
        </div>
      </section>

      <article className="container-content py-12">
        <div className="prose dark:prose-invert max-w-none space-y-6">
          <section>
            <h2>1. Introduction</h2>
            <p>
              Welcome to <strong>Travel to China</strong> (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;).
              We are committed to protecting your personal information and your right to privacy.
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information
              when you visit our website <strong>travels2china.com</strong> (&ldquo;the Site&rdquo;).
            </p>
            <p>
              Please read this privacy policy carefully. If you do not agree with the terms of this
              privacy policy, please do not access the Site.
            </p>
          </section>

          <section>
            <h2>2. Information We Collect</h2>

            <h3>2.1 Personal Information You Provide</h3>
            <p>
              We collect personal information that you voluntarily provide to us when you:
            </p>
            <ul>
              <li><strong>Subscribe to our newsletter</strong> — your name and email address</li>
              <li><strong>Post comments</strong> — your name, email address, and profile image (via OAuth login)</li>
              <li><strong>Contact us</strong> — your name, email address, and message content</li>
              <li><strong>Use our search</strong> — search queries you enter on the Site</li>
            </ul>

            <h3>2.2 Information Automatically Collected</h3>
            <p>
              When you visit our Site, we automatically collect certain information about your device and usage:
            </p>
            <ul>
              <li><strong>Usage Data:</strong> Pages visited, time spent on pages, referral sources</li>
              <li><strong>Device Data:</strong> Browser type, operating system, device type</li>
              <li><strong>Anonymous Identifiers:</strong> Random visitor IDs stored in your browser's local storage for basic analytics</li>
            </ul>

            <h3>2.3 Information We Do NOT Collect</h3>
            <p>
              We do <strong>not</strong> collect:
            </p>
            <ul>
              <li>Payment or credit card information</li>
              <li>Precise geolocation data</li>
              <li>Sensitive personal data (race, religion, health, etc.)</li>
              <li>Personal data from children under 13</li>
            </ul>
          </section>

          <section>
            <h2>3. How We Use Your Information</h2>
            <p>We use the collected information for the following purposes:</p>
            <ul>
              <li><strong>To provide and maintain our Site</strong> — ensuring content is delivered correctly</li>
              <li><strong>To send newsletters</strong> — periodic travel tips and updates (only with your consent)</li>
              <li><strong>To improve our content</strong> — analyzing which articles and destinations are most popular</li>
              <li><strong>To moderate comments</strong> — preventing spam and maintaining community quality</li>
              <li><strong>To communicate with you</strong> — responding to inquiries and providing support</li>
              <li><strong>To analyze trends</strong> — understanding how visitors use our Site to improve the experience</li>
            </ul>
          </section>

          <section>
            <h2>4. Cookies and Tracking Technologies</h2>
            <p>
              We use minimal cookies and browser storage for essential functionality:
            </p>
            <div className="overflow-x-auto">
              <table>
                <thead>
                  <tr>
                    <th>Cookie / Storage</th>
                    <th>Purpose</th>
                    <th>Duration</th>
                    <th>Type</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code>theme</code></td>
                    <td>Remember your dark/light mode preference</td>
                    <td>Persistent</td>
                    <td>Local Storage</td>
                  </tr>
                  <tr>
                    <td><code>visitor_id</code></td>
                    <td>Anonymous unique visitor counting for analytics</td>
                    <td>Persistent</td>
                    <td>Local Storage</td>
                  </tr>
                  <tr>
                    <td><code>session_id</code></td>
                    <td>Session tracking for visit duration analysis</td>
                    <td>Session</td>
                    <td>Session Storage</td>
                  </tr>
                  <tr>
                    <td><code>next-auth.session-token</code></td>
                    <td>Authentication session (only if you sign in)</td>
                    <td>Session</td>
                    <td>HTTP Cookie</td>
                  </tr>
                  <tr>
                    <td><code>admin_token</code></td>
                    <td>Admin dashboard access (only for administrators)</td>
                    <td>24 hours</td>
                    <td>HTTP Cookie</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-3">
              You can disable cookies in your browser settings. Disabling cookies may affect the
              functionality of certain features.
            </p>
          </section>

          <section>
            <h2>5. Third-Party Services</h2>
            <p>We may use the following third-party services:</p>
            <ul>
              <li>
                <strong>Mailchimp</strong> — Email newsletter delivery.
                <a href="https://mailchimp.com/legal/privacy/" target="_blank" rel="noopener noreferrer"> Mailchimp Privacy Policy</a>
              </li>
              <li>
                <strong>Google OAuth / GitHub OAuth</strong> — Optional social login for comments.
                <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer"> Google Privacy Policy</a>
              </li>
              <li>
                <strong>Google Analytics</strong> (optional) — If configured by the site administrator.
              </li>
            </ul>
            <p>
              These third parties have their own privacy policies. We encourage you to review them.
            </p>
          </section>

          <section>
            <h2>6. Data Storage and Security</h2>
            <ul>
              <li><strong>Analytics data</strong> (page views, search queries) is stored locally in a SQLite database on our server</li>
              <li><strong>Comment data</strong> is stored locally in our SQLite database</li>
              <li><strong>Subscriber emails</strong> are stored locally and optionally synced with Mailchimp</li>
              <li>We implement reasonable security measures to protect your data</li>
              <li>No data is sold, rented, or shared with third parties for marketing purposes</li>
            </ul>
          </section>

          <section>
            <h2>7. Data Retention</h2>
            <ul>
              <li><strong>Comments:</strong> Retained indefinitely unless you request deletion</li>
              <li><strong>Analytics data:</strong> Retained indefinitely in aggregate form</li>
              <li><strong>Subscriber data:</strong> Retained until you unsubscribe</li>
              <li><strong>Authentication data:</strong> Session tokens expire after 24 hours</li>
            </ul>
          </section>

          <section>
            <h2>8. Your Rights</h2>
            <p>Depending on your location, you may have the following rights:</p>
            <ul>
              <li><strong>Access:</strong> Request a copy of your personal data</li>
              <li><strong>Rectification:</strong> Request correction of inaccurate data</li>
              <li><strong>Erasure:</strong> Request deletion of your personal data</li>
              <li><strong>Unsubscribe:</strong> Opt out of marketing emails at any time by clicking the unsubscribe link in any email, or by contacting us</li>
              <li><strong>Objection:</strong> Object to processing of your personal data</li>
            </ul>
            <p>To exercise any of these rights, please contact us at the email below.</p>
          </section>

          <section>
            <h2>9. Children&apos;s Privacy</h2>
            <p>
              Our Site is not intended for children under 13 years of age. We do not knowingly collect
              personal information from children under 13. If you believe a child has provided us with
              personal information, please contact us and we will delete it.
            </p>
          </section>

          <section>
            <h2>10. Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes
              by posting the new Privacy Policy on this page and updating the &ldquo;Last updated&rdquo; date.
              You are advised to review this Privacy Policy periodically for any changes.
            </p>
          </section>

          <section>
            <h2>11. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <p>
              <strong>Email:</strong>{' '}
              <a href="mailto:contact@travels2china.com">contact@travels2china.com</a>
            </p>
            <p>
              <strong>Website:</strong>{' '}
              <a href="https://travels2china.com">travels2china.com</a>
            </p>
          </section>
        </div>
      </article>
    </>
  );
}
