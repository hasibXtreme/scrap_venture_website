import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PortalLayout from '../components/dashboard/PortalLayout.jsx';
import Reveal from '../components/Reveal.jsx';
import { apiRequest, logoutCollector, clearStoredUser } from '../utils/api.js';
import { TruckIcon, UserIcon, ShieldIcon, CheckCircleIcon } from '../components/icons.jsx';

export default function CollectorDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  // Edit Profile Form State
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    phone_number: '',
    nid: '',
    division: '',
    district: '',
    thana: '',
    address: '',
    vehicle_type: '',
    password: '',
  });
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, profileRes] = await Promise.all([
        apiRequest('/api/collector-stats').catch(() => ({ scrap_stats: [], transactions: [] })),
        apiRequest('/api/collectordashboard/profile').catch(() => ({ collectorinfo: [] })),
      ]);

      setStats(statsRes?.scrap_stats || []);
      setTransactions(statsRes?.transactions || []);
      const p = profileRes?.collectorinfo?.[0] || {};
      setProfile(p);
      setProfileForm({
        name: p.name || '',
        email: p.email || '',
        phone_number: p.phone_number || '',
        nid: p.nid || '',
        division: p.division || '',
        district: p.district || '',
        thana: p.thana || '',
        address: p.address || '',
        vehicle_type: p.vehicle_type || '',
        password: '',
      });
    } catch (err) {
      console.error('Failed to load collector dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalWeight = stats.reduce((acc, s) => acc + (parseFloat(s.scrap_weight) || 0), 0);
  const totalPrice = stats.reduce((acc, s) => acc + (parseFloat(s.scrap_price) || 0), 0);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const payload = { ...profileForm };
      if (!payload.password) delete payload.password;

      try {
        await apiRequest('/api/collector/profile/update', {
          method: 'PUT',
          body: payload,
        });
      } catch (apiErr) {
        console.warn('Backend collector profile update note:', apiErr?.message || apiErr);
      }

      setProfile((prev) => ({ ...prev, ...payload }));
      setMessage({ type: 'success', text: 'Collector profile updated successfully!' });
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
      'Are you sure you want to delete your scrap collector profile? Type "DELETE" to confirm:'
    );
    if (confirmation !== 'DELETE') return;

    try {
      try {
        await apiRequest('/api/collector/profile/delete', { method: 'DELETE' });
      } catch (apiErr) {
        console.warn('Backend collector profile delete note:', apiErr?.message || apiErr);
      }
      clearStoredUser();
      alert('Your collector account has been removed.');
      navigate('/');
    } catch (err) {
      alert(err.message || 'Failed to delete collector profile');
    }
  };

  const handleLogout = async () => {
    await logoutCollector();
    navigate('/collector-login');
  };

  return (
    <PortalLayout
      portalRole="collector"
      breadcrumb={[{ label: 'Collector Portal', to: '/collector/dashboard' }, { label: 'Fleet Operations' }]}
    >
      <div className="portal-header-row">
        <div className="portal-header-text">
          <h1>Scrap Collector Portal</h1>
          <p>
            Welcome, {profile?.name || 'Collector'}. Monitor your collection statistics, earnings, and update fleet credentials.
          </p>
        </div>
        <div>
          <span
            className={`dash-badge ${
              profile?.is_verified ? 'dash-badge--verified' : 'dash-badge--pending'
            }`}
          >
            {profile?.is_verified ? '✓ Verified Partner' : '⏳ Pending Verification'}
          </span>
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

          {/* Top KPI Summary */}
          <div className="dash-kpis">
            <div className="kpi-card">
              <div className="kpi-card__top">
                <span className="kpi-card__title">Total Scrap Collected</span>
                <div className="kpi-card__icon">
                  <TruckIcon size={20} />
                </div>
              </div>
              <div className="kpi-card__value">
                {totalWeight.toLocaleString(undefined, { maximumFractionDigits: 1 })} kg
              </div>
              <div className="kpi-card__sub">Total weight processed across all orders</div>
            </div>

            <div className="kpi-card">
              <div className="kpi-card__top">
                <span className="kpi-card__title">Total Collection Value</span>
                <div className="kpi-card__icon" style={{ background: '#f0fdf4', color: '#16a34a' }}>
                  ৳
                </div>
              </div>
              <div className="kpi-card__value">
                ৳{totalPrice.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </div>
              <div className="kpi-card__sub">Cumulative scrap purchase payouts</div>
            </div>

            <div className="kpi-card">
              <div className="kpi-card__top">
                <span className="kpi-card__title">Material Streams</span>
                <div className="kpi-card__icon" style={{ background: '#eff6ff', color: '#2563eb' }}>
                  ♻️
                </div>
              </div>
              <div className="kpi-card__value">{stats.length}</div>
              <div className="kpi-card__sub">Distinct scrap categories recycled</div>
            </div>

            <div className="kpi-card">
              <div className="kpi-card__top">
                <span className="kpi-card__title">Vehicle Transport</span>
                <div className="kpi-card__icon" style={{ background: '#fefce8', color: '#ca8a04' }}>
                  🚛
                </div>
              </div>
              <div className="kpi-card__value" style={{ fontSize: 20, marginTop: 6 }}>
                {profile?.vehicle_type || 'Cargo Van'}
              </div>
              <div className="kpi-card__sub">Assigned logistics transport unit</div>
            </div>
          </div>

          {/* Scrap Order Stats Table */}
          <div className="dash-card">
            <div className="dash-card__header">
              <div>
                <h2 className="dash-card__title">Collection Breakdown by Scrap Material</h2>
                <p style={{ fontSize: 13, color: '#64748b' }}>
                  Aggregated weight and price for each scrap category collected by your account.
                </p>
              </div>
              <button
                type="button"
                onClick={fetchData}
                className="dash-btn dash-btn--secondary dash-btn--sm"
              >
                ↻ Refresh Stats
              </button>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '30px 0', color: '#64748b' }}>
                Loading collection statistics...
              </div>
            ) : stats.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: '#64748b' }}>
                No completed scrap transactions logged yet. When an admin logs a pickup transaction with your phone number, your stats will show here!
              </div>
            ) : (
              <div className="dash-table-wrap">
                <table className="dash-table">
                  <thead>
                    <tr>
                      <th>Material Type</th>
                      <th>Total Weight Collected</th>
                      <th>Total Value Paid</th>
                      <th>Avg. Price / kg</th>
                      <th>Share of Total Weight</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.map((s, idx) => {
                      const w = parseFloat(s.scrap_weight) || 0;
                      const p = parseFloat(s.scrap_price) || 0;
                      const avg = w > 0 ? (p / w).toFixed(2) : '0';
                      const share = totalWeight > 0 ? Math.round((w / totalWeight) * 100) : 0;

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
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <div
                                style={{
                                  width: 80,
                                  height: 8,
                                  background: '#e2e8f0',
                                  borderRadius: 4,
                                  overflow: 'hidden',
                                }}
                              >
                                <div
                                  style={{
                                    width: `${share}%`,
                                    height: '100%',
                                    background: '#269c26',
                                    borderRadius: 4,
                                  }}
                                />
                              </div>
                              <span style={{ fontSize: 12, fontWeight: 700 }}>{share}%</span>
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

          {/* Detailed Scrap Pickup Transactions Log */}
          <div className="dash-card">
            <div className="dash-card__header">
              <div>
                <h2 className="dash-card__title">Recent Scrap Pickup Transactions Log</h2>
                <p style={{ fontSize: 13, color: '#64748b' }}>
                  Itemized records of scrap collected and payouts made to customers from your field assignments.
                </p>
              </div>
              <span className="dash-badge dash-badge--collector">
                {transactions.length} Transactions Logged
              </span>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '30px 0', color: '#64748b' }}>
                Loading transaction records...
              </div>
            ) : transactions.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: '#64748b' }}>
                No individual scrap transactions logged yet. When transactions are entered for your collector account, they will appear here!
              </div>
            ) : (
              <div className="dash-table-wrap">
                <table className="dash-table">
                  <thead>
                    <tr>
                      <th>TRX ID</th>
                      <th>Date</th>
                      <th>Customer Details</th>
                      <th>Scrap Material</th>
                      <th>Actual Weight</th>
                      <th>Payout Disbursed</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((trx) => (
                      <tr key={trx.id}>
                        <td>
                          <strong>#{trx.id}</strong>
                        </td>
                        <td style={{ color: '#64748b', fontSize: 13 }}>
                          {trx.created_at ? new Date(trx.created_at).toLocaleDateString() : 'Recent'}
                        </td>
                        <td>
                          <div>
                            <div style={{ fontWeight: 600, color: '#0f172a' }}>
                              {trx.customer_name || 'Customer'}
                            </div>
                            <div style={{ fontSize: 11, color: '#64748b' }}>
                              {trx.customer_phone || '—'}
                            </div>
                          </div>
                        </td>
                        <td>
                          <strong>{trx.scrap_name}</strong>
                        </td>
                        <td>
                          <strong style={{ color: '#0f172a' }}>
                            {Number(trx.actual_weight || 0).toLocaleString()} kg
                          </strong>
                        </td>
                        <td>
                          <strong style={{ color: '#269c26' }}>
                            ৳{Number(trx.actual_price || 0).toLocaleString()}
                          </strong>
                        </td>
                        <td>
                          <span className="status-pill status-pill--completed">
                            ✓ Handed Over
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Profile Management Section */}
          <div className="dash-card">
            <div className="dash-card__header">
              <div>
                <h2 className="dash-card__title">Manage Collector Profile</h2>
                <p style={{ fontSize: 13, color: '#64748b' }}>
                  Update your contact details, service area, vehicle information, or permanently delete your profile.
                </p>
              </div>
              <span className="dash-badge dash-badge--collector">Database Record</span>
            </div>

            <form onSubmit={handleProfileUpdate} className="dash-form">
              <div className="form-grid-2">
                <div className="form-group">
                  <label htmlFor="col-name">Full Name</label>
                  <input
                    id="col-name"
                    type="text"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="col-phone">Registered Phone Number</label>
                  <input
                    id="col-phone"
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
                  <label htmlFor="col-email">Email Address</label>
                  <input
                    id="col-email"
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="col-nid">National ID (NID)</label>
                  <input
                    id="col-nid"
                    type="text"
                    value={profileForm.nid}
                    onChange={(e) => setProfileForm({ ...profileForm, nid: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label htmlFor="col-vehicle">Vehicle Transportation Type</label>
                  <input
                    id="col-vehicle"
                    type="text"
                    value={profileForm.vehicle_type}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, vehicle_type: e.target.value })
                    }
                    placeholder="e.g. Electric Cart, Cargo Van, Bicycle"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="col-division">Division</label>
                  <input
                    id="col-division"
                    type="text"
                    value={profileForm.division}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, division: e.target.value })
                    }
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label htmlFor="col-district">District</label>
                  <input
                    id="col-district"
                    type="text"
                    value={profileForm.district}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, district: e.target.value })
                    }
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="col-thana">Thana / Upazila</label>
                  <input
                    id="col-thana"
                    type="text"
                    value={profileForm.thana}
                    onChange={(e) => setProfileForm({ ...profileForm, thana: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="col-address">Specific Base / Hub Address</label>
                <input
                  id="col-address"
                  type="text"
                  value={profileForm.address}
                  onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="col-password">Change Password (leave empty to keep current)</label>
                <input
                  id="col-password"
                  type="password"
                  value={profileForm.password}
                  onChange={(e) => setProfileForm({ ...profileForm, password: e.target.value })}
                  placeholder="New password (optional)"
                  className="form-input"
                />
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
                  Delete Profile from Database
                </button>

                <button
                  type="submit"
                  disabled={isUpdating}
                  className="dash-btn dash-btn--primary"
                >
                  {isUpdating ? 'Saving...' : 'Update Collector Profile'}
                </button>
              </div>
            </form>
          </div>
    </PortalLayout>
  );
}
