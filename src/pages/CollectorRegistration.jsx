import { Link } from 'react-router-dom';
import SiteLayout from '../components/SiteLayout.jsx';
import CollectorForm from '../components/CollectorForm.jsx';

export default function CollectorRegistration() {
  return (
    <SiteLayout hideNav hideFooter main mainClassName="auth-page-main">
      {/* Brand Logo Header */}
      <Link to="/" className="auth-header-brand" title="Return to ScrapVenture Homepage">
        <img src="/assets/images/logo.png" alt="ScrapVenture logo" />
      </Link>

      {/* Page Hero Header */}
      <div className="auth-page-hero">
        <h1 className="page-title">
          Collector <span className="collector-title-accent">Registration</span>
        </h1>
      </div>

      {/* Main Registration Form Section */}
      <div className="collector-form-container">
        <CollectorForm />
      </div>
    </SiteLayout>
  );
}
