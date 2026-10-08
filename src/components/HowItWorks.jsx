import { useEffect, useRef, useState } from 'react';
import Reveal from './Reveal.jsx';

const STEPS = [
  { num: '01', img: 'book.png', imgClass: 'how-img--book', alt: 'Calendar – Book a pickup', title: 'Book', desc: 'Schedule a convenient pickup in just a few clicks.' },
  { num: '02', img: 'pickup.png', imgClass: 'how-img--truck', alt: 'Truck – Pickup your scrap', title: 'Pickup', desc: 'Our team arrives at your doorstep on time.' },
  { num: '03', img: 'weigh.png', imgClass: 'how-img--scale', alt: 'Scale – Weigh your materials', title: 'Weigh', desc: 'Your recyclable materials are weighed transparently.' },
  { num: '04', img: 'money.png', imgClass: 'how-img--money', alt: 'Money – Get paid', title: 'Get Paid', desc: 'Receive fair payment for your recyclable materials.' },
];

// Step sequential reveal (stagger), ported from script.js.
function HowStep({ index, step }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let t;
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          t = setTimeout(function () { setShown(true); }, (index % 4) * 120);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    io.observe(el);
    return () => { io.disconnect(); clearTimeout(t); };
  }, [index]);

  return (
    <div className={'how-col how-step' + (shown ? ' in' : '')} data-step={index + 1} ref={ref}>
      <div className="how-num-wrap">
        <div className="how-num">{step.num}</div>
      </div>
      <div className="how-img-wrap">
        <img src={`assets/images/${step.img}`} className={'how-img ' + step.imgClass} alt={step.alt} draggable="false" />
      </div>
      <h3 className="how-col-title">{step.title}</h3>
      <p className="how-col-desc">{step.desc}</p>
    </div>
  );
}

export default function HowItWorks() {
  return (
    <section className="how" id="how">
      <div className="how-overlay" aria-hidden="true"></div>
      <div className="wrap">
        <Reveal className="how-head">
          <p className="eyebrow">How It Works</p>
          <p className="how-subtitle">Simple steps to turn scrap into value.</p>
        </Reveal>

        <Reveal className="how-timeline">
          {STEPS.map((s, i) => <HowStep key={s.num} index={i} step={s} />)}
        </Reveal>
      </div>
    </section>
  );
}
