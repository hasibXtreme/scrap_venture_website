import { useState, useId } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SiteLayout from '../components/SiteLayout.jsx';
import Reveal from '../components/Reveal.jsx';
import {
  ArrowIcon,
  MailIcon,
  PhoneIcon,
  LockIcon,
  EyeIcon,
  EyeOffIcon,
  UserIcon,
  CheckCircleIcon,
  TruckIcon,
} from '../components/icons.jsx';
import {
  BANGLADESH_DIVISIONS,
  BANGLADESH_DISTRICTS,
  POPULAR_THANAS,
} from '../data/bangladeshGeo.js';

export default function CustomerRegistration() {
  const formId = useId();
  const navigate = useNavigate();

  // Fields strictly mapped to customer table in db.ts:
  // name, email, phone_number, password, division, district, thana, address, role
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone_number: '',
    password: '',
    confirmPassword: '',
    division: '',
    district: '',
    thana: '',
    customThana: '',
    address: '',
    agreeTerms: true,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  const availableDistricts = formData.division
    ? BANGLADESH_DISTRICTS[formData.division] || []
    : [];

  const availableThanas = formData.district
    ? POPULAR_THANAS[formData.district] || []
    : [];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;

    setFormData((prev) => {
      const updated = { ...prev, [name]: val };

      if (name === 'division') {
        updated.district = '';
        updated.thana = '';
        updated.customThana = '';
      } else if (name === 'district') {
        updated.thana = '';
        updated.customThana = '';
      }

      return updated;
    });

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

    // name
    if (!formData.name.trim()) {
      errs.name = 'Full name is required';
    } else if (formData.name.trim().length < 2) {
      errs.name = 'Name must be at least 2 characters';
    }

    // email
    if (!formData.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Please enter a valid email address';
    }

    // phone_number (db.ts: table.string('phone_number').notNullable())
    const cleanPhone = formData.phone_number.replace(/[\s-]/g, '');
    if (!cleanPhone) {
      errs.phone_number = 'Phone number is required';
    } else if (!/^(?:\+?880|0)?1[3-9]\d{8}$/.test(cleanPhone)) {
      errs.phone_number = 'Enter a valid Bangladesh phone number (e.g. 017XXXXXXXX)';
    }

    // password
    if (!formData.password) {
      errs.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }

    // confirm password
    if (!formData.confirmPassword) {
      errs.confirmPassword = 'Confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }

    // division
    if (!formData.division) {
      errs.division = 'Please select your division';
    }

    // district
    if (!formData.district) {
      errs.district = 'Please select your district';
    }

    // thana
    const finalThana =
      formData.thana === 'Other' ? formData.customThana.trim() : formData.thana;
    if (!finalThana) {
      errs.thana = 'Please specify your thana / upazila';
    }

    // address
    if (!formData.address.trim()) {
      errs.address = 'Street / house address is required';
    } else if (formData.address.trim().length < 5) {
      errs.address = 'Please enter a complete doorstep pickup address';
    }

    // terms
    if (!formData.agreeTerms) {
      errs.agreeTerms = 'You must agree to the terms to register';
    }

    setErrors(errs);
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    const firstKey = Object.keys(errs)[0];
    if (firstKey) {
      const el = document.getElementById(`${formId}-${firstKey}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      const finalThana =
        formData.thana === 'Other' ? formData.customThana.trim() : formData.thana;

      const customerPayload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone_number: formData.phone_number.trim(),
        password: formData.password,
        division: formData.division,
        district: formData.district,
        thana: finalThana,
        address: formData.address.trim(),
        role: 'customer',
        createdAt: new Date().toISOString(),
      };

      // Save customer registration locally for app session
      const storedCustomers = JSON.parse(
        localStorage.getItem('scrapventure_registered_customers') || '[]'
      );
      localStorage.setItem(
        'scrapventure_registered_customers',
        JSON.stringify([customerPayload, ...storedCustomers])
      );

      setSubmittedData({
        ...customerPayload,
        referenceId: 'SV-CUST-' + Math.floor(10000 + Math.random() * 90000),
      });

      window.scrollTo({ top: 250, behavior: 'smooth' });
    }, 700);
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
          User <span className="collector-title-accent">Registration</span>
        </h1>

      </div>

      {/* Main Registration Form Section */}
      <div className="collector-form-container">
        {submittedData ? (
          /* Success Confirmation Card */
          <div className="collector-success-card">
            <div className="collector-success-icon-wrap">
              <div className="collector-success-badge">
                <CheckCircleIcon size={38} />
              </div>
            </div>

            <h3 className="collector-form-title" style={{ marginBottom: 8 }}>
              Registration Successful!
            </h3>
            <p className="collector-form-sub" style={{ marginBottom: 24 }}>
              Welcome to ScrapVenture, <strong>{submittedData.name}</strong>. Your customer profile has been created.
            </p>

            <div className="collector-summary-box">
              <div className="collector-summary-top">
                <span className="collector-summary-lbl">Customer ID</span>
                <span className="collector-summary-ref">{submittedData.referenceId}</span>
              </div>

              <div className="collector-summary-grid">
                <div className="collector-summary-item">
                  <span className="lbl">Full Name</span>
                  <span className="val">{submittedData.name}</span>
                </div>
                <div className="collector-summary-item">
                  <span className="lbl">Phone Number</span>
                  <span className="val">{submittedData.phone_number}</span>
                </div>
                <div className="collector-summary-item">
                  <span className="lbl">Email Address</span>
                  <span className="val">{submittedData.email}</span>
                </div>
                <div className="collector-summary-item">
                  <span className="lbl">Division</span>
                  <span className="val">{submittedData.division}</span>
                </div>
                <div className="collector-summary-item">
                  <span className="lbl">District &amp; Thana</span>
                  <span className="val">
                    {submittedData.thana}, {submittedData.district}
                  </span>
                </div>
                <div className="collector-summary-item" style={{ gridColumn: 'span 2' }}>
                  <span className="lbl">Doorstep Address</span>
                  <span className="val">{submittedData.address}</span>
                </div>
              </div>
            </div>

            <div className="collector-success-actions" style={{ marginTop: 28, display: 'flex', gap: 14, justifyContent: 'center' }}>
              <Link to="/customer-login" className="btn btn-solid">
                Proceed to Customer Login <ArrowIcon />
              </Link>
              <Link to="/book-pickup" className="btn btn-outline" style={{ color: 'var(--ink)' }}>
                Book a Pickup Now
              </Link>
            </div>
          </div>
        ) : (
          /* Registration Form */
          <form className="collector-form" onSubmit={handleSubmit} noValidate>
            <div className="collector-form-header">
              <h3 className="collector-form-title">Customer Account Details</h3>
              <p className="collector-form-sub">
                Fill in your contact and address details to set up your account
              </p>
            </div>

            {/* Section 1: Account Information */}
            <div className="form-section">
              <div className="form-section-title">
                <h4>Personal &amp; Login Information</h4>
                <p>Your name, email address, and security password</p>
              </div>

              <div className="form-grid">
                {/* Full Name */}
                <div className="form-group">
                  <label htmlFor={`${formId}-name`} className="form-label">
                    Full Name / আপনার নাম <span className="req">*</span>
                  </label>
                  <div className="input-wrap">
                    <span className="input-icon">
                      <UserIcon size={18} />
                    </span>
                    <input
                      id={`${formId}-name`}
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g. Tanvir Ahmed"
                      className={`form-input ${errors.name ? 'input-error' : ''}`}
                      autoComplete="name"
                    />
                  </div>
                  {errors.name && <span className="field-error">{errors.name}</span>}
                </div>

                {/* Email */}
                <div className="form-group">
                  <label htmlFor={`${formId}-email`} className="form-label">
                    Email Address / ইমেইল <span className="req">*</span>
                  </label>
                  <div className="input-wrap">
                    <span className="input-icon">
                      <MailIcon size={18} />
                    </span>
                    <input
                      id={`${formId}-email`}
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="name@example.com"
                      className={`form-input ${errors.email ? 'input-error' : ''}`}
                      autoComplete="email"
                    />
                  </div>
                  {errors.email && <span className="field-error">{errors.email}</span>}
                </div>

                {/* Phone Number (phone_number in db.ts) */}
                <div className="form-group">
                  <label htmlFor={`${formId}-phone_number`} className="form-label">
                    Phone Number / মোবাইল নম্বর <span className="req">*</span>
                  </label>
                  <div className="input-wrap">
                    <span className="input-icon">
                      <PhoneIcon size={18} />
                    </span>
                    <input
                      id={`${formId}-phone_number`}
                      type="tel"
                      name="phone_number"
                      value={formData.phone_number}
                      onChange={handleInputChange}
                      placeholder="01XXXXXXXXX"
                      className={`form-input ${errors.phone_number ? 'input-error' : ''}`}
                      autoComplete="tel"
                    />
                  </div>
                  {errors.phone_number && (
                    <span className="field-error">{errors.phone_number}</span>
                  )}
                  <span className="field-hint">Used for pickup coordination &amp; SMS notifications</span>
                </div>

                {/* Password */}
                <div className="form-group">
                  <label htmlFor={`${formId}-password`} className="form-label">
                    Password <span className="req">*</span>
                  </label>
                  <div className="input-wrap">
                    <span className="input-icon">
                      <LockIcon size={18} />
                    </span>
                    <input
                      id={`${formId}-password`}
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Minimum 6 characters"
                      className={`form-input has-toggle ${errors.password ? 'input-error' : ''}`}
                      autoComplete="new-password"
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

                {/* Confirm Password */}
                <div className="form-group">
                  <label htmlFor={`${formId}-confirmPassword`} className="form-label">
                    Confirm Password <span className="req">*</span>
                  </label>
                  <div className="input-wrap">
                    <span className="input-icon">
                      <LockIcon size={18} />
                    </span>
                    <input
                      id={`${formId}-confirmPassword`}
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Re-enter password"
                      className={`form-input has-toggle ${errors.confirmPassword ? 'input-error' : ''}`}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      className="input-toggle-btn"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      tabIndex="-1"
                      aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      {showConfirmPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <span className="field-error">{errors.confirmPassword}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Agreement Checkbox */}
            <div className="form-agreement">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleInputChange}
                />
                <span className="checkbox-custom"></span>
                <span className="checkbox-text">
                  I agree to ScrapVenture's Terms of Service and Privacy Policy for recycling pickup services.
                </span>
              </label>
              {errors.agreeTerms && <span className="field-error">{errors.agreeTerms}</span>}
            </div>

            {/* Form Actions */}
            <div className="form-actions">
              <button
                type="submit"
                className="btn btn-solid collector-submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner"></span> Creating Account...
                  </>
                ) : (
                  <>
                    <span>Create Customer Account</span> <ArrowIcon />
                  </>
                )}
              </button>
            </div>

            {/* Switch Footer */}
            <div className="login-switch-footer">
              <div className="login-switch-text">
                Already have an account?{' '}
                <Link to="/customer-login">Sign In here</Link>
              </div>


            </div>
          </form>
        )}
      </div>
    </SiteLayout>
  );
}
