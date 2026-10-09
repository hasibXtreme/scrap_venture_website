import { useMarketplace } from '../../context/MarketplaceContext.jsx';

export default function CartDrawer() {
  const {
    cart,
    cartCount,
    cartSubtotal,
    deliveryFee,
    cartTotal,
    removeFromCart,
    updateQuantity,
    isCartOpen,
    setIsCartOpen,
    setIsCheckoutOpen,
  } = useMarketplace();

  if (!isCartOpen) return null;

  const freeDeliveryThreshold = 2000;
  const progressToFree = Math.min(100, (cartSubtotal / freeDeliveryThreshold) * 100);
  const remainingForFree = Math.max(0, freeDeliveryThreshold - cartSubtotal);

  const handleCheckoutClick = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="mp-drawer-backdrop" onClick={() => setIsCartOpen(false)}>
      <aside className="mp-cart-drawer" onClick={(e) => e.stopPropagation()}>
        {/* Drawer Header */}
        <div className="mp-drawer-header">
          <div className="mp-drawer-title-group">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            <h2>Shopping Cart ({cartCount})</h2>
          </div>
          <button
            className="mp-drawer-close"
            onClick={() => setIsCartOpen(false)}
            aria-label="Close cart"
          >
            &times;
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="mp-free-shipping-box">
          <div className="mp-fs-text">
            {remainingForFree > 0 ? (
              <span>Add <strong>৳{remainingForFree.toLocaleString()}</strong> more for <strong>FREE Delivery</strong></span>
            ) : (
              <span className="mp-fs-unlocked">🎉 You unlocked <strong>FREE Delivery!</strong></span>
            )}
          </div>
          <div className="mp-fs-bar-track">
            <div className="mp-fs-bar-fill" style={{ width: `${progressToFree}%` }}></div>
          </div>
        </div>

        {/* Cart Item List */}
        <div className="mp-cart-items-list">
          {cart.length === 0 ? (
            <div className="mp-cart-empty">
              <div className="mp-empty-icon">🛍️</div>
              <h3>Your cart is empty</h3>
              <p>Explore our recycled and sustainable collections to make a positive impact!</p>
              <button
                className="mp-browse-btn"
                onClick={() => setIsCartOpen(false)}
              >
                Browse Marketplace
              </button>
            </div>
          ) : (
            cart.map(({ product, quantity }) => (
              <div key={product.id} className="mp-cart-item">
                <img src={product.image} alt={product.name} className="mp-cart-item-img" />

                <div className="mp-cart-item-details">
                  <h4 className="mp-cart-item-title">{product.name}</h4>
                  <span className="mp-cart-item-cat">{product.categoryName}</span>
                  <div className="mp-cart-item-price-unit">
                    ৳{product.price.toLocaleString()} each
                  </div>

                  <div className="mp-cart-item-controls">
                    <div className="mp-cart-qty-buttons">
                      <button
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        aria-label="Decrease quantity"
                      >
                        &minus;
                      </button>
                      <span>{quantity}</span>
                      <button
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    <span className="mp-cart-item-subtotal">
                      ৳{(product.price * quantity).toLocaleString()}
                    </span>

                    <button
                      className="mp-cart-remove-btn"
                      onClick={() => removeFromCart(product.id)}
                      title="Remove item"
                      aria-label="Remove item"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer & Checkout */}
        {cart.length > 0 && (
          <div className="mp-drawer-footer">
            <div className="mp-summary-row">
              <span>Subtotal</span>
              <strong>৳{cartSubtotal.toLocaleString()}</strong>
            </div>
            <div className="mp-summary-row">
              <span>Delivery Charge</span>
              <span>
                {deliveryFee === 0 ? (
                  <strong className="mp-free-tag">FREE</strong>
                ) : (
                  `৳${deliveryFee}`
                )}
              </span>
            </div>
            <div className="mp-summary-divider"></div>
            <div className="mp-summary-row mp-total-row">
              <span>Total Price</span>
              <strong className="mp-grand-total">৳{cartTotal.toLocaleString()}</strong>
            </div>

            <button
              className="mp-checkout-action-btn"
              onClick={handleCheckoutClick}
            >
              <span>Proceed to Checkout</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>

            <div className="mp-guarantee-note">
              <span>🔒 100% Secure Checkout &bull; Easy 7-Day Returns</span>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}

