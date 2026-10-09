import { useEffect, useRef, useState, Children, cloneElement } from 'react';

/**
 * ScrollStack Component
 * Overlapping card stack reveals on scroll with depth layering.
 * Inspired by React Bits (https://reactbits.dev/components/scroll-stack)
 */
export default function ScrollStack({
  children,
  className = '',
  itemDistance = 200,   // Distance in px between cards before docking
  baseTop = 110,        // Starting sticky top offset in px
  topOffset = 26,       // Visible tab offset for each stacked card in px
  scaleIncrement = 0.04,// Scale decrement per stacked card
}) {
  const containerRef = useRef(null);
  const cardRefs = useRef([]);
  const [transforms, setTransforms] = useState([]);

  const validChildren = Children.toArray(children);
  const totalCards = validChildren.length;

  useEffect(() => {
    let animationFrameId;

    const updateTransforms = () => {
      if (!containerRef.current) return;
      const cards = cardRefs.current.filter(Boolean);
      if (cards.length === 0) return;

      const newTransforms = cards.map((card, i) => {
        let stackCount = 0;

        for (let j = i + 1; j < cards.length; j++) {
          const nextCard = cards[j];
          if (nextCard) {
            const nextRect = nextCard.getBoundingClientRect();
            const nextTargetTop = baseTop + j * topOffset;
            const diff = nextRect.top - nextTargetTop;

            if (diff <= 0) {
              stackCount += 1;
            } else if (diff < 180) {
              // Smooth fractional interpolation as subsequent card docks
              stackCount += (180 - diff) / 180;
            }
          }
        }

        const scale = Math.max(0.86, 1 - stackCount * scaleIncrement);
        const brightness = Math.max(0.88, 1 - stackCount * 0.03);
        const shadowSpread = Math.min(18, stackCount * 5);

        return {
          scale,
          brightness,
          shadowSpread,
          isStacked: stackCount > 0.05,
        };
      });

      setTransforms(newTransforms);
    };

    const onScroll = () => {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(updateTransforms);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    updateTransforms();

    const timer = setTimeout(updateTransforms, 100);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      clearTimeout(timer);
    };
  }, [baseTop, topOffset, scaleIncrement, totalCards]);

  return (
    <div className={`scroll-stack-wrapper ${className}`} ref={containerRef}>
      {validChildren.map((child, idx) => {
        const isLast = idx === totalCards - 1;
        const currentTransform = transforms[idx] || { scale: 1, brightness: 1, shadowSpread: 0 };
        const stickyTop = baseTop + idx * topOffset;

        return (
          <div
            key={idx}
            ref={(el) => (cardRefs.current[idx] = el)}
            className={`scroll-stack-card-slot ${currentTransform.isStacked ? 'is-stacked' : ''}`}
            style={{
              position: 'sticky',
              top: `${stickyTop}px`,
              zIndex: idx + 1,
              transform: `scale(${currentTransform.scale})`,
              transformOrigin: 'top center',
              filter: `brightness(${currentTransform.brightness})`,
              marginBottom: isLast ? '0px' : `${itemDistance}px`,
              transition: 'transform 0.12s ease-out, filter 0.15s ease-out',
            }}
          >
            {child}
          </div>
        );
      })}
    </div>
  );
}
