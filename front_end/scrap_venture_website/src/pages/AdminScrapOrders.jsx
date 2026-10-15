import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PortalLayout from '../components/dashboard/PortalLayout.jsx';
import { apiRequest } from '../utils/api.js';

export default function AdminScrapOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [updatingId, setUpdatingId] = useState(null);
  const [message, setMessage] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await apiRequest('/api/admindashboard/scrap-orders');
      setOrders(data?.scrap_orders || []);
    } catch (err) {
      console.error('Error fetching scrap orders:', err);
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
      await apiRequest(`/api/admindashboard/scrap-orders/status/${orderId}`, {
        method: 'PUT',
        body: { status: newStatus },
      });
      setMessage({ type: 'success', text: `Scrap Order #${orderId} status updated to ${newStatus}` });
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder((prev) => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to update scrap order status' });
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
      breadcrumb={[{ label: 'Admin Portal', to: '/admin/dashboard' }, { label: 'Scrap Pickup Orders' }]}
    >
      <div className="portal-header-row">
        <div className="portal-header-text">
          <h1>Scrap Pickup Orders</h1>
          <p>
            Track doorstep scrap pickup requests, inspect entire user registration details, assign collectors, update status, and log completed scrap transactions.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Link to="/admin/scrap-transaction" className="portal-action-btn portal-action-btn--primary">
            + Record Scrap Transaction
          </Link>
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
                <h2 className="dash-card__title">All Scrap Pickup Orders ({filteredOrders.length})</h2>
                <span className="dash-badge dash-badge--collector">Logistics Queue</span>
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
                  <option value="requested">Requested</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="collector_assigned">Collector Assigned</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <button
                  type="button"
                  onClick={fetchOrders}
                  className="dash-btn dash-btn--secondary dash-btn--sm"
                  title="Refresh scrap orders"
                >
                  ↻ Refresh
                </button>
              </div>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: '#64748b' }}>
                Loading scrap pickup orders...
              </div>
            ) : filteredOrders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: '#64748b' }}>
                No scrap orders found matching this filter.
              </div>
            ) : (
              <div className="dash-table-wrap">
                <table className="dash-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer Information</th>
                      <th>Pickup Location</th>
                      <th>Scrap Requested</th>
                      <th>Scheduled Slot</th>
                      <th>Instructions</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order) => {
                      const firstScrap = order.items?.[0]?.scrap_name || '';
                      return (
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
                            {order.alternate_number && (
                              <div style={{ fontSize: 11, color: '#64748b' }}>
                                📱 Alt: {order.alternate_number}
                              </div>
                            )}
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
                              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                {order.items.map((item, idx) => (
                                  <div key={idx} style={{ fontSize: 12 }}>
                                    <span style={{ fontWeight: 600, color: '#0f172a' }}>• {item.scrap_name}</span>
                                    {item.scrap_weight && (
                                      <span style={{ color: '#64748b' }}> (~{item.scrap_weight} kg)</span>
                                    )}
                                    {item.scrap_price && (
                                      <span style={{ color: '#16a34a', fontWeight: 600 }}> [৳{item.scrap_price}]</span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <span style={{ fontSize: 12, color: '#94a3b8' }}>Scrap bundle</span>
                            )}
                          </td>
                          <td>
                            <div style={{ fontSize: 12, fontWeight: 600, color: '#0f172a' }}>
                              {order.pickup_schedule
                                ? new Date(order.pickup_schedule).toLocaleString()
                                : 'Flexible'}
                            </div>
                          </td>
                          <td>
                            <div style={{ fontSize: 12, color: '#64748b', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={order.instruction}>
                              {order.instruction || 'None provided'}
                            </div>
                          </td>
                          <td>
                            <select
                              disabled={updatingId === order.id}
                              value={order.status || 'requested'}
                              onChange={(e) => handleStatusChange(order.id, e.target.value)}
                              className="form-select"
                              style={{ padding: '4px 8px', fontSize: 12, width: 'auto' }}
                            >
                              <option value="requested">requested</option>
                              <option value="confirmed">confirmed</option>
                              <option value="collector_assigned">collector_assigned</option>
                              <option value="completed">completed</option>
                              <option value="cancelled">cancelled</option>
                            </select>
                          </td>
                          <td>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                              <button
                                type="button"
                                onClick={() => setSelectedOrder(order)}
                                className="dash-btn dash-btn--secondary dash-btn--sm"
                                style={{ whiteSpace: 'nowrap' }}
                              >
                                View Details →
                              </button>
                              <Link
                                to={`/admin/scrap-transaction?customer_phone=${encodeURIComponent(
                                  order.phone_number || ''
                                )}&scrap_type=${encodeURIComponent(firstScrap)}&order_id=${order.id}`}
                                className="dash-btn dash-btn--primary dash-btn--sm"
                                style={{ whiteSpace: 'nowrap', textAlign: 'center' }}
                                title="Register completed transaction for this order"
                              >
                                Fill Transaction
                              </Link>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        {/* Modal: Entire Scrap Order Registration Info Inputted by User */}
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
                  <span className="dash-badge dash-badge--collector" style={{ marginBottom: 6 }}>
                    Scrap Pickup Registration Dossier
                  </span>
                  <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', margin: '4px 0 0' }}>
                    Pickup Request #{selectedOrder.id}
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

              {/* 1. Customer Information */}
              <div style={{ marginBottom: 20, background: '#f8fafc', padding: '16px', borderRadius: 12, border: '1px solid #e2e8f0' }}>
                <h3 style={{ fontSize: 14, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#475569', margin: '0 0 12px', fontWeight: 700 }}>
                  👤 Customer Registration Details
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
                  <div>
                    <span style={{ fontSize: 12, color: '#64748b', display: 'block' }}>Full Name</span>
                    <strong style={{ fontSize: 14, color: '#0f172a' }}>{selectedOrder.name || 'Anonymous'}</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: 12, color: '#64748b', display: 'block' }}>Primary Phone Number</span>
                    <strong style={{ fontSize: 14, color: '#16a34a' }}>{selectedOrder.phone_number}</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: 12, color: '#64748b', display: 'block' }}>Alternative Phone Number</span>
                    <strong style={{ fontSize: 14, color: '#0f172a' }}>{selectedOrder.alternate_number || 'None provided'}</strong>
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

              {/* 2. Pickup Location */}
              <div style={{ marginBottom: 20, background: '#f8fafc', padding: '16px', borderRadius: 12, border: '1px solid #e2e8f0' }}>
                <h3 style={{ fontSize: 14, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#475569', margin: '0 0 12px', fontWeight: 700 }}>
                  📍 Pickup Location (Inputted by User)
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
                    <span style={{ fontSize: 12, color: '#64748b', display: 'block' }}>Thana / Upazila</span>
                    <strong style={{ fontSize: 14, color: '#0f172a' }}>{selectedOrder.thana}</strong>
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <span style={{ fontSize: 12, color: '#64748b', display: 'block' }}>Street Address / House / Road</span>
                    <strong style={{ fontSize: 15, color: '#0f172a' }}>{selectedOrder.address}</strong>
                  </div>
                  <div style={{ gridColumn: '1 / -1', background: '#ecfdf5', padding: '10px 12px', borderRadius: 8, border: '1px solid #a7f3d0' }}>
                    <span style={{ fontSize: 11, color: '#047857', display: 'block', fontWeight: 700, textTransform: 'uppercase' }}>
                      Full Pickup Address String
                    </span>
                    <div style={{ fontSize: 13, color: '#065f46', fontWeight: 600 }}>
                      {selectedOrder.address}, {selectedOrder.thana}, {selectedOrder.district}, {selectedOrder.division}
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Schedule & Special Instructions */}
              <div style={{ marginBottom: 20, background: '#f8fafc', padding: '16px', borderRadius: 12, border: '1px solid #e2e8f0' }}>
                <h3 style={{ fontSize: 14, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#475569', margin: '0 0 12px', fontWeight: 700 }}>
                  ⏰ Logistics &amp; Special Instructions
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
                  <div>
                    <span style={{ fontSize: 12, color: '#64748b', display: 'block' }}>Pickup Schedule</span>
                    <strong style={{ fontSize: 14, color: '#0f172a' }}>
                      {selectedOrder.pickup_schedule
                        ? new Date(selectedOrder.pickup_schedule).toLocaleString()
                        : 'Flexible'}
                    </strong>
                  </div>
                  <div>
                    <span style={{ fontSize: 12, color: '#64748b', display: 'block' }}>Current Status</span>
                    <strong style={{ fontSize: 14, color: '#16a34a', textTransform: 'capitalize' }}>
                      {selectedOrder.status}
                    </strong>
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <span style={{ fontSize: 12, color: '#64748b', display: 'block' }}>Special Instructions</span>
                    <div style={{ fontSize: 14, color: '#0f172a', background: '#ffffff', padding: '10px 12px', borderRadius: 8, border: '1px solid #e2e8f0', marginTop: 4 }}>
                      {selectedOrder.instruction || 'None provided'}
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. Scrap Items Manifest */}
              <div style={{ marginBottom: 20, background: '#f8fafc', padding: '16px', borderRadius: 12, border: '1px solid #e2e8f0' }}>
                <h3 style={{ fontSize: 14, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#475569', margin: '0 0 12px', fontWeight: 700 }}>
                  ♻️ Requested Scrap Items
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
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
                        <div>
                          <strong style={{ fontSize: 14, color: '#0f172a' }}>{item.scrap_name}</strong>
                          <div style={{ fontSize: 12, color: '#64748b' }}>
                            Weight: <strong>{item.scrap_weight || 0} kg</strong>
                          </div>
                        </div>
                        <div style={{ fontWeight: 700, color: '#16a34a', fontSize: 15 }}>
                          ৳{item.scrap_price || 0}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ fontSize: 13, color: '#64748b' }}>No individual scrap items registered.</div>
                  )}
                </div>
              </div>

              {/* Status Update & Fill Transaction */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, paddingTop: 12, borderTop: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#475569' }}>Change Status:</span>
                  <select
                    disabled={updatingId === selectedOrder.id}
                    value={selectedOrder.status || 'requested'}
                    onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value)}
                    className="form-select"
                    style={{ padding: '6px 12px', fontSize: 13, width: 'auto' }}
                  >
                    <option value="requested">requested</option>
                    <option value="confirmed">confirmed</option>
                    <option value="collector_assigned">collector_assigned</option>
                    <option value="completed">completed</option>
                    <option value="cancelled">cancelled</option>
                  </select>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <Link
                    to={`/admin/scrap-transaction?customer_phone=${encodeURIComponent(
                      selectedOrder.phone_number || ''
                    )}&scrap_type=${encodeURIComponent(selectedOrder.items?.[0]?.scrap_name || '')}&order_id=${selectedOrder.id}`}
                    className="dash-btn dash-btn--primary dash-btn--sm"
                  >
                    Fill Transaction Record →
                  </Link>
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
          </div>
        )}
    </PortalLayout>
  );
}
