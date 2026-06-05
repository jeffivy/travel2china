import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Use',
  description: 'Travel to China Terms of Use — rules and guidelines for using our website.',
};

export default function TermsPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-[var(--primary)]/10 to-[var(--gold)]/10 py-16">
        <div className="container-content text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms of Use</h1>
          <p className="text-lg text-[var(--muted)]">Last updated: June 5, 2026</p>
        </div>
      </section>

      <article className="container-content py-12">
        <div className="prose dark:prose-invert max-w-none space-y-6">
          <section>
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing and using <strong>Travel to China</strong> (&ldquo;the Site&rdquo;),
              available at <strong>travels2china.com</strong>, you agree to be bound by these
              Terms of Use (&ldquo;Terms&rdquo;). If you do not agree with any part of these Terms,
              you must not use the Site.
            </p>
            <p>
              We reserve the right to update or modify these Terms at any time without prior notice.
              Your continued use of the Site following any changes constitutes your acceptance of
              the new Terms.
            </p>
          </section>

          <section>
            <h2>2. Use of the Site</h2>

            <h3>2.1 Permitted Use</h3>
            <p>
              The Site provides travel information, guides, and related content about China.
              You may use the Site for personal, non-commercial purposes to:
            </p>
            <ul>
              <li>Read articles and travel guides</li>
              <li>Search for travel information</li>
              <li>Post comments and engage with content</li>
              <li>Subscribe to our newsletter</li>
            </ul>

            <h3>2.2 Prohibited Activities</h3>
            <p>You agree NOT to:</p>
            <ul>
              <li>Use the Site for any unlawful purpose or in violation of any applicable laws</li>
              <li>Post spam, offensive, defamatory, or inappropriate content in comments</li>
              <li>Attempt to gain unauthorized access to the Site&apos;s systems or admin areas</li>
              <li>Scrape, data-mine, or extract content from the Site without our permission</li>
              <li>Use automated tools (bots, crawlers) to access the Site in a way that burdens our servers</li>
              <li>Impersonate others or provide false information</li>
              <li>Distribute malware, viruses, or other harmful code</li>
              <li>Republish, redistribute, or sell our content without written permission</li>
            </ul>
          </section>

          <section>
            <h2>3. Intellectual Property</h2>

            <h3>3.1 Our Content</h3>
            <p>
              All content on the Site, including but not limited to articles, guides, images, logos,
              graphics, design, and code (&ldquo;Content&rdquo;), is owned by Travel to China or
              its content suppliers and is protected by international copyright, trademark, and
              intellectual property laws.
            </p>
            <p>
              You may:
            </p>
            <ul>
              <li>View and read Content for personal use</li>
              <li>Share links to our Content on social media</li>
              <li>Quote short excerpts with proper attribution and a link back to the original</li>
            </ul>
            <p>
              You may NOT:
            </p>
            <ul>
              <li>Reproduce, distribute, or republish entire articles without permission</li>
              <li>Use our Content for commercial purposes without a license</li>
              <li>Remove any copyright notices from our Content</li>
              <li>Create derivative works based on our Content</li>
            </ul>

            <h3>3.2 User-Generated Content</h3>
            <p>
              By posting comments or other content on the Site, you:
            </p>
            <ul>
              <li>Grant us a non-exclusive, royalty-free, perpetual license to display your content on the Site</li>
              <li>Represent that you own or have the right to post such content</li>
              <li>Accept that we may moderate, edit, or remove your content at our discretion</li>
            </ul>
          </section>

          <section>
            <h2>4. User Accounts and Comments</h2>
            <p>
              When you sign in via Google or GitHub OAuth to post comments:
            </p>
            <ul>
              <li>You are responsible for maintaining the confidentiality of your account credentials</li>
              <li>You are responsible for all activity under your account</li>
              <li>We reserve the right to suspend or terminate accounts that violate these Terms</li>
              <li>We reserve the right to moderate, approve, or remove comments at our discretion</li>
            </ul>
          </section>

          <section>
            <h2>5. Disclaimer of Warranties</h2>
            <p>
              <strong>The Site is provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo;
              basis.</strong> We make no warranties, expressed or implied, regarding:
            </p>
            <ul>
              <li>The accuracy, completeness, or timeliness of travel information</li>
              <li>The availability or uninterrupted operation of the Site</li>
              <li>The absence of viruses or harmful components</li>
            </ul>
            <p>
              Travel information on the Site is for general informational purposes only. Visa policies,
              travel regulations, prices, and conditions may change. Always verify with official sources
              before making travel arrangements.
            </p>
          </section>

          <section>
            <h2>6. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by applicable law, Travel to China and its owners,
              contributors, and affiliates shall not be liable for:
            </p>
            <ul>
              <li>Any indirect, incidental, special, consequential, or punitive damages</li>
              <li>Any loss of profits, data, or goodwill arising from your use of the Site</li>
              <li>Any damages resulting from reliance on travel information provided on the Site</li>
              <li>Any issues arising from third-party services linked from the Site</li>
            </ul>
          </section>

          <section>
            <h2>7. Travel Information Disclaimer</h2>
            <p>
              The travel information provided on this Site, including but not limited to visa requirements,
              transportation options, accommodation recommendations, and attraction details, is for
              general informational purposes only. We strive to keep information current and accurate,
              but we make no guarantees.
            </p>
            <p>
              <strong>You should always:</strong>
            </p>
            <ul>
              <li>Verify visa requirements with the nearest Chinese embassy or consulate</li>
              <li>Check official websites for current attraction hours, prices, and regulations</li>
              <li>Consult with qualified travel professionals for complex itineraries</li>
              <li>Purchase appropriate travel insurance</li>
            </ul>
          </section>

          <section>
            <h2>8. Third-Party Links</h2>
            <p>
              The Site may contain links to third-party websites or services that are not owned or
              controlled by us. We have no control over and assume no responsibility for the content,
              privacy policies, or practices of any third-party websites. You acknowledge that you
              access such links at your own risk.
            </p>
          </section>

          <section>
            <h2>9. Privacy</h2>
            <p>
              Your use of the Site is also governed by our{' '}
              <a href="/privacy">Privacy Policy</a>, which explains how we collect, use, and
              protect your personal information. By using the Site, you consent to the practices
              described in the Privacy Policy.
            </p>
          </section>

          <section>
            <h2>10. Termination</h2>
            <p>
              We reserve the right to terminate or suspend your access to the Site immediately,
              without prior notice, for any violation of these Terms or for any other reason at
              our sole discretion.
            </p>
          </section>

          <section>
            <h2>11. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the
              jurisdiction in which the Site operator is established, without regard to its
              conflict of law provisions.
            </p>
          </section>

          <section>
            <h2>12. Contact Information</h2>
            <p>
              For questions about these Terms of Use, please contact us at:
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

          <section>
            <h2>13. Severability</h2>
            <p>
              If any provision of these Terms is found to be unenforceable or invalid, that provision
              will be limited or eliminated to the minimum extent necessary, and the remaining
              provisions will remain in full force and effect.
            </p>
          </section>
        </div>
      </article>
    </>
  );
}
