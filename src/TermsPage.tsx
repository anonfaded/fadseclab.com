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
          <p className="page-subtitle">Last updated: June 2026</p>
        </div>

        <div className="page-body">
          <section>
            <h2>Scope</h2>
            <p>
              These terms govern the use of software and services provided by FadSec Lab. By
              downloading, installing, or using any FadSec Lab product, you agree to these terms.
            </p>
          </section>

          <section>
            <h2>Open Source Licensing</h2>
            <p>
              Unless otherwise noted, FadSec Lab software is distributed under open-source licenses.
              You are free to use, modify, and distribute the source code in accordance with the
              terms of the applicable license. Binaries and builds are provided as-is, without
              warranty of any kind.
            </p>
          </section>

          <section>
            <h2>Acceptable Use</h2>
            <p>
              FadSec Lab software must not be used in ways that violate applicable law or infringe on
              the rights of others. We reserve the right to deny service to entities engaged in
              activities we determine, in our sole discretion, to be harmful or unlawful.
            </p>
          </section>

          <section>
            <h2>Shariah Compliance</h2>
            <p>
              FadSec Lab operates in accordance with Shariah principles. We do not develop software
              or provide services for applications that conflict with these principles, including but
              not limited to:
            </p>
            <ul>
              <li>Music streaming or distribution platforms</li>
              <li>Insurance, lending, or financial services involving interest (riba)</li>
              <li>Data harvesting, surveillance, or user tracking products</li>
              <li>Gambling, adult content, or prohibited substances</li>
              <li>Any application designed to deceive, defraud, or harm users</li>
            </ul>
            <p>
              This list is not exhaustive. If you are unsure whether your project aligns with our
              principles, please reach out before engaging our services.
            </p>
          </section>

          <section>
            <h2>Limitation of Liability</h2>
            <p>
              FadSec Lab provides software and services on an "as is" basis. To the maximum extent
              permitted by law, we disclaim all warranties, express or implied. In no event shall
              FadSec Lab be liable for any damages arising from the use of our software or services.
            </p>
          </section>

          <section>
            <h2>Contact</h2>
            <p>
              For questions about these terms, reach out to{' '}
              <a href="mailto:contact@fadseclab.com">contact@fadseclab.com</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
