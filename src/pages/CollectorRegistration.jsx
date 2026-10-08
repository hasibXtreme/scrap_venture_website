import SiteLayout from '../components/SiteLayout.jsx';
import Reveal from '../components/Reveal.jsx';
import CollectorForm from '../components/CollectorForm.jsx';

export default function CollectorRegistration() {
  return (
    <SiteLayout variant="collector" main mainClassName="collector-page-main">
      {/* Page Hero Header */}
      <section className="collector-page-hero">
        <Reveal className="wrap collector-page-hero__inner">

          <h1 className="page-title">
            Become an Authorized ScrapVenture Collector
          </h1>

        </Reveal>
      </section>

      {/* Main Registration Form Section */}
      <section className="collector-form-section" id="registration-form">
        <div className="wrap">
          <Reveal className="collector-form-container">
            <CollectorForm />
          </Reveal>
        </div>
      </section>
    </SiteLayout>
  );
}
