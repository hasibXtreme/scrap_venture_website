// Ported 1:1 from script.js. Lenis is only used if a global `Lenis` exists
// (the original pages never load assets/lenis.min.js, so this stays inactive
// exactly like before; adding that <script> tag to index.html would enable it).
export function startLenis(onScroll) {
  if (typeof window.Lenis === 'undefined' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return null;
  }
  const lenis = new window.Lenis({
    duration: 1.2,
    easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 1.5,
  });
  let rafId;
  function raf(time) {
    lenis.raf(time);
    rafId = requestAnimationFrame(raf);
  }
  rafId = requestAnimationFrame(raf);
  lenis.on('scroll', function (e) { onScroll(e.scroll); });
  lenis.stop_ = function () { cancelAnimationFrame(rafId); lenis.destroy(); };
  return lenis;
}
