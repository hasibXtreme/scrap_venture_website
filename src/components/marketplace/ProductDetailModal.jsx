import { useState, useEffect } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext.jsx';

export default function ProductDetailModal() {
  const {
    selectedProduct,
    setSelectedProduct,
    addToCart,
    toggleWishlist,
    isWishlisted,
    setIsCheckoutOpen,
  } = useMarketplace();

  const [quantity, setQuantity] = useState(1);
  const [activeImgIndex, setActiveImgIndex] = useState(0);

  // Reset state when a product opens
  useEffect(() => {
    setQuantity(1);
    setActiveImgIndex(0);
  }, [selectedProduct]);

  if (!selectedProduct) return null;

  const p = selectedProduct;
  const wishlisted = isWishlisted(p.id);
  const images = p.images || [p.image];

  const handleBuyNow = () => {
    addToCart(p, quantity);
    setSelectedProduct(null);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="mp-modal-backdrop" onClick={() => setSelectedProduct(null)}>
      <div className="mp-detail-modal" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button
          className="mp-modal-close"
          onClick={() => setSelectedProduct(null)}
          aria-label="Close product details"
        >
          &times;
        </button>

        <div className="mp-detail-grid">
          {/* Left: Product Images Gallery */}
          <div className="mp-detail-gallery">
            <div className="mp-detail-main-img-box">
              <img
                src={images[activeImgIndex] || p.image}
                alt={p.name}
                className="mp-detail-main-img"
              />
            </div>

            {images.length > 1 && (
              <div className="mp-detail-thumbs">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    className={`mp-detail-thumb-btn ${activeImgIndex === idx ? 'active' : ''}`}
                    onClick={() => setActiveImgIndex(idx)}
                  >
                    <img src={img} alt={`Thumbnail ${idx + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Info & Actions */}
          <div className="mp-detail-info">
            <div className="mp-detail-meta-top">
              <span className="mp-detail-category">{p.categoryName}</span>
              <div className="mp-detail-rating">
                <span className="mp-star">★</span>
                <strong>{p.rating}</strong>
                <span>({p.reviewsCount} customer reviews)</span>
              </div>
            </div>

            <h1 className="mp-detail-title">{p.name}</h1>

            {/* Price Row */}
            <div className="mp-detail-price-row">
              <span className="mp-detail-price">৳{p.price.toLocaleString()}</span>
              {p.originalPrice && (
                <>
                  <span className="mp-detail-orig-price">৳{p.originalPrice.toLocaleString()}</span>
                  <span className="mp-detail-save-badge">
                    Save ৳{(p.originalPrice - p.price).toLocaleString()}
                  </span>
                </>
              )}
            </div>

            {/* Availability */}
            <div className="mp-detail-stock">
              <span className="mp-stock-indicator"></span>
              <strong>{p.availability}</strong>
              <span className="mp-shipping-note">&bull; Delivery in 2-4 days</span>
            </div>

            {/* Description */}
            <p className="mp-detail-desc">{p.description}</p>

            {/* Materials Breakdown */}
            <div className="mp-materials-highlight">
              <div className="mp-mat-label">Recycled Materials Used:</div>
              <div className="mp-mat-content">{p.materials}</div>
            </div>

            {/* Specifications Key-Values */}
            {p.specs && (
              <div className="mp-specs-list">
                {Object.entries(p.specs).map(([key, val]) => (
                  <div key={key} className="mp-spec-item">
                    <span className="mp-spec-k">{key}:</span>
                    <span className="mp-spec-v">{val}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Quantity Selector & Action Buttons */}
            <div className="mp-detail-actions-panel">
              <div className="mp-qty-selector">
                <button
                  className="mp-qty-btn"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                >
                  &minus;
                </button>
                <span className="mp-qty-val">{quantity}</span>
                <button
                  className="mp-qty-btn"
                  onClick={() => setQuantity((q) => q + 1)}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              <button
                className="mp-detail-add-btn"
                onClick={() => addToCart(p, quantity)}
                aria-label={`Add ${p.name} to cart`}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
                <span>Add to Cart</span>
              </button>

              <button
                className="mp-detail-buy-btn"
                onClick={handleBuyNow}
              >
                Buy Now
              </button>

              <button
                className={`mp-detail-wish-btn ${wishlisted ? 'active' : ''}`}
                onClick={() => toggleWishlist(p.id)}
                title={wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                aria-label={wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={wishlisted ? "2.4" : "2"} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </button>
            </div>

            {/* Customer Reviews Section */}
            <div className="mp-reviews-accordion">
              <h3 className="mp-reviews-title">Verified Customer Reviews ({p.reviews ? p.reviews.length : 0})</h3>
              <div className="mp-reviews-list">
                {p.reviews && p.reviews.length > 0 ? (
                  p.reviews.map((r, i) => (
                    <div key={i} className="mp-review-item">
                      <div className="mp-review-header">
                        <strong className="mp-review-author">{r.author}</strong>
                        <div className="mp-review-stars">{'★'.repeat(r.rating)}</div>
                        <span className="mp-review-date">{r.date}</span>
                      </div>
                      <p className="mp-review-body">{r.text}</p>
                    </div>
                  ))
                ) : (
                  <p className="mp-no-reviews">Be the first to review this sustainable product!</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

