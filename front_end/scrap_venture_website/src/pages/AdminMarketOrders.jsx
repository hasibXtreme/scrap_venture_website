import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PortalLayout from '../components/dashboard/PortalLayout.jsx';
import { apiRequest } from '../utils/api.js';

export default function AdminMarketOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [updatingId, setUpdatingId] = useState(null);
  const [message, setMessage] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await apiRequest('/api/admindashboard/market-orders');
      setOrders(data?.market_orders || []);
    } catch (err) {
      console.error('Error fetching market orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      await apiRequest(`/api/admindashboard/market-orders/status/${orderId}`, {
        method: 'PUT',
        body: { status: newStatus },
      });
      setMessage({ type: 'success', text: `Order #${orderId} status updated to ${newStatus}` });
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder((prev) => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to update order status' });
    } finally {
      setUpdatingId(null);
      setTimeout(() => setMessage(null), 4000);
    }
  };

  const filteredOrders =
    filterStatus === 'all'
      ? orders
      : orders.filter((o) => o.status?.toLowerCase() === filterStatus.toLowerCase());

  return (
    <PortalLayout
      portalRole="admin"
      breadcrumb={[{ label: 'Admin Portal', to: '/admin/dashboard' }, { label: 'Marketplace Orders' }]}
    >
      <div className="portal-header-row">
        <div className="portal-header-text">
          <h1>Eco Market Orders</h1>
          <p>
            Inspect customer purchases of circular upcycled products, review complete customer registration details, and manage delivery status.
          </p>
        </div>
      </div>
          {message && (
            <div
              style={{
                background: message.type === 'success' ? '#f0fdf4' : '#fef2f2',
                border: `1px solid ${message.type === 'success' ? '#86efac' : '#fecaca'}`,
                color: message.type === 'success' ? '#166534' : '#991b1b',
                padding: '12px 18px',
                borderRadius: 12,
                marginBottom: 20,
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              {message.text}
            </div>
          )}

          <div className="dash-card">
            <div className="dash-card__header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <h2 className="dash-card__title">All Eco Market Orders ({filteredOrders.length})</h2>
                <span className="dash-badge dash-badge--admin">Live Data</span>
              </div>

              {/* Status Filter */}
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <label style={{ fontSize: 13, color: '#64748b', fontWeight: 600 }}>Filter:</label>
                <select
                  className="form-select"
                  style={{ width: 'auto', padding: '6px 12px', fontSize: 13 }}
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="order_placed">Order Placed</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <button
                  type="button"
                  onClick={fetchOrders}
                  className="dash-btn dash-btn--secondary dash-btn--sm"
                  title="Refresh orders list"
                >
                  ↻ Refresh
                </button>
              </div>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: '#64748b' }}>
                Loading Eco Market orders...
              </div>
            ) : filteredOrders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: '#64748b' }}>
                No market orders found matching this filter.
              </div>
            ) : (
              <div className="dash-table-wrap">
                <table className="dash-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer Registration</th>
                      <th>Delivery Location</th>
                      <th>Items Manifest</th>
                      <th>Total &amp; Payment</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order) => (
                      <tr key={order.id}>
                        <td>
                          <strong>#{order.id}</strong>
                          <div style={{ fontSize: 11, color: '#94a3b8' }}>
                            {order.created_at ? new Date(order.created_at).toLocaleString() : ''}
                          </div>
                          {order.customer_id && (
                            <div style={{ fontSize: 11, color: '#0284c7', fontWeight: 600, marginTop: 2 }}>
                              Cust ID: #{order.customer_id}
                            </div>
                          )}
                        </td>
                        <td>
                          <strong style={{ fontSize: 14, color: '#0f172a' }}>
                            {order.name || 'Anonymous Customer'}
                          </strong>
                          <div style={{ fontSize: 12, color: '#16a34a', fontWeight: 600 }}>
                            📞 {order.phone_number}
                          </div>
                          {order.email && (
                            <div style={{ fontSize: 11, color: '#64748b' }}>
                              ✉️ {order.email}
                            </div>
                          )}
                        </td>
                        <td>
                          <div style={{ fontSize: 13, fontWeight: 600 }}>
                            {order.address}
                          </div>
                          <div style={{ fontSize: 12, color: '#475569' }}>
                            Thana: <strong>{order.thana}</strong>
                          </div>
                          <div style={{ fontSize: 11, color: '#64748b' }}>
                            {order.district}, {order.division}
                          </div>
                        </td>
                        <td>
                          {order.items && order.items.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                              {order.items.map((item, idx) => (
                                <div
                                  key={idx}
                                  style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                                >
                                  {item.product_image && (
                                    <img
                                      src={item.product_image}
                                      alt={item.product_name}
                                      style={{
                                        width: 28,
                                        height: 28,
                                        borderRadius: 4,
                                        objectFit: 'cover',
                                        border: '1px solid #e2e8f0',
                                      }}
                                    />
                                  )}
                                  <span style={{ fontSize: 12, fontWeight: 600 }}>
                                    {item.product_name}
                                  </span>
                                  <span style={{ fontSize: 11, color: '#64748b' }}>
                                    (৳{item.product_price})
                                  </span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span style={{ fontSize: 12, color: '#94a3b8' }}>No items listed</span>
                          )}
                        </td>
                        <td>
                          <div style={{ color: '#269c26', fontSize: 15, fontWeight: 800 }}>
                            ৳{Number(order.total_price || 0).toLocaleString()}
                          </div>
                          <div style={{ fontSize: 11, color: '#64748b', textTransform: 'capitalize' }}>
                            💳 {order.payment_method || 'COD'}
                          </div>
                        </td>
                        <td>
                          <span
                            className={`status-pill status-pill--${
                              order.status === 'order_placed'
                                ? 'placed'
                                : order.status === 'delivered'
                                ? 'completed'
                                : order.status === 'cancelled'
                                ? 'cancelled'
                                : 'confirmed'
                            }`}
                          >
                            {order.status?.replace('_', ' ') || 'Placed'}
                          </span>
                          <div style={{ marginTop: 6 }}>
                            <select
                              disabled={updatingId === order.id}
                              value={order.status || 'order_placed'}
                              onChange={(e) => handleStatusChange(order.id, e.target.value)}
                              className="form-select"
                              style={{ padding: '3px 6px', fontSize: 11, width: 'auto' }}
                            >
                              <option value="order_placed">order_placed</option>
                              <option value="processing">processing</option>
                              <option value="shipped">shipped</option>
                              <option value="delivered">delivered</option>
                              <option value="cancelled">cancelled</option>
                            </select>
                          </div>
                        </td>
                        <td>
                          <button
                            type="button"
                            onClick={() => setSelectedOrder(order)}
                            className="dash-btn dash-btn--primary dash-btn--sm"
                            style={{ whiteSpace: 'nowrap' }}
                          >
                            View Full Info →
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        {/* Modal: Entire Order Registration Info Inputted by User */}
        {selectedOrder && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(15, 23, 42, 0.65)',
              backdropFilter: 'blur(4px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
              padding: 16,
            }}
            onClick={() => setSelectedOrder(null)}
          >
            <div
              style={{
                background: '#ffffff',
                borderRadius: 16,
                maxWidth: 680,
                width: '100%',
                maxHeight: '90vh',
                overflowY: 'auto',
                boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                border: '1px solid #e2e8f0',
                padding: '28px',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #e2e8f0', paddingBottom: 16, marginBottom: 20 }}>
                <div>
                  <span className="dash-badge dash-badge--admin" style={{ marginBottom: 6 }}>
                    Eco Market Order Registration Details
                  </span>
                  <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', margin: '4px 0 0' }}>
                    Order #{selectedOrder.id}
                  </h2>
                  <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748b' }}>
                    Registered on: {selectedOrder.created_at ? new Date(selectedOrder.created_at).toLocaleString() : 'N/A'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  style={{
                    background: '#f1f5f9',
                    border: 'none',
                    borderRadius: '50%',
                    width: 34,
                    height: 34,
                    fontSize: 20,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#64748b',
                  }}
                >
                  ✕
                </button>
              </div>

              {/* 1. Customer Registration Info */}
              <div style={{ marginBottom: 20, background: '#f8fafc', padding: '16px', borderRadius: 12, border: '1px solid #e2e8f0' }}>
                <h3 style={{ fontSize: 14, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#475569', margin: '0 0 12px', fontWeight: 700 }}>
                  👤 Customer Registration Information
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
                  <div>
                    <span style={{ fontSize: 12, color: '#64748b', display: 'block' }}>Full Name</span>
                    <strong style={{ fontSize: 14, color: '#0f172a' }}>{selectedOrder.name || 'Anonymous'}</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: 12, color: '#64748b', display: 'block' }}>Phone Number</span>
                    <strong style={{ fontSize: 14, color: '#16a34a' }}>{selectedOrder.phone_number}</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: 12, color: '#64748b', display: 'block' }}>Email Address</span>
                    <strong style={{ fontSize: 14, color: '#0f172a' }}>{selectedOrder.email || 'None provided'}</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: 12, color: '#64748b', display: 'block' }}>Customer ID (Account)</span>
                    <strong style={{ fontSize: 14, color: '#0284c7' }}>
                      {selectedOrder.customer_id ? `#CUST-${selectedOrder.customer_id}` : 'Guest / Not Registered'}
                    </strong>
                  </div>
                </div>
              </div>

              {/* 2. Delivery Location Info */}
              <div style={{ marginBottom: 20, background: '#f8fafc', padding: '16px', borderRadius: 12, border: '1px solid #e2e8f0' }}>
                <h3 style={{ fontSize: 14, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#475569', margin: '0 0 12px', fontWeight: 700 }}>
                  📍 Delivery Address (Inputted by User)
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
                  <div>
                    <span style={{ fontSize: 12, color: '#64748b', display: 'block' }}>Division</span>
                    <strong style={{ fontSize: 14, color: '#0f172a' }}>{selectedOrder.division}</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: 12, color: '#64748b', display: 'block' }}>District</span>
                    <strong style={{ fontSize: 14, color: '#0f172a' }}>{selectedOrder.district}</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: 12, color: '#64748b', display: 'block' }}>Thana / Area</span>
                    <strong style={{ fontSize: 14, color: '#0f172a' }}>{selectedOrder.thana}</strong>
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <span style={{ fontSize: 12, color: '#64748b', display: 'block' }}>Street Address / House / Road</span>
                    <strong style={{ fontSize: 15, color: '#0f172a' }}>{selectedOrder.address}</strong>
                  </div>
                  <div style={{ gridColumn: '1 / -1', background: '#ecfdf5', padding: '10px 12px', borderRadius: 8, border: '1px solid #a7f3d0' }}>
                    <span style={{ fontSize: 11, color: '#047857', display: 'block', fontWeight: 700, textTransform: 'uppercase' }}>
                      Complete Delivery String
                    </span>
                    <div style={{ fontSize: 13, color: '#065f46', fontWeight: 600 }}>
                      {selectedOrder.address}, {selectedOrder.thana}, {selectedOrder.district}, {selectedOrder.division}
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Items Ordered & Financials */}
              <div style={{ marginBottom: 20, background: '#f8fafc', padding: '16px', borderRadius: 12, border: '1px solid #e2e8f0' }}>
                <h3 style={{ fontSize: 14, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#475569', margin: '0 0 12px', fontWeight: 700 }}>
                  🛍️ Ordered Products &amp; Payment
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
                  {selectedOrder.items && selectedOrder.items.length > 0 ? (
                    selectedOrder.items.map((item, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          background: '#ffffff',
                          padding: '10px 14px',
                          borderRadius: 8,
                          border: '1px solid #e2e8f0',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          {item.product_image && (
                            <img
                              src={item.product_image}
                              alt={item.product_name}
                              style={{ width: 38, height: 38, borderRadius: 6, objectFit: 'cover' }}
                            />
                          )}
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{item.product_name}</div>
                            <div style={{ fontSize: 11, color: '#64748b' }}>Upcycled Eco Product</div>
                          </div>
                        </div>
                        <div style={{ fontWeight: 700, color: '#16a34a', fontSize: 14 }}>
                          ৳{item.product_price}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ fontSize: 13, color: '#64748b' }}>No products listed.</div>
                  )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px dashed #cbd5e1', paddingTop: 12 }}>
                  <div>
                    <span style={{ fontSize: 12, color: '#64748b', display: 'block' }}>Payment Method</span>
                    <strong style={{ fontSize: 14, color: '#0f172a', textTransform: 'uppercase' }}>
                      {selectedOrder.payment_method || 'Cash on Delivery'}
                    </strong>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: 12, color: '#64748b', display: 'block' }}>Total Price</span>
                    <strong style={{ fontSize: 20, color: '#269c26' }}>
                      ৳{Number(selectedOrder.total_price || 0).toLocaleString()}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Status Update Controller */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#475569' }}>Change Status:</span>
                  <select
                    disabled={updatingId === selectedOrder.id}
                    value={selectedOrder.status || 'order_placed'}
                    onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value)}
                    className="form-select"
                    style={{ padding: '6px 12px', fontSize: 13, width: 'auto' }}
                  >
                    <option value="order_placed">order_placed</option>
                    <option value="processing">processing</option>
                    <option value="shipped">shipped</option>
                    <option value="delivered">delivered</option>
                    <option value="cancelled">cancelled</option>
                  </select>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="dash-btn dash-btn--secondary dash-btn--sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
    </PortalLayout>
  );
}
