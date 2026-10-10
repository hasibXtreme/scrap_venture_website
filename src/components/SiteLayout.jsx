import useSiteScroll from '../hooks/useSiteScroll.js';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';

// Navbar + page content + Footer shared by pages.
// `main` wraps the content in <main class="awards-page-main"> like awards.html.
export default function SiteLayout({
  variant,
  main = false,
  mainClass,
  mainClassName,
  hideNav = false,
  hideFooter = false,
  children,
}) {
  const scrolled = useSiteScroll();
  const cls = mainClass || mainClassName || (
    variant === 'team' ? 'team-page-main' : 
    (variant === 'collector' ? 'collector-page-main' : 
    (variant === 'blog' ? 'blog-page-main' : 
    (variant === 'contact' ? 'contact-page-main' : 'awards-page-main')))
  );
  return (
    <>
      {!hideNav && <Navbar variant={variant} scrolled={scrolled} />}
      {main ? <main className={cls}>{children}</main> : children}
      {!hideFooter && <Footer variant={variant} />}
    </>
  );
}
