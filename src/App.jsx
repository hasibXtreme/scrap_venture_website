import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Awards from './pages/Awards.jsx';
import Team from './pages/Team.jsx';

export default function App() {
  // The original was a static page, so the browser jumped to #hash on load
  // (e.g. index.html#why). Content now renders from JS, so do the same jump here.
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;
    const el = document.getElementById(decodeURIComponent(hash.slice(1)));
    if (el) el.scrollIntoView({ behavior: 'instant' });
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/index.html" element={<Home />} />
      <Route path="/awards.html" element={<Awards />} />
      <Route path="/team.html" element={<Team />} />
      <Route path="/team" element={<Team />} />
    </Routes>
  );
}
