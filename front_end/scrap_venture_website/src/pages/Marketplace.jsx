import { useEffect } from 'react';
import SiteLayout from '../components/SiteLayout.jsx';
import { MarketplaceProvider, useMarketplace } from '../context/MarketplaceContext.jsx';
import MarketplaceHero from '../components/marketplace/MarketplaceHero.jsx';
import CategoryBar from '../components/marketplace/CategoryBar.jsx';
import ProductCard from '../components/marketplace/ProductCard.jsx';
import ProductDetailModal from '../components/marketplace/ProductDetailModal.jsx';
import CartDrawer from '../components/marketplace/CartDrawer.jsx';
import CheckoutModal from '../components/marketplace/CheckoutModal.jsx';
import OrderTrackingModal from '../components/marketplace/OrderTrackingModal.jsx';

function MarketplaceContent() {
  const {
    products,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    priceRange,
    setPriceRange,
    sortBy,
    setSortBy,
    badgeFilter,
    setBadgeFilter,
    toast,
    cartTotalCount,
    cartSubtotal,
    setIsCartOpen,
  } = useMarketplace();

  // Ensure scroll starts cleanly at top
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  const badgeFiltersList = ['all', 'Recycled', 'Eco-Friendly', 'HDPE', 'Handmade', 'Zero Waste', 'Weatherproof'];

  return (
    <SiteLayout variant="marketplace">
      <div className="marketplace-app">
        {/* Toast Notification */}
        {toast && (
          <div className={`mp-floating-toast ${toast.type || ''}`}>
            <span className="mp-floating-toast-icon">
              {toast.type === 'cart' && (
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
              )}
              {toast.type === 'wishlist' && (
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              )}
              {(toast.type === 'success' || !toast.type) && (
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              )}
              {toast.type === 'info' && (
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="16" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
              )}
            </span>
            <span className="mp-floating-toast-msg">{toast.message}</span>
          </div>
        )}

        {/* Floating Cart Trigger Pill */}
        <button
          className="mp-floating-cart-pill"
          onClick={() => setIsCartOpen(true)}
          aria-label={`Open shopping cart with ${cartTotalCount} items totaling ৳${cartSubtotal}`}
          title="Open Shopping Cart"
        >
          <span className="mp-floating-cart-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            {cartTotalCount > 0 && <span className="mp-floating-cart-badge">{cartTotalCount}</span>}
          </span>
          <span className="mp-floating-cart-info">
            <span className="mp-floating-cart-title">Cart {cartTotalCount}</span>
            <span className="mp-floating-cart-price">৳{cartSubtotal.toLocaleString()}</span>
          </span>
        </button>

        {/* Hero Section */}
        <MarketplaceHero />

        {/* Category Navigation Bar */}
        <CategoryBar />

        {/* Main Products Section with Left Sidebar Filter */}
        <section className="mp-products-section" id="products-grid">
          <div className="mp-catalog-wide-wrap mp-catalog-layout">
            {/* Left Sidebar Filter (Sticky E-Commerce Sidebar) */}
            <aside className="mp-sidebar-filter">
              <div className="mp-sidebar-header">
                <div className="mp-sidebar-title-group">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="4" y1="21" x2="4" y2="14"></line>
                    <line x1="4" y1="10" x2="4" y2="3"></line>
                    <line x1="12" y1="21" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12" y2="3"></line>
                    <line x1="20" y1="21" x2="20" y2="16"></line>
                    <line x1="20" y1="12" x2="20" y2="3"></line>
                    <line x1="1" y1="14" x2="7" y2="14"></line>
                    <line x1="9" y1="8" x2="15" y2="8"></line>
                    <line x1="17" y1="16" x2="23" y2="16"></line>
                  </svg>
                  <h3>Filters</h3>
                </div>
                {(selectedCategory !== 'all' || badgeFilter !== 'all' || priceRange < 10000 || searchQuery) && (
                  <button
                    className="mp-sidebar-reset-btn"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                      setBadgeFilter('all');
                      setPriceRange(10000);
                    }}
                    title="Reset all filters"
                  >
                    Reset All &times;
                  </button>
                )}
              </div>

              {/* Filter Group: Categories */}
              <div className="mp-filter-group">
                <h4 className="mp-filter-group-title">Product Categories</h4>
                <ul className="mp-filter-cat-list">
                  {[
                    { id: 'all', name: 'All Products' },
                    { id: 'recycled-bags', name: 'Recycled Bags' },
                    { id: 'plastic-boards', name: 'Plastic Boards' },
                    { id: 'benches', name: 'Recycled Benches' },
                    { id: 'tables', name: 'Upcycled Tables' },
                    { id: 'flower-tubs', name: 'Flower Tubs' },
                    { id: 'recycled-accessories', name: 'Recycled Accessories' },
                    { id: 'sustainable-products', name: 'Sustainable Products' },
                  ].map((cat) => {
                    const isChecked = selectedCategory === cat.id;
                    return (
                      <li key={cat.id}>
                        <button
                          className={`mp-filter-cat-btn ${isChecked ? 'active' : ''}`}
                          onClick={() => setSelectedCategory(cat.id)}
                          aria-pressed={isChecked}
                        >
                          <span className={`mp-filter-radio ${isChecked ? 'checked' : ''}`}></span>
                          <span className="mp-filter-cat-text">{cat.name}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Filter Group: Price Range */}
              <div className="mp-filter-group">
                <div className="mp-filter-group-title-row">
                  <h4 className="mp-filter-group-title">Price Range</h4>
                  <span className="mp-price-current-tag">Up to ৳{priceRange.toLocaleString()}</span>
                </div>
                <div className="mp-sidebar-price-slider">
                  <input
                    type="range"
                    min="500"
                    max="10000"
                    step="250"
                    value={priceRange}
                    onChange={(e) => setPriceRange(Number(e.target.value))}
                    aria-label="Filter by maximum price"
                  />
                  <div className="mp-price-scale-labels">
                    <span>৳500</span>
                    <span>৳5,000</span>
                    <span>৳10,000</span>
                  </div>
                </div>

                {/* Quick Price Buttons */}
                <div className="mp-price-presets">
                  <button
                    className={`mp-preset-btn ${priceRange === 1500 ? 'active' : ''}`}
                    onClick={() => setPriceRange(1500)}
                  >
                    Under ৳1,500
                  </button>
                  <button
                    className={`mp-preset-btn ${priceRange === 3000 ? 'active' : ''}`}
                    onClick={() => setPriceRange(3000)}
                  >
                    Under ৳3,000
                  </button>
                  <button
                    className={`mp-preset-btn ${priceRange === 10000 ? 'active' : ''}`}
                    onClick={() => setPriceRange(10000)}
                  >
                    Any Price
                  </button>
                </div>
              </div>

              {/* Filter Group: Badges / Attributes */}
              <div className="mp-filter-group">
                <h4 className="mp-filter-group-title">Material &amp; Attributes</h4>
                <div className="mp-sidebar-badge-chips">
                  {badgeFiltersList.map((badge) => (
                    <button
                      key={badge}
                      className={`mp-sidebar-chip ${badgeFilter === badge ? 'active' : ''}`}
                      onClick={() => setBadgeFilter(badge)}
                    >
                      {badge === 'all' ? 'All Attributes' : badge}
                    </button>
                  ))}
                </div>
              </div>

            </aside>

            {/* Right Product Catalog Area */}
            <main className="mp-catalog-main">
              {/* Catalog Top Meta & Sorting Bar */}
              <div className="mp-catalog-top-bar">
                <div className="mp-catalog-results-count">
                  <span>Showing <strong>{products.length}</strong> sustainable recycled items</span>
                </div>

                {/* Right: Sort Dropdown & Quick Cart */}
                <div className="mp-catalog-actions-right">
                  <div className="mp-sort-box">
                    <label htmlFor="sort-select">Sort by:</label>
                    <div className="mp-select-wrapper">
                      <select
                        id="sort-select"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        aria-label="Sort products by"
                      >
                        <option value="featured">Featured</option>
                        <option value="newest">Newest First</option>
                        <option value="price-asc">Price: Low to High</option>
                        <option value="price-desc">Price: High to Low</option>
                        <option value="rating">Highest Rated</option>
                      </select>
                      <svg className="mp-select-chevron" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </div>
                  </div>

                  <button
                    className="mp-quick-cart-trigger"
                    onClick={() => setIsCartOpen(true)}
                    aria-label="Open Shopping Cart"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                      <line x1="3" y1="6" x2="21" y2="6"></line>
                      <path d="M16 10a4 4 0 0 1-8 0"></path>
                    </svg>
                    <span>Cart {cartTotalCount}</span>
                  </button>
                </div>
              </div>

              {/* Active Filter Tags */}
              {(selectedCategory !== 'all' || badgeFilter !== 'all' || priceRange < 10000 || searchQuery) && (
                <div className="mp-active-filters-chips-bar">
                  <span className="mp-active-lbl">Active filters:</span>
                  {selectedCategory !== 'all' && (
                    <button className="mp-active-chip" onClick={() => setSelectedCategory('all')}>
                      Category: {selectedCategory} &times;
                    </button>
                  )}
                  {badgeFilter !== 'all' && (
                    <button className="mp-active-chip" onClick={() => setBadgeFilter('all')}>
                      Badge: {badgeFilter} &times;
                    </button>
                  )}
                  {priceRange < 10000 && (
                    <button className="mp-active-chip" onClick={() => setPriceRange(10000)}>
                      Price ≤ ৳{priceRange.toLocaleString()} &times;
                    </button>
                  )}
                  {searchQuery && (
                    <button className="mp-active-chip" onClick={() => setSearchQuery('')}>
                      Search: &ldquo;{searchQuery}&rdquo; &times;
                    </button>
                  )}
                  <button
                    className="mp-active-clear-all"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                      setBadgeFilter('all');
                      setPriceRange(10000);
                    }}
                  >
                    Clear All
                  </button>
                </div>
              )}

              {/* Product Cards Grid */}
              {products.length > 0 ? (
                <div className="mp-product-grid">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="mp-no-results">
                  <div className="mp-no-res-icon">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                  </div>
                  <h3>No recycled products matched your filters</h3>
                  <p>Try searching for bags, benches, flower tubs, or reset your filters.</p>
                  <button
                    className="mp-reset-search-btn"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                      setBadgeFilter('all');
                      setPriceRange(10000);
                    }}
                  >
                    Reset All Filters
                  </button>
                </div>
              )}
            </main>
          </div>
        </section>

        {/* Modals & Overlays */}
        <ProductDetailModal />
        <CartDrawer />
        <CheckoutModal />
        <OrderTrackingModal />
      </div>
    </SiteLayout>
  );
}

export default function Marketplace() {
  return (
    <MarketplaceProvider>
      <MarketplaceContent />
    </MarketplaceProvider>
  );
}

