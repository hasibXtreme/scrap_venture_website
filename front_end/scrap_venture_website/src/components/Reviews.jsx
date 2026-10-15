import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import Reveal from './Reveal.jsx';
import { StarIcon } from './icons.jsx';
import reviews from '../data/reviews.js';

// Reviews carousel (auto-sliding, responsive sets, dots, pause on hover, touch swipe),
// ported from script.js.
function getCardsPerPage() {
  if (window.innerWidth <= 640) return 1;
  if (window.innerWidth <= 960) return 2;
  return 3;
}

const TOTAL_CARDS = reviews.length;
const getTotalPages = () => Math.ceil(TOTAL_CARDS / getCardsPerPage());

function useCountUp(endValue, duration = 1400, decimals = 1, triggerRef = null) {
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
      { threshold: 0.2 }
    );

    observer.observe(triggerRef.current);
    return () => observer.disconnect();
  }, [triggerRef]);

  useEffect(() => {
    if (!inView) return;

    let frameId;
    let startTime = null;
    const easeFn = (t) => t * (2 - t);

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

    return () => {
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [inView, endValue, duration]);

  if (decimals > 0) {
    return count.toFixed(decimals);
  }
  return Math.floor(count).toLocaleString('en-US');
}

export default function Reviews() {
  const trackRef = useRef(null);
  const pageRef = useRef(0);
  const timerRef = useRef(null);
  const pausedRef = useRef(false);
  const touchStartX = useRef(0);
  const scoreBadgeRef = useRef(null);
  const reviewScore = useCountUp(4.8, 1400, 1, scoreBadgeRef);
  const [page, setPage] = useState(0);
  const [layoutTick, setLayoutTick] = useState(0);

  const goTo = useCallback((idx) => {
    const totalPages = getTotalPages();
    if (totalPages <= 0) return;
    const p = ((idx % totalPages) + totalPages) % totalPages;
    pageRef.current = p;
    setPage(p);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    stopTimer();
    timerRef.current = setInterval(function () {
      if (!pausedRef.current) goTo(pageRef.current + 1);
    }, 4500);
  }, [goTo, stopTimer]);

  // Slide the track to the current page
  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const cards = track.querySelectorAll('.rev-card');
    const targetCard = cards[Math.min(page * getCardsPerPage(), TOTAL_CARDS - 1)];
    if (targetCard && cards[0]) {
      const offset = targetCard.offsetLeft - cards[0].offsetLeft;
      track.style.transform = 'translateX(-' + offset + 'px)';
    }
  }, [page, layoutTick]);

  // Auto-slide timer
  useEffect(() => {
    startTimer();
    return stopTimer;
  }, [startTimer, stopTimer]);

  // Handle resize (debounced)
  useEffect(() => {
    let t = null;
    const onResize = () => {
      clearTimeout(t);
      t = setTimeout(function () {
        setLayoutTick((n) => n + 1);
        goTo(pageRef.current);
      }, 100);
    };
    window.addEventListener('resize', onResize);
    return () => { window.removeEventListener('resize', onResize); clearTimeout(t); };
  }, [goTo]);

  const onTouchStart = (e) => {
    if (e.touches && e.touches[0]) {
      touchStartX.current = e.touches[0].clientX;
      pausedRef.current = true;
    }
  };
  const onTouchEnd = (e) => {
    if (e.changedTouches && e.changedTouches[0]) {
      const diff = e.changedTouches[0].clientX - touchStartX.current;
      if (Math.abs(diff) > 40) {
        goTo(pageRef.current + (diff < 0 ? 1 : -1));
        startTimer();
      }
    }
    pausedRef.current = false;
  };

  return (
    <section className="reviews" id="reviews">
      <div className="wrap">
        <Reveal className="reviews-head">
          <p className="eyebrow">Customer Reviews</p>
          <h2 className="reviews-title">
            Loved &amp; trusted by <span className="reviews-title-accent">thousands of households</span> across Dhaka.
          </h2>
          <div className="reviews-summary-badge" ref={scoreBadgeRef}>
            <div className="rev-score">
              <span className="rev-stars">
                {[0, 1, 2, 3, 4].map((i) => <StarIcon key={i} size={17} />)}
              </span>
              <span className="rev-val">{reviewScore} / 5.0</span>
            </div>
            <span className="rev-badge-sep" aria-hidden="true">•</span>
            <p className="rev-note">Based on 1,200+ verified customer reviews</p>
          </div>
        </Reveal>

        {/* Reviews Carousel */}
        <Reveal
          className="reviews-carousel"
          id="reviewsCarousel"
          onMouseEnter={() => { pausedRef.current = true; }}
          onMouseLeave={() => { pausedRef.current = false; }}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div className="reviews-track" id="reviewsTrack" ref={trackRef}>
            {reviews.map((r) => (
              <div className="rev-card" key={r.name}>
                <div className="rev-top">
                  <div className="rev-stars">
                    {Array.from({ length: r.stars }, (_, i) => <StarIcon key={i} size={15} />)}
                  </div>
                  <span className="rev-badge">Verified Pickup</span>
                </div>
                <p className="rev-comment">{r.comment}</p>
                <div className="rev-author">
                  <img src={r.avatar} alt={r.name} className="rev-avatar" />
                  <div>
                    <span className="rev-name">{r.name}</span>
                    <span className="rev-meta">{r.meta}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Carousel Dots Indicator */}
          <div className="reviews-dots" id="reviewsDots" aria-label="Review pagination">
            {Array.from({ length: getTotalPages() }, (_, i) => (
              <button
                key={i}
                className={'reviews-dot' + (i === page ? ' active' : '')}
                aria-label={'Go to review set ' + (i + 1)}
                onClick={() => { goTo(i); startTimer(); }}
              />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
