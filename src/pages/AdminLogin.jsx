import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SiteLayout from '../components/SiteLayout.jsx';
import Reveal from '../components/Reveal.jsx';
import {
  ArrowIcon,
  MailIcon,
  LockIcon,
  EyeIcon,
  EyeOffIcon,
  ShieldIcon,
  CheckCircleIcon,
} from '../components/icons.jsx';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    securityPin: '',
    rememberSession: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.email.trim()) {
      errs.email = 'Admin email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Enter a valid administrator email';
    }

    if (!formData.password) {
      errs.password = 'Master administrative password is required';
    } else if (formData.password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    // Simulate administrative authentication & token generation
    setTimeout(() => {
      setIsSubmitting(false);
      setLoginSuccess(true);

      const adminSession = {
        email: formData.email,
        role: 'admin',
        token: 'sv-adm-root-' + Date.now(),
        authenticatedAt: new Date().toISOString(),
      };
      localStorage.setItem('scrapventure_admin_session', JSON.stringify(adminSession));

      setTimeout(() => {
        alert('Admin authentication successful! Access granted to ScrapVenture operations.');
      }, 900);
    }, 800);
  };

  return (
    <SiteLayout hideNav hideFooter main mainClassName="auth-page-main">
      {/* Page Hero Header */}
      <div className="auth-page-hero">
        <h1 className="page-title">
          System Administration <span className="admin-title-accent">Portal</span>
        </h1>
        <p className="page-subtitle">
          Restricted operations management gateway. Authorized ScrapVenture administrators and logistics controllers only.
        </p>
      </div>

      {/* Main Login Form Section */}
      <div className="collector-form-container login-card-container">
        <div className="collector-form" style={{ borderColor: 'rgba(217, 119, 6, 0.28)' }}>
          {/* Card Header with ScrapVenture Logo */}
          <div className="collector-form-header" style={{ textAlign: 'center' }}>
            <div style={{ marginBottom: 16 }}>
              <Link to="/" title="Return to Homepage">
                <img
                  src="/assets/images/logo.png"
                  alt="ScrapVenture"
                  style={{ height: 46, width: 'auto', display: 'inline-block' }}
                />
              </Link>
            </div>
            <h2 className="collector-form-title">Admin Authentication</h2>
          </div>

              {loginSuccess && (
                <div className="login-alert login-alert--success">
                  <CheckCircleIcon size={18} />
                  <span>Administrative credentials verified. Session authorized.</span>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                {/* Admin Email */}
                <div className="form-group" style={{ marginBottom: 18 }}>
                  <label className="form-label">
                    Administrator Email <span className="req">*</span>
                  </label>
                  <div className="input-wrap">
                    <span className="input-icon">
                      <MailIcon size={18} />
                    </span>
                    <input
                      type="email"
                      name="email"
                      className={`form-input ${errors.email ? 'input-error' : ''}`}
                      placeholder="admin@scrapventure.com"
                      value={formData.email}
                      onChange={handleChange}
                      autoComplete="username"
                      disabled={isSubmitting || loginSuccess}
                    />
                  </div>
                  {errors.email && <span className="field-error">{errors.email}</span>}
                </div>

                {/* Master Password */}
                <div className="form-group" style={{ marginBottom: 18 }}>
                  <label className="form-label">
                    Master Password <span className="req">*</span>
                  </label>
                  <div className="input-wrap">
                    <span className="input-icon">
                      <LockIcon size={18} />
                    </span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      className={`form-input has-toggle ${errors.password ? 'input-error' : ''}`}
                      placeholder="••••••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      autoComplete="current-password"
                      disabled={isSubmitting || loginSuccess}
                    />
                    <button
                      type="button"
                      className="input-toggle-btn"
                      onClick={() => setShowPassword((prev) => !prev)}
                      tabIndex="-1"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                    </button>
                  </div>
                  {errors.password && <span className="field-error">{errors.password}</span>}
                </div>

                {/* Session Checkbox */}
                <div className="login-aux-row">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="rememberSession"
                      checked={formData.rememberSession}
                      onChange={handleChange}
                      disabled={isSubmitting || loginSuccess}
                    />
                    <span className="checkbox-custom"></span>
                    <span className="checkbox-text">Trust this workstation for 24 hours</span>
                  </label>
                </div>

                {/* Submit Action */}
                <div className="form-actions" style={{ marginTop: 8 }}>
                  <button
                    type="submit"
                    className="btn btn-solid collector-submit-btn"
                    style={{
                      background: 'linear-gradient(135deg, #15803d 0%, #166534 100%)',
                    }}
                    disabled={isSubmitting || loginSuccess}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner"></span>
                        <span>Authenticating admin access...</span>
                      </>
                    ) : (
                      <>
                        <ShieldIcon size={18} />
                        <span>Authorize Administrator</span>
                        <ArrowIcon />
                      </>
                    )}
                  </button>
                </div>

              </form>
            </div>
          </div>
    </SiteLayout>
  );
}
