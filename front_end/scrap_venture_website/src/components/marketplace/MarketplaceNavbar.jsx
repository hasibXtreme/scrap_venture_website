import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMarketplace } from '../../context/MarketplaceContext.jsx';

export default function MarketplaceNavbar() {
  const {
    cartCount,
    wishlistCount,
    searchQuery,
    setSearchQuery,
    setIsCartOpen,
    selectedCategory,
    setSelectedCategory,
    orders,
    setActiveOrder,
  } = useMarketplace();

  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="mp-navbar">
      <div className="mp-navbar-wrap">
        {/* Brand / Logo */}
        <div className="mp-nav-left">
          <Link to="/" className="mp-brand" title="Back to Home">
            <img src="/assets/images/logo.png" alt="ScrapVenture logo" height="34" />
          </Link>
          <div className="mp-pill-badge">
            <span className="mp-pulse-dot"></span>
            Marketplace
          </div>
        </div>

        {/* Search Bar */}
        <div className={`mp-nav-search ${isSearchFocused ? 'focused' : ''}`}>
          <svg className="mp-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            placeholder="Search recycled & sustainable products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
          />
          {searchQuery && (
            <button className="mp-search-clear" onClick={() => setSearchQuery('')} aria-label="Clear search">
              ✕
            </button>
          )}
        </div>

        {/* Nav Links & Actions */}
        <div className="mp-nav-right">
          <Link to="/" className="mp-nav-link home-return-link">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            <span>Home</span>
          </Link>

          <a href="#products-grid" className="mp-nav-link" onClick={() => setSelectedCategory('all')}>
            <span>Categories</span>
          </a>

          {/* Orders Tracking Button */}
          {orders.length > 0 && (
            <button
              className="mp-nav-link-btn"
              onClick={() => setActiveOrder(orders[0])}
              title="Track your recent order"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="3" width="15" height="13"></rect>
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                <circle cx="5.5" cy="18.5" r="2.5"></circle>
                <circle cx="18.5" cy="18.5" r="2.5"></circle>
              </svg>
              <span>Track Order</span>
            </button>
          )}

          {/* Wishlist Button */}
          <a href="#products-grid" className="mp-icon-btn" title="View Wishlist">
            <svg width="20" height="20" viewBox="0 0 24 24" fill={wishlistCount > 0 ? '#ef4444' : 'none'} stroke={wishlistCount > 0 ? '#ef4444' : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
            {wishlistCount > 0 && <span className="mp-badge wishlist-badge">{wishlistCount}</span>}
          </a>

          {/* Cart Button */}
          <button
            className="mp-cart-btn"
            onClick={() => setIsCartOpen(true)}
            aria-label="Open Shopping Cart"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            <span className="mp-cart-label">Cart</span>
            <span className="mp-badge cart-badge">{cartCount}</span>
          </button>

          {/* Mobile burger toggle */}
          <button
            className="mp-mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {mobileMenuOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </>
              ) : (
                <>
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mp-mobile-menu">
          <Link to="/" onClick={() => setMobileMenuOpen(false)}>Home Page</Link>
          <a href="#products-grid" onClick={() => { setSelectedCategory('all'); setMobileMenuOpen(false); }}>All Categories</a>
          <button onClick={() => { setIsCartOpen(true); setMobileMenuOpen(false); }}>
            Shopping Cart ({cartCount})
          </button>
          {orders.length > 0 && (
            <button onClick={() => { setActiveOrder(orders[0]); setMobileMenuOpen(false); }}>
              Recent Order Tracking
            </button>
          )}
        </div>
      )}
    </header>
  );
}

