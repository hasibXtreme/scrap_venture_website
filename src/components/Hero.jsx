import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import HeroAvatars from './HeroAvatars.jsx';
import { ArrowIcon } from './icons.jsx';

function useCountUp(endValue, duration = 1600, decimals = 0, delay = 0, triggerRef = null) {
  const [count, setCount] = useState(0);
  const [inView, setInView] = useState(!triggerRef);

  useEffect(() => {
    if (!triggerRef || !triggerRef.current) {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(triggerRef.current);
    return () => observer.disconnect();
  }, [triggerRef]);

  useEffect(() => {
    if (!inView) return;

    let frameId;
    let timeoutId;

    timeoutId = setTimeout(() => {
      let startTime = null;

      // Easing curve:
      // For large numbers (10,000): cubic ease-out
      // For smaller numbers (50, 4.8): smooth quad ease-out so every number transition is clearly visible
      const easeFn = endValue > 100 
        ? (t) => 1 - Math.pow(1 - t, 3) 
        : (t) => t * (2 - t);

      const animate = (currentTime) => {
        if (!startTime) startTime = currentTime;
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = easeFn(progress);
        const currentVal = eased * endValue;

        setCount(currentVal);

        if (progress < 1) {
          frameId = requestAnimationFrame(animate);
        } else {
          setCount(endValue);
        }
      };

      frameId = requestAnimationFrame(animate);
    }, delay);

    return () => {
      clearTimeout(timeoutId);
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [inView, endValue, duration, delay]);

  if (decimals > 0) {
    return count.toFixed(decimals);
  }
  return Math.floor(count).toLocaleString('en-US');
}

export default function Hero() {
  const heroStatsRef = useRef(null);
  const customersCount = useCountUp(10000, 1800, 0, 400);
  const ratingCount = useCountUp(4.8, 1600, 1, 950, heroStatsRef);
  const tonsCount = useCountUp(50, 1600, 0, 1050, heroStatsRef);

  return (
    <section className="hero" id="top">
      <div className="hero-bg"></div>
      <div className="wrap hero-inner">
        <h1>
          <span className="line"><b>Don't throw it away.</b></span>
          <span className="line"><b>Turn it into <span className="accent">value.</span></b></span>
        </h1>
        <p className="lead">We collect your recyclable scrap from your doorstep and give it a second life.</p>
        <div className="hero-trust">
          <HeroAvatars />
          <div className="hero-trust-content">
            <div className="hero-trust-header">
              <span className="hero-trust-num">{customersCount}+ Happy Customers</span>
            </div>
          </div>
        </div>
        <div className="hero-ctas">
          <Link
            to="/book-pickup"
            className="btn btn-solid"
          >
            Book a Pickup{' '}
            <ArrowIcon />
          </Link>
          <Link
            to="/become-a-collector"
            className="btn btn-outline btn-glass hero-btn-collector"
          >
            Become a Collector{' '}
            <ArrowIcon />
          </Link>
        </div>
        <div className="hero-stats" ref={heroStatsRef}>
          <div className="hero-stat">
            <div className="num">{ratingCount}/5</div>
            <div className="lbl">Average Rating</div>
          </div>
          <div className="hero-stat">
            <div className="num">{tonsCount}+ Tons</div>
            <div className="lbl">Recycled Monthly</div>
          </div>
        </div>
      </div>
    </section>
  );
}
