import { useState, useEffect } from 'react';
import SiteLayout from '../components/SiteLayout.jsx';
import Reveal from '../components/Reveal.jsx';
import { ArrowIcon, NewspaperIcon } from '../components/icons.jsx';
import newsArticles from '../data/news.js';
import { fetchPublicCampaignEffects } from '../utils/api.js';

export default function Blog() {
  const [campaignEffects, setCampaignEffects] = useState([]);

  useEffect(() => {
    fetchPublicCampaignEffects()
      .then((res) => {
        if (res?.campaign_effect && res.campaign_effect.length > 0) {
          setCampaignEffects(res.campaign_effect);
        }
      })
      .catch((err) => {
        console.warn('Failed to load campaign effects in blog:', err);
      });
  }, []);

  return (
    <SiteLayout variant="blog" main mainClassName="awards-page-main">
      {/* Ambient Eco Decorative Elements in Background - Strictly 2 Watermarks matching Awards Page */}
      <div className="awards-bg-deco" aria-hidden="true">
        <img
          src="/assets/images/recycle.png"
          alt=""
          className="awards-bg-watermark awards-watermark-1"
          loading="lazy"
        />
        <img
          src="/assets/images/recycle.png"
          alt=""
          className="awards-bg-watermark awards-watermark-2"
          loading="lazy"
        />
        <div className="awards-glow-orb awards-glow-orb--1"></div>
        <div className="awards-glow-orb awards-glow-orb--2"></div>
      </div>

      {/* Page Heading & Hero Section */}
      <section className="blog-page-hero">
        <Reveal className="wrap blog-page-hero__inner">
          <h1 className="page-title">
            Featured in National Media —<br />
            <span className="blog-title-accent">Stories of Innovation &amp; Impact</span>
          </h1>
          <p className="page-subtitle">
            National press highlights ScrapVenture’s startup seed funding, green technology leadership, and circular economy milestones across Bangladesh.
          </p>
        </Reveal>
      </section>

      {/* Campaign Effects & Environmental Impact Section */}
      {campaignEffects.length > 0 && (
        <section style={{ padding: '20px 0 60px 0', position: 'relative', zIndex: 2 }}>
          <div className="wrap">
            <Reveal>
              <div style={{ textAlign: 'center', marginBottom: 36 }}>
                <span className="eyebrow">Verified Climate Results</span>
                <h2 style={{ fontSize: 32, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
                  Live Campaign <span style={{ color: '#269c26' }}>Effects &amp; Milestones</span>
                </h2>
                <p style={{ color: '#64748b', fontSize: 16, maxWidth: 640, margin: '8px auto 0' }}>
                  Transparent, verifiable ecological outcomes driven by citizen participation and certified circular recycling drives.
                </p>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                  gap: 24,
                }}
              >
                {campaignEffects.map((item, idx) => (
                  <article
                    key={item.id || idx}
                    style={{
                      background: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: 18,
                      padding: 26,
                      boxShadow: '0 8px 25px rgba(0,0,0,0.04)',
                      position: 'relative',
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 4,
                        background: 'linear-gradient(90deg, #269c26, #10b981)',
                      }}
                    />
                    <div>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: 14,
                        }}
                      >
                        <span
                          className="dash-badge dash-badge--admin"
                          style={{ textTransform: 'none', fontWeight: 700 }}
                        >
                          📢 {item.campaign_title || 'National Recycling Initiative'}
                        </span>
                        <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>
                          Effect #{idx + 1}
                        </span>
                      </div>

                      <h3
                        style={{
                          fontSize: 18,
                          fontWeight: 800,
                          color: '#0f172a',
                          marginBottom: 12,
                          lineHeight: 1.4,
                        }}
                      >
                        Ecological &amp; Community Outcome
                      </h3>

                      <p
                        style={{
                          fontSize: 14,
                          color: '#475569',
                          lineHeight: 1.6,
                        }}
                      >
                        {item.effect}
                      </p>
                    </div>

                    <div
                      style={{
                        marginTop: 20,
                        paddingTop: 14,
                        borderTop: '1px solid #f1f5f9',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        fontSize: 12,
                        color: '#16a34a',
                        fontWeight: 700,
                      }}
                    >
                      <span>✓ Field Verified Impact Metric</span>
                    </div>
                  </article>
                ))}
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* Press Coverage & Newspaper Articles Section */}
      <section className="blog-articles-section">
        <div className="wrap">
          <div className="news-cards-grid">
            {newsArticles.map((article, idx) => (
              <Reveal
                as="article"
                className={`news-card news-card--delay-${idx + 1}`}
                key={article.id}
              >
                {/* Newspaper Article Image Media */}
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

                  <h3 className="news-card__title">
                    <a href={article.link} target="_blank" rel="noopener noreferrer">
                      {article.title}
                    </a>
                  </h3>

                  {article.englishTitle && (
                    <p className="news-card__english-title">
                      {article.englishTitle}
                    </p>
                  )}

                  {/* Beginning Lines Excerpt with Prominent Fade Effect */}
                  <div className="news-card__excerpt-box">
                    <p className="news-card__excerpt-text">
                      {article.excerpt}
                    </p>
                    {/* The Fade Effect: Smooth gradient dissolution at the bottom */}
                    <div className="news-card__fade-overlay" aria-hidden="true"></div>
                  </div>

                  {/* Footer with Link to Corresponding Newspaper Article */}
                  <div className="news-card__footer">
                    <a
                      href={article.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="news-card__read-more-link"
                      title={`Read full paper on ${article.paperEnglish}`}
                    >
                      <span>Read More</span>
                      <ArrowIcon size={15} strokeWidth="2.4" />
                    </a>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
