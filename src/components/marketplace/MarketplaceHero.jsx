import { useMarketplace } from '../../context/MarketplaceContext.jsx';

export default function MarketplaceHero() {
  const { searchQuery, setSearchQuery } = useMarketplace();

  return (
    <section className="mp-hero">
      <div className="mp-catalog-wide-wrap mp-hero-inner">
        {/* Center Column: Heading, Subtitle, Search */}
        <div className="mp-hero-content">
          <h1 className="mp-hero-title">
            Give Waste a <span className="accent-green">Second Life.</span>
          </h1>
          <p className="mp-hero-subtitle">
            Discover sustainable products made from recycled materials. Handcrafted, high-durability essentials designed for modern living.
          </p>

          {/* Main Prominent Search Bar */}
          <div className="mp-hero-search-box">
            <div className="mp-hero-search-wrapper">
              <svg className="mp-hero-search-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input
                type="text"
                placeholder="Search recycled & sustainable products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search recycled products"
              />
              {searchQuery && (
                <button
                  className="mp-hero-search-clear"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
              <a href="#products-grid" className="mp-hero-search-btn">
                Explore Products
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: Full, Prominently Visible Recycle Image */}
        <div className="mp-hero-recycle-side" aria-hidden="true">
          <div className="mp-recycle-side-wrap">
            <img
              src="/assets/images/recycle.png"
              alt="ScrapVenture Recycling"
              className="mp-recycle-side-img"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

