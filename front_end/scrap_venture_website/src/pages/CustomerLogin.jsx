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
  TruckIcon,
  CheckCircleIcon,
} from '../components/icons.jsx';

import { loginCustomer } from '../utils/api.js';

export default function CustomerLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: true,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setApiError('');

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
      errs.email = 'Email address or phone number is required';
    }

    if (!formData.password) {
      errs.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setApiError('');

    try {
      await loginCustomer({
        email: formData.email.trim(),
        identifier: formData.email.trim(),
        password: formData.password,
      });

      setLoginSuccess(true);
      setTimeout(() => {
        navigate('/customer/dashboard');
      }, 700);
    } catch (err) {
      setApiError(err?.data?.message || err?.message || 'Invalid email or password');
    } finally {
      setIsSubmitting(false);
    }
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
          User <span className="collector-title-accent">Login</span>
        </h1>
      </div>

      {/* Main Login Form Section */}
      <div className="collector-form-container login-card-container">
        <div className="collector-form">
          {/* Card Header */}
          <div className="collector-form-header">
            <h2 className="collector-form-title">Welcome Back</h2>
            <p className="collector-form-sub">
              Enter your registered email and password
            </p>
          </div>

          {loginSuccess && (
            <div className="login-alert login-alert--success">
              <CheckCircleIcon size={18} />
              <span>Login successful! Entering Customer Portal...</span>
            </div>
          )}

          {apiError && (
            <div className="login-alert" style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', marginBottom: 16 }}>
              <span>⚠️ {apiError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* Email Address */}
            <div className="form-group" style={{ marginBottom: 18 }}>
              <label className="form-label">
                Email Address <span className="req">*</span>
              </label>
              <div className="input-wrap">
                <span className="input-icon">
                  <MailIcon size={18} />
                </span>
                <input
                  type="email"
                  name="email"
                  className={`form-input ${errors.email ? 'input-error' : ''}`}
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  disabled={isSubmitting || loginSuccess}
                />
              </div>
              {errors.email && <span className="field-error">{errors.email}</span>}
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
              {errors.password && <span className="field-error">{errors.password}</span>}
            </div>

            {/* Auxiliary Row: Remember Me & Forgot Password */}
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
                <span className="checkbox-text">Remember me</span>
              </label>

              <a
                href="#forgot"
                className="forgot-pw-link"
                onClick={(e) => {
                  e.preventDefault();
                  alert('Password reset instructions will be sent to your registered email.');
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
                    <span>Verifying credentials...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In as Customer</span>
                    <ArrowIcon />
                  </>
                )}
              </button>
            </div>

            {/* Bottom Switch Footer */}
            <div className="login-switch-footer">
              <div className="login-switch-text">
                Don't have an account?{' '}
                <Link to="/customer-register">Register here</Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </SiteLayout>
  );
}
