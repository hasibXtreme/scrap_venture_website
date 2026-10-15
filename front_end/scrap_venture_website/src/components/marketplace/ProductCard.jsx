import { useMarketplace } from '../../context/MarketplaceContext.jsx';

export default function ProductCard({ product }) {
  const {
    addToCart,
    toggleWishlist,
    isWishlisted,
    setSelectedProduct,
  } = useMarketplace();

  const wishlisted = isWishlisted(product.id);

  return (
    <article className="mp-product-card">
      {/* Card Header & Media */}
      <div className="mp-card-media" onClick={() => setSelectedProduct(product)}>
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="mp-product-img"
        />

        {/* Wishlist Button */}
        <button
          className={`mp-wishlist-toggle ${wishlisted ? 'active' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          title={wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
          aria-label={wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={wishlisted ? "2.4" : "2.2"} strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>

        {/* Quick View Overlay on hover */}
        <div className="mp-card-quick-view">
          <span>Quick View</span>
        </div>
      </div>

      {/* Card Body */}
      <div className="mp-card-body">
        {/* Rating & Availability */}
        <div className="mp-card-meta-top">
          <div className="mp-card-rating">
            <span className="mp-star-icon">★</span>
            <span className="mp-rating-val">{product.rating}</span>
            <span className="mp-rating-count">({product.reviewsCount})</span>
          </div>
          <span className="mp-stock-status">{product.availability}</span>
        </div>

        {/* Title & Description */}
        <h3 className="mp-card-title" onClick={() => setSelectedProduct(product)}>
          {product.name}
        </h3>
        <p className="mp-card-desc">{product.shortDesc}</p>

        {/* Price & Action Row */}
        <div className="mp-card-footer">
          <div className="mp-price-group">
            <span className="mp-current-price">৳{product.price.toLocaleString()}</span>
            {product.originalPrice && (
              <span className="mp-orig-price">৳{product.originalPrice.toLocaleString()}</span>
            )}
          </div>

          <button
            className="mp-add-cart-btn"
            onClick={() => addToCart(product, 1)}
            aria-label={`Add ${product.name} to cart`}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </article>
  );
}

