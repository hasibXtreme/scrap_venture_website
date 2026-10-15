import { Link } from 'react-router-dom';
import Reveal from './Reveal.jsx';
import { ArrowIcon } from './icons.jsx';

export default function CtaFinal() {
  return (
    <section className="cta-final" id="cta">
      <img src="assets/image/recycle.png" className="cta-recycle cta-recycle--tl" alt="" aria-hidden="true" />
      <img src="assets/image/recycle.png" className="cta-recycle cta-recycle--br" alt="" aria-hidden="true" />
      <Reveal className="wrap cta-inner">
        <h2>Your scrap has value.</h2>
        <p>Give it another life. We'll take care of the rest.</p>
        <Link to="/book-pickup" className="btn btn-solid">
          Book a Pickup <ArrowIcon />
        </Link>
      </Reveal>
    </section>
  );
}
