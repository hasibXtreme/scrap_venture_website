import { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowIcon } from './icons.jsx';
import Reveal from './Reveal.jsx';

const STEPS = [
  {
    num: '01',
    img: 'book.png',
    imgClass: 'how-img--book',
    alt: 'Calendar – Book a pickup',
    title: 'Book',
    desc: 'Schedule a convenient pickup in just a few clicks.',
    isTop: true,
  },
  {
    num: '02',
    img: 'pickup.png',
    imgClass: 'how-img--truck',
    alt: 'Truck – Pickup your scrap',
    title: 'Pickup',
    desc: 'Our team arrives at your doorstep on time.',
    isTop: false,
  },
  {
    num: '03',
    img: 'weigh.png',
    imgClass: 'how-img--scale',
    alt: 'Scale – Weigh your materials',
    title: 'Weigh',
    desc: 'Your recyclable materials are weighed transparently.',
    isTop: true,
  },
  {
    num: '04',
    img: 'money.png',
    imgClass: 'how-img--money',
    alt: 'Money – Get paid',
    title: 'Get Paid',
    desc: 'Receive fair payment for your recyclable materials.',
    isTop: false,
  },
];

export default function HowItWorks() {
  const trackRef = useRef(null);
  const stickyRef = useRef(null);
  const timelineRef = useRef(null);
  const nodeRefs = useRef([]);
  const pathRef = useRef(null);
  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);

  const [pathData, setPathData] = useState('');
  const [pathLength, setPathLength] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Dynamically compute the S-curve / snake-like bezier path connecting the 4 step nodes
  const updateSvgPath = useCallback(() => {
    if (!timelineRef.current) return;
    const containerRect = timelineRef.current.getBoundingClientRect();
    const nodes = nodeRefs.current.filter(Boolean);
    if (nodes.length < 4) return;

    // Center coordinates of each step node relative to the timeline container
    const points = nodes.map((node) => {
      const r = node.getBoundingClientRect();
      return {
        x: r.left - containerRect.left + r.width / 2,
        y: r.top - containerRect.top + r.height / 2,
      };
    });

    const [p0, p1, p2, p3] = points;

    // Smooth cubic bezier wave connecting p0 -> p1 -> p2 -> p3 (snake motion)
    const dx01 = (p1.x - p0.x) * 0.50;
    const dx12 = (p2.x - p1.x) * 0.50;
    const dx23 = (p3.x - p2.x) * 0.50;

    const d = `M ${p0.x} ${p0.y} C ${p0.x + dx01} ${p0.y}, ${p1.x - dx01} ${p1.y}, ${p1.x} ${p1.y} C ${p1.x + dx12} ${p1.y}, ${p2.x - dx12} ${p2.y}, ${p2.x} ${p2.y} C ${p2.x + dx23} ${p2.y}, ${p3.x - dx23} ${p3.y}, ${p3.x} ${p3.y}`;

    setPathData(d);
  }, []);

  // Update total path length whenever pathData changes
  useEffect(() => {
    const measureLength = () => {
      if (pathRef.current && pathData) {
        try {
          const len = pathRef.current.getTotalLength();
          if (len > 0) setPathLength(len);
        } catch {
          // SVG length fallback
        }
      }
    };
    measureLength();
    const id = requestAnimationFrame(measureLength);
    return () => cancelAnimationFrame(id);
  }, [pathData]);

  // ResizeObserver to automatically re-anchor the SVG bezier line when layout shifts
  useEffect(() => {
    if (!timelineRef.current) return;
    const ro = new ResizeObserver(() => {
      updateSvgPath();
    });
    ro.observe(timelineRef.current);
    return () => ro.disconnect();
  }, [updateSvgPath]);

  // Handle sticky scroll progress: pins section while mouse scrolls smoothly through the snake line
  useEffect(() => {
    let animationFrameId;

    const handleScroll = () => {
      if (!trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Track height is taller than viewport. Section is pinned while rect.top <= 0.
      const totalScrollable = rect.height - windowHeight;
      if (totalScrollable <= 0) return;

      const currentScroll = -rect.top;

      // ENTRANCE & EXIT DEADZONES:
      // When scrolling down, section sticks when rect.top <= 0.
      // During entrance buffer, progress stays strictly 0.0 (Step 1 sits still).
      // Arrival momentum settles in this buffer, so the line never starts moving until user scrolls again.
      // During activeRange, line moves smoothly from Step 1 to Step 4.
      // During exit buffer, line stays 100% complete before unpinning.
      const entranceBuffer = Math.min(220, Math.max(160, totalScrollable * 0.12));
      const exitBuffer = Math.min(220, Math.max(160, totalScrollable * 0.12));
      const activeRange = totalScrollable - entranceBuffer - exitBuffer;

      let p = 0;
      if (currentScroll <= entranceBuffer) {
        p = 0;
      } else if (currentScroll >= totalScrollable - exitBuffer) {
        p = 1;
      } else if (activeRange > 0) {
        p = (currentScroll - entranceBuffer) / activeRange;
      }

      p = Math.max(0, Math.min(1, p));
      targetProgressRef.current = p;
    };

    // Fast-settling, responsive RAF interpolation (no trailing drift / creeping after scroll stops)
    const updateSmoothProgress = () => {
      const target = targetProgressRef.current;
      const current = currentProgressRef.current;
      const diff = target - current;

      if (Math.abs(diff) > 0.0008) {
        currentProgressRef.current = current + diff * 0.50;
        setScrollProgress(currentProgressRef.current);
      } else if (current !== target) {
        currentProgressRef.current = target;
        setScrollProgress(target);
      }

      animationFrameId = requestAnimationFrame(updateSmoothProgress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', updateSvgPath, { passive: true });

    // Initial calculations
    updateSvgPath();
    handleScroll();
    currentProgressRef.current = targetProgressRef.current;
    setScrollProgress(targetProgressRef.current);

    animationFrameId = requestAnimationFrame(updateSmoothProgress);

    const t1 = setTimeout(() => {
      updateSvgPath();
      handleScroll();
    }, 150);

    const t2 = setTimeout(() => {
      updateSvgPath();
      handleScroll();
    }, 500);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateSvgPath);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [updateSvgPath]);

  // Line progress is 1:1 with scrollProgress (entrance and exit buffers are handled above)
  const lineProgress = scrollProgress;

  // Activation thresholds for each step along the path (1 to 4)
  const isStepActive = (index) => {
    if (typeof window !== 'undefined' && window.innerWidth <= 820) return true;
    if (index === 0) return true;
    if (index === 1) return lineProgress >= 0.28;
    if (index === 2) return lineProgress >= 0.62;
    if (index === 3) return lineProgress >= 0.95;
    return false;
  };

  const strokeDashoffset = pathLength > 0 ? pathLength * (1 - lineProgress) : 2000;

  return (
    <section className="how-pin-section" id="how" ref={trackRef}>
      <div className="how-sticky-frame">
        <div className="how-overlay" aria-hidden="true"></div>
        <div className="wrap how-sticky-content">
          <div className="how-head">
            <p className="eyebrow">How It Works</p>
            <h2 className="title how-title">Simple steps to turn scrap into value.</h2>
            <p className="how-subtitle">Scroll down to see the pickup journey unfold.</p>
          </div>

          {/* Timeline Wrap containing SVG Snake Line & Clean Staggered Columns */}
          <div className="how-timeline-wrap" ref={timelineRef}>
            {/* Animated SVG Snake Curve */}
            <svg className="how-snake-svg" aria-hidden="true">
              <defs>
                <linearGradient id="howSnakeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#22c55e" />
                  <stop offset="50%" stopColor="#188746" />
                  <stop offset="100%" stopColor="#15803d" />
                </linearGradient>
              </defs>

              {/* Background Faint Track */}
              {pathData && (
                <path
                  d={pathData}
                  className="how-snake-track"
                />
              )}

              {/* Animated Active Foreground Path (Draws as user scrolls while pinned) */}
              {pathData && (
                <path
                  ref={pathRef}
                  d={pathData}
                  className="how-snake-active"
                  style={{
                    strokeDasharray: pathLength || 2000,
                    strokeDashoffset: strokeDashoffset,
                    opacity: pathLength > 0 ? 1 : 0,
                  }}
                />
              )}
            </svg>

            {/* Staggered 4 Columns (Lowered so background face is clearly visible) */}
            <div className="how-timeline-grid">
              {STEPS.map((s, i) => {
                const active = isStepActive(i);
                return (
                  <div
                    key={s.num}
                    className={`how-col ${s.isTop ? 'how-col--top' : 'how-col--bottom'} ${active ? 'is-active' : ''}`}
                  >
                    {/* Number Circle Node */}
                    <div className="how-num-wrap">
                      <div
                        className="how-num"
                        ref={(el) => (nodeRefs.current[i] = el)}
                      >
                        {s.num}
                      </div>
                    </div>

                    {/* 3D Illustration Image */}
                    <div className="how-img-wrap">
                      <img
                        src={`assets/images/${s.img}`}
                        className={'how-img ' + s.imgClass}
                        alt={s.alt}
                        draggable="false"
                      />
                    </div>

                    {/* Frosted text shield for crystal-clear readability */}
                    <div className="how-text-shield">
                      <h3 className="how-col-title">{s.title}</h3>
                      <p className="how-col-desc">{s.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Book a Pickup Button directly beneath the timeline */}
          <div className="how-cta-row">
            <Link to="/book-pickup" className="how-book-btn">
              <span>Book a Pickup</span>
              <ArrowIcon />
            </Link>
          </div>
        </div>
      </div>
    </section>
    );
}
