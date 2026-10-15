import { useState } from 'react';

// Avatar group hover interaction (ported from script.js).
function readNum(name, fb) {
  const v = parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name));
  return isNaN(v) ? fb : v;
}
function readEase(name, fb) {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || fb;
}

const AVATARS = [1, 2, 3, 4, 5];

export default function HeroAvatars() {
  const [styles, setStyles] = useState(null);

  function setShifts(activeIdx, phase) {
    const lift = readNum('--avatar-lift', -6);
    const falloff = readNum('--avatar-falloff', 0.45);
    const scale = readNum('--avatar-scale', 1.08);
    const ease = phase === 'out'
      ? readEase('--avatar-ease-out', 'cubic-bezier(0.34, 3.85, 0.64, 1)')
      : readEase('--avatar-ease-in', 'cubic-bezier(0.22, 1, 0.36, 1)');

    setStyles(AVATARS.map(function (_, i) {
      if (activeIdx == null) {
        return { transitionTimingFunction: ease, '--shift': '0px', '--scale-active': '1', zIndex: '' };
      }
      const d = Math.abs(i - activeIdx);
      return {
        transitionTimingFunction: ease,
        '--shift': (lift * Math.pow(falloff, d)).toFixed(3) + 'px',
        '--scale-active': i === activeIdx ? scale.toString() : '1',
        zIndex: i === activeIdx ? '10' : (AVATARS.length - d).toString(),
      };
    }));
  }

  return (
    <div className="hero-trust-avatars" data-proto-avatars="" onMouseLeave={() => setShifts(null, 'out')}>
      {AVATARS.map((n, i) => (
        <div className="hero-avatar" key={n} style={styles ? styles[i] : undefined} onMouseEnter={() => setShifts(i, 'in')}>
          <img src={`assets/images/avatar-${n}.jpg`} alt={`Happy customer ${n}`} width="40" height="40" loading="eager" />
        </div>
      ))}
    </div>
  );
}
