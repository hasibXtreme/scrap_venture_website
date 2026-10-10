import { useState, useId } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowIcon,
  LockIcon,
  EyeIcon,
  EyeOffIcon,
  MailIcon,
  UserIcon,
  CheckCircleIcon,
  TruckIcon,
} from './icons.jsx';
import {
  BANGLADESH_DIVISIONS,
  BANGLADESH_DISTRICTS,
  POPULAR_THANAS,
} from '../data/bangladeshGeo.js';

export default function CollectorForm() {
  const formId = useId();

  // Strictly mapped to scrap_collector table in backend db.ts:
  // name, email, password, nid, division, district, thana, address, role, is_verified
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    nid: '',
    phone: '',
    division: '',
    district: '',
    thana: '',
    customThana: '',
    address: '',
    vehicle: 'Van / Three-Wheeler',
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

      // Reset dependent location fields when parent changes
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

    // Clear field-specific error as user types
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

    // Name (db.ts: table.string('name'))
    if (!formData.name.trim()) {
      errs.name = 'Full name is required';
    } else if (formData.name.trim().length < 3) {
      errs.name = 'Name must be at least 3 characters';
    }

    // Email (db.ts: table.string('email').notNullable())
    if (!formData.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Please enter a valid email address';
    }

    // Password (db.ts: table.string('password').notNullable())
    if (!formData.password) {
      errs.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }

    // Confirm Password
    if (!formData.confirmPassword) {
      errs.confirmPassword = 'Confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }

    // NID (db.ts: table.string('nid').notNullable())
    const cleanNid = formData.nid.replace(/[\s-]/g, '');
    if (!cleanNid) {
      errs.nid = 'National ID (NID) number is required';
    } else if (!/^\d{10}$|^\d{13}$|^\d{17}$/.test(cleanNid)) {
      errs.nid = 'NID must be 10, 13, or 17 numeric digits';
    }

    // Phone
    const cleanPhone = formData.phone.replace(/[\s-]/g, '');
    if (!cleanPhone) {
      errs.phone = 'Phone number is required';
    } else if (!/^(?:\+?880|0)?1[3-9]\d{8}$/.test(cleanPhone)) {
      errs.phone = 'Enter a valid Bangladesh phone number (e.g. 01712345678)';
    }

    // Division (db.ts: table.string('division').notNullable())
    if (!formData.division) {
      errs.division = 'Please select your division';
    }

    // District (db.ts: table.string('district').notNullable())
    if (!formData.district) {
      errs.district = 'Please select your district';
    }

    // Thana (db.ts: table.string('thana').notNullable())
    const finalThana =
      formData.thana === 'Other' ? formData.customThana.trim() : formData.thana;
    if (!finalThana) {
      errs.thana = 'Please specify your thana / police station';
    }

    // Address (db.ts: table.string('address').notNullable())
    if (!formData.address.trim()) {
      errs.address = 'Street / hub / warehouse address is required';
    } else if (formData.address.trim().length < 5) {
      errs.address = 'Please enter a detailed physical address';
    }

    // Terms
    if (!formData.agreeTerms) {
      errs.agreeTerms = 'You must accept the terms to apply';
    }

    setErrors(errs);
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    const firstErrorKey = Object.keys(errs)[0];
    if (firstErrorKey) {
      const el = document.getElementById(`${formId}-${firstErrorKey}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setIsSubmitting(true);

    // Simulate registration submission matching scrap_collector table
    setTimeout(() => {
      setIsSubmitting(false);
      const appRef = 'SV-COL-' + Math.floor(10000 + Math.random() * 90000);
      const finalThana =
        formData.thana === 'Other' ? formData.customThana.trim() : formData.thana;

      const collectorPayload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        nid: formData.nid.trim(),
        phone: formData.phone.trim(),
        phone_number: formData.phone.trim(),
        division: formData.division,
        district: formData.district,
        thana: finalThana,
        address: formData.address.trim(),
        role: 'collector',
        is_verified: false,
        vehicle: formData.vehicle,
        referenceId: appRef,
        date: new Date().toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }),
      };

      // Store in localStorage for session test
      const stored = JSON.parse(
        localStorage.getItem('scrapventure_registered_collectors') || '[]'
      );
      localStorage.setItem(
        'scrapventure_registered_collectors',
        JSON.stringify([collectorPayload, ...stored])
      );

      setSubmittedData(collectorPayload);
      window.scrollTo({ top: 300, behavior: 'smooth' });
    }, 700);
  };

  const handleReset = () => {
    setSubmittedData(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      nid: '',
      phone: '',
      division: '',
      district: '',
      thana: '',
      customThana: '',
      address: '',
      vehicle: 'Van / Three-Wheeler',
      agreeTerms: true,
    });
    setErrors({});
  };

  if (submittedData) {
    return (
      <div className="collector-success-card">
        <div className="collector-success-icon-wrap">
          <div className="collector-success-badge">
            <CheckCircleIcon size={38} />
          </div>
        </div>

        <h3 className="collector-form-title" style={{ marginBottom: 8 }}>
          Application Submitted Successfully!
        </h3>
        <p className="collector-form-sub" style={{ marginBottom: 24 }}>
          Thank you, <strong>{submittedData.name}</strong>. Your collector profile has been submitted and is queued for verification.
        </p>

        <div className="collector-summary-box">
          <div className="collector-summary-top">
            <span className="collector-summary-lbl">Application Reference</span>
            <span className="collector-summary-ref">{submittedData.referenceId}</span>
          </div>

          <div className="collector-summary-grid">
            <div className="collector-summary-item">
              <span className="lbl">Full Name</span>
              <span className="val">{submittedData.name}</span>
            </div>
            <div className="collector-summary-item">
              <span className="lbl">Email Address</span>
              <span className="val">{submittedData.email}</span>
            </div>
            <div className="collector-summary-item">
              <span className="lbl">Phone Number</span>
              <span className="val">{submittedData.phone}</span>
            </div>
            <div className="collector-summary-item">
              <span className="lbl">NID Number</span>
              <span className="val">
                {submittedData.nid.length > 6
                  ? submittedData.nid.slice(0, 4) + '••••' + submittedData.nid.slice(-4)
                  : submittedData.nid}
              </span>
            </div>
            <div className="collector-summary-item">
              <span className="lbl">Operational Division</span>
              <span className="val">{submittedData.division}</span>
            </div>
            <div className="collector-summary-item">
              <span className="lbl">District &amp; Thana</span>
              <span className="val">
                {submittedData.thana}, {submittedData.district}
              </span>
            </div>
            <div className="collector-summary-item" style={{ gridColumn: 'span 2' }}>
              <span className="lbl">Physical Hub / Address</span>
              <span className="val">{submittedData.address}</span>
            </div>
            <div className="collector-summary-item">
              <span className="lbl">Account Role</span>
              <span className="val" style={{ textTransform: 'capitalize' }}>{submittedData.role}</span>
            </div>
            <div className="collector-summary-item">
              <span className="lbl">Verification Status</span>
              <span className="val" style={{ color: '#d97706', fontWeight: 700 }}>Pending Verification</span>
            </div>
          </div>
        </div>

        <div className="collector-next-steps">
          <h4>Next Steps for Verification</h4>
          <ol className="collector-steps-list">
            <li>
              <span className="step-num">1</span>
              <div>
                <strong>Hub Review:</strong> Our operations controller will cross-check your NID and territory within 24 hours.
              </div>
            </li>
            <li>
              <span className="step-num">2</span>
              <div>
                <strong>Scale &amp; ID Handover:</strong> Receive your authorized digital weighing scale, badge, and ScrapVenture credentials.
              </div>
            </li>
            <li>
              <span className="step-num">3</span>
              <div>
                <strong>Start Collecting:</strong> Sign in with your registered email and password on the Collector Portal!
              </div>
            </li>
          </ol>
        </div>

        <div className="collector-success-actions" style={{ marginTop: 24, display: 'flex', gap: 14, justifyContent: 'center' }}>
          <Link to="/collector-login" className="btn btn-solid">
            Go to Collector Login <ArrowIcon />
          </Link>
          <button type="button" onClick={handleReset} className="btn btn-ghost-dark">
            Register Another Partner
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>


      <form className="collector-form" onSubmit={handleSubmit} noValidate>
        {/* Section 1: Personal Details & Security Credentials */}
        <div className="form-section">
          <div className="form-section-title">
            <h4>Personal Information &amp; Security Credentials</h4>
            <p>Your primary contact, legal identity, and portal credentials</p>
          </div>

          <div className="form-grid">
            {/* Full Name (name) */}
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
                  placeholder="e.g. Rafiqul Islam / রফিকুল ইসলাম"
                  className={`form-input ${errors.name ? 'input-error' : ''}`}
                  autoComplete="name"
                />
              </div>
              {errors.name && <span className="field-error">{errors.name}</span>}
            </div>

            {/* Email Address (email) */}
            <div className="form-group">
              <label htmlFor={`${formId}-email`} className="form-label">
                Email Address / আপনার ইমেইল <span className="req">*</span>
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
                  placeholder="collector@example.com"
                  className={`form-input ${errors.email ? 'input-error' : ''}`}
                  autoComplete="email"
                />
              </div>
              {errors.email && <span className="field-error">{errors.email}</span>}
            </div>

            {/* Password (password) */}
            <div className="form-group">
              <label htmlFor={`${formId}-password`} className="form-label">
                Password / পাসওয়ার্ড <span className="req">*</span>
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
                Confirm Password / পাসওয়ার্ড নিশ্চিত করুন <span className="req">*</span>
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

            {/* National ID (nid) */}
            <div className="form-group">
              <label htmlFor={`${formId}-nid`} className="form-label">
                National ID (NID) Number / জাতীয় পরিচয়পত্র নম্বর <span className="req">*</span>
              </label>
              <div className="input-wrap">
                <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="16" rx="2" />
                  <line x1="7" y1="8" x2="11" y2="8" />
                  <line x1="7" y1="12" x2="17" y2="12" />
                  <line x1="7" y1="16" x2="13" y2="16" />
                </svg>
                <input
                  id={`${formId}-nid`}
                  type="text"
                  name="nid"
                  value={formData.nid}
                  onChange={handleInputChange}
                  placeholder="10, 13, or 17 digit NID number"
                  className={`form-input ${errors.nid ? 'input-error' : ''}`}
                  maxLength="17"
                />
              </div>
              {errors.nid && <span className="field-error">{errors.nid}</span>}
              <span className="field-hint">Required for official verification &amp; field trust badge</span>
            </div>

            {/* Phone Number */}
            <div className="form-group">
              <label htmlFor={`${formId}-phone`} className="form-label">
                Phone Number / মোবাইল নম্বর <span className="req">*</span>
              </label>
              <div className="input-wrap">
                <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <input
                  id={`${formId}-phone`}
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="01XXXXXXXXX"
                  className={`form-input ${errors.phone ? 'input-error' : ''}`}
                  autoComplete="tel"
                />
              </div>
              {errors.phone && <span className="field-error">{errors.phone}</span>}
              <span className="field-hint">Used for dispatch orders and SMS pickup notifications</span>
            </div>
          </div>
        </div>

        {/* Section 2: Operational Location & Physical Address */}
        <div className="form-section">
          <div className="form-section-title">
            <h4>Operational Territory &amp; Physical Address</h4>
            <p>Coverage division, district, thana, and physical address (db.ts: division, district, thana, address)</p>
          </div>

          <div className="form-grid form-grid-3">
            {/* Division (division) */}
            <div className="form-group">
              <label htmlFor={`${formId}-division`} className="form-label">
                Division <span className="req">*</span>
              </label>
              <div className="select-wrap">
                <select
                  id={`${formId}-division`}
                  name="division"
                  value={formData.division}
                  onChange={handleInputChange}
                  className={`form-select ${errors.division ? 'input-error' : ''}`}
                >
                  <option value="">Select Division</option>
                  {BANGLADESH_DIVISIONS.map((div) => (
                    <option key={div} value={div}>
                      {div} Division
                    </option>
                  ))}
                </select>
                <span className="select-arrow">▼</span>
              </div>
              {errors.division && <span className="field-error">{errors.division}</span>}
            </div>

            {/* District (district) */}
            <div className="form-group">
              <label htmlFor={`${formId}-district`} className="form-label">
                District <span className="req">*</span>
              </label>
              <div className="select-wrap">
                <select
                  id={`${formId}-district`}
                  name="district"
                  value={formData.district}
                  onChange={handleInputChange}
                  disabled={!formData.division}
                  className={`form-select ${errors.district ? 'input-error' : ''}`}
                >
                  <option value="">
                    {formData.division ? 'Select District' : 'Select Division first'}
                  </option>
                  {availableDistricts.map((dist) => (
                    <option key={dist} value={dist}>
                      {dist}
                    </option>
                  ))}
                </select>
                <span className="select-arrow">▼</span>
              </div>
              {errors.district && <span className="field-error">{errors.district}</span>}
            </div>

            {/* Thana (thana) */}
            <div className="form-group">
              <label htmlFor={`${formId}-thana`} className="form-label">
                Thana / Upazila <span className="req">*</span>
              </label>
              <div className="select-wrap">
                <select
                  id={`${formId}-thana`}
                  name="thana"
                  value={formData.thana}
                  onChange={handleInputChange}
                  disabled={!formData.district}
                  className={`form-select ${errors.thana ? 'input-error' : ''}`}
                >
                  <option value="">
                    {formData.district ? 'Select Thana / Upazila' : 'Select District first'}
                  </option>
                  {availableThanas.map((th) => (
                    <option key={th} value={th}>
                      {th}
                    </option>
                  ))}
                  {formData.district && <option value="Other">Other / Enter Custom Thana</option>}
                </select>
                <span className="select-arrow">▼</span>
              </div>
              {errors.thana && <span className="field-error">{errors.thana}</span>}
            </div>
          </div>

          {/* Custom Thana input */}
          {formData.thana === 'Other' && (
            <div className="form-group custom-thana-group" style={{ marginTop: 14 }}>
              <label htmlFor={`${formId}-customThana`} className="form-label">
                Specify Thana / Police Station Name / থানার নাম <span className="req">*</span>
              </label>
              <div className="input-wrap">
                <input
                  id={`${formId}-customThana`}
                  type="text"
                  name="customThana"
                  value={formData.customThana}
                  onChange={handleInputChange}
                  placeholder="e.g. Rampura, Savar / যেমন: রামপুরা, সাভার"
                  className={`form-input ${errors.thana ? 'input-error' : ''}`}
                />
              </div>
            </div>
          )}

          {/* Detailed Physical Address (address) */}
          <div className="form-group" style={{ marginTop: 18 }}>
            <label htmlFor={`${formId}-address`} className="form-label">
              Detailed Address / Warehouse / Hub / আপনার ঠিকানা <span className="req">*</span>
            </label>
            <div className="input-wrap">
              <input
                id={`${formId}-address`}
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="e.g. Shop 14, Ring Road, Mohammadpur, Dhaka"
                className={`form-input ${errors.address ? 'input-error' : ''}`}
              />
            </div>
            {errors.address && <span className="field-error">{errors.address}</span>}
          </div>
        </div>

        {/* Section 3: Transport Logistics */}
        <div className="form-section">
          <div className="form-section-title">
            <h4>Collection Logistics</h4>
            <p>Preferred transport for scrap haulage</p>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor={`${formId}-vehicle`} className="form-label">
                Transport / Vehicle Type / যানবাহনের ধরন
              </label>
              <div className="select-wrap">
                <select
                  id={`${formId}-vehicle`}
                  name="vehicle"
                  value={formData.vehicle}
                  onChange={handleInputChange}
                  className="form-select"
                >
                  <option value="Van / Three-Wheeler">Van / Three-Wheeler (রিকশা ভ্যান)</option>
                  <option value="Motorcycle / Scooter">Motorcycle / Scooter (মোটরসাইকেল / স্কুটার)</option>
                  <option value="Pickup Truck / Mini Truck">Pickup Truck / Mini Truck (পিকআপ / মিনি ট্রাক)</option>
                  <option value="Bicycle / Hand Trolley">Bicycle / Hand Trolley (বাইসাইকেল / ঠেলাগাড়ি)</option>
                  <option value="On Foot / Neighborhood Cart">On Foot / Neighborhood Cart (পায়ে হেঁটে / ট্রলি)</option>
                </select>
                <span className="select-arrow">▼</span>
              </div>
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
              I confirm that the provided NID, password, and address information are accurate, and I agree to uphold ScrapVenture's verified collector standards, digital weighment protocols, and fair customer service.
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
                <span className="spinner"></span> Processing Collector Application...
              </>
            ) : (
              <>
                Submit Collector Application <ArrowIcon />
              </>
            )}
          </button>
        </div>

        {/* Switch Footer */}
        <div className="login-switch-footer">
          <div className="login-switch-text">
            Already registered as a collector?{' '}
            <Link to="/collector-login">Sign In to Collector Portal</Link>
          </div>
        </div>
      </form>
    </div>
  );
}
