import { useEffect, useRef, useState } from 'react';

// Same behaviour as the original ".reveal" IntersectionObserver in script.js:
// adds the "in" class once, the first time the element scrolls into view.
export default function Reveal({ as: Tag = 'div', className = '', children, ...rest }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          setShown(true);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const cls = [className, 'reveal', shown ? 'in' : ''].filter(Boolean).join(' ');
  return <Tag ref={ref} className={cls} {...rest}>{children}</Tag>;
}
