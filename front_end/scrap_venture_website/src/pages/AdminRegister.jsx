import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SiteLayout from '../components/SiteLayout.jsx';
import Reveal from '../components/Reveal.jsx';
import { registerAdminOrModerator, getStoredUser } from '../utils/api.js';
import { ShieldIcon, LockIcon, MailIcon, UserIcon, ArrowIcon } from '../components/icons.jsx';

export default function AdminRegister() {
  const navigate = useNavigate();
  const currentUser = getStoredUser();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'moderator',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Access check: only admins can access this page
  useEffect(() => {
    if (!currentUser || currentUser.role !== 'admin') {
      navigate('/admin-login?unauthorized=1');
    }
  }, [currentUser, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.password) {
      setError('Please provide name, email, and password');
      return;
    }

    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const res = await registerAdminOrModerator(formData);
      setSuccess(`Successfully registered new ${formData.role}: ${formData.email}!`);
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'moderator',
      });
    } catch (err) {
      setError(err?.data?.message || err?.message || 'Failed to register account');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SiteLayout variant="home">
      <div className="dash-page">
        <div className="dash-header">
          <div className="wrap dash-header-inner">
            <div className="dash-title-group">
              <span className="eyebrow" style={{ marginBottom: 4 }}>Access Management</span>
              <h1>Register <span>Admins &amp; Moderators</span></h1>
              <p className="dash-subtitle">
                Restricted portal for super administrators to provision privileged operational accounts.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <Link to="/admin/dashboard" className="dash-btn dash-btn--secondary">
                ← Back to Dashboard
              </Link>
            </div>
          </div>
        </div>

        <div className="wrap" style={{ maxWidth: 720 }}>
          <Reveal className="dash-card">
            <div className="dash-card__header">
              <div>
                <h2 className="dash-card__title">Create Privileged Account</h2>
                <p style={{ fontSize: 13, color: '#64748b' }}>
                  Assign role permissions for ScrapVenture system moderation or administrative control.
                </p>
              </div>
              <span className="dash-badge dash-badge--admin">
                <ShieldIcon size={14} /> Super Admin Only
              </span>
            </div>

            {error && (
              <div
                style={{
                  background: '#fef2f2',
                  border: '1px solid #fecaca',
                  color: '#b91c1c',
                  padding: '12px 16px',
                  borderRadius: 10,
                  fontSize: 14,
                  marginBottom: 20,
                }}
              >
                ⚠️ {error}
              </div>
            )}

            {success && (
              <div
                style={{
                  background: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  color: '#15803d',
                  padding: '12px 16px',
                  borderRadius: 10,
                  fontSize: 14,
                  marginBottom: 20,
                }}
              >
                ✅ {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="dash-form">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Ayesha Rahman"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Official Email Address</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. ayesha.ops@scrapventure.com"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label htmlFor="password">Temporary Password</label>
                  <input
                    id="password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Min. 6 characters"
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="role">Assigned System Role</label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="moderator">Moderator (Operational Oversight)</option>
                    <option value="admin">Administrator (Full System Control)</option>
                  </select>
                </div>
              </div>

              <div
                style={{
                  background: '#f8fafc',
                  padding: '14px 18px',
                  borderRadius: 10,
                  border: '1px solid #e2e8f0',
                  fontSize: 13,
                  color: '#475569',
                }}
              >
                <strong>Role Specifications:</strong>
                <ul style={{ paddingLeft: 20, marginTop: 6, lineHeight: 1.6 }}>
                  <li><strong>Moderator:</strong> Can view &amp; update scrap and marketplace orders, view stats, and monitor collector verification.</li>
                  <li><strong>Administrator:</strong> Unrestricted super-user access including registering other administrators, modifying system settings, and deleting records.</li>
                </ul>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 12 }}>
                <Link to="/admin/dashboard" className="dash-btn dash-btn--secondary">
                  Cancel
                </Link>
                <button
                  type="submit"
                  id="admin-register-btn"
                  disabled={isSubmitting}
                  className="dash-btn dash-btn--primary"
                  style={{ minWidth: 180 }}
                >
                  {isSubmitting ? 'Registering Account...' : `Register ${formData.role === 'admin' ? 'Administrator' : 'Moderator'} →`}
                </button>
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </SiteLayout>
  );
}
