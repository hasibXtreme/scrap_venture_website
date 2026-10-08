import SiteLayout from '../components/SiteLayout.jsx';
import Reveal from '../components/Reveal.jsx';
import CtaFinal from '../components/CtaFinal.jsx';
import awards from '../data/awards.js';

export default function Awards() {
  return (
    <SiteLayout variant="awards" main>
      {/* Page Heading & Intro */}
      <section className="awards-page-hero">
        <Reveal className="wrap awards-page-hero__inner">
          <p className="eyebrow">Awards &amp; Recognition</p>
          <h1 className="page-title">Recognized for our contribution to responsible recycling and a cleaner future.</h1>
          <p className="page-subtitle">A collection of milestones, national challenges, and innovation honors celebrating our dedication to smart, eco-friendly waste management across Bangladesh.</p>
        </Reveal>
      </section>

      {/* Editorial Alternating Awards Layout */}
      <section className="awards-list-section">
        <div className="wrap">
          <div className="awards-list">
            {awards.map((a) => (
              <Reveal as="article" className="award-item" key={a.img}>
                <div className="award-item__media">
                  <img src={a.img} alt={a.title} loading="lazy" />
                </div>
                <div className="award-item__content">
                  <div className="award-item__meta">
                    <span className="award-item__tag">{a.tag}</span>
                    <span className="award-item__sep">•</span>
                    <span className="award-item__date">{a.date}</span>
                  </div>
                  <h2 className="award-item__title">{a.title}</h2>
                  <p className="award-item__desc">{a.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaFinal />
    </SiteLayout>
  );
}
