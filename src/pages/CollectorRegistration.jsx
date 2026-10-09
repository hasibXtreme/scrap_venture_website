import SiteLayout from '../components/SiteLayout.jsx';
import Reveal from '../components/Reveal.jsx';
import CollectorForm from '../components/CollectorForm.jsx';

export default function CollectorRegistration() {
  return (
    <SiteLayout variant="collector" main mainClassName="collector-page-main">
      {/* Ambient Eco Decorative Elements in Background */}
      <div className="collector-bg-deco" aria-hidden="true">
        <img
          src="/assets/images/recycle.png"
          alt=""
          className="collector-bg-watermark collector-watermark-tl"
          loading="lazy"
        />
        <img
          src="/assets/images/recycle.png"
          alt=""
          className="collector-bg-watermark collector-watermark-tr"
          loading="lazy"
        />
        <img
          src="/assets/images/recycle.png"
          alt=""
          className="collector-bg-watermark collector-watermark-bl"
          loading="lazy"
        />
        <img
          src="/assets/images/recycle.png"
          alt=""
          className="collector-bg-watermark collector-watermark-br"
          loading="lazy"
        />
        <div className="collector-glow-orb collector-glow-orb--1"></div>
        <div className="collector-glow-orb collector-glow-orb--2"></div>
      </div>

      {/* Page Hero Header */}
      <section className="collector-page-hero">
        <Reveal className="wrap collector-page-hero__inner">
          <h1 className="page-title">
            Register as a <span className="collector-title-accent">Scrap Collector</span>
          </h1>
          <p className="page-subtitle">
            Join ScrapVenture's authorized network of collectors across Bangladesh. Get reliable pickup requests, fair automated pricing, and weekly digital payouts.
          </p>
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
