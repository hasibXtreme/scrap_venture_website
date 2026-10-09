import Reveal from './Reveal.jsx';
import ScrollStack from './ScrollStack.jsx';
import {
  ScaleIcon,
  TruckIcon,
  ShieldCheckIcon,
  RecycleIcon,
  RealisticRecycleIcon,
  CheckCircleIcon,
} from './pickup/pickupIcons.jsx';

const WHY_POINTS = [
  {
    num: '01',
    tag: 'TRANSPARENT VALUATION',
    title: 'Fair Pricing & Real-Time Rates',
    text: 'Get the true market-linked value for every kilogram of recyclable materials. With certified digital scales calibrated on-site, you get 100% honest pricing with zero hidden deductions or broker markups.',
    highlights: [
      'Certified Digital Scales (±50g)',
      'Live Market-Linked Rates',
      'Zero Hidden Cuts or Deductions',
    ],
    icon: ScaleIcon,
    accentColor: '#10b981',
    badgeBg: '#ecfdf5',
    themeClass: 'why-card--emerald',
  },
  {
    num: '02',
    tag: 'EFFORTLESS LOGISTICS',
    title: 'Convenient Doorstep Pickup',
    text: 'No need to transport heavy cartons, old newspapers, or metal scraps yourself. Pick a convenient date and time slot that fits your schedule, and our dedicated collection team arrives right at your doorstep.',
    highlights: [
      'Flexible Date & Time Slots',
      'Heavy Lifting Handled by Us',
      'Prompt Van & Pickup Arrival',
    ],
    icon: TruckIcon,
    accentColor: '#0d9488',
    badgeBg: '#f0fdfa',
    themeClass: 'why-card--teal',
  },
  {
    num: '03',
    tag: 'SAFETY & INTEGRITY',
    title: 'Trusted Service & Instant Payment',
    text: 'Experience professional, dignified scrap collection with background-checked and uniformed collectors. Once materials are digitally weighed, receive immediate spot cash or instant digital payout via bKash or Nagad.',
    highlights: [
      'Verified & Background-Checked Collectors',
      'Instant bKash, Nagad or Spot Cash',
      '10,000+ Satisfied Customers',
    ],
    icon: ShieldCheckIcon,
    accentColor: '#0284c7',
    badgeBg: '#f0f9ff',
    themeClass: 'why-card--blue',
  },
  {
    num: '04',
    tag: 'CIRCULAR IMPACT',
    title: 'Sustainable Circular Recycling',
    text: 'Give your recyclable materials a genuine second life. Every kilogram collected is sorted, categorized, and supplied directly to certified industrial recyclers, preventing tons of scrap from polluting local landfills.',
    highlights: [
      '100% Traceable Circular Recycling',
      '50+ Tons Diverted from Landfills Monthly',
      'Clean & Green Environmental Mission',
    ],
    icon: RealisticRecycleIcon,
    accentColor: '#16a34a',
    badgeBg: '#f0fdf4',
    themeClass: 'why-card--green',
  },
];

export default function WhyScrapVenture() {
  return (
    <section className="why" id="why">
      <div className="wrap">
        {/* Top Header */}
        <Reveal className="why-header">
          <p className="eyebrow">Why Scrap Venture</p>
          <h2 className="title why-title">
            Simple for you.<br />Meaningful for the planet.
          </h2>
          <p className="why-subtitle">
            Experience transparent digital scrap collection right from your doorstep with fair pricing and verified collectors.
          </p>
        </Reveal>

        {/* 2-Column Split Layout: Left Sticky Image + Right ScrollStack Cards */}
        <div className="why-split-grid">
          {/* Left Column: Image (Sticky while right side scrolls) */}
          <div className="why-image-col">
            <div className="why-sticky-img-card">
              <img
                src="assets/images/why-pickup.jpg"
                alt="ScrapVenture Doorstep Pickup and Digital Weighing"
                loading="lazy"
              />
            </div>
          </div>

          {/* Right Column: Scroll Stack Cards */}
          <div className="why-stack-col">
            <ScrollStack
              className="why-scroll-stack"
              itemDistance={135}
              baseTop={115}
              topOffset={26}
              scaleIncrement={0.038}
            >
              {WHY_POINTS.map((point) => {
                const Icon = point.icon;
                return (
                  <div
                    key={point.num}
                    className={`why-stack-card ${point.themeClass}`}
                  >
                    {/* Top Glowing Color Accent Bar */}
                    <div
                      className="why-card-top-accent"
                      style={{
                        background: `linear-gradient(90deg, ${point.accentColor}, #22c55e)`,
                      }}
                    />

                    {/* Card Top Header */}
                    <div className="why-card-head">
                      <div className="why-card-pill-group">
                        <span
                          className="why-card-num-badge"
                          style={{
                            background: point.badgeBg,
                            color: point.accentColor,
                            borderColor: point.accentColor,
                          }}
                        >
                          {point.num}
                        </span>
                        <span className="why-card-tag">{point.tag}</span>
                      </div>

                      <div
                        className="why-card-icon-wrap"
                        style={{
                          background: point.badgeBg,
                          color: point.accentColor,
                        }}
                      >
                        <Icon size={24} color={point.accentColor} />
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="why-card-body">
                      <h3 className="why-card-title">{point.title}</h3>
                      <p className="why-card-desc">{point.text}</p>
                    </div>

                    {/* Card Highlights */}
                    <div className="why-card-highlights">
                      {point.highlights.map((h, i) => (
                        <div key={i} className="why-highlight-pill">
                          <CheckCircleIcon size={16} color={point.accentColor} />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </ScrollStack>
          </div>
        </div>
      </div>
    </section>
  );
}
