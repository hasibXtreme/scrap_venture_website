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
  UserIcon,
  CheckCircleIcon,
  TruckIcon,
} from '../components/icons.jsx';

export default function CollectorLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
    rememberMe: true,
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
    if (!formData.identifier.trim()) {
      errs.identifier = 'Registered email or phone number is required';
    }

    if (!formData.password) {
      errs.password = 'Password is required';
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

    // Simulate authentication
    setTimeout(() => {
      setIsSubmitting(false);
      setLoginSuccess(true);

      // Store auth session
      const collectorSession = {
        identifier: formData.identifier,
        role: 'collector',
        token: 'sv-col-sess-' + Date.now(),
      };
      localStorage.setItem('scrapventure_current_user', JSON.stringify(collectorSession));

      // Route after short notification
      setTimeout(() => {
        navigate('/book-pickup');
      }, 1200);
    }, 600);
  };

  return (
    <SiteLayout hideNav hideFooter main mainClassName="auth-page-main">
      {/* Brand Logo Header */}
      <Link to="/" className="auth-header-brand" title="Return to ScrapVenture Homepage">
        <img src="/assets/images/logo.png" alt="ScrapVenture logo" />
      </Link>

      {/* Page Hero Header */}
      <div className="auth-page-hero">
        <h1 className="page-title">
          Scrap Collector <span className="collector-title-accent">Login</span>
        </h1>

      </div>

      {/* Main Login Form Section */}
      <div className="collector-form-container login-card-container">
        <div className="collector-form">
          {/* Card Header */}
          <div className="collector-form-header">

            <h2 className="collector-form-title">Collector Sign In</h2>
            <p className="collector-form-sub">
              Enter your registered collector email or phone number and password
            </p>
          </div>

          {loginSuccess && (
            <div className="login-alert login-alert--success">
              <CheckCircleIcon size={18} />
              <span>Authentication approved! Redirecting to pickup assignments...</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* Email or Phone */}
            <div className="form-group" style={{ marginBottom: 18 }}>
              <label className="form-label">
                Email or Phone Number <span className="req">*</span>
              </label>
              <div className="input-wrap">
                <span className="input-icon">
                  <TruckIcon size={18} />
                </span>
                <input
                  type="text"
                  name="identifier"
                  className={`form-input ${errors.identifier ? 'input-error' : ''}`}
                  placeholder="e.g. collector@domain.com or 017XXXXXXXX"
                  value={formData.identifier}
                  onChange={handleChange}
                  autoComplete="username"
                  disabled={isSubmitting || loginSuccess}
                />
              </div>
              {errors.identifier && (
                <span className="field-error">{errors.identifier}</span>
              )}
            </div>

            {/* Password */}
            <div className="form-group" style={{ marginBottom: 10 }}>
              <label className="form-label">
                Password <span className="req">*</span>
              </label>
              <div className="input-wrap">
                <span className="input-icon">
                  <LockIcon size={18} />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  className={`form-input has-toggle ${errors.password ? 'input-error' : ''}`}
                  placeholder="••••••••"
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
              {errors.password && (
                <span className="field-error">{errors.password}</span>
              )}
            </div>

            {/* Auxiliary Row */}
            <div className="login-aux-row">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  disabled={isSubmitting || loginSuccess}
                />
                <span className="checkbox-custom"></span>
                <span className="checkbox-text">Keep me logged in</span>
              </label>

              <a
                href="#forgot"
                className="forgot-pw-link"
                onClick={(e) => {
                  e.preventDefault();
                  alert('Please contact your ScrapVenture hub supervisor or call support for password recovery.');
                }}
              >
                Forgot password?
              </a>
            </div>

            {/* Submit Action */}
            <div className="form-actions" style={{ marginTop: 10 }}>
              <button
                type="submit"
                className="btn btn-solid collector-submit-btn"
                disabled={isSubmitting || loginSuccess}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner"></span>
                    <span>Verifying collector account...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In as Collector</span>
                    <ArrowIcon />
                  </>
                )}
              </button>

              <div className="form-security-note">
                <LockIcon size={14} />
                <span>Authorized Partner Access Only</span>
              </div>
            </div>

            {/* Bottom Switch Footer */}
            <div className="login-switch-footer">
              <div className="login-switch-text">
                Don't have an account?{' '}
                <Link to="/become-a-collector">Register as a Collector</Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </SiteLayout>
  );
}
