import Reveal from './Reveal.jsx';
import { ArrowIcon } from './icons.jsx';

const MATERIALS = [
  { img: 'mat-paper.jpg', alt: 'Recycled paper materials', name: 'Paper', examples: 'Newsprint · Office Paper · Magazines', lg: true },
  { img: 'mat-metal.jpg', alt: 'Scrap metal materials', name: 'Metal', examples: 'Copper · Aluminum · Iron' },
  { img: 'mat-plastic.jpg', alt: 'Plastic bottle materials', name: 'Plastic', examples: 'PET · HDPE · Containers' },
  { img: 'mat-ewaste.jpg', alt: 'Electronic waste materials', name: 'E-Waste', examples: 'Circuit Boards · Devices · Cables' },
  { img: 'mat-cardboard.jpg', alt: 'Cardboard materials', name: 'Cardboard', examples: 'Boxes · Packaging · Cartons' },
];

export default function Materials() {
  return (
    <section className="materials" id="materials">
      <div className="wrap">
        <Reveal className="sec-head">
          <div>
            <p className="eyebrow">What We Collect</p>
            <h2 className="title">Different scrap.<br />One purpose.</h2>
          </div>
          <p className="desc">From everyday paper to old electronics, we collect materials that deserve another life.</p>
        </Reveal>

        <Reveal className="mosaic">
          {MATERIALS.map((m) => (
            <a href="#cta" className={'mat-card' + (m.lg ? ' lg' : '')} key={m.name}>
              <img src={`assets/images/${m.img}`} alt={m.alt} loading="lazy" />
              <div className="mat-card-content">
                <div className="m-name">{m.name}</div>
                <div className="m-examples">{m.examples}</div>
                <div className="m-link">Explore <ArrowIcon size={13} strokeWidth="2.6" /></div>
              </div>
            </a>
          ))}
        </Reveal>

        <Reveal className="mat-footer">
          <p>Don't see your material?</p>
          <a href="#footer" className="m-link" style={{ color: 'var(--green)' }}>View All Materials <ArrowIcon size={13} strokeWidth="2.6" /></a>
        </Reveal>
      </div>
    </section>
  );
}
