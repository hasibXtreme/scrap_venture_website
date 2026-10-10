import { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext.jsx';
import { UserIcon, PhoneIcon, MailIcon } from '../icons.jsx';

export default function CheckoutModal() {
  const {
    cart,
    cartSubtotal,
    deliveryFee,
    cartTotal,
    isCheckoutOpen,
    setIsCheckoutOpen,
    placeOrder,
  } = useMarketplace();

  const [formData, setFormData] = useState({
    fullName: 'Sayed Rahman',
    email: 'sayed.rahman@example.com',
    phone: '01712-345678',
    address: 'House 42, Road 11, Sector 4, Uttara',
    city: 'Dhaka',
    postalCode: '1230',
    deliveryNotes: 'Please ring the front bell upon arrival.',
    paymentMethod: 'bkash',
    bkashNumber: '01712-345678',
    trxId: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isCheckoutOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.address) {
      setErrorMessage('Please fill in your name, phone number, and delivery address.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    setTimeout(() => {
      setIsSubmitting(false);
      placeOrder(formData);
    }, 1200);
  };

  return (
    <div className="mp-modal-backdrop" onClick={() => setIsCheckoutOpen(false)}>
      <div className="mp-checkout-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="mp-checkout-header">
          <div className="mp-checkout-header-title">
            <span className="mp-step-pill">Secure Checkout</span>
            <h2>Complete Your Sustainable Order</h2>
          </div>
          <button
            className="mp-modal-close"
            onClick={() => setIsCheckoutOpen(false)}
            aria-label="Close checkout"
          >
            &times;
          </button>
        </div>

        {errorMessage && (
          <div className="mp-checkout-alert error">
            ⚠️ {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mp-checkout-form">
          <div className="mp-checkout-columns">
            {/* Left Column: Customer & Delivery Details */}
            <div className="mp-checkout-left">
              <div className="mp-form-section">
                <h3 className="mp-form-section-title">
                  <span className="mp-sec-num">1</span>
                  Customer Information
                </h3>
                <div className="mp-form-grid">
                  <div className="mp-input-group full">
                    <label>Full Name / আপনার নাম *</label>
                    <div className="mp-input-wrap">
                      <span className="mp-input-icon"><UserIcon size={16} /></span>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="Full Name / আপনার নাম"
                        required
                      />
                    </div>
                  </div>
                  <div className="mp-input-group">
                    <label>Phone Number / ফোন নম্বর *</label>
                    <div className="mp-input-wrap">
                      <span className="mp-input-icon"><PhoneIcon size={16} /></span>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="01XXXXXXXXX"
                        required
                      />
                    </div>
                  </div>
                  <div className="mp-input-group">
                    <label>Email Address / আপনার ইমেইল</label>
                    <div className="mp-input-wrap">
                      <span className="mp-input-icon"><MailIcon size={16} /></span>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email Address / আপনার ইমেইল"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mp-form-section">
                <h3 className="mp-form-section-title">
                  <span className="mp-sec-num">2</span>
                  Delivery Address
                </h3>
                <div className="mp-form-grid">
                  <div className="mp-input-group full">
                    <label>Street Address / Apartment *</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="House, Road, Area..."
                      required
                    />
                  </div>
                  <div className="mp-input-group">
                    <label>City / District *</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="e.g. Dhaka"
                      required
                    />
                  </div>
                  <div className="mp-input-group">
                    <label>Postal Code</label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                      placeholder="e.g. 1212"
                    />
                  </div>
                  <div className="mp-input-group full">
                    <label>Delivery Instructions (Optional)</label>
                    <input
                      type="text"
                      name="deliveryNotes"
                      value={formData.deliveryNotes}
                      onChange={handleChange}
                      placeholder="Special instructions for the courier..."
                    />
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="mp-form-section">
                <h3 className="mp-form-section-title">
                  <span className="mp-sec-num">3</span>
                  Payment Method
                </h3>
                <div className="mp-payment-options">
                  {/* bKash */}
                  <label className={`mp-payment-card ${formData.paymentMethod === 'bkash' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bkash"
                      checked={formData.paymentMethod === 'bkash'}
                      onChange={handleChange}
                    />
                    <div className="mp-payment-card-content">
                      <div className="mp-payment-brand">
                        <span className="mp-pay-logo bkash-logo">bKash</span>
                        <strong>bKash Mobile Payment</strong>
                      </div>
                      <span className="mp-payment-tag">Instant Verification</span>
                    </div>
                  </label>

                  {/* Nagad */}
                  <label className={`mp-payment-card ${formData.paymentMethod === 'nagad' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="nagad"
                      checked={formData.paymentMethod === 'nagad'}
                      onChange={handleChange}
                    />
                    <div className="mp-payment-card-content">
                      <div className="mp-payment-brand">
                        <span className="mp-pay-logo nagad-logo">Nagad</span>
                        <strong>Nagad Digital Payment</strong>
                      </div>
                      <span className="mp-payment-tag">Instant Payment</span>
                    </div>
                  </label>

                  {/* Bank Transfer */}
                  <label className={`mp-payment-card ${formData.paymentMethod === 'bank' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bank"
                      checked={formData.paymentMethod === 'bank'}
                      onChange={handleChange}
                    />
                    <div className="mp-payment-card-content">
                      <div className="mp-payment-brand">
                        <span className="mp-pay-logo bank-logo">🏦</span>
                        <strong>Bank Transfer</strong>
                      </div>
                      <span className="mp-payment-tag">City / BRAC Bank</span>
                    </div>
                  </label>

                  {/* Cash on Delivery */}
                  <label className={`mp-payment-card ${formData.paymentMethod === 'cod' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={handleChange}
                    />
                    <div className="mp-payment-card-content">
                      <div className="mp-payment-brand">
                        <span className="mp-pay-logo cod-logo">💵</span>
                        <strong>Cash on Delivery (COD)</strong>
                      </div>
                      <span className="mp-payment-tag">Pay Upon Receiving</span>
                    </div>
                  </label>
                </div>

                {/* Sub-instruction for bKash */}
                {formData.paymentMethod === 'bkash' && (
                  <div className="mp-payment-subbox">
                    <p>Send money to ScrapVenture Merchant Account: <strong>01800-SCRAPV (01800-727278)</strong> or proceed to direct prompt.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Order Summary */}
            <div className="mp-checkout-right">
              <div className="mp-order-summary-box">
                <h3 className="mp-summary-heading">Order Summary</h3>

                <div className="mp-summary-items">
                  {cart.map(({ product, quantity }) => (
                    <div key={product.id} className="mp-mini-item">
                      <img src={product.image} alt={product.name} />
                      <div className="mp-mini-info">
                        <strong>{product.name}</strong>
                        <span>Qty: {quantity} &bull; ৳{product.price.toLocaleString()}</span>
                      </div>
                      <div className="mp-mini-subtotal">
                        ৳{(product.price * quantity).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mp-summary-calc">
                  <div className="mp-calc-row">
                    <span>Items Subtotal</span>
                    <span>৳{cartSubtotal.toLocaleString()}</span>
                  </div>
                  <div className="mp-calc-row">
                    <span>Delivery Charge</span>
                    <span>{deliveryFee === 0 ? <strong className="mp-free-tag">FREE</strong> : `৳${deliveryFee}`}</span>
                  </div>
                  <div className="mp-calc-row">
                    <span>Packaging</span>
                    <span className="mp-free-tag">100% Recycled & Free</span>
                  </div>
                  <div className="mp-calc-divider"></div>
                  <div className="mp-calc-row grand-total">
                    <span>Total Payable</span>
                    <span className="mp-grand-amount">৳{cartTotal.toLocaleString()}</span>
                  </div>
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  className="mp-place-order-btn"
                  disabled={isSubmitting || cart.length === 0}
                >
                  {isSubmitting ? (
                    <span className="mp-btn-spinner">Processing Order...</span>
                  ) : (
                    <>
                      <span>Confirm &amp; Place Order</span>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </>
                  )}
                </button>

                <div className="mp-checkout-trust-points">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>
                    <span>Certified Post-Consumer Materials</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                    <span>Carbon Neutral Courier Transport</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                    <span>Guaranteed 7-Day Exchange Policy</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

