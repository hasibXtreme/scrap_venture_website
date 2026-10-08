import Reveal from './Reveal.jsx';
import { ArrowIcon, ExternalLinkIcon, NewspaperIcon } from './icons.jsx';
import newsArticles from '../data/news.js';

export default function Blog() {
  return (
    <section className="blog" id="blog">
      <div className="wrap">
        <Reveal className="sec-head">
          <div>
            <p className="eyebrow">Press &amp; Media Coverage</p>
            <h2 className="title">
              Featured in National Media —<br />Stories of Innovation &amp; Impact
            </h2>
          </div>
          <p className="desc">
            National press highlights ScrapVenture’s startup seed funding, green technology leadership, and circular economy milestones across Bangladesh.
          </p>
        </Reveal>

        {/* Media Trust Highlight Strip */}
        <Reveal className="news-trust-strip">
          <div className="news-trust-strip__info">
            <div className="news-trust-strip__icon">
              <NewspaperIcon size={20} />
            </div>
            <div>
              <h4 className="news-trust-strip__title">Featured in Dainik Amader Shomoy (দৈনিক আমাদের সময়)</h4>
              <p className="news-trust-strip__desc">
                Leading national daily newspaper documenting our university startup incubator victories and global accolades.
              </p>
            </div>
          </div>
          <span className="news-trust-strip__tag">
            <NewspaperIcon size={14} /> 3 Verified Publications
          </span>
        </Reveal>

        {/* 3 Newspaper Cards with Beginning Lines, Fade Effect & Actual External Links */}
        <div className="news-cards-grid">
          {newsArticles.map((article) => (
            <Reveal as="article" className="news-card" key={article.id}>
              {/* Newspaper Article Image */}
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

        {/* Action footer */}
        <Reveal className="blog-footer">
          <a
            href="https://www.dainikamadershomoy.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost-dark"
          >
            Visit Dainik Amader Shomoy Archive <ExternalLinkIcon size={14} />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
