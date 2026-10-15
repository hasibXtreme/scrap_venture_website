import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SiteLayout from '../components/SiteLayout.jsx';
import Reveal from '../components/Reveal.jsx';
import { apiRequest } from '../utils/api.js';

export default function AdminCollectorVerification() {
  const [collectors, setCollectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterVerified, setFilterVerified] = useState('all');
  const [updatingId, setUpdatingId] = useState(null);
  const [message, setMessage] = useState(null);

  const fetchCollectors = async () => {
    setLoading(true);
    try {
      const data = await apiRequest('/api/admindashboard/collector-display');
      setCollectors(data?.all_collectors || []);
    } catch (err) {
      console.error('Error fetching collectors:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollectors();
  }, []);

  const handleToggleVerification = async (collectorId, currentStatus) => {
    setUpdatingId(collectorId);
    const newStatus = !currentStatus;
    try {
      await apiRequest(`/api/admindashboard/collector-verify/${collectorId}`, {
        method: 'POST',
        body: { is_verified: newStatus },
      });
      setMessage({
        type: 'success',
        text: `Collector #${collectorId} status changed to ${newStatus ? 'VERIFIED' : 'UNVERIFIED'}`,
      });
      setCollectors((prev) =>
        prev.map((c) => (c.id === collectorId ? { ...c, is_verified: newStatus } : c))
      );
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to update verification status' });
    } finally {
      setUpdatingId(null);
      setTimeout(() => setMessage(null), 4000);
    }
  };

  const filteredCollectors = collectors.filter((col) => {
    const matchesSearch =
      (col.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (col.phone_number || '').includes(searchTerm) ||
      (col.nid || '').includes(searchTerm) ||
      (col.email || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterVerified === 'all'
        ? true
        : filterVerified === 'verified'
        ? col.is_verified === true
        : col.is_verified === false;

    return matchesSearch && matchesFilter;
  });

  return (
    <SiteLayout variant="home">
      <div className="dash-page">
        <div className="dash-header">
          <div className="wrap dash-header-inner">
            <div className="dash-title-group">
              <span className="eyebrow" style={{ marginBottom: 4 }}>Partner Network</span>
              <h1>Collector <span>Verification</span></h1>
              <p className="dash-subtitle">
                Review registered scrap collectors, inspect NID documentation and vehicle credentials, and grant verification approval.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <Link to="/admin/dashboard" className="dash-btn dash-btn--secondary">
                ← Admin Dashboard
              </Link>
            </div>
          </div>
        </div>

        <div className="wrap">
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
                <h2 className="dash-card__title">
                  Registered Collectors ({filteredCollectors.length})
                </h2>
                <span className="dash-badge dash-badge--collector">Identity Approval</span>
              </div>

              {/* Filters */}
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
                <input
                  type="text"
                  placeholder="Search name, phone, NID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-input"
                  style={{ width: 220, padding: '6px 12px', fontSize: 13 }}
                />

                <select
                  className="form-select"
                  style={{ width: 'auto', padding: '6px 12px', fontSize: 13 }}
                  value={filterVerified}
                  onChange={(e) => setFilterVerified(e.target.value)}
                >
                  <option value="all">All Collectors</option>
                  <option value="verified">Verified Only</option>
                  <option value="pending">Pending Approval</option>
                </select>

                <button
                  type="button"
                  onClick={fetchCollectors}
                  className="dash-btn dash-btn--secondary dash-btn--sm"
                >
                  ↻ Refresh
                </button>
              </div>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: '#64748b' }}>
                Loading collector records...
              </div>
            ) : filteredCollectors.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: '#64748b' }}>
                No collector records found.
              </div>
            ) : (
              <div className="dash-table-wrap">
                <table className="dash-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Collector Name &amp; Contact</th>
                      <th>NID Identification</th>
                      <th>Zone &amp; Address</th>
                      <th>Vehicle Transport</th>
                      <th>Verification Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCollectors.map((col) => (
                      <tr key={col.id}>
                        <td>
                          <strong>#{col.id}</strong>
                        </td>
                        <td>
                          <strong>{col.name || 'Collector Partner'}</strong>
                          <div style={{ fontSize: 13, color: '#16a34a', fontWeight: 600 }}>
                            {col.phone_number}
                          </div>
                          {col.email && (
                            <div style={{ fontSize: 11, color: '#94a3b8' }}>{col.email}</div>
                          )}
                        </td>
                        <td>
                          <code
                            style={{
                              background: '#f1f5f9',
                              padding: '2px 6px',
                              borderRadius: 4,
                              fontSize: 12,
                            }}
                          >
                            {col.nid || 'N/A'}
                          </code>
                        </td>
                        <td>
                          <div style={{ fontSize: 13 }}>
                            {col.thana}, {col.district}
                          </div>
                          <div style={{ fontSize: 11, color: '#64748b' }}>
                            {col.address} ({col.division})
                          </div>
                        </td>
                        <td>
                          <span style={{ fontSize: 12, fontWeight: 600 }}>
                            {col.vehicle_type || 'Bicycle / Cart'}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`dash-badge ${
                              col.is_verified ? 'dash-badge--verified' : 'dash-badge--pending'
                            }`}
                          >
                            {col.is_verified ? '✓ Verified Partner' : '⏳ Pending Approval'}
                          </span>
                        </td>
                        <td>
                          <button
                            type="button"
                            disabled={updatingId === col.id}
                            onClick={() => handleToggleVerification(col.id, col.is_verified)}
                            className={`dash-btn dash-btn--sm ${
                              col.is_verified ? 'dash-btn--danger' : 'dash-btn--primary'
                            }`}
                          >
                            {updatingId === col.id
                              ? 'Updating...'
                              : col.is_verified
                              ? 'Revoke / Unverify'
                              : '✓ Approve Collector'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
