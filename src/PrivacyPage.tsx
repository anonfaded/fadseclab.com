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
          <p className="page-subtitle">Last updated: June 23, 2026</p>
        </div>

        <div className="page-body">
          <section>
            <h2>Overview</h2>
            <p>
              FadSec Lab is committed to building privacy-respecting software. We use only the
              information needed to operate our services and provide a secure, reliable experience,
              and we never sell, rent, or monetize user data.
            </p>
            <p>
              This Privacy Policy is to be read and understood as being a complement to our{' '}
              <a href="https://fadseclab.com/terms">Terms of Service</a>.
            </p>
          </section>

          <section>
            <h2>Products</h2>
            <p>
              Unless explicitly stated otherwise, FadSec Lab products do not collect personal
              information, telemetry, analytics, usage data, crash reports, or diagnostic data.
            </p>
          </section>

          <section>
            <h2>Website</h2>
            <p>
              Our website uses privacy-preserving analytics provided by Cloudflare to understand
              aggregate traffic and improve website performance. We do not use advertising trackers,
              behavioral profiling, or cross-site tracking technologies, and we do not collect
              analytics data ourselves.
            </p>
            <p>
              For information about how Cloudflare processes data, please refer to Cloudflare's
              Privacy Policy.
            </p>
          </section>

          <section>
            <h2>Accounts</h2>
            <p>
              Some services, such as account systems provided through{' '}
              <strong>id.fadseclab.com</strong>, require information supplied by the user, including
              an email address. This information is used solely to provide and secure the requested
              service and is never sold or shared with third parties except where required to operate
              the service.
            </p>
          </section>

          <section>
            <h2>Third-Party Services</h2>
            <p>
              Users may choose to interact with third-party services such as GitHub, Patreon, or
              other external platforms. These services operate under their own privacy policies, and
              FadSec Lab is not responsible for their data practices.
            </p>
          </section>

          <section>
            <h2>Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. The latest version will always be
              available on this page, and the &ldquo;Last updated&rdquo; date will reflect the most
              recent changes. Continued use of our services after updates constitutes acceptance of
              the revised policy.
            </p>
          </section>

          <section>
            <h2>Contact</h2>
            <p>
              For privacy-related questions, contact:{' '}
              <a href="mailto:contact@fadseclab.com">contact@fadseclab.com</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
