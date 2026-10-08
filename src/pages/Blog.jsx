import SiteLayout from '../components/SiteLayout.jsx';
import Reveal from '../components/Reveal.jsx';
import CtaFinal from '../components/CtaFinal.jsx';
import { ExternalLinkIcon, NewspaperIcon } from '../components/icons.jsx';
import newsArticles from '../data/news.js';
import { campaignImpacts, campaignSummary } from '../data/campaigns.js';

export default function Blog() {
  return (
    <SiteLayout variant="blog" main>
      {/* Blog Page Hero Header */}
      <section className="blog-page-hero">
        <Reveal className="wrap blog-page-hero__inner">
          <p className="eyebrow">Press &amp; Media Coverage</p>
          <h1 className="page-title">
            Featured in National Media — Stories of Innovation &amp; Circular Impact
          </h1>
          <p className="page-subtitle">
            Leading national newspapers and publications document ScrapVenture’s startup milestones, university incubation victories, and tech-driven recycling impact across Bangladesh.
          </p>
        </Reveal>
      </section>

      {/* 1. Main Newspaper Articles Grid */}
      <section className="blog-page-section">
        <div className="wrap">
          {/* 3 Newspaper Cards with Beginning Lines, Fade Effect & Direct External Links */}
          <div className="news-cards-grid">
            {newsArticles.map((article) => (
              <Reveal as="article" className="news-card" key={article.id}>
                {/* Media Image */}
                <div className="news-card__media">
                  <img
                    src={article.image}
                    alt={article.title}
                    loading="lazy"
                    className="news-card__img"
                    onError={(e) => {
                      if (article.fallbackImage && e.target.src !== article.fallbackImage) {
                        e.target.src = article.fallbackImage;
                      }
                    }}
                  />
                  <span className="news-card__outlet-badge">
                    <NewspaperIcon size={13} />
                    <span>{article.paper}</span>
                  </span>
                </div>

                {/* Card Body */}
                <div className="news-card__body">
                  <div className="news-card__meta">
                    <span className="news-card__tag">{article.badge}</span>
                    <span className="news-card__date">{article.date}</span>
                  </div>

                  <h2 className="news-card__title">
                    <a href={article.link} target="_blank" rel="noopener noreferrer">
                      {article.title}
                    </a>
                  </h2>

                  {/* Beginning Lines Excerpt with the Prominent Fade Effect */}
                  <div className="news-card__excerpt-box">
                    <p className="news-card__excerpt-text">
                      {article.excerpt}
                    </p>
                    {/* The Fade Effect: Smooth gradient dissolution at the bottom */}
                    <div className="news-card__fade-overlay" aria-hidden="true"></div>
                  </div>

                  {/* Footer with the Actual Link to the Corresponding Newspaper Article */}
                  <div className="news-card__footer">
                    <a
                      href={article.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="news-card__read-btn"
                      title={`Read full paper on ${article.paperEnglish}`}
                    >
                      <div className="news-card__read-btn-content">
                        <span className="news-card__read-btn-main">Read Full Paper on Dainik Amader Shomoy</span>
                        <span className="news-card__read-btn-sub">দৈনিক আমাদের সময় • সম্পূর্ণ প্রতিবেদন পড়ুন</span>
                      </div>
                      <ExternalLinkIcon size={18} strokeWidth="2.3" />
                    </a>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Campaign Impact & Results Section (Beneath Press & Media) */}
      <section className="campaign-impact-section" id="campaign-impact">
        <div className="wrap">
          <Reveal className="sec-head">
            <div>
              <p className="eyebrow">Real-World Results</p>
              <h2 className="title">
                Campaign Impact &amp; Results —<br />Transforming Waste into Value
              </h2>
            </div>
            <p className="desc">
              Data-backed outcomes, environmental metrics, and community transformation generated through ScrapVenture’s targeted on-ground campaigns.
            </p>
          </Reveal>

          {/* Cumulative Impact Metric Bar */}
          <Reveal className="campaign-summary-bar">
            <div className="campaign-summary-item">
              <span className="campaign-summary-value">{campaignSummary.totalDiverted}</span>
              <span className="campaign-summary-label">Total Recyclables Diverted</span>
              <span className="campaign-summary-sub">Prevented from open dumping</span>
            </div>
            <div className="campaign-summary-item">
              <span className="campaign-summary-value">{campaignSummary.cashDistributed}</span>
              <span className="campaign-summary-label">Cash Rewards Paid Out</span>
              <span className="campaign-summary-sub">Direct to households &amp; students</span>
            </div>
            <div className="campaign-summary-item">
              <span className="campaign-summary-value">{campaignSummary.citizensEngaged}</span>
              <span className="campaign-summary-label">Participants Mobilized</span>
              <span className="campaign-summary-sub">Across universities &amp; societies</span>
            </div>
            <div className="campaign-summary-item">
              <span className="campaign-summary-value">{campaignSummary.co2Avoided}</span>
              <span className="campaign-summary-label">CO₂ Emissions Mitigated</span>
              <span className="campaign-summary-sub">Verified circular carbon offset</span>
            </div>
          </Reveal>

          {/* Detailed Campaign Impact Cards */}
          <div className="campaign-cards-list">
            {campaignImpacts.map((camp) => (
              <Reveal as="article" className="campaign-card" key={camp.id}>
                {/* Header Row */}
                <div className="campaign-card__header">
                  <div className="campaign-card__head-left">
                    <div className="campaign-card__icon">{camp.icon}</div>
                    <div>
                      <div className="campaign-card__meta-tags">
                        <span className="campaign-tag campaign-tag--badge">{camp.badge}</span>
                        <span className="campaign-tag campaign-tag--status">
                          <span className="dot"></span>
                          {camp.status}
                        </span>
                        <span className="campaign-tag campaign-tag--date">{camp.date}</span>
                      </div>
                      <h3 className="campaign-card__title">{camp.title}</h3>
                    </div>
                  </div>
                  <span className="campaign-card__location">📍 {camp.location}</span>
                </div>

                {/* Campaign Summary */}
                <p className="campaign-card__summary">{camp.summary}</p>

                {/* 4-Metric Impact Grid */}
                <div className="campaign-card__stats-grid">
                  {camp.stats.map((s, idx) => (
                    <div className="campaign-stat-box" key={idx}>
                      <span className="campaign-stat-box__val">{s.value}</span>
                      <span className="campaign-stat-box__lbl">{s.label}</span>
                      <span className="campaign-stat-box__detail">{s.detail}</span>
                    </div>
                  ))}
                </div>

                {/* Key Achievements Checklist */}
                <div className="campaign-card__highlights-box">
                  <h4 className="campaign-card__highlights-title">
                    <span>🌱 Tangible Achievements &amp; Verified Outcomes</span>
                  </h4>
                  <ul className="campaign-card__highlights-list">
                    {camp.highlights.map((h, i) => (
                      <li className="campaign-card__highlights-item" key={i}>
                        <span className="campaign-card__check-icon">✓</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Standard Closing CTA */}
      <CtaFinal />
    </SiteLayout>
  );
}
