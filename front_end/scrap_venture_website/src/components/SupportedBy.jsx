import React from 'react';

const SUPPORTERS = [
  {
    name: 'University Innovation Hub UITS',
    img: '/assets/images/supported-by/S-1-clean.png',
  },
  {
    name: 'ICT Division Bangladesh',
    img: '/assets/images/supported-by/S-2-clean.png',
  },
  {
    name: 'Bangladesh Hi-Tech Park Authority',
    img: '/assets/images/supported-by/S-3-clean.png',
  },
  {
    name: 'University Innovation Hub Program',
    img: '/assets/images/supported-by/S-4-clean.png',
  },
  {
    name: 'UNIDO Bangladesh',
    img: '/assets/images/supported-by/S-5-clean.png',
  },
  {
    name: 'Department of Environment (পরিবেশ অধিদপ্তর)',
    img: '/assets/images/supported-by/S-6-clean.png',
  },
  {
    name: 'DE!3D',
    img: '/assets/images/supported-by/S-7-clean.png',
  },
  {
    name: 'SME Foundation',
    img: '/assets/images/supported-by/S-8-clean.png',
  },
];

// Double the set per group so each group is ~2,700px wide, guaranteeing full viewport coverage
const GROUP_LOGOS = [...SUPPORTERS, ...SUPPORTERS];

export default function SupportedBy() {
  return (
    <section className="supported-by" id="supported-by" aria-label="Supported By">
      <div className="supported-marquee-outer">
        <div className="supported-marquee-track">
          {/* Primary Group */}
          <div className="supported-marquee-group">
            {GROUP_LOGOS.map((s, idx) => (
              <div
                className="supported-logo-item"
                key={`g1-${idx}`}
                title={s.name}
              >
                <img
                  src={s.img}
                  alt={s.name}
                  loading="lazy"
                  draggable="false"
                />
              </div>
            ))}
          </div>

          {/* Secondary Group (Identical duplicate for seamless 50% translate loop) */}
          <div className="supported-marquee-group" aria-hidden="true">
            {GROUP_LOGOS.map((s, idx) => (
              <div
                className="supported-logo-item"
                key={`g2-${idx}`}
                title={s.name}
              >
                <img
                  src={s.img}
                  alt=""
                  loading="lazy"
                  draggable="false"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
