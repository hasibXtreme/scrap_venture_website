import SiteLayout from '../components/SiteLayout.jsx';
import Reveal from '../components/Reveal.jsx';
import { ArrowIcon, NewspaperIcon } from '../components/icons.jsx';
import newsArticles from '../data/news.js';

export default function Blog() {
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
