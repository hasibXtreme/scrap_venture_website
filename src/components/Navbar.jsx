import { useState } from 'react';
import { ArrowIcon } from './icons.jsx';

const HOME_LINKS = [
  ['#top', 'Home'], ['#why', 'About'], ['team.html', 'Our Team'], ['#materials', 'Materials'], ['awards.html', 'Awards'],
  ['#reviews', 'Reviews'], ['blog.html', 'Blog'], ['#footer', 'Contact'],
];
const AWARDS_LINKS = [
  ['index.html', 'Home'], ['index.html#why', 'About'], ['team.html', 'Our Team'], ['index.html#materials', 'Materials'], ['awards.html', 'Awards'],
  ['index.html#reviews', 'Reviews'], ['blog.html', 'Blog'], ['#footer', 'Contact'],
];
const TEAM_LINKS = [
  ['index.html', 'Home'], ['index.html#why', 'About'], ['team.html', 'Our Team'], ['index.html#materials', 'Materials'], ['awards.html', 'Awards'],
  ['index.html#reviews', 'Reviews'], ['blog.html', 'Blog'], ['#footer', 'Contact'],
];
const COLLECTOR_LINKS = [
  ['/', 'Home'], ['/#why', 'About'], ['/team', 'Our Team'], ['/#materials', 'Materials'], ['/awards.html', 'Awards'],
  ['/#reviews', 'Reviews'], ['/blog', 'Blog'], ['#footer', 'Contact'],
];
const BLOG_LINKS = [
  ['index.html', 'Home'], ['index.html#why', 'About'], ['team.html', 'Our Team'], ['index.html#materials', 'Materials'], ['awards.html', 'Awards'],
  ['index.html#reviews', 'Reviews'], ['blog.html', 'Blog'], ['#footer', 'Contact'],
];

const VARIANTS = {
  home: { headerClass: 'nav', brandHref: '#top', links: HOME_LINKS, desktopActive: 'Home', mobileActive: null },
  awards: { headerClass: 'nav nav-page', brandHref: 'index.html', links: AWARDS_LINKS, desktopActive: 'Awards', mobileActive: 'Awards' },
  team: { headerClass: 'nav nav-page', brandHref: 'index.html', links: TEAM_LINKS, desktopActive: 'Our Team', mobileActive: 'Our Team' },
  collector: { headerClass: 'nav nav-page', brandHref: '/', links: COLLECTOR_LINKS, desktopActive: null, mobileActive: null },
  blog: { headerClass: 'nav nav-page', brandHref: 'index.html', links: BLOG_LINKS, desktopActive: 'Blog', mobileActive: 'Blog' },
};


export default function Navbar({ variant, scrolled }) {
  const v = VARIANTS[variant] || VARIANTS.collector;
  const [open, setOpen] = useState(false);
  const closeMenu = () => setOpen(false);

  return (
    <>
      <header className={v.headerClass + (scrolled ? ' scrolled' : '')} id="siteNav">
        <div className="wrap nav-row">
          <a href={v.brandHref} className="brand"><img src="/assets/images/logo.png" alt="ScrapVenture logo" /></a>
          <ul className="nav-links">
            {v.links.map(([href, label]) => (
              <li key={label}><a href={href} className={label === v.desktopActive ? 'active' : undefined}>{label}</a></li>
            ))}
          </ul>
          <div className="nav-actions">
            <a href="#footer" className="btn btn-outline">Download App</a>
            <a href="#cta" className="btn btn-solid">Book a Pickup{' '}
              <ArrowIcon />
            </a>
            <button className={'burger' + (open ? ' open' : '')} id="burgerBtn" aria-label="Open menu" onClick={() => setOpen(!open)}><span></span></button>
          </div>
        </div>
      </header>

      <div className={'mobile-menu' + (open ? ' open' : '')} id="mobileMenu">
        {v.links.map(([href, label]) => (
          <a key={label} href={href} className={label === v.mobileActive ? 'active' : undefined} onClick={closeMenu}>{label}</a>
        ))}
        <a href="#cta" className="btn btn-solid" onClick={closeMenu}>Book a Pickup →</a>
      </div>
    </>
  );
}
