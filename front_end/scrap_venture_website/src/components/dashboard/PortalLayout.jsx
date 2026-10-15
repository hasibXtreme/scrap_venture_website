import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getStoredUser, logoutAdmin, logoutCollector, logoutCustomer } from '../../utils/api.js';

export default function PortalLayout({
  children,
  portalRole = 'admin', // 'admin' | 'collector' | 'customer'
  breadcrumb = [],
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = getStoredUser();

  useEffect(() => {
    if (!currentUser) {
      if (portalRole === 'admin') navigate('/admin-login', { replace: true });
      else if (portalRole === 'collector') navigate('/collector-login', { replace: true });
      else navigate('/customer-login', { replace: true });
      return;
    }

    if (portalRole === 'admin' && currentUser.role !== 'admin' && currentUser.role !== 'moderator') {
      navigate('/admin-login', { replace: true });
    } else if (portalRole === 'collector' && currentUser.role !== 'scrap_collector' && currentUser.role !== 'collector') {
      navigate('/collector-login', { replace: true });
    } else if (portalRole === 'customer' && currentUser.role !== 'customer') {
      navigate('/customer-login', { replace: true });
    }
  }, [currentUser, portalRole, navigate]);

  if (!currentUser) {
    return null;
  }

  const handleLogout = async () => {
    if (portalRole === 'admin') {
      await logoutAdmin();
      navigate('/admin-login', { replace: true });
    } else if (portalRole === 'collector') {
      await logoutCollector();
      navigate('/collector-login', { replace: true });
    } else {
      await logoutCustomer();
      navigate('/customer-login', { replace: true });
    }
  };

  // Nav menus for the 3 dashboards
  const adminNav = [
    {
      key: 'dashboard',
      label: 'Dashboard',
      to: '/admin/dashboard',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="7" height="7" x="3" y="3" rx="1" />
          <rect width="7" height="7" x="14" y="3" rx="1" />
          <rect width="7" height="7" x="14" y="14" rx="1" />
          <rect width="7" height="7" x="3" y="14" rx="1" />
        </svg>
      ),
    },
    {
      key: 'users',
      label: 'Users',
      to: '/admin/users',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
    {
      key: 'marketplace',
      label: 'Marketplace',
      to: '/admin/market-orders',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" />
          <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
          <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" />
          <path d="M2 7h20" />
        </svg>
      ),
    },
    {
      key: 'scrap-pickup',
      label: 'Scrap Pickup',
      to: '/admin/scrap-orders',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
          <path d="M15 18H9" />
          <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62l-3.32-4.15A1 1 0 0 0 17.68 8H14v10" />
          <circle cx="17" cy="18.5" r="2.5" />
          <circle cx="7" cy="18.5" r="2.5" />
        </svg>
      ),
    },
    {
      key: 'scrap-types',
      label: 'Scrap Materials / Rates',
      to: '/admin/scrap-types',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
      ),
    },
    {
      key: 'employees-collectors',
      label: 'Employees / Collectors',
      to: '/admin/employees-collectors',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="18" height="18" x="3" y="3" rx="2" />
          <path d="M7 7h10" />
          <path d="M7 12h10" />
          <path d="M7 17h6" />
        </svg>
      ),
    },
    {
      key: 'team-members',
      label: 'Team Members',
      to: '/admin/team-members',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
    {
      key: 'awards',
      label: 'Awards',
      to: '/admin/awards',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
          <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
          <path d="M4 22h16" />
          <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
          <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
          <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
        </svg>
      ),
    },
    {
      key: 'campaigns',
      label: 'Campaigns',
      to: '/admin/campaigns',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m3 11 18-5v12L3 14v-3z" />
          <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
        </svg>
      ),
    },
  ];

  const collectorNav = [
    {
      key: 'dashboard',
      label: 'Dashboard',
      to: '/collector/dashboard',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="7" height="7" x="3" y="3" rx="1" />
          <rect width="7" height="7" x="14" y="3" rx="1" />
          <rect width="7" height="7" x="14" y="14" rx="1" />
          <rect width="7" height="7" x="3" y="14" rx="1" />
        </svg>
      ),
    },
    {
      key: 'pickups',
      label: 'Pickup Tasks',
      to: '/collector/dashboard#tasks',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
          <circle cx="17" cy="18.5" r="2.5" />
          <circle cx="7" cy="18.5" r="2.5" />
        </svg>
      ),
    },
    {
      key: 'profile',
      label: 'My Profile & Area',
      to: '/collector/dashboard#profile',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
    },
  ];

  const customerNav = [
    {
      key: 'dashboard',
      label: 'Overview',
      to: '/customer/dashboard',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="7" height="7" x="3" y="3" rx="1" />
          <rect width="7" height="7" x="14" y="3" rx="1" />
          <rect width="7" height="7" x="14" y="14" rx="1" />
          <rect width="7" height="7" x="3" y="14" rx="1" />
        </svg>
      ),
    },
    {
      key: 'market-orders',
      label: 'Eco Market Orders',
      to: '/customer/dashboard#market-orders',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" />
          <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
          <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" />
          <path d="M2 7h20" />
        </svg>
      ),
    },
    {
      key: 'book-pickup',
      label: 'Book Scrap Pickup',
      to: '/book-pickup',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="16" />
          <line x1="8" y1="12" x2="16" y2="12" />
        </svg>
      ),
    },
    {
      key: 'marketplace',
      label: 'Upcycled Market',
      to: '/marketplace',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
          <path d="M3 6h18" />
        </svg>
      ),
    },
    {
      key: 'profile',
      label: 'Account Settings',
      to: '/customer/dashboard#profile',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
    },
  ];

  const currentNav =
    portalRole === 'collector'
      ? collectorNav
      : portalRole === 'customer'
      ? customerNav
      : adminNav;

  const roleBadgeText =
    portalRole === 'collector'
      ? 'COLLECTOR PORTAL'
      : portalRole === 'customer'
      ? 'USER PORTAL'
      : 'ADMIN PANEL';

  const roleBadgeClass =
    portalRole === 'collector'
      ? 'portal-brand__badge--collector'
      : portalRole === 'customer'
      ? 'portal-brand__badge--customer'
      : 'portal-brand__badge--admin';

  const userName =
    currentUser?.name ||
    (portalRole === 'admin' ? 'Administrator' : portalRole === 'collector' ? 'Field Collector' : 'Valued Member');

  const userSubRole =
    currentUser?.role ||
    (portalRole === 'admin' ? 'Super Administrator' : portalRole === 'collector' ? 'Certified Collector' : 'Eco Member');

  return (
    <div className="portal-root">
      {/* DEEP GREEN SIDEBAR */}
      <aside className="portal-sidebar" aria-label="Portal Navigation">
        {/* Brand header */}
        <div className="portal-sidebar__header">
          <Link to={portalRole === 'admin' ? '/admin/dashboard' : portalRole === 'collector' ? '/collector/dashboard' : '/customer/dashboard'} className="portal-brand">
            <div className="portal-brand__logo">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
                <path d="M15 18H9" />
                <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62l-3.32-4.15A1 1 0 0 0 17.68 8H14v10" />
                <circle cx="17" cy="18.5" r="2.5" />
                <circle cx="7" cy="18.5" r="2.5" />
              </svg>
            </div>
            <div className="portal-brand__text">
              <span className="portal-brand__title">Scrap Venture</span>
              <span className={`portal-brand__badge ${roleBadgeClass}`}>{roleBadgeText}</span>
            </div>
          </Link>
        </div>

        {/* Sidebar Nav Items */}
        <nav className="portal-sidebar__nav">
          {currentNav.map((item) => {
            const isActive =
              location.pathname === item.to ||
              (item.to !== '/admin/dashboard' && item.to !== '/collector/dashboard' && item.to !== '/customer/dashboard' && location.pathname.startsWith(item.to));

            return (
              <Link
                key={item.key}
                to={item.to}
                className={`portal-nav-link ${isActive ? 'active' : ''} ${
                  portalRole === 'collector'
                    ? 'portal-nav-link--collector'
                    : portalRole === 'customer'
                    ? 'portal-nav-link--customer'
                    : ''
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="portal-sidebar__footer">
          <Link
            to={portalRole === 'admin' ? '/admin/profile' : portalRole === 'collector' ? '/collector/dashboard#profile' : '/customer/dashboard#profile'}
            className="portal-footer-link"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            <span>Settings</span>
          </Link>
          <button type="button" onClick={handleLogout} className="portal-footer-link portal-footer-link--logout">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* MAIN PORTAL AREA */}
      <div className="portal-main">
        {/* Top Header bar */}
        <header className="portal-topbar">
          <div className="portal-breadcrumb">
            {breadcrumb.map((b, i) => (
              <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                {i > 0 && <span style={{ opacity: 0.5 }}>/</span>}
                {b.to ? (
                  <Link to={b.to}>{b.label}</Link>
                ) : (
                  <span className="current">{b.label}</span>
                )}
              </span>
            ))}
          </div>

          <div className="portal-topbar__right">
            <Link to="/" className="portal-view-site-btn">
              <span>View Site</span>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </Link>

            <div className="portal-user-badge">
              <div className="portal-user-avatar">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="portal-user-meta">
                <span className="portal-user-name">{userName}</span>
                <span className="portal-user-role">{userSubRole}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Section */}
        <main className="portal-content">
          {children}
        </main>
      </div>
    </div>
  );
}
