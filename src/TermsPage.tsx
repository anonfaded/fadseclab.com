import { ArrowLeft } from 'lucide-react';

interface Props {
  onBack: () => void;
}

export default function TermsPage({ onBack }: Props) {
  return (
    <div className="page-shell">
      <div className="page-content">
        <button type="button" className="page-back" onClick={onBack}>
          <ArrowLeft size={16} />
          Back to home
        </button>

        <div className="page-header">
          <h1 className="page-title">Terms and Conditions</h1>
          <p className="page-subtitle">Last updated: June 23, 2026</p>
        </div>

        <div className="page-body">
          <section>
            <h2>1. Scope</h2>
            <p>
              These Terms apply to all software, services, and development work provided by FadSec
              Lab, including open-source projects, binaries, and custom application development
              services.
            </p>
            <p>
              By using, downloading, or commissioning any FadSec Lab software or service, you agree
              to these Terms.
            </p>
          </section>

          <section>
            <h2>2. Open Source Licensing (GPLv3)</h2>
            <p>
              Unless otherwise stated, FadSec Lab software is licensed under the{' '}
              <strong>GNU General Public License v3.0 (GPLv3)</strong>.
            </p>
            <ul>
              <li>You are free to use, modify, and distribute the software in accordance with the GPLv3 license.</li>
              <li>Source code is provided under its respective repository license terms.</li>
              <li>Any redistributed or modified versions must comply with GPLv3 obligations, including source disclosure where applicable.</li>
              <li>Third-party components remain subject to their own licenses.</li>
            </ul>
            <p>
              The GPLv3 license governs the software; these Terms govern service usage, development
              services, and commercial engagement.
            </p>
          </section>

          <section>
            <h2>3. Custom Development Services</h2>
            <p>
              FadSec Lab provides software development and engineering services upon request.
            </p>
            <ul>
              <li>Project scope, pricing, and delivery terms are defined separately for each engagement.</li>
              <li>Deliverables may include proprietary, open-source, or hybrid licensing depending on the agreement.</li>
              <li>We reserve the right to refuse projects that conflict with our principles or technical standards.</li>
            </ul>
          </section>

          <section>
            <h2>4. Acceptable Use</h2>
            <p>
              You agree not to use FadSec Lab software or services for unlawful purposes or in ways
              that infringe the rights of others.
            </p>
            <p>
              We may refuse or terminate service engagements if we determine, in good faith, that a
              project involves harmful, deceptive, or illegal activity.
            </p>
          </section>

          <section>
            <h2>5. Ethical &amp; Shariah Compliance</h2>
            <p>
              FadSec Lab operates in accordance with Shariah-aligned ethical principles. We do not
              knowingly build or support systems involved in:
            </p>
            <ul>
              <li>Gambling or betting systems</li>
              <li>Interest-based financial services (riba)</li>
              <li>Surveillance, tracking, or user profiling systems</li>
              <li>Adult content platforms</li>
              <li>Deceptive, fraudulent, or harmful applications</li>
              <li>Other systems that conflict with our ethical principles</li>
            </ul>
            <p>
              This list is not complete and may be understood based on the basic principles of
              preventing harm and acting ethically.
            </p>
          </section>

          <section>
            <h2>6. Disclaimer of Warranty</h2>
            <p>
              All software is provided &ldquo;as is&rdquo; without any warranty. To the fullest
              extent allowed by law, FadSec Lab does not promise that the software will be fit for a
              specific purpose or free from legal issues.
            </p>
          </section>

          <section>
            <h2>7. Limitation of Liability</h2>
            <p>
              FadSec Lab shall not be liable for any direct, indirect, incidental, or consequential
              damages arising from the use of its software or services.
            </p>
          </section>

          <section>
            <h2>8. Changes to These Terms</h2>
            <p>
              We may update these Terms from time to time. The latest version will always be
              available at this page, and continued use of our software or services constitutes
              acceptance of the updated Terms.
            </p>
          </section>

          <section>
            <h2>9. Contact</h2>
            <p>
              For questions about these Terms:{' '}
              <a href="mailto:contact@fadseclab.com">contact@fadseclab.com</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
