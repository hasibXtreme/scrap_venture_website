import { useState } from 'react';
import SiteLayout from '../components/SiteLayout.jsx';
import Reveal from '../components/Reveal.jsx';
import { 
  PhoneIcon, 
  MailIcon, 
  MapPinIcon, 
  CheckCircleIcon, 
  SendIcon, 
  ArrowIcon,
  UserIcon
} from '../components/icons.jsx';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [status, setStatus] = useState({
    submitting: false,
    submitted: false,
    error: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setStatus({ submitting: false, submitted: false, error: 'Please fill in all required fields.' });
      return;
    }

    setStatus({ submitting: true, submitted: false, error: null });

    // Simulate clean async submission with delightful feedback
    setTimeout(() => {
      setStatus({ submitting: false, submitted: true, error: null });
    }, 750);
  };

  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
    setStatus({ submitting: false, submitted: false, error: null });
  };

  return (
    <SiteLayout variant="contact" main mainClassName="awards-page-main">
      {/* Ambient Eco Decorative Elements in Background - Strictly matching Blog & Awards Pages */}
      <div className="awards-bg-deco" aria-hidden="true">
        <img
          src="/assets/images/recycle.png"
          alt=""
          className="awards-bg-watermark awards-watermark-1"
          loading="lazy"
        />
        <img
          src="/assets/images/recycle.png"
          alt=""
          className="awards-bg-watermark awards-watermark-2"
          loading="lazy"
        />
        <div className="awards-glow-orb awards-glow-orb--1"></div>
        <div className="awards-glow-orb awards-glow-orb--2"></div>
      </div>

      {/* Page Heading & Hero Section */}
      <section className="contact-hero">
        <div className="wrap">
          <Reveal className="contact-hero__inner">
            <h1 className="contact-title">
              Let’s Build <span className="contact-title-accent">Green Together</span>
            </h1>
            <p className="contact-subtitle">
              Turn your scrap into sustainable value with quick doorstep pickups and eco-friendly recycling.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Split Content Section: Info on Left + Drop Us a Message on Right */}
      <section className="contact-content-sec">
        <div className="wrap">
          <div className="contact-split-grid">
            
            {/* Left Column: We Are Here To Help */}
            <div className="contact-info-col">
              <Reveal className="contact-info-intro contact-intro-delay">
                <h2 className="contact-info-heading">
                  We are here <span className="contact-help-accent">to help</span>
                </h2>
                <p className="contact-info-desc">
                  Have questions about scrap pricing, materials we collect, or scheduling a convenient pickup? Reach out to us through any of our direct channels below.
                </p>
              </Reveal>

              <div className="contact-cards-stack">
                {/* Phone & WhatsApp Card */}
                <Reveal as="a" href="tel:+8801700000000" className="contact-info-card contact-card-delay-1">
                  <div className="contact-card-icon-wrap" aria-hidden="true">
                    <PhoneIcon size={22} />
                  </div>
                  <div className="contact-card-body">
                    <div className="contact-card-label">Direct Phone &amp; WhatsApp</div>
                    <div className="contact-card-val">+880 1700-000000</div>
                    <div className="contact-card-note">Mon – Sat: 9:00 AM – 8:00 PM (Instant response)</div>
                  </div>
                </Reveal>

                {/* Email Support Card */}
                <Reveal as="a" href="mailto:hello@scrapventure.xyz" className="contact-info-card contact-card-delay-2">
                  <div className="contact-card-icon-wrap" aria-hidden="true">
                    <MailIcon size={22} />
                  </div>
                  <div className="contact-card-body">
                    <div className="contact-card-label">Official Email Support</div>
                    <div className="contact-card-val">hello@scrapventure.xyz</div>
                    <div className="contact-card-note">General inquiries, corporate orders &amp; media</div>
                  </div>
                </Reveal>

                {/* Hub & Address Card */}
                <Reveal as="div" className="contact-info-card contact-card-delay-3">
                  <div className="contact-card-icon-wrap" aria-hidden="true">
                    <MapPinIcon size={22} />
                  </div>
                  <div className="contact-card-body">
                    <div className="contact-card-label">Operations Hub &amp; Address</div>
                    <div className="contact-card-val">House 42, Road 11, Block D</div>
                    <div className="contact-card-note">Banani, Dhaka-1213, Bangladesh</div>
                  </div>
                </Reveal>
              </div>
            </div>

            {/* Right Column: Drop Us a Message Box */}
            <div className="contact-form-col">
              <Reveal className="contact-form-card contact-form-delay">
                {status.submitted ? (
                  <div className="contact-success-state">
                    <div className="contact-success-icon-wrap">
                      <CheckCircleIcon size={38} />
                    </div>
                    <h3 className="contact-success-title">Message Sent Successfully!</h3>
                    <p className="contact-success-text">
                      Thank you, <strong>{formData.name}</strong>! We have received your message{formData.subject ? <> regarding <em>"{formData.subject}"</em></> : ''}. Our recycling coordination team will reach out to you within a few hours.
                    </p>
                    <button type="button" onClick={handleReset} className="contact-reset-btn">
                      Send Another Message <ArrowIcon />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="contact-form-header">
                      <h2 className="contact-form-title">Drop Us a Message</h2>
                      <p className="contact-form-desc">
                        Fill in your details below and our recycling specialists will get back to you promptly.
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="contact-form" noValidate>
                      {status.error && (
                        <div style={{
                          padding: '12px 16px',
                          background: '#FEF2F2',
                          border: '1px solid #FCA5A5',
                          borderRadius: '10px',
                          color: '#DC2626',
                          fontSize: '14px',
                          fontWeight: '600'
                        }}>
                          {status.error}
                        </div>
                      )}

                      {/* Row 1: Name & Email */}
                      <div className="contact-form-row">
                        <div className="contact-form-group">
                          <label htmlFor="contactName" className="contact-form-label">
                            Full Name / আপনার নাম <span className="contact-form-req">*</span>
                          </label>
                          <div className="contact-input-wrap">
                            <span className="contact-input-icon" aria-hidden="true">
                              <UserIcon size={17} />
                            </span>
                            <input
                              type="text"
                              id="contactName"
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              placeholder="Full Name / আপনার নাম"
                              className="contact-input"
                              required
                            />
                          </div>
                        </div>

                        <div className="contact-form-group">
                          <label htmlFor="contactEmail" className="contact-form-label">
                            Email Address / আপনার ইমেইল <span className="contact-form-req">*</span>
                          </label>
                          <div className="contact-input-wrap">
                            <span className="contact-input-icon" aria-hidden="true">
                              <MailIcon size={17} />
                            </span>
                            <input
                              type="email"
                              id="contactEmail"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              placeholder="Email Address / আপনার ইমেইল"
                              className="contact-input"
                              required
                            />
                          </div>
                        </div>
                      </div>

                      {/* Row 2: Phone & Subject */}
                      <div className="contact-form-row">
                        <div className="contact-form-group">
                          <label htmlFor="contactPhone" className="contact-form-label">
                            Phone Number / ফোন নম্বর
                          </label>
                          <div className="contact-input-wrap">
                            <span className="contact-input-icon" aria-hidden="true">
                              <PhoneIcon size={17} />
                            </span>
                            <input
                              type="tel"
                              id="contactPhone"
                              name="phone"
                              value={formData.phone}
                              onChange={handleChange}
                              placeholder="01XXXXXXXXX / ফোন নম্বর"
                              className="contact-input"
                            />
                          </div>
                        </div>

                        <div className="contact-form-group">
                          <label htmlFor="contactSubject" className="contact-form-label">
                            Subject / বিষয়
                          </label>
                          <select
                            id="contactSubject"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            className={`contact-select ${!formData.subject ? 'is-placeholder' : ''}`}
                          >
                            <option value="" disabled hidden>Select a Subject... / বিষয় নির্বাচন করুন</option>
                            <option value="Household Scrap Doorstep Pickup">Household Scrap Doorstep Pickup (বাসাবাড়ির স্ক্র্যাপ পিকআপ)</option>
                            <option value="Corporate / Office Bulk Recycling">Corporate / Office Bulk Recycling (কর্পোরেট বাল্ক রিসাইক্লিং)</option>
                            <option value="E-Waste & Hardware Disposal">E-Waste &amp; Hardware Disposal (ই-বর্জ্য ও হার্ডওয়্যার)</option>
                            <option value="Become a ScrapVenture Collector">Become a ScrapVenture Collector (কালেক্টর হিসেবে যোগ দিন)</option>
                            <option value="Partnership & Sponsorship">Partnership &amp; Sponsorship (পার্টনারশিপ ও স্পনসরশিপ)</option>
                            <option value="General Question / Other">General Question / Other (সাধারণ প্রশ্ন বা অন্যান্য)</option>
                          </select>
                        </div>
                      </div>

                      {/* Row 3: Message Textarea */}
                      <div className="contact-form-group">
                        <label htmlFor="contactMessage" className="contact-form-label">
                          Send Your Message / আপনার বার্তা লিখুন <span className="contact-form-req">*</span>
                        </label>
                        <textarea
                          id="contactMessage"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          placeholder="Write your message here... / আপনার বার্তা এখানে লিখুন..."
                          rows={5}
                          className="contact-textarea"
                          required
                        ></textarea>
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={status.submitting}
                        className="contact-submit-btn"
                      >
                        {status.submitting ? (
                          <span>Sending Message...</span>
                        ) : (
                          <>
                            <span>Send Message</span>
                            <SendIcon size={18} />
                          </>
                        )}
                      </button>
                    </form>
                  </>
                )}
              </Reveal>
            </div>

          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
