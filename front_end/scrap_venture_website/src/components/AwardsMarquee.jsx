import Reveal from './Reveal.jsx';
import awards from '../data/awards.js';

function AchCard({ award, duplicate }) {
  return (
    <div className="ach-card" aria-hidden={duplicate ? 'true' : undefined}>
      <div className="ach-card-photo">
        <img src={award.img} alt={duplicate ? '' : award.title} loading="lazy" draggable="false" />
      </div>
      <div className="ach-card-body">
        <span className="ach-card-org">{award.date}</span>
        <span className="ach-card-title">{award.title}</span>
        <p className="ach-card-desc">{award.desc}</p>
      </div>
    </div>
  );
}

export default function AwardsMarquee() {
  return (
    <section className="awards" id="awards">
      <Reveal className="wrap awards-head">
        <p className="eyebrow">Awards &amp; Recognition</p>
        <h2 className="awards-marquee-title">
          Honored for driving <span className="awards-title-accent">sustainable innovation</span> and circular impact.
        </h2>
      </Reveal>

      {/* Marquee — scrolls right to left */}
      <div className="ach-marquee-outer">
        <div className="ach-marquee-track">
          {awards.map((a) => <AchCard key={a.img} award={a} />)}
          {/* Duplicate set for seamless loop */}
          {awards.map((a) => <AchCard key={'dup-' + a.img} award={a} duplicate />)}
        </div>
      </div>
    </section>
  );
}
