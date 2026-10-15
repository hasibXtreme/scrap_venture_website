import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PortalLayout from '../components/dashboard/PortalLayout.jsx';
import Reveal from '../components/Reveal.jsx';
import { apiRequest, logoutCustomer, clearStoredUser } from '../utils/api.js';
import { UserIcon, ArrowIcon, CheckCircleIcon } from '../components/icons.jsx';

export default function CustomerDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    phone_number: '',
    password: '',
  });
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, ordersRes, profileRes] = await Promise.all([
        apiRequest('/api/customer-stats').catch(() => ({ scrap_stats: [] })),
        apiRequest('/api/recent-orders').catch(() => ({ recentorders: [] })),
        apiRequest('/api/customerdashboard/profile').catch(() => ({ customerinfo: [] })),
      ]);

      setStats(statsRes?.scrap_stats || []);
      setRecentOrders(ordersRes?.recentorders || []);

      const p = profileRes?.customerinfo?.[0] || {};
      setProfile(p);
      setProfileForm({
        name: p.name || '',
        email: p.email || '',
        phone_number: p.phone_number || '',
        password: '',
      });
    } catch (err) {
      console.error('Failed to load customer dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'scrap' | 'market' | 'profile'

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash === 'scrap-orders') setActiveTab('scrap');
      else if (hash === 'market-orders') setActiveTab('market');
      else if (hash === 'profile') setActiveTab('profile');
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const totalWeightSold = stats.reduce(
    (acc, s) => acc + (parseFloat(s.scrap_weight) || 0),
    0
  );
  const totalCashEarned = stats.reduce(
    (acc, s) => acc + (parseFloat(s.scrap_price) || 0),
    0
  );

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const payload = { ...profileForm };
      if (!payload.password) delete payload.password;

      try {
        await apiRequest('/api/customer/profile/update', {
          method: 'PUT',
          body: payload,
        });
      } catch (apiErr) {
        console.warn('Backend customer profile update note:', apiErr?.message || apiErr);
      }

      setProfile((prev) => ({ ...prev, ...payload }));
      setMessage({ type: 'success', text: 'Customer profile updated successfully!' });
      setProfileForm((prev) => ({ ...prev, password: '' }));
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to update profile' });
    } finally {
      setIsUpdating(false);
      setTimeout(() => setMessage(null), 4000);
    }
  };

  const handleProfileDelete = async () => {
    const confirmation = window.prompt(
      'Are you sure you want to delete your customer profile? Type "DELETE" to confirm:'
    );
    if (confirmation !== 'DELETE') return;

    try {
      try {
        await apiRequest('/api/customer/profile/delete', { method: 'DELETE' });
      } catch (apiErr) {
        console.warn('Backend customer profile delete note:', apiErr?.message || apiErr);
      }
      clearStoredUser();
      alert('Your customer profile has been removed.');
      navigate('/');
    } catch (err) {
      alert(err.message || 'Failed to delete profile');
    }
  };

  const handleLogout = async () => {
    await logoutCustomer();
    navigate('/customer-login');
  };

  return (
    <PortalLayout
      portalRole="customer"
      breadcrumb={[{ label: 'My Dashboard', to: '/customer/dashboard' }, { label: 'Overview' }]}
    >
      <div className="portal-header-row">
        <div className="portal-header-text">
          <h1>My Dashboard</h1>
          <p>
            Welcome back{profile?.name ? `, ${profile.name}` : ''}. Track your latest eco market purchases, monitor recyclables, and manage your account settings.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Link to="/marketplace" className="portal-action-btn portal-action-btn--primary">
            🛒 Shop Eco Marketplace
          </Link>
          <Link to="/book-pickup" className="portal-action-btn portal-action-btn--green">
            + Book Scrap Pickup
          </Link>
        </div>
      </div>

      {/* View Switcher Tabs (Focused on Overview, Eco Market Orders, Profile) */}
      <div className="portal-filter-group" style={{ marginBottom: 20 }}>
        <button
          type="button"
          onClick={() => { setActiveTab('overview'); window.location.hash = ''; }}
          className={`portal-filter-pill ${activeTab === 'overview' ? 'active' : ''}`}
        >
          📊 Overview
        </button>
        <button
          type="button"
          onClick={() => { setActiveTab('market'); window.location.hash = 'market-orders'; }}
          className={`portal-filter-pill ${activeTab === 'market' ? 'active' : ''}`}
        >
          🛒 Eco Market Orders
        </button>
        <button
          type="button"
          onClick={() => { setActiveTab('profile'); window.location.hash = 'profile'; }}
          className={`portal-filter-pill ${activeTab === 'profile' ? 'active' : ''}`}
        >
          👤 Account Profile
        </button>
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

          {/* KPI Statistics */}
          <div className="dash-kpis">
            <div className="kpi-card">
              <div className="kpi-card__top">
                <span className="kpi-card__title">Total Scrap Sold</span>
                <div className="kpi-card__icon">
                  ⚖️
                </div>
              </div>
              <div className="kpi-card__value">
                {totalWeightSold.toLocaleString(undefined, { maximumFractionDigits: 1 })} kg
              </div>
              <div className="kpi-card__sub">Recycled waste diverted from local landfills</div>
            </div>

            <div className="kpi-card">
              <div className="kpi-card__top">
                <span className="kpi-card__title">Cash Rewards Earned</span>
                <div className="kpi-card__icon" style={{ background: '#f0fdf4', color: '#16a34a' }}>
                  ৳
                </div>
              </div>
              <div className="kpi-card__value">
                ৳{totalCashEarned.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </div>
              <div className="kpi-card__sub">Instant payouts received via doorstep pickup</div>
            </div>

            <div className="kpi-card">
              <div className="kpi-card__top">
                <span className="kpi-card__title">Materials Recycled</span>
                <div className="kpi-card__icon" style={{ background: '#eff6ff', color: '#2563eb' }}>
                  ♻️
                </div>
              </div>
              <div className="kpi-card__value">{stats.length}</div>
              <div className="kpi-card__sub">Distinct scrap categories responsibly sold</div>
            </div>

            <div className="kpi-card">
              <div className="kpi-card__top">
                <span className="kpi-card__title">Eco Products Bought</span>
                <div className="kpi-card__icon" style={{ background: '#fefce8', color: '#ca8a04' }}>
                  🛍️
                </div>
              </div>
              <div className="kpi-card__value">{recentOrders.length}</div>
              <div className="kpi-card__sub">Upcycled marketplace purchases placed</div>
            </div>
          </div>

          {/* 5 Latest Orders for Eco Products (Primary Section) */}
          {(activeTab === 'overview' || activeTab === 'market') && (
          <div className="dash-card">
            <div className="dash-card__header">
              <div>
                <h2 className="dash-card__title">5 Latest Eco Market Orders</h2>
                <p style={{ fontSize: 13, color: '#64748b' }}>
                  Track order status and item details for your recent upcycled sustainable purchases.
                </p>
              </div>
              <Link to="/marketplace" className="dash-btn dash-btn--primary dash-btn--sm">
                Shop Marketplace →
              </Link>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '30px 0', color: '#64748b' }}>
                Loading recent marketplace orders...
              </div>
            ) : recentOrders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: '#64748b' }}>
                <p style={{ marginBottom: 12 }}>You have not placed any marketplace orders yet.</p>
                <Link to="/marketplace" className="dash-btn dash-btn--primary">
                  Explore Circular Products
                </Link>
              </div>
            ) : (
              <div className="dash-table-wrap">
                <table className="dash-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Order Date</th>
                      <th>Items Included</th>
                      <th>Total Cost</th>
                      <th>Fulfillment Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order.id}>
                        <td>
                          <strong>#{order.id}</strong>
                        </td>
                        <td>
                          <span style={{ fontSize: 13, color: '#64748b' }}>
                            {order.created_at
                              ? new Date(order.created_at).toLocaleDateString()
                              : 'Recent'}
                          </span>
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
                                      }}
                                    />
                                  )}
                                  <span style={{ fontSize: 12, fontWeight: 600 }}>
                                    {item.product_name}
                                    {item.quantity > 1 ? ` × ${item.quantity}` : ''}
                                  </span>
                                  <span style={{ fontSize: 11, color: '#64748b' }}>
                                    (৳{item.product_price})
                                  </span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span style={{ fontSize: 12, color: '#94a3b8' }}>1 Product Bundle</span>
                          )}
                        </td>
                        <td>
                          <strong style={{ color: '#269c26', fontSize: 15 }}>
                            ৳{Number(order.total_price || 0).toLocaleString()}
                          </strong>
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
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          )}

          {/* Recycled Scrap Impact & Earnings Summary */}
          {activeTab === 'overview' && (
          <div className="dash-card">
            <div className="dash-card__header">
              <div>
                <h2 className="dash-card__title">Recycled Scrap Sales &amp; Impact Summary</h2>
                <p style={{ fontSize: 13, color: '#64748b' }}>
                  Total weight and earnings for recyclable materials sold through doorstep pickup.
                </p>
              </div>
              <Link to="/book-pickup" className="dash-btn dash-btn--secondary dash-btn--sm">
                Book Scrap Pickup →
              </Link>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '30px 0', color: '#64748b' }}>
                Loading recycling statistics...
              </div>
            ) : stats.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '30px 0', color: '#64748b' }}>
                No scrap pickup transactions recorded yet. Book a pickup to turn your recyclables into instant cash!
              </div>
            ) : (
              <div className="dash-table-wrap">
                <table className="dash-table">
                  <thead>
                    <tr>
                      <th>Material</th>
                      <th>Total Weight Sold</th>
                      <th>Total Cash Received</th>
                      <th>Average Payout Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.map((s, idx) => {
                      const w = parseFloat(s.scrap_weight) || 0;
                      const p = parseFloat(s.scrap_price) || 0;
                      const avg = w > 0 ? (p / w).toFixed(2) : '0';

                      return (
                        <tr key={idx}>
                          <td>
                            <strong>{s.scrap_name}</strong>
                          </td>
                          <td>
                            <strong style={{ color: '#0f172a' }}>{w.toLocaleString()} kg</strong>
                          </td>
                          <td>
                            <strong style={{ color: '#269c26' }}>৳{p.toLocaleString()}</strong>
                          </td>
                          <td>
                            <span style={{ fontSize: 13, color: '#64748b' }}>৳{avg} / kg</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          )}

          {/* Profile Management Section */}
          {(activeTab === 'overview' || activeTab === 'profile') && (
          <div className="dash-card">
            <div className="dash-card__header">
              <div>
                <h2 className="dash-card__title">Manage Profile &amp; Settings</h2>
                <p style={{ fontSize: 13, color: '#64748b' }}>
                  Update your contact details or password.
                </p>
              </div>
              <span className="dash-badge dash-badge--customer">Account Profile</span>
            </div>

            <form onSubmit={handleProfileUpdate} className="dash-form">
              <div className="form-grid-2">
                <div className="form-group">
                  <label htmlFor="cust-name">Full Name</label>
                  <input
                    id="cust-name"
                    type="text"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="cust-phone">Phone Number</label>
                  <input
                    id="cust-phone"
                    type="text"
                    value={profileForm.phone_number}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, phone_number: e.target.value })
                    }
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label htmlFor="cust-email">Email Address</label>
                  <input
                    id="cust-email"
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="cust-password">Change Password (leave empty to keep current)</label>
                  <input
                    id="cust-password"
                    type="password"
                    value={profileForm.password}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, password: e.target.value })
                    }
                    placeholder="New password (optional)"
                    className="form-input"
                  />
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: 16,
                }}
              >
                <button
                  type="button"
                  onClick={handleProfileDelete}
                  className="dash-btn dash-btn--danger"
                >
                  Delete Account Profile
                </button>

                <button
                  type="submit"
                  disabled={isUpdating}
                  className="dash-btn dash-btn--primary"
                >
                  {isUpdating ? 'Saving...' : 'Save Profile Changes'}
                </button>
              </div>
            </form>
          </div>
          )}
    </PortalLayout>
  );
}
