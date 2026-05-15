import { useEffect, useRef, useState } from 'react';
import { BrowserRouter, Link, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import './App.css';
import AdminDashboardPage from './admin/AdminDashboardPage';
import AdminLoginPage from './admin/AdminLoginPage';
import Footer from './components/Footer';
import NavigationBar from './components/NavigationBar';
import { fetchSite, resolveMediaUrl } from './lib/api';
import { fallbackSite } from './data/fallbackContent';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import GalleryPage from './pages/GalleryPage';
import HomePage from './pages/HomePage';
import LulusJobPage from './pages/LulusJobPage';
import NewsPage from './pages/NewsPage';

function AppShell() {
  const rootRef = useRef(null);
  const location = useLocation();
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const pageTitle = getPageTitle(location.pathname, location.hash);
    document.title = pageTitle;
  }, [location.hash, location.pathname]);

  useEffect(() => {
    let isActive = true;

    const applyIconType = (element, href) => {
      if (href && href.toLowerCase().endsWith('.svg')) {
        element.setAttribute('type', 'image/svg+xml');
        return;
      }

      element.removeAttribute('type');
    };

    const setFavicon = (href) => {
      if (!href) {
        return;
      }

      const selectors = ['link[rel="icon"]', 'link[rel="shortcut icon"]'];

      selectors.forEach((selector) => {
        const existing = document.querySelector(selector);

        if (existing) {
          existing.setAttribute('href', href);
          applyIconType(existing, href);
          return;
        }

        const link = document.createElement('link');
        link.rel = 'icon';
        link.href = href;
        applyIconType(link, href);
        document.head.appendChild(link);
      });
    };

    const loadFavicon = async () => {
      const site = await fetchSite(fallbackSite);

      if (!isActive) {
        return;
      }

      setFavicon(resolveMediaUrl(site.logoUrl) || '/favicon.svg');
    };

    loadFavicon();

    return () => {
      isActive = false;
    };
  }, []);

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
        <Route path="/lulus-job" element={<LulusJobPage />} />
        <Route path="/berita" element={<NewsPage />} />
        <Route path="/kontak" element={<ContactPage />} />
        <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Footer />
      {showBackToTop && (
        <button
          type="button"
          className="back-to-top-button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Kembali ke atas"
        >
          ↑
        </button>
      )}
    </main>
  );
}

function NotFoundPage() {
  return (
    <section className="page-section not-found-page">
      <div className="page-hero">
        <p className="eyebrow">Halaman tidak tersedia</p>
        <h1>URL ini tidak dipublikasikan untuk pengunjung.</h1>
        <p>
          Gunakan halaman yang tersedia: Home, Tentang Furusato, Map, Galeri, Lulus Job, Berita, dan Kontak.
        </p>
        <Link className="primary-action" to="/">Kembali ke Home</Link>
      </div>
    </section>
  );
}

function getPageTitle(pathname, hash) {
  if (pathname === '/' && hash === '#map') {
    return 'Furusato | Map';
  }

  if (pathname === '/') {
    return 'Furusato Temanggung | LPK Jepang';
  }

  if (pathname === '/tentang') {
    return 'Tentang Furusato Temanggung';
  }

  if (pathname === '/galeri') {
    return 'Galeri Furusato Temanggung';
  }

  if (pathname === '/lulus-job') {
    return 'Lulus Job Furusato Temanggung';
  }

  if (pathname === '/berita') {
    return 'Berita Furusato Temanggung';
  }

  if (pathname === '/kontak') {
    return 'Kontak Furusato Temanggung';
  }

  if (pathname === '/admin/login') {
    return 'Furusato Admin | Login';
  }

  if (pathname === '/admin/dashboard') {
    return 'Furusato Admin | Dashboard';
  }

  return 'Furusato Temanggung | Halaman Tidak Ditemukan';
}

function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AppShell />
    </BrowserRouter>
  );
}

export default App;
