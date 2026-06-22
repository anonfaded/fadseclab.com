import { ArrowLeft } from 'lucide-react';

interface Props {
  onBack: () => void;
}

export default function PrivacyPage({ onBack }: Props) {
  return (
    <div className="page-shell">
      <div className="page-content">
        <button type="button" className="page-back" onClick={onBack}>
          <ArrowLeft size={16} />
          Back to home
        </button>

        <div className="page-header">
          <h1 className="page-title">Privacy Policy</h1>
          <p className="page-subtitle">Last updated: June 2026</p>
        </div>

        <div className="page-body">
          <section>
            <h2>Data Collection</h2>
            <p>
              FadSec Lab products are designed to operate without collecting personal data. We do not
              use analytics SDKs, tracking frameworks, or telemetry of any kind. When a service
              explicitly requires user-provided information — such as an email address for account
              recovery — that data is stored locally and never shared with third parties.
            </p>
          </section>

          <section>
            <h2>Third-Party Services</h2>
            <p>
              Some FadSec Lab applications may integrate with third-party services you explicitly
              choose to use (e.g., GitHub for source code access, Patreon for donations). These
              services operate under their own privacy policies, and FadSec Lab does not control or
              assume responsibility for their data practices.
            </p>
          </section>

          <section>
            <h2>Data Security</h2>
            <p>
              We follow industry-standard security practices in all software we release. Source code
              is open for audit, builds are reproducible where possible, and cryptographic integrity
              checks are provided for all distributed binaries.
            </p>
          </section>

          <section>
            <h2>Contact</h2>
            <p>
              If you have questions about this policy, reach out to{' '}
              <a href="mailto:contact@fadseclab.com">contact@fadseclab.com</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
