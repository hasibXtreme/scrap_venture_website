import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Awards from './pages/Awards.jsx';
import Team from './pages/Team.jsx';
import CollectorRegistration from './pages/CollectorRegistration.jsx';
import Blog from './pages/Blog.jsx';

function ScrollHandler() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const el = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname, hash]);

  return null;
}

export default function App() {
  return (
    <>
      <ScrollHandler />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/index.html" element={<Home />} />
        <Route path="/awards.html" element={<Awards />} />
        <Route path="/team.html" element={<Team />} />
        <Route path="/team" element={<Team />} />
        <Route path="/collector-registration" element={<CollectorRegistration />} />
        <Route path="/collector-registration.html" element={<CollectorRegistration />} />
        <Route path="/collector" element={<CollectorRegistration />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog.html" element={<Blog />} />
      </Routes>
    </>
  );
}
