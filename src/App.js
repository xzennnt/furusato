import { useEffect, useRef, useState } from 'react';
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
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.hero-copy > *, .page-hero > *', {
        y: 34,
        opacity: 0,
        duration: 0.9,
        stagger: 0.12,
        delay: 0.15,
        ease: 'power3.out',
      });
    }, rootRef);

    return () => ctx.revert();
  }, [location.pathname, location.hash]);

  useEffect(() => {
    let frameId = 0;

    const updateBackToTop = () => {
      frameId = 0;
      setShowBackToTop(window.scrollY > 600);
    };

    const onScroll = () => {
      if (frameId) {
        return;
      }

      frameId = window.requestAnimationFrame(updateBackToTop);
    };

    updateBackToTop();
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, []);

  useEffect(() => {
    if (location.hash) {
      return undefined;
    }

    if (process.env.NODE_ENV !== 'test') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    return undefined;
  }, [location.pathname, location.hash]);

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
      {showBackToTop && (
        <button
          type="button"
          className="back-to-top-button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Kembali ke atas"
        >
          Top
        </button>
      )}
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
