import useSiteScroll from '../hooks/useSiteScroll.js';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';

// Navbar + page content + Footer shared by both pages.
export default function SiteLayout({ variant, main = false, mainClassName, children }) {
  const scrolled = useSiteScroll();
  const mainClass = mainClassName || (variant === 'team' ? 'team-page-main' : (variant === 'collector' ? 'collector-page-main' : (variant === 'blog' ? 'blog-page-main' : 'awards-page-main')));
  return (
    <>
      <Navbar variant={variant} scrolled={scrolled} />
      {main ? <main className={mainClass}>{children}</main> : children}
      <Footer variant={variant} />
    </>
  );
}

