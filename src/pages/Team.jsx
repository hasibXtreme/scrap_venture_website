import SiteLayout from '../components/SiteLayout.jsx';
import Reveal from '../components/Reveal.jsx';
import CtaFinal from '../components/CtaFinal.jsx';
import team from '../data/team.js';

export default function Team() {
  return (
    <SiteLayout variant="team" main>
      {/* Team Page Hero Header */}
      <section className="team-page-hero">
        <Reveal className="wrap team-page-hero__inner">
          <p className="eyebrow">
            <span className="eyebrow__dot"></span>
            Our Team &amp; Leadership
          </p>
          <h1 className="page-title">
            The Visionaries Driving Sustainable Change
          </h1>
          <p className="page-subtitle">
            Meet the leaders, innovators, and advisors behind ScrapVenture — pioneering smart, tech-driven waste supply chains for a cleaner, circular green Bangladesh.
          </p>
        </Reveal>
      </section>

      {/* Main Team Roster Grid */}
      <section className="team-content-section">
        <div className="wrap">
          <div className="team-roster-grid">
            {team.map(member => (
              <Reveal as="article" className="team-card" key={member.id}>
                {/* 1. Photo on Top */}
                <div className="team-card__media">
                  <img
                    src={member.image}
                    alt={`${member.name} - ${member.rank}`}
                    loading="lazy"
                    className="team-card__img"
                  />
                </div>

                {/* 2. Name then Rank */}
                <div className="team-card__body">
                  <h3 className="team-card__name">{member.name}</h3>
                  <p className="team-card__rank">{member.rank}</p>
                  <p className="team-card__desc">{member.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Corporate Culture / Mission Banner */}
          <Reveal className="team-values-banner">
            <div className="team-values-banner__header">
              <span className="team-values-banner__tag">Values That Unite Us</span>
              <h2>Building the Future of Waste-to-Value</h2>
              <p>Combining entrepreneurial energy, technical precision, and institutional guidance to transform recycling nationwide.</p>
            </div>
            <div className="team-values-grid">
              <div className="team-value-item">
                <div className="team-value-item__icon">🌱</div>
                <h4>Eco-Centric Mission</h4>
                <p>Every business and operational decision is guided by measurable circular economy impact.</p>
              </div>
              <div className="team-value-item">
                <div className="team-value-item__icon">⚡</div>
                <h4>Tech-Driven Precision</h4>
                <p>Empowered by modern digital workflows, IoT integration, and reliable scrap supply chain automation.</p>
              </div>
              <div className="team-value-item">
                <div className="team-value-item__icon">🤝</div>
                <h4>Shared Ownership</h4>
                <p>Partnering with community collectors, academic institutions, and national recycling industries.</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Standard Closing CTA */}
      <CtaFinal />
    </SiteLayout>
  );
}
