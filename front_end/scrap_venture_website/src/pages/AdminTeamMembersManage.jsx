import { useState, useEffect } from 'react';
import PortalLayout from '../components/dashboard/PortalLayout.jsx';
import { apiRequest } from '../utils/api.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';

export default function AdminTeamMembersManage() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    rank: '',
    responsibilities: '',
    image_url: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadFeedback, setUploadFeedback] = useState(null);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      // Uses the authenticated admin route
      const res = await apiRequest('/api/admindashboard/member/display').catch(() =>
        apiRequest('/api/home/members')
      );
      setMembers(res?.members || []);
    } catch (err) {
      console.error('Failed to fetch team members:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const openCreateModal = () => {
    setEditingMember(null);
    setUploadFeedback(null);
    setFormData({
      name: '',
      rank: '',
      responsibilities: '',
      image_url: '',
    });
    setModalOpen(true);
  };

  const openEditModal = (member) => {
    setEditingMember(member);
    setUploadFeedback(null);
    setFormData({
      name: member.name || '',
      rank: member.rank || '',
      responsibilities: member.responsibilities || '',
      image_url: member.image_url || '',
    });
    setModalOpen(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setUploadFeedback(null);
    try {
      const cloudUrl = await uploadToCloudinary(file);
      if (cloudUrl) {
        setFormData((prev) => ({ ...prev, image_url: cloudUrl }));
        setUploadFeedback({ type: 'success', text: 'Photo uploaded to Cloudinary successfully!' });
      } else {
        throw new Error('Cloudinary did not return a valid URL');
      }
    } catch (err) {
      console.error('Image upload failed:', err);
      setUploadFeedback({ type: 'error', text: err.message || 'Image upload failed' });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingMember) {
        await apiRequest(`/api/admindashboard/member/update/${editingMember.id}`, {
          method: 'PUT',
          body: formData,
        });
        setMessage({ type: 'success', text: `Team member #${editingMember.id} updated successfully!` });
      } else {
        await apiRequest('/api/admindashboard/member/post', {
          method: 'POST',
          body: formData,
        });
        setMessage({ type: 'success', text: 'New team member added to organization roster!' });
      }
      setModalOpen(false);
      await fetchMembers();
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to save member' });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setMessage(null), 4000);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this team member from the roster?')) return;
    try {
      await apiRequest(`/api/admindashboard/member/delete/${id}`, {
        method: 'DELETE',
      });
      setMessage({ type: 'success', text: `Team member #${id} deleted successfully` });
      setMembers((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to delete member' });
    } finally {
      setTimeout(() => setMessage(null), 4000);
    }
  };

  // KPIs
  const totalOrg = members.length || 7;
  const execCount = members.filter((m) =>
    ['ceo', 'coo', 'cto', 'cbo', 'founder'].some((role) =>
      m.rank?.toLowerCase().includes(role)
    )
  ).length || 4;
  const advisorCount = members.filter((m) =>
    ['advisor', 'director', 'mentor', 'academic'].some((role) =>
      m.rank?.toLowerCase().includes(role)
    )
  ).length || 1;

  return (
    <PortalLayout
      portalRole="admin"
      breadcrumb={[{ label: 'Admin Portal', to: '/admin/dashboard' }, { label: 'Team Members' }]}
    >
      {/* Header Row */}
      <div className="portal-header-row">
        <div className="portal-header-text">
          <h1>Team Members Management</h1>
          <p>
            Manage company leadership, executive designations, engineers, and profile representations.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateModal}
          className="portal-action-btn portal-action-btn--primary"
        >
          + Add Team Member
        </button>
      </div>

      {message && (
        <div
          style={{
            padding: '12px 18px',
            borderRadius: '8px',
            marginBottom: '20px',
            fontSize: '13.5px',
            fontWeight: 600,
            background: message.type === 'success' ? '#f0fdf4' : '#fef2f2',
            color: message.type === 'success' ? '#15803d' : '#b91c1c',
            border: `1px solid ${message.type === 'success' ? '#bbf7d0' : '#fecaca'}`,
          }}
        >
          {message.text}
        </div>
      )}

      {/* KPI Cards (Matching Screenshot 3) */}
      <div className="portal-kpi-grid">
        <div className="portal-kpi-card">
          <div>
            <div className="portal-kpi-title">TOTAL ORGANIZATION</div>
            <div className="portal-kpi-val">{totalOrg} Members</div>
            <div className="portal-kpi-sub">Leadership &amp; Advisory Board</div>
          </div>
          <div className="portal-kpi-icon-pill portal-kpi-icon-pill--blue">
            👥
          </div>
        </div>

        <div className="portal-kpi-card">
          <div>
            <div className="portal-kpi-title">C-SUITE &amp; FOUNDERS</div>
            <div className="portal-kpi-val">{execCount} Executives</div>
            <div className="portal-kpi-sub">CEO, COO, CBO, CTO</div>
          </div>
          <div className="portal-kpi-icon-pill portal-kpi-icon-pill--orange">
            👔
          </div>
        </div>

        <div className="portal-kpi-card">
          <div>
            <div className="portal-kpi-title">ACADEMIC ADVISORS</div>
            <div className="portal-kpi-val">{advisorCount} Director</div>
            <div className="portal-kpi-sub">UITS IQAC Strategic Mentor</div>
          </div>
          <div className="portal-kpi-icon-pill portal-kpi-icon-pill--green">
            🎓
          </div>
        </div>
      </div>

      {/* Corporate Roster Table (Matching Screenshot 3) */}
      <div className="portal-table-card">
        <div className="portal-table-card__header">
          <div className="portal-table-card__title">Corporate Roster &amp; Profile Directory</div>
        </div>

        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
            Loading organization roster...
          </div>
        ) : members.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
            No members in database. Click &quot;+ Add Team Member&quot; to register your leadership team.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="portal-table">
              <thead>
                <tr>
                  <th>Profile &amp; Member</th>
                  <th>Designation / Rank</th>
                  <th>Role &amp; Core Responsibilities</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {members.map((member, idx) => (
                  <tr key={member.id || idx}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <img
                          src={
                            member.image_url ||
                            `/assets/team/${(idx % 7) + 1}.jpg`
                          }
                          alt=""
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            objectFit: 'cover',
                            border: '1.5px solid #cbd5e1',
                            flexShrink: 0,
                          }}
                          onError={(e) => {
                            e.target.src = '/assets/images/recycle.png';
                          }}
                        />
                        <div>
                          <div style={{ fontWeight: 700, color: '#0f172a' }}>{member.name}</div>
                          <div style={{ fontSize: 11, color: '#94a3b8' }}>ID: {member.id || `member-${idx + 1}`}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="portal-badge-tag">{member.rank || 'Executive'}</span>
                    </td>
                    <td style={{ maxWidth: 450, color: '#475569', fontSize: 12.5, lineHeight: 1.45 }}>
                      {member.responsibilities || 'Driving circular economy innovation and enterprise operations.'}
                    </td>
                    <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <button
                        type="button"
                        onClick={() => openEditModal(member)}
                        className="portal-action-link portal-action-link--edit"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(member.id)}
                        className="portal-action-link"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Dialog for Add / Edit Team Member */}
      {modalOpen && (
        <div className="dash-modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="dash-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="dash-modal-header">
              <h2 className="dash-modal-title">
                {editingMember ? `Edit Member #${editingMember.id}` : 'Add New Team Member'}
              </h2>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  fontSize: 22,
                  cursor: 'pointer',
                  color: '#64748b',
                }}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 6 }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Motaleb Hossain Emon"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #cbd5e1' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 6 }}>
                  Designation / Rank
                </label>
                <input
                  type="text"
                  placeholder="e.g. Founder & CEO, Co-founder & COO, CTO"
                  value={formData.rank}
                  onChange={(e) => setFormData({ ...formData, rank: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #cbd5e1' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 6 }}>
                  Profile Image (Upload to Cloudinary or Direct URL)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ marginBottom: 8, fontSize: 13 }}
                  disabled={uploadingImage}
                />
                {uploadingImage && (
                  <div style={{ fontSize: 12, color: '#f97316', marginBottom: 6 }}>
                    Uploading photo to Cloudinary...
                  </div>
                )}
                {uploadFeedback && (
                  <div
                    style={{
                      fontSize: 12,
                      color: uploadFeedback.type === 'success' ? '#16a34a' : '#dc2626',
                      marginBottom: 6,
                    }}
                  >
                    {uploadFeedback.text}
                  </div>
                )}
                <input
                  type="text"
                  placeholder="Or enter Cloudinary URL: https://res.cloudinary.com/..."
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #cbd5e1' }}
                />
                {formData.image_url && (
                  <div style={{ marginTop: 10 }}>
                    <img
                      src={formData.image_url}
                      alt="Preview"
                      style={{ width: 60, height: 60, borderRadius: '50%', objectFit: 'cover', border: '1px solid #cbd5e1' }}
                    />
                  </div>
                )}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 6 }}>
                  Role &amp; Core Responsibilities
                </label>
                <textarea
                  rows={4}
                  placeholder="Describe key duties, strategy execution, technical domain, or leadership scope..."
                  value={formData.responsibilities}
                  onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #cbd5e1', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 12 }}>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  style={{
                    padding: '10px 18px',
                    borderRadius: 8,
                    border: '1px solid #cbd5e1',
                    background: '#ffffff',
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || uploadingImage}
                  className="portal-action-btn portal-action-btn--primary"
                >
                  {isSubmitting ? 'Saving...' : editingMember ? 'Save Changes' : 'Add Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PortalLayout>
  );
}
