import { useMarketplace } from '../../context/MarketplaceContext.jsx';
import { MARKETPLACE_CATEGORIES } from '../../data/marketplaceData.js';

export default function CategoryBar() {
  const { selectedCategory, setSelectedCategory } = useMarketplace();

  return (
    <div className="mp-categories-bar-wrapper">
      <div className="mp-catalog-wide-wrap">
        <div className="mp-categories-compact-row">
          <div className="mp-categories-label">
            <span>Explore:</span>
          </div>

          <div className="mp-category-scroll">
            {MARKETPLACE_CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  className={`mp-category-pill-compact ${isActive ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat.id)}
                  aria-pressed={isActive}
                >
                  <span>{cat.name}</span>
                  {isActive && <span className="mp-active-dot"></span>}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

