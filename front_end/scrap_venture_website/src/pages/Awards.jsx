import { useState, useEffect } from 'react';
import SiteLayout from '../components/SiteLayout.jsx';
import Reveal from '../components/Reveal.jsx';
import defaultAwards from '../data/awards.js';
import { fetchPublicAwards } from '../utils/api.js';

export default function Awards() {
  const [awardList, setAwardList] = useState(defaultAwards);

  useEffect(() => {
    fetchPublicAwards()
      .then((res) => {
        if (res?.awards && res.awards.length > 0) {
          const mapped = res.awards.map((a, idx) => ({
            id: a.id,
            img: a.image_url
              ? (a.image_url.startsWith('http') || a.image_url.startsWith('/') ? a.image_url : `/${a.image_url}`)
              : `/assets/awards/${(idx % 6) + 1}.jpg`,
            title: a.title,
            date: a.date_won
              ? new Date(a.date_won).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
              : 'Verified Recognition',
            desc: a.description,
            tag: defaultAwards.find(
              (d) => d.title?.toLowerCase().trim() === a.title?.toLowerCase().trim()
            )?.tag || 'Official Milestone Recognition',
          }));
          setAwardList(mapped);
        }
      })
      .catch((err) => {
        console.warn('Failed to fetch public awards, using default:', err);
      });
  }, []);

  return (
    <SiteLayout variant="awards" main mainClassName="awards-page-main">
      {/* Ambient Eco Decorative Elements in Background */}
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
        <img
          src="/assets/images/recycle.png"
          alt=""
          className="awards-bg-watermark awards-watermark-3"
          loading="lazy"
        />
        <img
          src="/assets/images/recycle.png"
          alt=""
          className="awards-bg-watermark awards-watermark-4"
          loading="lazy"
        />
        <div className="awards-glow-orb awards-glow-orb--1"></div>
        <div className="awards-glow-orb awards-glow-orb--2"></div>
        <div className="awards-glow-orb awards-glow-orb--3"></div>
      </div>

      {/* Page Heading & Hero Intro */}
      <section className="awards-page-hero">
        <Reveal className="wrap awards-page-hero__inner">
          <h1 className="page-title">
            Honors, Awards &amp; <span className="awards-title-accent">National Recognition</span>
          </h1>
          <p className="page-subtitle">
            Recognized for pioneering digital waste management, circular innovation, and sustainable environmental impact across Bangladesh.
          </p>
        </Reveal>
      </section>

      {/* Editorial Awards Showcase with Left-Slide Image & Down-Slide Content */}
      <section className="awards-list-section">
        <div className="wrap">
          <div className="awards-list">
            {awardList.map((a, idx) => (
              <Reveal
                as="article"
                className="award-item"
                key={a.id || a.title + idx}
              >
                <div className="award-item__media">
                  <span className="award-card-tag">Milestone #{idx + 1}</span>
                  <img
                    src={a.img}
                    alt={a.title}
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = '/assets/images/recycle.png';
                    }}
                  />
                </div>

                <div className="award-item__content">
                  <div className="award-item__meta">
                    <span className="award-item__tag">{a.tag}</span>
                    <span className="award-item__sep">•</span>
                    <span className="award-item__date">{a.date}</span>
                  </div>
                  <h2 className="award-item__title">{a.title}</h2>
                  <p className="award-item__desc">{a.desc}</p>
                  <div className="award-item__highlight">
                    <span>Verified Milestone Achievement</span>
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
