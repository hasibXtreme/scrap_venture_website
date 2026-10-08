const HOME = {
  quick: [['#top', 'Home'], ['#why', 'About'], ['team.html', 'Our Team'], ['#how', 'How It Works'], ['awards.html', 'Awards'], ['#reviews', 'Reviews'], ['#blog', 'Blog']],
  materials: '#materials',
};
const AWARDS = {
  quick: [['index.html', 'Home'], ['index.html#why', 'About'], ['team.html', 'Our Team'], ['index.html#how', 'How It Works'], ['awards.html', 'Awards'], ['index.html#reviews', 'Reviews'], ['index.html#blog', 'Blog']],
  materials: 'index.html#materials',
};
const TEAM = {
  quick: [['index.html', 'Home'], ['index.html#why', 'About'], ['team.html', 'Our Team'], ['index.html#how', 'How It Works'], ['awards.html', 'Awards'], ['index.html#reviews', 'Reviews'], ['index.html#blog', 'Blog']],
  materials: 'index.html#materials',
};
const COLLECTOR = {
  quick: [['/', 'Home'], ['/#why', 'About'], ['/team', 'Our Team'], ['/#how', 'How It Works'], ['/awards.html', 'Awards'], ['/#reviews', 'Reviews'], ['/#blog', 'Blog']],
  materials: '/#materials',
};

export default function Footer({ variant }) {
  const f = variant === 'home' ? HOME : (variant === 'team' ? TEAM : (variant === 'collector' ? COLLECTOR : AWARDS));
  return (
    <footer id="footer">
      <div className="wrap">
        <div className="foot-grid">
          <div className="foot-brand">
            <img src="/assets/images/logo.png" alt="ScrapVenture logo" />
            <p>ScrapVenture collects recyclable scrap straight from your doorstep and gives it a second life — for you, and for the planet.</p>
            <div className="foot-social">
              <a href="#" aria-label="Facebook"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.4h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12z" /></svg></a>
              <a href="#" aria-label="Instagram"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" /></svg></a>
              <a href="#" aria-label="LinkedIn"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 8.98h4v12H3v-12zm7 0h3.8v1.64h.05c.53-1 1.83-2.06 3.76-2.06 4.02 0 4.76 2.65 4.76 6.1v6.32h-4v-5.6c0-1.34-.02-3.06-1.87-3.06-1.87 0-2.16 1.46-2.16 2.96v5.7h-4v-12z" /></svg></a>
            </div>
          </div>
          <div className="foot-col">
            <h4>Quick Links</h4>
            <ul>
              {f.quick.map(([href, label]) => <li key={label}><a href={href}>{label}</a></li>)}
            </ul>
          </div>
          <div className="foot-col">
            <h4>Materials</h4>
            <ul>
              {['Paper', 'Metal', 'Plastic', 'E-Waste'].map((m) => <li key={m}><a href={f.materials}>{m}</a></li>)}
            </ul>
          </div>
          <div className="foot-col">
            <h4>Contact</h4>
            <ul>
              <li><a href="mailto:hello@scrapventure.xyz">hello@scrapventure.xyz</a></li>
              <li><a href="tel:+8800000000">+880 000-0000</a></li>
              <li>Dhaka, Bangladesh</li>
            </ul>
            <a href="#" className="app-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2" /><path d="M11 18h2" /></svg>{' '}
              Download App
            </a>
          </div>
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
