import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowIcon, DownloadIcon, UserIcon, TruckIcon, ChevronDownIcon } from './icons.jsx';

const HOME_LINKS = [
  ['#top', 'Home'],
  ['/marketplace', 'MarketPlace'],
  ['/team', 'Our Team'],
  ['/awards.html', 'Awards'],
  ['/blog', 'Blog'],
  ['/contact', 'Contact'],
];

const AWARDS_LINKS = [
  ['/', 'Home'],
  ['/marketplace', 'MarketPlace'],
  ['/team', 'Our Team'],
  ['/awards.html', 'Awards'],
  ['/blog', 'Blog'],
  ['/contact', 'Contact'],
];

const MARKETPLACE_LINKS = [
  ['/', 'Home'],
  ['/marketplace', 'MarketPlace'],
  ['/team', 'Our Team'],
  ['/awards.html', 'Awards'],
  ['/blog', 'Blog'],
  ['/contact', 'Contact'],
];

const TEAM_LINKS = [
  ['/', 'Home'],
  ['/marketplace', 'MarketPlace'],
  ['/team', 'Our Team'],
  ['/awards.html', 'Awards'],
  ['/blog', 'Blog'],
  ['/contact', 'Contact'],
];

const BLOG_LINKS = [
  ['/', 'Home'],
  ['/marketplace', 'MarketPlace'],
  ['/team', 'Our Team'],
  ['/awards.html', 'Awards'],
  ['/blog', 'Blog'],
  ['/contact', 'Contact'],
];

const CONTACT_LINKS = [
  ['/', 'Home'],
  ['/marketplace', 'MarketPlace'],
  ['/team', 'Our Team'],
  ['/awards.html', 'Awards'],
  ['/blog', 'Blog'],
  ['/contact', 'Contact'],
];

const VARIANTS = {
  home: {
    headerClass: 'nav',
    brandHref: '#top',
    links: HOME_LINKS,
    desktopActive: 'Home',
    mobileActive: null,
    downloadHref: '#footer',
    pickupHref: '/book-pickup',
  },
  awards: {
    headerClass: 'nav nav-page',
    brandHref: '/',
    links: AWARDS_LINKS,
    desktopActive: 'Awards',
    mobileActive: 'Awards',
    downloadHref: '/#footer',
    pickupHref: '/book-pickup',
  },
  team: {
    headerClass: 'nav nav-page',
    brandHref: '/',
    links: TEAM_LINKS,
    desktopActive: 'Our Team',
    mobileActive: 'Our Team',
    downloadHref: '/#footer',
    pickupHref: '/book-pickup',
  },
  marketplace: {
    headerClass: 'nav nav-page',
    brandHref: '/',
    links: MARKETPLACE_LINKS,
    desktopActive: 'MarketPlace',
    mobileActive: 'MarketPlace',
    downloadHref: '#footer',
    pickupHref: '/book-pickup',
  },
  bookPickup: {
    headerClass: 'nav nav-page',
    brandHref: '/',
    links: MARKETPLACE_LINKS,
    desktopActive: 'Book a Pickup',
    mobileActive: 'Book a Pickup',
    downloadHref: '#footer',
    pickupHref: '/book-pickup',
  },
  collector: {
    headerClass: 'nav nav-page',
    brandHref: '/',
    links: TEAM_LINKS,
    desktopActive: null,
    mobileActive: null,
    downloadHref: '/#footer',
    pickupHref: '/book-pickup',
  },
  blog: {
    headerClass: 'nav nav-page',
    brandHref: '/',
    links: BLOG_LINKS,
    desktopActive: 'Blog',
    mobileActive: 'Blog',
    downloadHref: '/#footer',
    pickupHref: '/book-pickup',
  },
  contact: {
    headerClass: 'nav nav-page',
    brandHref: '/',
    links: CONTACT_LINKS,
    desktopActive: 'Contact',
    mobileActive: 'Contact',
    downloadHref: '/#footer',
    pickupHref: '/book-pickup',
  },
};

import { getStoredUser, clearStoredUser } from '../utils/api.js';

export default function Navbar({ variant, scrolled }) {
  const v = VARIANTS[variant] || VARIANTS.home;
  const [open, setOpen] = useState(false);
  const [loginMenuOpen, setLoginMenuOpen] = useState(false);
  const loginDropdownRef = useRef(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    setCurrentUser(getStoredUser());
  }, []);

  const closeMenu = () => {
    setOpen(false);
    setLoginMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        loginDropdownRef.current &&
        !loginDropdownRef.current.contains(event.target)
      ) {
        setLoginMenuOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setLoginMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <>
      <header className={v.headerClass + (scrolled ? ' scrolled' : '')} id="siteNav">
        <div className="wrap nav-row">
          <a href={v.brandHref} className="brand">
            <img src="/assets/images/logo.png" alt="ScrapVenture logo" />
          </a>
          <ul className="nav-links">
            {v.links.map(([href, label]) => {
              const isInternalRoute =
                href === '/marketplace' ||
                href === '/awards.html' ||
                href === '/awards' ||
                href === '/' ||
                href === '/team' ||
                href === '/become-a-collector' ||
                href === '/blog' ||
                href === '/blog.html';
              return (
                <li key={label}>
                  {isInternalRoute ? (
                    <Link to={href} className={label === v.desktopActive ? 'active' : undefined}>
                      {label}
                    </Link>
                  ) : (
                    <a href={href} className={label === v.desktopActive ? 'active' : undefined}>
                      {label}
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
          <div className="nav-actions">
            <a
              href={v.downloadHref}
              className="btn btn-outline nav-download-btn"
            >
              <DownloadIcon size={16} />
              <span>Download App</span>
            </a>

            {!currentUser && (
              <Link
                to="/customer-register"
                className="btn btn-outline nav-register-btn"
                style={{
                  padding: '9px 18px',
                  borderRadius: '999px',
                  fontWeight: 600,
                  fontSize: '14px',
                  color: '#059669',
                  borderColor: '#10b981',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>Register</span>
              </Link>
            )}

            {/* Login Button with Interactive Dropdown */}
            {/* Login or User Dashboard Button */}
            <div className="nav-login-wrapper" ref={loginDropdownRef}>
              <button
                type="button"
                className={`btn btn-solid nav-login-trigger ${loginMenuOpen ? 'active' : ''}`}
                onClick={() => setLoginMenuOpen((prev) => !prev)}
                aria-haspopup="true"
                aria-expanded={loginMenuOpen}
              >
                {currentUser?.role === 'scrap_collector' ? (
                  <TruckIcon size={16} />
                ) : (
                  <UserIcon size={16} />
                )}
                <span>
                  {currentUser
                    ? currentUser.role === 'admin'
                      ? 'Admin Portal'
                      : currentUser.role === 'scrap_collector'
                      ? 'Collector Portal'
                      : 'My Account'
                    : 'Login'}
                </span>
                <ChevronDownIcon
                  size={14}
                  className={`nav-login-caret ${loginMenuOpen ? 'rotate' : ''}`}
                />
              </button>

              {loginMenuOpen && (
                <div className="nav-login-dropdown" role="menu">
                  {currentUser ? (
                    <>
                      <div className="nav-login-dropdown-header">
                        <span>Signed In ({currentUser.email || currentUser.role})</span>
                      </div>

                      {currentUser.role === 'admin' && (
                        <>
                          <Link
                            to="/admin/dashboard"
                            className="nav-login-dropdown-item"
                            role="menuitem"
                            onClick={() => setLoginMenuOpen(false)}
                          >
                            <div className="nav-login-item-icon nav-login-item-icon--customer">
                              <UserIcon size={18} />
                            </div>
                            <div className="nav-login-item-info">
                              <span className="nav-login-item-title">Admin Dashboard</span>
                              <span className="nav-login-item-sub">Charts &amp; Master Control</span>
                            </div>
                            <ArrowIcon size={13} className="nav-login-item-arrow" />
                          </Link>

                          <Link
                            to="/admin/register"
                            className="nav-login-dropdown-item"
                            role="menuitem"
                            onClick={() => setLoginMenuOpen(false)}
                          >
                            <div className="nav-login-item-icon nav-login-item-icon--customer">
                              🛡️
                            </div>
                            <div className="nav-login-item-info">
                              <span className="nav-login-item-title">Register Admins</span>
                              <span className="nav-login-item-sub">Provision new moderators</span>
                            </div>
                            <ArrowIcon size={13} className="nav-login-item-arrow" />
                          </Link>

                          <Link
                            to="/admin/profile"
                            className="nav-login-dropdown-item"
                            role="menuitem"
                            onClick={() => setLoginMenuOpen(false)}
                          >
                            <div className="nav-login-item-info">
                              <span className="nav-login-item-title">Admin Profile</span>
                            </div>
                          </Link>
                        </>
                      )}

                      {currentUser.role === 'scrap_collector' && (
                        <Link
                          to="/collector/dashboard"
                          className="nav-login-dropdown-item"
                          role="menuitem"
                          onClick={() => setLoginMenuOpen(false)}
                        >
                          <div className="nav-login-item-icon nav-login-item-icon--collector">
                            <TruckIcon size={18} />
                          </div>
                          <div className="nav-login-item-info">
                            <span className="nav-login-item-title">Collector Dashboard</span>
                            <span className="nav-login-item-sub">Scrap stats &amp; fleet info</span>
                          </div>
                          <ArrowIcon size={13} className="nav-login-item-arrow" />
                        </Link>
                      )}

                      {currentUser.role === 'customer' && (
                        <Link
                          to="/customer/dashboard"
                          className="nav-login-dropdown-item"
                          role="menuitem"
                          onClick={() => setLoginMenuOpen(false)}
                        >
                          <div className="nav-login-item-icon nav-login-item-icon--customer">
                            <UserIcon size={18} />
                          </div>
                          <div className="nav-login-item-info">
                            <span className="nav-login-item-title">User Dashboard</span>
                            <span className="nav-login-item-sub">Orders &amp; Scrap Sold Stats</span>
                          </div>
                          <ArrowIcon size={13} className="nav-login-item-arrow" />
                        </Link>
                      )}

                      <button
                        type="button"
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: '12px 16px',
                          color: '#dc2626',
                          fontSize: 13,
                          fontWeight: 700,
                          borderTop: '1px solid #e2e8f0',
                          cursor: 'pointer',
                          background: 'none',
                          border: 'none',
                        }}
                        onClick={() => {
                          clearStoredUser();
                          setCurrentUser(null);
                          setLoginMenuOpen(false);
                          window.location.href = '/';
                        }}
                      >
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="nav-login-dropdown-header">
                        <span>Choose Login Portal</span>
                      </div>

                      <Link
                        to="/customer-login"
                        className="nav-login-dropdown-item"
                        role="menuitem"
                        onClick={() => setLoginMenuOpen(false)}
                      >
                        <div className="nav-login-item-icon nav-login-item-icon--customer">
                          <UserIcon size={18} />
                        </div>
                        <div className="nav-login-item-info">
                          <span className="nav-login-item-title">User Login</span>
                          <span className="nav-login-item-sub">Sell scrap &amp; manage bookings</span>
                        </div>
                        <ArrowIcon size={13} className="nav-login-item-arrow" />
                      </Link>

                      <Link
                        to="/collector-login"
                        className="nav-login-dropdown-item"
                        role="menuitem"
                        onClick={() => setLoginMenuOpen(false)}
                      >
                        <div className="nav-login-item-icon nav-login-item-icon--collector">
                          <TruckIcon size={18} />
                        </div>
                        <div className="nav-login-item-info">
                          <span className="nav-login-item-title">Collector Login</span>
                          <span className="nav-login-item-sub">Authorized collection partners</span>
                        </div>
                        <ArrowIcon size={13} className="nav-login-item-arrow" />
                      </Link>

                      <Link
                        to="/admin-login"
                        className="nav-login-dropdown-item"
                        role="menuitem"
                        onClick={() => setLoginMenuOpen(false)}
                      >
                        <div className="nav-login-item-icon" style={{ background: '#fef3c7', color: '#b45309' }}>
                          🛡️
                        </div>
                        <div className="nav-login-item-info">
                          <span className="nav-login-item-title">Admin Login</span>
                          <span className="nav-login-item-sub">Master operations gateway</span>
                        </div>
                        <ArrowIcon size={13} className="nav-login-item-arrow" />
                      </Link>

                      <div className="nav-login-dropdown-header" style={{ borderTop: '1px solid #e2e8f0', marginTop: 8, paddingTop: 10 }}>
                        <span>New to ScrapVenture?</span>
                      </div>

                      <Link
                        to="/customer-register"
                        className="nav-login-dropdown-item"
                        role="menuitem"
                        onClick={() => setLoginMenuOpen(false)}
                      >
                        <div className="nav-login-item-icon" style={{ background: '#dcfce7', color: '#15803d' }}>
                          ✨
                        </div>
                        <div className="nav-login-item-info">
                          <span className="nav-login-item-title">Register as Customer</span>
                          <span className="nav-login-item-sub">Sell scrap &amp; get doorstep cash</span>
                        </div>
                        <ArrowIcon size={13} className="nav-login-item-arrow" />
                      </Link>

                      <Link
                        to="/become-a-collector"
                        className="nav-login-dropdown-item"
                        role="menuitem"
                        onClick={() => setLoginMenuOpen(false)}
                      >
                        <div className="nav-login-item-icon nav-login-item-icon--collector">
                          <TruckIcon size={18} />
                        </div>
                        <div className="nav-login-item-info">
                          <span className="nav-login-item-title">Join as Collector</span>
                          <span className="nav-login-item-sub">Apply for logistics fleet</span>
                        </div>
                        <ArrowIcon size={13} className="nav-login-item-arrow" />
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            <button
              className={'burger' + (open ? ' open' : '')}
              id="burgerBtn"
              aria-label="Open menu"
              onClick={() => setOpen(!open)}
            >
              <span></span>
            </button>
          </div>
        </div>
      </header>

      <div className={'mobile-menu' + (open ? ' open' : '')} id="mobileMenu">
        {v.links.map(([href, label]) => {
          const isInternalRoute =
            href === '/marketplace' ||
            href === '/awards.html' ||
            href === '/awards' ||
            href === '/' ||
            href === '/team' ||
            href === '/become-a-collector' ||
            href === '/blog' ||
            href === '/blog.html';
          return isInternalRoute ? (
            <Link
              key={label}
              to={href}
              className={label === v.mobileActive ? 'active' : undefined}
              onClick={closeMenu}
            >
              {label}
            </Link>
          ) : (
            <a
              key={label}
              href={href}
              className={label === v.mobileActive ? 'active' : undefined}
              onClick={closeMenu}
            >
              {label}
            </a>
          );
        })}
        <a
          href={v.downloadHref}
          className="btn btn-outline"
          onClick={closeMenu}
          style={{ marginBottom: 12, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
        >
          <DownloadIcon size={18} />
          <span>Download App</span>
        </a>

        {/* Mobile Login & Register Options */}
        <div className="mobile-login-box">
          <Link
            to="/customer-register"
            className="btn btn-solid mobile-login-btn"
            onClick={closeMenu}
            style={{ background: 'linear-gradient(135deg, #059669 0%, #047857 100%)', marginBottom: 6 }}
          >
            <span>✨ Register New Account</span>
          </Link>
          <Link
            to="/customer-login"
            className="btn btn-outline mobile-login-btn"
            onClick={closeMenu}
          >
            <UserIcon size={16} />
            <span>User Login</span>
          </Link>
          <Link
            to="/collector-login"
            className="btn btn-outline mobile-login-btn"
            onClick={closeMenu}
          >
            <TruckIcon size={16} />
            <span>Collector Login</span>
          </Link>
        </div>
      </div>
    </>
  );
}
