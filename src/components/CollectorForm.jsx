import { useState, useId } from 'react';
import { Link } from 'react-router-dom';
import { ArrowIcon } from './icons.jsx';
import {
  BANGLADESH_DIVISIONS,
  BANGLADESH_DISTRICTS,
  POPULAR_THANAS,
} from '../data/bangladeshGeo.js';

export default function CollectorForm() {
  const formId = useId();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    nid: '',
    division: '',
    district: '',
    thana: '',
    customThana: '',
    vehicle: 'Van / Three-Wheeler',
    experience: '1-2 Years',
    agreeTerms: true,
  });

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

    // Name
    if (!formData.name.trim()) {
      errs.name = 'Full name is required';
    } else if (formData.name.trim().length < 3) {
      errs.name = 'Name must be at least 3 characters';
    }

    // Email
    if (!formData.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Please enter a valid email address';
    }

    // Phone
    const cleanPhone = formData.phone.replace(/[\s-]/g, '');
    if (!cleanPhone) {
      errs.phone = 'Phone number is required';
    } else if (!/^(?:\+?880|0)?1[3-9]\d{8}$/.test(cleanPhone)) {
      errs.phone = 'Enter a valid Bangladesh phone number (e.g. 01712345678)';
    }

    // NID
    const cleanNid = formData.nid.replace(/[\s-]/g, '');
    if (!cleanNid) {
      errs.nid = 'National ID (NID) number is required';
    } else if (!/^\d{10}$|^\d{13}$|^\d{17}$/.test(cleanNid)) {
      errs.nid = 'NID must be 10, 13, or 17 numeric digits';
    }

    // Division
    if (!formData.division) {
      errs.division = 'Please select your division';
    }

    // District
    if (!formData.district) {
      errs.district = 'Please select your district';
    }

    // Thana
    const finalThana =
      formData.thana === 'Other' ? formData.customThana.trim() : formData.thana;
    if (!finalThana) {
      errs.thana = 'Please specify your thana / police station';
    }

    // Terms
    if (!formData.agreeTerms) {
      errs.agreeTerms = 'You must accept the terms to apply';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      const firstErrorKey = Object.keys(errors)[0];
      const el = document.getElementById(`${formId}-${firstErrorKey}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setIsSubmitting(true);

    // Simulate network API submission
    setTimeout(() => {
      setIsSubmitting(false);
      const appRef = 'SV-COL-' + Math.floor(10000 + Math.random() * 90000);
      const finalThana =
        formData.thana === 'Other' ? formData.customThana.trim() : formData.thana;
      setSubmittedData({
        ...formData,
        finalThana,
        referenceId: appRef,
        date: new Date().toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }),
      });
      window.scrollTo({ top: 300, behavior: 'smooth' });
    }, 700);
  };

  const handleReset = () => {
    setSubmittedData(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      nid: '',
      division: '',
      district: '',
      thana: '',
      customThana: '',
      vehicle: 'Van / Three-Wheeler',
      experience: '1-2 Years',
      agreeTerms: true,
    });
    setErrors({});
  };

  if (submittedData) {
    return (
      <div className="collector-success-card">
        <div className="collector-success-icon-wrap">
          <div className="collector-success-badge">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
        </div>

        <div className="collector-success-header">
          <span className="collector-tag">Application Submitted</span>
          <h2 className="collector-success-title">Welcome to the ScrapVenture Fleet!</h2>
          <p className="collector-success-desc">
            Your collector registration has been successfully received. Our regional field coordinator for{' '}
            <strong>{submittedData.finalThana}, {submittedData.district}</strong> will review your details and reach out within 24–48 hours.
          </p>
        </div>

        <div className="collector-summary-box">
          <div className="collector-summary-head">
            <span className="collector-summary-lbl">Application Reference</span>
            <span className="collector-summary-ref">{submittedData.referenceId}</span>
          </div>

          <div className="collector-summary-grid">
            <div className="collector-summary-item">
              <span className="lbl">Full Name</span>
              <span className="val">{submittedData.name}</span>
            </div>
            <div className="collector-summary-item">
              <span className="lbl">Phone Number</span>
              <span className="val">{submittedData.phone}</span>
            </div>
            <div className="collector-summary-item">
              <span className="lbl">Email Address</span>
              <span className="val">{submittedData.email}</span>
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
              <span className="val">{submittedData.finalThana}, {submittedData.district}</span>
            </div>
            <div className="collector-summary-item">
              <span className="lbl">Transport Type</span>
              <span className="val">{submittedData.vehicle}</span>
            </div>
            <div className="collector-summary-item">
              <span className="lbl">Experience Level</span>
              <span className="val">{submittedData.experience}</span>
            </div>
          </div>
        </div>

        <div className="collector-next-steps">
          <h4>Next Steps for Onboarding</h4>
          <ol className="collector-steps-list">
            <li>
              <span className="step-num">1</span>
              <div>
                <strong>Phone Verification:</strong> Our local hub officer will contact you on <strong>{submittedData.phone}</strong> to confirm your availability.
              </div>
            </li>
            <li>
              <span className="step-num">2</span>
              <div>
                <strong>Kit &amp; ID Pickup:</strong> Receive your official ScrapVenture collector badge, certified digital weighing scale, and safety uniform.
              </div>
            </li>
            <li>
              <span className="step-num">3</span>
              <div>
                <strong>Start Earning:</strong> Activate the ScrapVenture Partner App and begin collecting high-value recyclables in your neighborhood!
              </div>
            </li>
          </ol>
        </div>

        <div className="collector-success-actions">
          <Link to="/" className="btn btn-solid">
            Return to Homepage <ArrowIcon />
          </Link>
          <button type="button" onClick={handleReset} className="btn btn-ghost-dark">
            Register Another Collector
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>

      <div className="collector-form-header">
        <h3 className="collector-form-title">Collector Registration Form</h3>
      </div>

      <form className="collector-form" onSubmit={handleSubmit} noValidate>

        {/* Section 1: Personal Details */}
        <div className="form-section">
          <div className="form-section-title">
            <h4>Personal Information</h4>
            <p>Your primary contact &amp; identity details</p>
          </div>

          <div className="form-grid">
            {/* Full Name */}
            <div className="form-group">
              <label htmlFor={`${formId}-name`} className="form-label">
                Full Name <span className="req">*</span>
              </label>
              <div className="input-wrap">
                <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
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

            {/* Email Address */}
            <div className="form-group">
              <label htmlFor={`${formId}-email`} className="form-label">
                Email Address <span className="req">*</span>
              </label>
              <div className="input-wrap">
                <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                <input
                  id={`${formId}-email`}
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="e.g. tanvir.ahmed@gmail.com"
                  className={`form-input ${errors.email ? 'input-error' : ''}`}
                  autoComplete="email"
                />
              </div>
              {errors.email && <span className="field-error">{errors.email}</span>}
            </div>

            {/* Phone Number */}
            <div className="form-group">
              <label htmlFor={`${formId}-phone`} className="form-label">
                Phone Number <span className="req">*</span>
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
                  placeholder="e.g. 01712345678"
                  className={`form-input ${errors.phone ? 'input-error' : ''}`}
                  autoComplete="tel"
                />
              </div>
              {errors.phone && <span className="field-error">{errors.phone}</span>}
              <span className="field-hint">Used for order alerts and instant payment notifications</span>
            </div>

            {/* NID Number */}
            <div className="form-group">
              <label htmlFor={`${formId}-nid`} className="form-label">
                National ID (NID) Number <span className="req">*</span>
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
              <span className="field-hint">Required for verified collector verification &amp; trust badge</span>
            </div>
          </div>
        </div>

        {/* Section 2: Operational Location */}
        <div className="form-section">
          <div className="form-section-title">
            <h4>Operational Location &amp; Coverage</h4>
            <p>Define your primary doorstep collection territory in Bangladesh</p>
          </div>

          <div className="form-grid form-grid-3">
            {/* Division */}
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

            {/* District */}
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

            {/* Thana */}
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

          {/* Custom Thana input if "Other" is chosen or district has no popular presets */}
          {formData.thana === 'Other' && (
            <div className="form-group custom-thana-group">
              <label htmlFor={`${formId}-customThana`} className="form-label">
                Specify Thana / Police Station Name <span className="req">*</span>
              </label>
              <div className="input-wrap">
                <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <input
                  id={`${formId}-customThana`}
                  type="text"
                  name="customThana"
                  value={formData.customThana}
                  onChange={handleInputChange}
                  placeholder="e.g. Rampura, Savar, বা নির্দিষ্ট থানা"
                  className={`form-input ${errors.thana ? 'input-error' : ''}`}
                />
              </div>
            </div>
          )}
        </div>

        {/* Section 3: Logistics & Equipment */}
        <div className="form-section">
          <div className="form-section-title">
            <h4>Logistics &amp; Capacity</h4>
            <p>Helps us match you with the right scrap volume pickups</p>
          </div>

          <div className="form-grid">
            {/* Transport / Vehicle Type */}
            <div className="form-group">
              <label htmlFor={`${formId}-vehicle`} className="form-label">
                Transport / Vehicle Type
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
                  <option value="Motorcycle / Scooter">Motorcycle / Scooter</option>
                  <option value="Pickup Truck / Mini Truck">Pickup Truck / Mini Truck</option>
                  <option value="Bicycle / Hand Trolley">Bicycle / Hand Trolley</option>
                  <option value="On Foot / Neighborhood Cart">On Foot / Neighborhood Cart</option>
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
              I confirm that the provided NID and personal information are accurate, and I agree to uphold ScrapVenture's verified collector code of conduct, accurate weight standards, and fair customer service.
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
                <span className="spinner"></span> Processing Application...
              </>
            ) : (
              <>
                Submit Collector Application <ArrowIcon />
              </>
            )}
          </button>
          <span className="form-security-note">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            Zero registration fee. Your data is strictly encrypted and protected.
          </span>
        </div>
      </form>
    </div>
  );
}
