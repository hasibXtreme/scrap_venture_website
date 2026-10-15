import { useEffect, useState } from 'react';
import { startLenis } from '../utils/lenis.js';

// Navbar "scrolled" state + smooth anchor scrolling (ported from script.js).
export default function useSiteScroll() {
  const [scrolled, setScrolled] = useState(() => window.scrollY > 40);

  useEffect(() => {
    const update = (y) => setScrolled(y > 40);
    const onScroll = () => update(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    const lenis = startLenis(update);

    // Smooth scroll for anchor links with fixed navbar offset
    const onClick = (e) => {
      const anchor = e.target.closest && e.target.closest('a[href^="#"]');
      if (!anchor) return;
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;
      const target = href === '#top' ? document.body : document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      const nav = document.getElementById('siteNav');
      const navHeight = nav ? (window.innerWidth <= 560 ? 65 : 76) : 70;

      if (lenis) {
        lenis.scrollTo(target, {
          offset: href === '#top' ? 0 : -navHeight,
          duration: 1.1,
        });
      } else {
        const topPos = href === '#top' ? 0 : target.getBoundingClientRect().top + window.pageYOffset - navHeight;
        window.scrollTo({ top: topPos, behavior: 'smooth' });
      }

      if (history.pushState && href !== '#top') {
        history.pushState(null, null, href);
      }
    };
    document.addEventListener('click', onClick);

    return () => {
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('click', onClick);
      if (lenis) lenis.stop_();
    };
  }, []);

  return scrolled;
}
