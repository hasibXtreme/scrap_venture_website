import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Awards from './pages/Awards.jsx';
import Marketplace from './pages/Marketplace.jsx';
import BookPickup from './pages/BookPickup.jsx';
import Team from './pages/Team.jsx';
import CollectorRegistration from './pages/CollectorRegistration.jsx';
import Blog from './pages/Blog.jsx';
import Contact from './pages/Contact.jsx';

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
      <Route path="/become-a-collector" element={<CollectorRegistration />} />
      <Route path="/become-a-collector.html" element={<CollectorRegistration />} />
      <Route path="/collector" element={<CollectorRegistration />} />
      <Route path="/collector.html" element={<CollectorRegistration />} />
      <Route path="/become-collector" element={<CollectorRegistration />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog.html" element={<Blog />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/contact.html" element={<Contact />} />
      <Route path="/contact-us" element={<Contact />} />
    </Routes>
  );
}
