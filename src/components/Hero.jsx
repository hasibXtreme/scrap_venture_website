import { Link } from 'react-router-dom';
import HeroAvatars from './HeroAvatars.jsx';
import { ArrowIcon } from './icons.jsx';

export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero-bg"></div>
      <div className="wrap hero-inner">
        <h1>
          <span className="line"><b>Don't throw it away.</b></span>
          <span className="line"><b>Turn it into <span className="accent">value.</span></b></span>
        </h1>
        <p className="lead">We collect your recyclable scrap from your doorstep and give it a second life.</p>
        <div className="hero-trust">
          <HeroAvatars />
          <div className="hero-trust-content">
            <div className="hero-trust-header">
              <span className="hero-trust-num">10,000+  Happy Customers</span>
            </div>
          </div>
        </div>
        <div className="hero-ctas">
          <Link
            to="/book-pickup"
            className="btn btn-solid"
          >
            Book a Pickup{' '}
            <ArrowIcon />
          </Link>
          <Link
            to="/become-a-collector"
            className="btn btn-outline btn-glass hero-btn-collector"
          >
            Become a Collector{' '}
            <ArrowIcon />
          </Link>
        </div>
        <div className="hero-stats">
          <div className="hero-stat">
            <div className="num">4.8/5</div>
            <div className="lbl">Average Rating</div>
          </div>
          <div className="hero-stat">
            <div className="num">50+ Tons</div>
            <div className="lbl">Recycled Monthly</div>
          </div>
        </div>
      </div>
    </section>
  );
}
