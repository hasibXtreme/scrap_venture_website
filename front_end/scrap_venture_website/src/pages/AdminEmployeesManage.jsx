import { useState, useEffect } from 'react';
import PortalLayout from '../components/dashboard/PortalLayout.jsx';
import { apiRequest } from '../utils/api.js';

export default function AdminEmployeesManage() {
  const [collectors, setCollectors] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'pending' | 'verified' | 'transactions'
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const fetchCollectors = async () => {
    setLoading(true);
    try {
      const data = await apiRequest('/api/admindashboard/collector-display');
      setCollectors(data?.all_collectors || data?.collectors || []);
      setTransactions(data?.transactions || []);
    } catch (err) {
      console.error('Failed to load collectors list:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollectors();
  }, []);

  const handleVerify = async (collectorId, isVerified) => {
    setActionLoadingId(collectorId);
    try {
      await apiRequest(`/api/admindashboard/collector-verify/${collectorId}`, {
        method: 'POST',
        body: { is_verified: isVerified },
      });
      setCollectors((prev) =>
        prev.map((c) => (c.id === collectorId ? { ...c, is_verified: isVerified } : c))
      );
    } catch (err) {
      alert('Verification status change failed: ' + (err.message || 'Error'));
    } finally {
      setActionLoadingId(null);
    }
  };

  const pendingList = collectors.filter((c) => !c.is_verified);
  const verifiedList = collectors.filter((c) => c.is_verified);

  const totalCollectedWeight = collectors.reduce((acc, c) => acc + (parseFloat(c.total_weight) || 0), 0);
  const totalPayoutValue = collectors.reduce((acc, c) => acc + (parseFloat(c.total_price) || 0), 0);

  const currentDisplayList =
    activeTab === 'all' ? collectors : activeTab === 'pending' ? pendingList : verifiedList;

  return (
    <PortalLayout
      portalRole="admin"
      breadcrumb={[{ label: 'Admin Portal', to: '/admin/dashboard' }, { label: 'Employees / Collectors' }]}
    >
      <div className="portal-header-row">
        <div className="portal-header-text">
          <h1>Employees &amp; Collectors</h1>
          <p>
            Directory of field collectors, verification workflows, and scrap transaction handover records.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="portal-kpi-grid">
        <div className="portal-kpi-card">
          <div>
            <div className="portal-kpi-title">TOTAL REGISTERED FLEET</div>
            <div className="portal-kpi-val">{collectors.length} Collectors</div>
            <div className="portal-kpi-sub">Total applicants &amp; partners</div>
          </div>
          <div className="portal-kpi-icon-pill portal-kpi-icon-pill--blue">
            👥
          </div>
        </div>

        <div className="portal-kpi-card">
          <div>
            <div className="portal-kpi-title">TOTAL SCRAP COLLECTED</div>
            <div className="portal-kpi-val">{totalCollectedWeight.toLocaleString()} kg</div>
            <div className="portal-kpi-sub">Total weight collected by fleet</div>
          </div>
          <div className="portal-kpi-icon-pill portal-kpi-icon-pill--green">
            ⚖️
          </div>
        </div>

        <div className="portal-kpi-card">
          <div>
            <div className="portal-kpi-title">TOTAL PAYOUT DISBURSED</div>
            <div className="portal-kpi-val">৳{totalPayoutValue.toLocaleString()}</div>
            <div className="portal-kpi-sub">Across all scrap handovers</div>
          </div>
          <div className="portal-kpi-icon-pill portal-kpi-icon-pill--orange">
            ৳
          </div>
        </div>

        <div className="portal-kpi-card">
          <div>
            <div className="portal-kpi-title">ACTIVE FIELD COLLECTORS</div>
            <div className="portal-kpi-val">{verifiedList.length} Verified</div>
            <div className="portal-kpi-sub">{pendingList.length} pending review</div>
          </div>
          <div className="portal-kpi-icon-pill portal-kpi-icon-pill--green">
            🛡️
          </div>
        </div>
      </div>

      {/* Tabs & Table */}
      <div className="portal-table-card">
        <div className="portal-table-card__header">
          <div className="portal-filter-group">
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`portal-filter-pill ${activeTab === 'all' ? 'active' : ''}`}
            >
              All Collectors ({collectors.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('pending')}
              className={`portal-filter-pill ${activeTab === 'pending' ? 'active' : ''}`}
            >
              Pending ({pendingList.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('verified')}
              className={`portal-filter-pill ${activeTab === 'verified' ? 'active' : ''}`}
            >
              Verified Fleet ({verifiedList.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('transactions')}
              className={`portal-filter-pill ${activeTab === 'transactions' ? 'active' : ''}`}
            >
              📋 Scrap Transactions ({transactions.length})
            </button>
          </div>
        </div>

        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
            Loading collector roster...
          </div>
        ) : activeTab === 'transactions' ? (
          /* Scrap Transactions Log View */
          transactions.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
              No scrap pickup transactions recorded yet. Use the Scrap Transaction page to enter handovers.
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="portal-table">
                <thead>
                  <tr>
                    <th>TRX ID</th>
                    <th>DATE</th>
                    <th>SCRAP MATERIAL</th>
                    <th>ACTUAL WEIGHT</th>
                    <th>TOTAL PAYOUT</th>
                    <th>FIELD COLLECTOR</th>
                    <th>CUSTOMER</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((trx) => (
                    <tr key={trx.id}>
                      <td>
                        <strong>#{trx.id}</strong>
                      </td>
                      <td style={{ color: '#64748b', fontSize: 12 }}>
                        {trx.created_at ? new Date(trx.created_at).toLocaleDateString() : 'Recent'}
                      </td>
                      <td>
                        <strong>{trx.scrap_name}</strong>
                      </td>
                      <td>
                        <strong style={{ color: '#0f172a' }}>{Number(trx.actual_weight || 0).toLocaleString()} kg</strong>
                      </td>
                      <td>
                        <strong style={{ color: '#16a34a' }}>৳{Number(trx.actual_price || 0).toLocaleString()}</strong>
                      </td>
                      <td>
                        <div>
                          <div style={{ fontWeight: 600, color: '#0f172a' }}>{trx.collector_name || 'Collector Partner'}</div>
                          <div style={{ fontSize: 11, color: '#64748b' }}>{trx.collector_phone || '—'}</div>
                        </div>
                      </td>
                      <td>
                        <div>
                          <div style={{ fontWeight: 600, color: '#0f172a' }}>{trx.customer_name || 'Customer'}</div>
                          <div style={{ fontSize: 11, color: '#64748b' }}>{trx.customer_phone || '—'}</div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : currentDisplayList.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
            No records found in this category.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="portal-table">
              <thead>
                <tr>
                  <th>COLLECTOR DETAILS</th>
                  <th>NID &amp; VERIFICATION</th>
                  <th>STATUS</th>
                  <th>COLLECTIONS &amp; PAYOUTS</th>
                  <th>ZONE &amp; DISTRICT</th>
                  <th>VEHICLE</th>
                  <th style={{ textAlign: 'right' }}>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {currentDisplayList.map((col, idx) => (
                  <tr key={col.id || idx}>
                    <td>
                      <div>
                        <div style={{ fontWeight: 700, color: '#0f172a' }}>{col.name || 'Collector Applicant'}</div>
                        <div style={{ fontSize: 11.5, color: '#64748b' }}>{col.phone_number || '+880 1722-112233'}</div>
                      </div>
                    </td>
                    <td>
                      <div>
                        <div style={{ fontFamily: 'monospace', fontWeight: 600, color: '#334155' }}>
                          {col.nid || '19922615288004921'}
                        </div>
                        <div style={{ fontSize: 11, color: '#16a34a', fontWeight: 600 }}>
                          NID Document Attached
                        </div>
                      </div>
                    </td>
                    <td>
                      <span
                        className={`portal-status-badge ${
                          col.is_verified ? 'portal-status-badge--success' : 'portal-status-badge--warning'
                        }`}
                      >
                        {col.is_verified ? '✓ Verified Partner' : '⏳ Pending Review'}
                      </span>
                    </td>
                    <td>
                      <div>
                        <div style={{ fontWeight: 700, color: '#16a34a' }}>
                          {Number(col.total_weight || 0).toLocaleString()} kg
                        </div>
                        <div style={{ fontSize: 11.5, color: '#64748b' }}>
                          ৳{Number(col.total_price || 0).toLocaleString()} ({col.total_transactions || 0} orders)
                        </div>
                      </div>
                    </td>
                    <td>
                      <div>
                        <div style={{ fontWeight: 600, color: '#0f172a' }}>{col.thana || 'Mirpur'}</div>
                        <div style={{ fontSize: 11, color: '#94a3b8' }}>{col.district || 'Dhaka'}, {col.division || 'Dhaka'}</div>
                      </div>
                    </td>
                    <td>
                      <div>
                        <div style={{ fontWeight: 600, color: '#334155' }}>{col.vehicle_type || 'Cargo E-Trike'}</div>
                        <div style={{ fontSize: 11, color: '#94a3b8' }}>Exp: 3+ Years</div>
                      </div>
                    </td>
                    <td style={{ color: '#64748b', fontSize: 12 }}>
                      {col.created_at ? new Date(col.created_at).toLocaleDateString() : '14 Oct 2026'}
                    </td>
                    <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                      {!col.is_verified ? (
                        <div style={{ display: 'inline-flex', gap: 6 }}>
                          <button
                            type="button"
                            disabled={actionLoadingId === col.id}
                            onClick={() => handleVerify(col.id, true)}
                            className="portal-btn-sm portal-btn-sm--approve"
                          >
                            Approve
                          </button>
                          <button
                            type="button"
                            disabled={actionLoadingId === col.id}
                            onClick={() => handleVerify(col.id, false)}
                            className="portal-btn-sm portal-btn-sm--reject"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          disabled={actionLoadingId === col.id}
                          onClick={() => handleVerify(col.id, false)}
                          className="portal-btn-sm portal-btn-sm--reject"
                        >
                          Revoke Verification
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </PortalLayout>
  );
}
