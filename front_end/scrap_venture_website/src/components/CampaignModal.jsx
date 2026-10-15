import { useState, useEffect } from 'react';
import { fetchPublicCampaigns } from '../utils/api.js';

export default function CampaignModal() {
  const [campaign, setCampaign] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if user already dismissed modal during this session
    const dismissed = sessionStorage.getItem('sv_campaign_modal_dismissed');
    if (dismissed) return;

    fetchPublicCampaigns()
      .then((res) => {
        const campaignsList = res?.campaigns || [];
        if (campaignsList.length > 0) {
          // Take the latest campaign (last inserted or first in descending)
          const latest = campaignsList[campaignsList.length - 1];
          setCampaign(latest);
          // Small delay for smooth entry after page load
          const timer = setTimeout(() => {
            setIsOpen(true);
          }, 800);
          return () => clearTimeout(timer);
        }
      })
      .catch((err) => {
        console.warn('Could not load campaign popup:', err);
      });
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem('sv_campaign_modal_dismissed', 'true');
  };

  if (!isOpen || !campaign) return null;

  const registrationLink =
    campaign.registration_link ||
    'https://docs.google.com/forms/d/e/1FAIpQLScrapVentureCampusZeroWaste/viewform';

  return (
    <div className="campaign-modal-overlay" onClick={handleClose}>
      <div
        className="campaign-modal-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="campaign-modal-title"
      >
        <div className="campaign-modal-banner">
          <button
            type="button"
            className="campaign-modal-close-btn"
            onClick={handleClose}
            aria-label="Close Campaign Notification"
          >
            ×
          </button>
          <span className="campaign-modal-badge">🌱 Latest Live Campaign</span>
          <h3 id="campaign-modal-title">{campaign.title}</h3>
        </div>

        <div className="campaign-modal-body">
          <p className="campaign-modal-desc">{campaign.description}</p>

          <div className="campaign-modal-actions">
            <a
              href={registrationLink}
              target="_blank"
              rel="noopener noreferrer"
              className="dash-btn dash-btn--primary"
              style={{ flex: 1 }}
              onClick={handleClose}
            >
              <span>Register in Campaign</span>
              <span>↗</span>
            </a>
            <button
              type="button"
              className="dash-btn dash-btn--secondary"
              onClick={handleClose}
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
