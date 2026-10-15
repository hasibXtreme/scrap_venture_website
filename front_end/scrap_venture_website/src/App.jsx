import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Awards from './pages/Awards.jsx';
import Marketplace from './pages/Marketplace.jsx';
import BookPickup from './pages/BookPickup.jsx';
import Team from './pages/Team.jsx';
import CollectorRegistration from './pages/CollectorRegistration.jsx';
import CustomerRegistration from './pages/CustomerRegistration.jsx';
import CustomerLogin from './pages/CustomerLogin.jsx';
import CollectorLogin from './pages/CollectorLogin.jsx';
import AdminLogin from './pages/AdminLogin.jsx';
import Blog from './pages/Blog.jsx';
import Contact from './pages/Contact.jsx';

import ProtectedRoute from './components/ProtectedRoute.jsx';

// Dashboards and Operations Pages
import AdminDashboard from './pages/AdminDashboard.jsx';
import AdminRegister from './pages/AdminRegister.jsx';
import AdminOrdersManage from './pages/AdminOrdersManage.jsx';
import AdminMarketOrders from './pages/AdminMarketOrders.jsx';
import AdminScrapOrders from './pages/AdminScrapOrders.jsx';
import AdminScrapTransaction from './pages/AdminScrapTransaction.jsx';
import AdminScrapManage from './pages/AdminScrapManage.jsx';
import AdminEmployeesManage from './pages/AdminEmployeesManage.jsx';
import AdminTeamMembersManage from './pages/AdminTeamMembersManage.jsx';
import AdminUsersManage from './pages/AdminUsersManage.jsx';
import AdminAwardsManage from './pages/AdminAwardsManage.jsx';
import AdminCampaignsManage from './pages/AdminCampaignsManage.jsx';
import AdminProfile from './pages/AdminProfile.jsx';
import CollectorDashboard from './pages/CollectorDashboard.jsx';
import CustomerDashboard from './pages/CustomerDashboard.jsx';

export default function App() {
  const location = useLocation();

  useEffect(() => {
    // Disable browser automatic scroll restoration to prevent jumping down on reload
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    // If loaded or refreshed with a hash (e.g. #cta), strip it from the URL so it stays clean
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }

    // Always ensure the page starts at the very top (0, 0)
    window.scrollTo(0, 0);

    const handleBeforeUnload = () => {
      if (window.location.hash) {
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  useEffect(() => {
    // When changing routes (e.g. /marketplace or /), always scroll to top
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [location.pathname]);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/index.html" element={<Home />} />
      <Route path="/awards" element={<Awards />} />
      <Route path="/awards.html" element={<Awards />} />
      <Route path="/team" element={<Team />} />
      <Route path="/team.html" element={<Team />} />
      <Route path="/our-team" element={<Team />} />
      <Route path="/marketplace" element={<Marketplace />} />
      <Route path="/marketplace.html" element={<Marketplace />} />
      <Route path="/book-pickup" element={<BookPickup />} />
      <Route path="/book-pickup.html" element={<BookPickup />} />
      {/* Collector Registration Routes */}
      <Route path="/become-a-collector" element={<CollectorRegistration />} />
      <Route path="/become-a-collector.html" element={<CollectorRegistration />} />
      <Route path="/collector" element={<CollectorRegistration />} />
      <Route path="/collector.html" element={<CollectorRegistration />} />
      <Route path="/become-collector" element={<CollectorRegistration />} />

      {/* Customer Registration Routes */}
      <Route path="/register" element={<CustomerRegistration />} />
      <Route path="/register.html" element={<CustomerRegistration />} />
      <Route path="/customer-register" element={<CustomerRegistration />} />
      <Route path="/customer-register.html" element={<CustomerRegistration />} />
      <Route path="/customer-registration" element={<CustomerRegistration />} />
      <Route path="/register/customer" element={<CustomerRegistration />} />
      <Route path="/register/collector" element={<CollectorRegistration />} />

      {/* Customer Login Routes */}
      <Route path="/customer-login" element={<CustomerLogin />} />
      <Route path="/customer-login.html" element={<CustomerLogin />} />
      <Route path="/login/customer" element={<CustomerLogin />} />

      {/* Collector Login Routes */}
      <Route path="/collector-login" element={<CollectorLogin />} />
      <Route path="/collector-login.html" element={<CollectorLogin />} />
      <Route path="/login/collector" element={<CollectorLogin />} />

      {/* Admin Login Routes */}
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/admin-login.html" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminLogin />} />
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Admin Dashboard & Management Routes (Protected: Admin & Moderator only) */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['admin', 'moderator']} redirectPath="/admin-login">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute allowedRoles={['admin', 'moderator']} redirectPath="/admin-login">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute allowedRoles={['admin', 'moderator']} redirectPath="/admin-login">
            <AdminUsersManage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/employees-collectors"
        element={
          <ProtectedRoute allowedRoles={['admin', 'moderator']} redirectPath="/admin-login">
            <AdminEmployeesManage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/verify-collectors"
        element={
          <ProtectedRoute allowedRoles={['admin', 'moderator']} redirectPath="/admin-login">
            <AdminEmployeesManage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/team-members"
        element={
          <ProtectedRoute allowedRoles={['admin', 'moderator']} redirectPath="/admin-login">
            <AdminTeamMembersManage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/register"
        element={
          <ProtectedRoute allowedRoles={['admin']} redirectPath="/admin-login">
            <AdminRegister />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin-register"
        element={
          <ProtectedRoute allowedRoles={['admin']} redirectPath="/admin-login">
            <AdminRegister />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/market-orders"
        element={
          <ProtectedRoute allowedRoles={['admin', 'moderator']} redirectPath="/admin-login">
            <AdminMarketOrders />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/scrap-orders"
        element={
          <ProtectedRoute allowedRoles={['admin', 'moderator']} redirectPath="/admin-login">
            <AdminScrapOrders />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/scrap-transaction"
        element={
          <ProtectedRoute allowedRoles={['admin', 'moderator']} redirectPath="/admin-login">
            <AdminScrapTransaction />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/scrap-types"
        element={
          <ProtectedRoute allowedRoles={['admin', 'moderator']} redirectPath="/admin-login">
            <AdminScrapManage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/scraps"
        element={
          <ProtectedRoute allowedRoles={['admin', 'moderator']} redirectPath="/admin-login">
            <AdminScrapManage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/awards"
        element={
          <ProtectedRoute allowedRoles={['admin', 'moderator']} redirectPath="/admin-login">
            <AdminAwardsManage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/campaigns"
        element={
          <ProtectedRoute allowedRoles={['admin', 'moderator']} redirectPath="/admin-login">
            <AdminCampaignsManage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/profile"
        element={
          <ProtectedRoute allowedRoles={['admin', 'moderator']} redirectPath="/admin-login">
            <AdminProfile />
          </ProtectedRoute>
        }
      />

      {/* Collector Dashboard Routes (Protected: Collector only) */}
      <Route
        path="/collector/dashboard"
        element={
          <ProtectedRoute allowedRoles={['scrap_collector', 'collector']} redirectPath="/collector-login">
            <CollectorDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/collector-dashboard"
        element={
          <ProtectedRoute allowedRoles={['scrap_collector', 'collector']} redirectPath="/collector-login">
            <CollectorDashboard />
          </ProtectedRoute>
        }
      />

      {/* Customer Dashboard Routes (Protected: Customer only) */}
      <Route
        path="/customer/dashboard"
        element={
          <ProtectedRoute allowedRoles={['customer']} redirectPath="/customer-login">
            <CustomerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer-dashboard"
        element={
          <ProtectedRoute allowedRoles={['customer']} redirectPath="/customer-login">
            <CustomerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={['customer']} redirectPath="/customer-login">
            <CustomerDashboard />
          </ProtectedRoute>
        }
      />

      <Route path="/blog" element={<Blog />} />
      <Route path="/blog.html" element={<Blog />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/contact.html" element={<Contact />} />
      <Route path="/contact-us" element={<Contact />} />
    </Routes>
  );
}
