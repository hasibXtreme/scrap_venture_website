import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PortalLayout from '../components/dashboard/PortalLayout.jsx';
import { apiRequest, clearStoredUser } from '../utils/api.js';

export default function AdminProfile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    apiRequest('/api/admindashboard/profile')
      .then((data) => {
        const adminData = data?.admininfo?.[0] || {};
        setProfile(adminData);
        setFormData({
          name: adminData.name || '',
          email: adminData.email || '',
          password: '',
        });
      })
      .catch((err) => {
        console.error('Failed to load admin profile:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
      };
      if (formData.password) {
        payload.password = formData.password;
      }
      await apiRequest('/api/admin/profile/update', {
        method: 'PUT',
        body: payload,
      });
      setMessage({ type: 'success', text: 'Admin profile updated successfully!' });
      setFormData((prev) => ({ ...prev, password: '' }));
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to update profile' });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setMessage(null), 4000);
    }
  };

  const handleDelete = async () => {
    const confirmation = window.prompt(
      'Type "DELETE" to permanently terminate this administrator account:'
    );
    if (confirmation !== 'DELETE') return;

    try {
      await apiRequest('/api/admin/profile/delete', { method: 'DELETE' });
      clearStoredUser();
      alert('Administrator account has been permanently removed.');
      navigate('/');
    } catch (err) {
      alert(err.message || 'Failed to delete account');
    }
  };

  return (
    <PortalLayout
      portalRole="admin"
      breadcrumb={[
        { label: 'Admin Portal', to: '/admin/dashboard' },
        { label: 'Account Profile' },
      ]}
    >
      <div className="portal-header-row">
        <div className="portal-header-text">
          <h1>Administrator Profile</h1>
          <p>
            Manage your credentials, privileged contact email, and administrative security settings.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Link to="/admin/dashboard" className="portal-btn-sm" style={{ textDecoration: 'none' }}>
            ← Admin Dashboard
          </Link>
        </div>
      </div>

      <div style={{ maxWidth: 680, margin: '0 auto' }}>
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

        <div className="portal-table-card" style={{ padding: '24px 28px' }}>
          <div style={{ marginBottom: 20 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', margin: '0 0 6px 0' }}>
              Profile Credentials
            </h2>
            <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>
              Role: <strong style={{ textTransform: 'capitalize' }}>{profile?.role || 'Administrator'}</strong>
            </p>
          </div>

          {loading ? (
            <div style={{ padding: '30px 0', textAlign: 'center', color: '#64748b' }}>
              Loading admin profile...
            </div>
          ) : (
            <form onSubmit={handleUpdate}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 6 }}>
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                  Official Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#334155', marginBottom: 6 }}>
                  Change Password (leave empty to keep current)
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="New password (optional)"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 8,
                    border: '1px solid #cbd5e1',
                    fontSize: 14,
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 24 }}>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="portal-btn-sm portal-btn-sm--reject"
                  style={{ padding: '8px 16px' }}
                >
                  Delete Account
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="portal-btn-sm portal-btn-sm--approve"
                  style={{ padding: '8px 20px', minWidth: 140 }}
                >
                  {isSubmitting ? 'Saving...' : 'Update Profile'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </PortalLayout>
  );
}
