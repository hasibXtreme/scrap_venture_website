import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PortalLayout from '../components/dashboard/PortalLayout.jsx';
import { apiRequest } from '../utils/api.js';

export default function AdminCampaignsManage() {
  const [activeTab, setActiveTab] = useState('campaigns'); // 'campaigns' | 'effects'
  const [campaigns, setCampaigns] = useState([]);
  const [effects, setEffects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  // Campaign Modal State
  const [campaignModalOpen, setCampaignModalOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [campaignForm, setCampaignForm] = useState({
    title: '',
    description: '',
    registration_link: '',
  });

  // Effect Modal State
  const [effectModalOpen, setEffectModalOpen] = useState(false);
  const [editingEffect, setEditingEffect] = useState(null);
  const [effectForm, setEffectForm] = useState({
    campaign_title: '',
    effect: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [cRes, eRes] = await Promise.all([
        apiRequest('/api/home/campaigns').catch(() => ({ campaigns: [] })),
        apiRequest('/api/home/campaign-effects').catch(() => ({ campaign_effect: [] })),
      ]);
      setCampaigns(cRes?.campaigns || []);
      setEffects(eRes?.campaign_effect || []);
    } catch (err) {
      console.error('Error fetching campaigns/effects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Campaign Handlers
  const openCreateCampaignModal = () => {
    setEditingCampaign(null);
    setCampaignForm({
      title: '',
      description: '',
      registration_link: 'https://forms.gle/scrapventure-registration',
    });
    setCampaignModalOpen(true);
  };

  const openEditCampaignModal = (item) => {
    setEditingCampaign(item);
    setCampaignForm({
      title: item.title || '',
      description: item.description || '',
      registration_link: item.registration_link || '',
    });
    setCampaignModalOpen(true);
  };

  const handleCampaignSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingCampaign) {
        await apiRequest(`/api/admindashboard/campaign/update/${editingCampaign.id}`, {
          method: 'PUT',
          body: campaignForm,
        });
        setMessage({ type: 'success', text: `Campaign #${editingCampaign.id} updated successfully!` });
      } else {
        await apiRequest('/api/admindashboard/campaign/post', {
          method: 'POST',
          body: campaignForm,
        });
        setMessage({ type: 'success', text: 'New campaign published successfully!' });
      }
      setCampaignModalOpen(false);
      fetchData();
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Operation failed' });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setMessage(null), 4000);
    }
  };

  const handleCampaignDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this campaign?')) return;
    try {
      await apiRequest(`/api/admindashboard/campaign/delete/${id}`, { method: 'DELETE' });
      setMessage({ type: 'success', text: `Campaign #${id} deleted successfully` });
      setCampaigns((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to delete campaign' });
    } finally {
      setTimeout(() => setMessage(null), 4000);
    }
  };

  // Effect Handlers
  const openCreateEffectModal = () => {
    setEditingEffect(null);
    setEffectForm({
      campaign_title: campaigns[0]?.title || '',
      effect: '',
    });
    setEffectModalOpen(true);
  };

  const openEditEffectModal = (item) => {
    setEditingEffect(item);
    setEffectForm({
      campaign_title: item.campaign_title || '',
      effect: item.effect || '',
    });
    setEffectModalOpen(true);
  };

  const handleEffectSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingEffect) {
        await apiRequest(`/api/admindashboard/campaign-effect/update/${editingEffect.id}`, {
          method: 'PUT',
          body: effectForm,
        });
        setMessage({ type: 'success', text: `Campaign Effect #${editingEffect.id} updated!` });
      } else {
        await apiRequest('/api/admindashboard/campaign-effect/post', {
          method: 'POST',
          body: effectForm,
        });
        setMessage({ type: 'success', text: 'New campaign effect published successfully!' });
      }
      setEffectModalOpen(false);
      fetchData();
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Operation failed' });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setMessage(null), 4000);
    }
  };

  const handleEffectDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this campaign effect?')) return;
    try {
      await apiRequest(`/api/admindashboard/campaign-effect/delete/${id}`, { method: 'DELETE' });
      setMessage({ type: 'success', text: `Campaign effect #${id} deleted successfully` });
      setEffects((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to delete effect' });
    } finally {
      setTimeout(() => setMessage(null), 4000);
    }
  };

  return (
    <PortalLayout
      portalRole="admin"
      breadcrumb={[
        { label: 'Admin Portal', to: '/admin/dashboard' },
        { label: 'Campaigns & Drives' },
      ]}
    >
      <div className="portal-header-row">
        <div className="portal-header-text">
          <h1>Campaigns &amp; Impact Effects</h1>
          <p>
            Manage live recycling drives, Google Form registration links, and measurable environmental effects displayed in the Blog page.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {activeTab === 'campaigns' ? (
            <button
              type="button"
              onClick={openCreateCampaignModal}
              className="portal-btn-sm portal-btn-sm--approve"
              style={{ padding: '8px 16px', fontSize: 13 }}
            >
              + Create New Campaign
            </button>
          ) : (
            <button
              type="button"
              onClick={openCreateEffectModal}
              className="portal-btn-sm portal-btn-sm--approve"
              style={{ padding: '8px 16px', fontSize: 13 }}
            >
              + Add Campaign Effect
            </button>
          )}
          <Link to="/admin/dashboard" className="portal-btn-sm" style={{ textDecoration: 'none' }}>
            ← Admin Dashboard
          </Link>
        </div>
      </div>

      <div style={{ padding: '0 0 24px 0' }}>
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

          {/* Sub Navigation Tabs */}
          <div className="dash-nav-bar">
            <button
              type="button"
              className={`dash-nav-btn ${activeTab === 'campaigns' ? 'active' : ''}`}
              onClick={() => setActiveTab('campaigns')}
            >
              📢 Active Campaigns ({campaigns.length})
            </button>
            <button
              type="button"
              className={`dash-nav-btn ${activeTab === 'effects' ? 'active' : ''}`}
              onClick={() => setActiveTab('effects')}
            >
              📊 Campaign Effects &amp; Impacts ({effects.length})
            </button>
          </div>

          {/* Campaigns Tab */}
          {activeTab === 'campaigns' && (
            <div className="dash-card">
              <div className="dash-card__header">
                <div>
                  <h2 className="dash-card__title">National Campaigns</h2>
                  <p style={{ fontSize: 13, color: '#64748b' }}>
                    The latest campaign appears as a popup invitation on the site entrance.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={fetchData}
                  className="dash-btn dash-btn--secondary dash-btn--sm"
                >
                  ↻ Refresh
                </button>
              </div>

              {loading ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: '#64748b' }}>
                  Loading campaigns...
                </div>
              ) : campaigns.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: '#64748b' }}>
                  No campaigns published yet. Click "+ Create New Campaign" to launch one!
                </div>
              ) : (
                <div className="dash-table-wrap">
                  <table className="dash-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Campaign Title</th>
                        <th>Description &amp; Goals</th>
                        <th>Google Form Link</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {campaigns.map((camp) => (
                        <tr key={camp.id}>
                          <td>
                            <strong>#{camp.id}</strong>
                          </td>
                          <td>
                            <strong>{camp.title}</strong>
                          </td>
                          <td>
                            <p style={{ fontSize: 13, color: '#475569', maxWidth: 450 }}>
                              {camp.description}
                            </p>
                          </td>
                          <td>
                            {camp.registration_link ? (
                              <a
                                href={camp.registration_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  fontSize: 12,
                                  color: '#269c26',
                                  textDecoration: 'underline',
                                  wordBreak: 'break-all',
                                }}
                              >
                                {camp.registration_link}
                              </a>
                            ) : (
                              <span style={{ fontSize: 12, color: '#94a3b8' }}>None set</span>
                            )}
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: 6 }}>
                              <button
                                type="button"
                                onClick={() => openEditCampaignModal(camp)}
                                className="dash-btn dash-btn--secondary dash-btn--sm"
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => handleCampaignDelete(camp.id)}
                                className="dash-btn dash-btn--danger dash-btn--sm"
                              >
                                Delete
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
          )}

          {/* Campaign Effects Tab */}
          {activeTab === 'effects' && (
            <div className="dash-card">
              <div className="dash-card__header">
                <div>
                  <h2 className="dash-card__title">Campaign Effects &amp; Environmental Impact</h2>
                  <p style={{ fontSize: 13, color: '#64748b' }}>
                    Metrics, diverged scrap tons, and ecological achievements displayed on the public Blog page.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={fetchData}
                  className="dash-btn dash-btn--secondary dash-btn--sm"
                >
                  ↻ Refresh
                </button>
              </div>

              {loading ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: '#64748b' }}>
                  Loading campaign effects...
                </div>
              ) : effects.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: '#64748b' }}>
                  No campaign effects logged yet. Click "+ Add Campaign Effect" to record impact!
                </div>
              ) : (
                <div className="dash-table-wrap">
                  <table className="dash-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Target Campaign Title</th>
                        <th>Recorded Ecological Effect &amp; Metrics</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {effects.map((item) => (
                        <tr key={item.id}>
                          <td>
                            <strong>#{item.id}</strong>
                          </td>
                          <td>
                            <span className="dash-badge dash-badge--admin">
                              {item.campaign_title || 'General'}
                            </span>
                          </td>
                          <td>
                            <p style={{ fontSize: 13, color: '#334155', lineHeight: 1.5 }}>
                              {item.effect}
                            </p>
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: 6 }}>
                              <button
                                type="button"
                                onClick={() => openEditEffectModal(item)}
                                className="dash-btn dash-btn--secondary dash-btn--sm"
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => handleEffectDelete(item.id)}
                                className="dash-btn dash-btn--danger dash-btn--sm"
                              >
                                Delete
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
          )}
        </div>

        {/* Campaign Modal */}
        {campaignModalOpen && (
          <div className="dash-modal-overlay" onClick={() => setCampaignModalOpen(false)}>
            <div className="dash-modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="dash-modal-header">
                <h3 className="dash-modal-title">
                  {editingCampaign ? `Edit Campaign #${editingCampaign.id}` : 'Create New Campaign'}
                </h3>
                <button
                  type="button"
                  onClick={() => setCampaignModalOpen(false)}
                  style={{ fontSize: 20, cursor: 'pointer', border: 'none', background: 'none' }}
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleCampaignSubmit} className="dash-form">
                <div className="form-group">
                  <label htmlFor="camp-title">Campaign Title</label>
                  <input
                    id="camp-title"
                    type="text"
                    value={campaignForm.title}
                    onChange={(e) => setCampaignForm({ ...campaignForm, title: e.target.value })}
                    placeholder="e.g. Dhaka Green Doorstep Blitz 2026"
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="camp-desc">Description &amp; Overview</label>
                  <textarea
                    id="camp-desc"
                    value={campaignForm.description}
                    onChange={(e) =>
                      setCampaignForm({ ...campaignForm, description: e.target.value })
                    }
                    placeholder="Detail the objectives, community outreach, and reward structure..."
                    className="form-textarea"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="camp-link">Google Form Registration URL</label>
                  <input
                    id="camp-link"
                    type="url"
                    value={campaignForm.registration_link}
                    onChange={(e) =>
                      setCampaignForm({ ...campaignForm, registration_link: e.target.value })
                    }
                    placeholder="https://forms.gle/..."
                    className="form-input"
                    required
                  />
                  <span style={{ fontSize: 11, color: '#94a3b8' }}>
                    Citizens visiting the site can register via this Google Form directly from the entrance popup.
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 16 }}>
                  <button
                    type="button"
                    onClick={() => setCampaignModalOpen(false)}
                    className="dash-btn dash-btn--secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="dash-btn dash-btn--primary"
                  >
                    {isSubmitting ? 'Saving...' : editingCampaign ? 'Update Campaign' : 'Publish Campaign'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Effect Modal */}
        {effectModalOpen && (
          <div className="dash-modal-overlay" onClick={() => setEffectModalOpen(false)}>
            <div className="dash-modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="dash-modal-header">
                <h3 className="dash-modal-title">
                  {editingEffect ? `Edit Effect #${editingEffect.id}` : 'Log Campaign Effect & Impact'}
                </h3>
                <button
                  type="button"
                  onClick={() => setEffectModalOpen(false)}
                  style={{ fontSize: 20, cursor: 'pointer', border: 'none', background: 'none' }}
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleEffectSubmit} className="dash-form">
                <div className="form-group">
                  <label htmlFor="effect-camp">Related Campaign Title</label>
                  <input
                    id="effect-camp"
                    type="text"
                    value={effectForm.campaign_title}
                    onChange={(e) =>
                      setEffectForm({ ...effectForm, campaign_title: e.target.value })
                    }
                    placeholder="e.g. Zero Waste Campus Drive 2026"
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="effect-desc">Environmental &amp; Social Effect</label>
                  <textarea
                    id="effect-desc"
                    value={effectForm.effect}
                    onChange={(e) => setEffectForm({ ...effectForm, effect: e.target.value })}
                    placeholder="e.g. 4,850 kg scrap diverted from landfills; 3,200+ students actively participated across 14 university departments, averting 7.8 tons of CO₂ lifecycle emissions."
                    className="form-textarea"
                    required
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 16 }}>
                  <button
                    type="button"
                    onClick={() => setEffectModalOpen(false)}
                    className="dash-btn dash-btn--secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="dash-btn dash-btn--primary"
                  >
                    {isSubmitting ? 'Saving...' : editingEffect ? 'Update Effect' : 'Publish Effect'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
    </PortalLayout>
  );
}
