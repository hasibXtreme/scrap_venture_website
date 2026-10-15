import SocialFlipButton from './SocialFlipButton.jsx';

const QUICK_LINKS = [
  ['/', 'Home'],
  ['/marketplace', 'MarketPlace'],
  ['/team', 'Our Team'],
  ['/awards', 'Awards'],
  ['/blog', 'Blog'],
  ['/contact', 'Contact Us'],
];

export default function Footer({ variant }) {
  const materialsHref = variant === 'home' ? '#materials' : '/#materials';

  return (
    <footer id="footer">
      <div className="wrap">
        <div className="foot-grid">
          <div className="foot-brand">
            <img src="/assets/images/logo.png" alt="ScrapVenture logo" />
            <p>ScrapVenture collects recyclable scrap straight from your doorstep and gives it a second life — for you, and for the planet.</p>
          </div>
          <div className="foot-col">
            <h4>Quick Links</h4>
            <ul>
              {QUICK_LINKS.map(([href, label]) => (
                <li key={label}><a href={href}>{label}</a></li>
              ))}
            </ul>
          </div>
          <div className="foot-col">
            <h4>Materials</h4>
            <ul>
              {['Paper', 'Metal', 'Plastic', 'E-Waste'].map((m) => (
                <li key={m}><a href={materialsHref}>{m}</a></li>
              ))}
            </ul>
          </div>
          <div className="foot-col">
            <h4><a href="/contact" style={{ color: 'inherit', textDecoration: 'none' }}>Contact</a></h4>
            <ul>
              <li><a href="mailto:hello@scrapventure.xyz">hello@scrapventure.xyz</a></li>
              <li><a href="tel:+8801700000000">+880 1700-000000</a></li>
              <li><a href="/contact">Banani, Dhaka, Bangladesh</a></li>
            </ul>
            <a
              href="https://play.google.com/store/apps"
              target="_blank"
              rel="noopener noreferrer"
              className="foot-google-play-btn"
              title="Get ScrapVenture on Google Play"
            >
              <img
                src="/assets/images/google-play-badge.png"
                alt="Get it on Google Play"
                className="foot-google-play-img"
              />
            </a>
          </div>
        </div>

        {/* CONNECT Flip Bar - Aligned with Logo (left) and Contact/App (right) */}
        <div className="foot-connect-strip">
          <SocialFlipButton />
        </div>

        <div className="foot-bottom">
          <p>© 2026 ScrapVenture. All rights reserved.</p>
          <div className="foot-legal">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms &amp; Conditions</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

