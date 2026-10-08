import Reveal from './Reveal.jsx';

const BENEFITS = [
  { title: 'Fair Pricing', text: 'Get fair value for your recyclable materials.', path: 'M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' },
  { title: 'Doorstep Pickup', text: 'No need to transport heavy scrap yourself.', path: 'M3 12l9-9 9 9M5 10v10h14V10' },
  { title: 'Trusted Service', text: 'A reliable and professional pickup experience.', path: 'M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4z' },
  { title: 'Sustainable Impact', text: 'Give recyclable materials another life.', path: 'M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z' },
];

export default function WhyScrapVenture() {
  return (
    <section className="why" id="why">
      <div className="wrap">
        <div className="why-grid">
          <Reveal className="why-img">
            <img src="assets/images/why-pickup.jpg" alt="ScrapVenture pickup service weighing recyclables" loading="lazy" />
            <div className="tag"><span className="dot"></span> Every pickup, weighed transparently</div>
          </Reveal>
          <Reveal>
            <p className="eyebrow">Why Scrap Venture</p>
            <h2 className="title" style={{ marginTop: '18px' }}>Simple for you.<br />Meaningful for the planet.</h2>
            <div className="benefits" style={{ marginTop: '40px' }}>
              {BENEFITS.map((b) => (
                <div className="benefit" key={b.title}>
                  <div className="b-ico"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d={b.path} /></svg></div>
                  <div><h3>{b.title}</h3><p>{b.text}</p></div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
