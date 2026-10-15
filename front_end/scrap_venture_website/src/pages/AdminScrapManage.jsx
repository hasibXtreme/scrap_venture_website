import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PortalLayout from '../components/dashboard/PortalLayout.jsx';
import { apiRequest } from '../utils/api.js';

export default function AdminScrapManage() {
  const [scraps, setScraps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingScrap, setEditingScrap] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const fetchScraps = async () => {
    setLoading(true);
    try {
      const data = await apiRequest('/api/admindashboard/scrap/display').catch(() =>
        apiRequest('/api/scrap-materials/display')
      );
      setScraps(data?.scrap_materials || []);
    } catch (err) {
      console.error('Failed to load scrap materials:', err);
      setMessage({ type: 'error', text: 'Could not load scrap materials catalog' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScraps();
  }, []);

  const openCreateModal = () => {
    setEditingScrap(null);
    setFormData({ name: '', price: '', description: '' });
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingScrap(item);
    setFormData({
      name: item.name || '',
      price: item.price || '',
      description: item.description || '',
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      setMessage({ type: 'error', text: 'Name and price per kg are required' });
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingScrap) {
        await apiRequest(`/api/admindashboard/scrap/update/${editingScrap.id}`, {
          method: 'PUT',
          body: {
            name: formData.name.trim(),
            price: parseFloat(formData.price),
            description: formData.description.trim(),
          },
        });
        setMessage({ type: 'success', text: `Scrap material '${formData.name}' updated successfully!` });
      } else {
        await apiRequest('/api/admindashboard/scrap/post', {
          method: 'POST',
          body: {
            name: formData.name.trim(),
            price: parseFloat(formData.price),
            description: formData.description.trim(),
          },
        });
        setMessage({ type: 'success', text: `New scrap material '${formData.name}' added to catalog!` });
      }

      setModalOpen(false);
      fetchScraps();
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Operation failed' });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setMessage(null), 4000);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove '${name}' from the scrap catalog?`)) {
      return;
    }

    setDeletingId(id);
    try {
      await apiRequest(`/api/admindashboard/scrap/delete/${id}`, {
        method: 'DELETE',
      });
      setMessage({ type: 'success', text: `Scrap material '${name}' deleted successfully!` });
      setScraps((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to delete scrap material' });
    } finally {
      setDeletingId(null);
      setTimeout(() => setMessage(null), 4000);
    }
  };

  const avgPrice =
    scraps.length > 0
      ? (scraps.reduce((acc, s) => acc + (parseFloat(s.price) || 0), 0) / scraps.length).toFixed(2)
      : '0.00';

  const maxValued =
    scraps.length > 0
      ? [...scraps].sort((a, b) => (parseFloat(b.price) || 0) - (parseFloat(a.price) || 0))[0]
      : null;

  return (
    <PortalLayout
      portalRole="admin"
      breadcrumb={[
        { label: 'Admin Portal', to: '/admin/dashboard' },
        { label: 'Scrap Materials / Rates' },
      ]}
    >
      <div className="portal-header-row">
        <div className="portal-header-text">
          <h1>Scrap Materials &amp; Benchmark Rates</h1>
          <p>
            Configure catalog recyclable materials, set buying rates per kilogram, and define category descriptions for citizen collections.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            type="button"
            onClick={openCreateModal}
            className="portal-btn-sm portal-btn-sm--approve"
            style={{ padding: '8px 18px', fontSize: 13, textDecoration: 'none' }}
          >
            + Add New Scrap Type
          </button>
          <Link
            to="/admin/scrap-transaction"
            className="portal-btn-sm"
            style={{ textDecoration: 'none', background: '#0f172a', color: '#ffffff' }}
          >
            Record Transaction →
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
            borderRadius: 10,
            marginBottom: 20,
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          {message.text}
        </div>
      )}

      {/* KPI Cards */}
      <div className="portal-kpi-grid">
        <div className="portal-kpi-card">
          <div>
            <div className="portal-kpi-title">REGISTERED MATERIALS</div>
            <div className="portal-kpi-val">{scraps.length} Types</div>
            <div className="portal-kpi-sub">Active streams in collection system</div>
          </div>
          <div className="portal-kpi-icon-pill portal-kpi-icon-pill--green">
            ♻️
          </div>
        </div>

        <div className="portal-kpi-card">
          <div>
            <div className="portal-kpi-title">AVERAGE BUYING RATE</div>
            <div className="portal-kpi-val">৳{avgPrice} / kg</div>
            <div className="portal-kpi-sub">Across all circular scrap items</div>
          </div>
          <div className="portal-kpi-icon-pill portal-kpi-icon-pill--blue">
            ⚖️
          </div>
        </div>

        <div className="portal-kpi-card">
          <div>
            <div className="portal-kpi-title">PREMIUM VALUE STREAM</div>
            <div className="portal-kpi-val">{maxValued ? `${maxValued.name}` : 'N/A'}</div>
            <div className="portal-kpi-sub">
              {maxValued ? `৳${parseFloat(maxValued.price).toFixed(2)} per kg` : 'No materials'}
            </div>
          </div>
          <div className="portal-kpi-icon-pill portal-kpi-icon-pill--orange">
            ⭐
          </div>
        </div>
      </div>

      {/* Materials Table Card */}
      <div className="portal-table-card">
        <div className="portal-table-card__header">
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', margin: '0 0 4px 0' }}>
              Materials Price Index ({scraps.length})
            </h2>
            <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>
              Rates here automatically determine default payouts when logging collector transactions.
            </p>
          </div>
          <button
            type="button"
            onClick={fetchScraps}
            className="portal-btn-sm"
            style={{ fontSize: 12, padding: '6px 12px' }}
          >
            ↻ Refresh Rates
          </button>
        </div>

        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
            Loading scrap materials catalog...
          </div>
        ) : scraps.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
            <p style={{ marginBottom: 16 }}>No scrap materials defined in the database catalog yet.</p>
            <button
              type="button"
              onClick={openCreateModal}
              className="portal-btn-sm portal-btn-sm--approve"
            >
              + Create First Scrap Material
            </button>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="portal-table">
              <thead>
                <tr>
                  <th style={{ width: 60 }}>ID</th>
                  <th>SCRAP TYPE &amp; NAME</th>
                  <th>BUYING RATE (PER KG)</th>
                  <th>DESCRIPTION &amp; SPECIFICATIONS</th>
                  <th>LAST UPDATED</th>
                  <th style={{ textAlign: 'right' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {scraps.map((s) => (
                  <tr key={s.id}>
                    <td>
                      <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#64748b' }}>
                        #{s.id}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 700, color: '#0f172a', fontSize: 14 }}>
                        {s.name}
                      </div>
                    </td>
                    <td>
                      <span
                        style={{
                          fontWeight: 700,
                          color: '#16a34a',
                          fontSize: 14,
                          background: '#f0fdf4',
                          padding: '4px 8px',
                          borderRadius: 6,
                          display: 'inline-block',
                        }}
                      >
                        ৳{parseFloat(s.price).toFixed(2)} / kg
                      </span>
                    </td>
                    <td>
                      <div style={{ color: '#475569', fontSize: 13, maxWidth: 380 }}>
                        {s.description || <span style={{ color: '#94a3b8' }}>No description provided</span>}
                      </div>
                    </td>
                    <td style={{ color: '#64748b', fontSize: 12 }}>
                      {s.updated_at ? new Date(s.updated_at).toLocaleDateString() : 'Active'}
                    </td>
                    <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'inline-flex', gap: 6 }}>
                        <button
                          type="button"
                          onClick={() => openEditModal(s)}
                          className="portal-btn-sm"
                          style={{ fontSize: 12, padding: '5px 12px' }}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          disabled={deletingId === s.id}
                          onClick={() => handleDelete(s.id, s.name)}
                          className="portal-btn-sm portal-btn-sm--reject"
                          style={{ fontSize: 12, padding: '5px 12px' }}
                        >
                          {deletingId === s.id ? 'Removing...' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: 16,
          }}
          onClick={() => setModalOpen(false)}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: 16,
              maxWidth: 520,
              width: '100%',
              padding: '28px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', margin: 0 }}>
                {editingScrap ? `Edit Scrap Material #${editingScrap.id}` : 'Add New Scrap Material Type'}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: 22,
                  cursor: 'pointer',
                  color: '#64748b',
                }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 6 }}>
                  Scrap Material Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Copper Wire Grade A, Aluminum Cans, HDPE Plastic"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 8,
                    border: '1px solid #cbd5e1',
                    fontSize: 14,
                  }}
                  required
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 6 }}>
                  Standard Buying Rate (BDT ৳ per kg) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="e.g. 35.00"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 8,
                    border: '1px solid #cbd5e1',
                    fontSize: 14,
                  }}
                  required
                />
                <span style={{ fontSize: 11, color: '#94a3b8' }}>
                  Base amount paid to customers per kilogram during collector pickup.
                </span>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 6 }}>
                  Material Description / Sorting Guidelines
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="e.g. Clean, dry bottles, caps removed; bundles of tied cardboard..."
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 8,
                    border: '1px solid #cbd5e1',
                    fontSize: 14,
                    resize: 'vertical',
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 8,
                    border: '1px solid #cbd5e1',
                    background: '#f8fafc',
                    color: '#475569',
                    fontWeight: 600,
                    fontSize: 13,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="portal-btn-sm portal-btn-sm--approve"
                  style={{ padding: '8px 20px', fontSize: 13 }}
                >
                  {isSubmitting ? 'Saving...' : editingScrap ? 'Update Material' : 'Add to Catalog'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PortalLayout>
  );
}
