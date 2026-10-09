import { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext.jsx';

export default function OrderTrackingModal() {
  const { activeOrder, setActiveOrder, showToast } = useMarketplace();

  const STEPS = [
    { key: 'Order Placed', label: 'Order Placed', desc: 'Received & verified by ScrapVenture', icon: '📝' },
    { key: 'Processing', label: 'Processing', desc: 'Crafting & eco-packaging items', icon: '📦' },
    { key: 'Shipped', label: 'Shipped', desc: 'Handed over to green courier partner', icon: '🚚' },
    { key: 'Out for Delivery', label: 'Out for Delivery', desc: 'Courier rider is in your area', icon: '🛵' },
    { key: 'Delivered', label: 'Delivered', desc: 'Successfully handed over to recipient', icon: '🏡' },
  ];

  if (!activeOrder) return null;

  const currentStepIndex = STEPS.findIndex((s) => s.key === activeOrder.status);
  const activeIdx = currentStepIndex !== -1 ? currentStepIndex : 0;

  // Simulation: advance status for interactive demo
  const handleAdvanceStatus = () => {
    const nextIdx = (activeIdx + 1) % STEPS.length;
    const nextStatus = STEPS[nextIdx].key;
    setActiveOrder({
      ...activeOrder,
      status: nextStatus,
    });
    showToast(`Order status updated to: "${nextStatus}" 🚀`);
  };

  const copyOrderId = () => {
    navigator.clipboard.writeText(activeOrder.id);
    showToast(`Order ID ${activeOrder.id} copied to clipboard! 📋`);
  };

  return (
    <div className="mp-modal-backdrop" onClick={() => setActiveOrder(null)}>
      <div className="mp-tracking-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="mp-tracking-header">
          <div className="mp-track-title-box">
            <span className="mp-track-badge">🎉 Live Order Tracking</span>
            <h2>Order #{activeOrder.id}</h2>
            <p className="mp-track-date">
              Placed on {new Date(activeOrder.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
          <div className="mp-track-top-actions">
            <button className="mp-copy-id-btn" onClick={copyOrderId} title="Copy Order ID">
              Copy ID
            </button>
            <button className="mp-modal-close" onClick={() => setActiveOrder(null)} aria-label="Close tracking">
              &times;
            </button>
          </div>
        </div>

        {/* Stepper Progress Bar */}
        <div className="mp-tracking-stepper">
          <div className="mp-stepper-track">
            <div
              className="mp-stepper-progress"
              style={{ width: `${(activeIdx / (STEPS.length - 1)) * 100}%` }}
            ></div>
          </div>

          <div className="mp-stepper-nodes">
            {STEPS.map((step, idx) => {
              const isCompleted = idx <= activeIdx;
              const isCurrent = idx === activeIdx;

              return (
                <div
                  key={step.key}
                  className={`mp-step-node ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}
                >
                  <div className="mp-step-circle">
                    {isCompleted && !isCurrent ? '✓' : step.icon}
                  </div>
                  <div className="mp-step-content">
                    <strong className="mp-step-label">{step.label}</strong>
                    <span className="mp-step-desc">{step.desc}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Status Callout & Advance Demo Button */}
        <div className="mp-status-banner">
          <div className="mp-status-info">
            <span className="mp-status-pulse"></span>
            <div>
              <strong>Current Status: {activeOrder.status}</strong>
              <p>Estimated Delivery: {activeOrder.estimatedDelivery}</p>
            </div>
          </div>
          <button className="mp-advance-btn" onClick={handleAdvanceStatus} title="Click to test live order lifecycle">
            Simulate Next Status ⏩
          </button>
        </div>

        {/* Details Grid: Delivery + Order Items */}
        <div className="mp-tracking-details-grid">
          {/* Left: Delivery & Customer Info */}
          <div className="mp-track-card">
            <h4 className="mp-card-sec-head">Delivery Information</h4>
            <div className="mp-info-rows">
              <div className="mp-info-row">
                <span className="k">Recipient:</span>
                <span className="v">{activeOrder.customer?.fullName || 'Valued Customer'}</span>
              </div>
              <div className="mp-info-row">
                <span className="k">Phone:</span>
                <span className="v">{activeOrder.customer?.phone || 'N/A'}</span>
              </div>
              <div className="mp-info-row">
                <span className="k">Delivery Address:</span>
                <span className="v">
                  {activeOrder.customer?.address}, {activeOrder.customer?.city} - {activeOrder.customer?.postalCode}
                </span>
              </div>
              <div className="mp-info-row">
                <span className="k">Payment Method:</span>
                <span className="v" style={{ textTransform: 'uppercase' }}>
                  {activeOrder.customer?.paymentMethod === 'cod' ? 'Cash on Delivery' : activeOrder.customer?.paymentMethod} (Verified)
                </span>
              </div>
            </div>
          </div>

          {/* Right: Products Ordered */}
          <div className="mp-track-card">
            <h4 className="mp-card-sec-head">Products in this Order ({activeOrder.items?.length || 0})</h4>
            <div className="mp-track-items-list">
              {activeOrder.items?.map(({ product, quantity }) => (
                <div key={product.id} className="mp-track-item">
                  <img src={product.image} alt={product.name} />
                  <div className="mp-track-item-info">
                    <strong>{product.name}</strong>
                    <span>{quantity} x ৳{product.price.toLocaleString()}</span>
                  </div>
                  <div className="mp-track-item-subtotal">
                    ৳{(product.price * quantity).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>

            <div className="mp-track-total-box">
              <div className="row">
                <span>Subtotal:</span>
                <span>৳{activeOrder.subtotal?.toLocaleString()}</span>
              </div>
              <div className="row">
                <span>Delivery:</span>
                <span>{activeOrder.deliveryFee === 0 ? 'FREE' : `৳${activeOrder.deliveryFee}`}</span>
              </div>
              <div className="row grand">
                <strong>Total Amount:</strong>
                <strong>৳{activeOrder.total?.toLocaleString()}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mp-tracking-footer">
          <button className="mp-continue-btn" onClick={() => setActiveOrder(null)}>
            Continue Shopping in Marketplace
          </button>
        </div>
      </div>
    </div>
  );
}

