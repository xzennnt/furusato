import { useEffect, useRef } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import './App.css';
import AdminDashboardPage from './admin/AdminDashboardPage';
import AdminLoginPage from './admin/AdminLoginPage';
import Footer from './components/Footer';
import NavigationBar from './components/NavigationBar';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import GalleryPage from './pages/GalleryPage';
import HomePage from './pages/HomePage';
import NewsPage from './pages/NewsPage';

function AppShell() {
  const rootRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.site-header', { y: -28, opacity: 0, duration: 0.8, ease: 'power3.out' });
      gsap.from('.hero-copy > *, .page-hero > *', {
        y: 34,
        opacity: 0,
        duration: 0.9,
        stagger: 0.12,
        delay: 0.15,
        ease: 'power3.out',
      });
      gsap.from('.image-marker, .sticker-card', {
        y: 28,
        rotate: -1.5,
        scale: 0.96,
        opacity: 0,
        duration: 0.72,
        stagger: 0.07,
        delay: 0.25,
        ease: 'back.out(1.35)',
      });
    }, rootRef);

    return () => ctx.revert();
  }, [location.pathname]);

  useEffect(() => {
    let hashScrollTimer;

    if (location.hash) {
      hashScrollTimer = window.setTimeout(() => {
        const target = document.querySelector(location.hash);

        if (!target) {
          return;
        }

        const headerHeight = document.querySelector('.site-header')?.offsetHeight || 0;
        const offset = headerHeight + 24;
        const targetTop = target.getBoundingClientRect().top + window.scrollY - offset;

        window.scrollTo({ top: Math.max(targetTop, 0), behavior: 'smooth' });
      }, 120);
    } else if (process.env.NODE_ENV !== 'test') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    return () => {
      window.clearTimeout(hashScrollTimer);
    };
  }, [location]);

  return (
    <main ref={rootRef} className="furusato-site">
      <NavigationBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/tentang" element={<AboutPage />} />
        <Route path="/galeri" element={<GalleryPage />} />
        <Route path="/berita" element={<NewsPage />} />
        <Route path="/kontak" element={<ContactPage />} />
        <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
      </Routes>
      <Footer />
    </main>
  );
}

function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AppShell />
    </BrowserRouter>
  );
}

export default App;
