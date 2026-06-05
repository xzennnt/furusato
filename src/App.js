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
import { LanguageProvider, useLanguage } from './i18n/LanguageProvider';
import { getSeoMeta } from './i18n/copy';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import GalleryPage from './pages/GalleryPage';
import HomePage from './pages/HomePage';
import LulusJobPage from './pages/LulusJobPage';
import NewsPage from './pages/NewsPage';

function upsertMeta(attribute, value, content) {
  if (!content) {
    return;
  }

  let element = document.head.querySelector(`meta[${attribute}="${value}"]`);

  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, value);
    document.head.appendChild(element);
  }

  element.setAttribute('content', content);
}

function upsertCanonical(href) {
  let element = document.head.querySelector('link[rel="canonical"]');

  if (!element) {
    element = document.createElement('link');
    element.rel = 'canonical';
    document.head.appendChild(element);
  }

  element.setAttribute('href', href);
}

function applySeoMeta(meta) {
  document.title = meta.title;
  upsertCanonical(meta.canonical);

  upsertMeta('name', 'description', meta.description);
  upsertMeta('name', 'keywords', meta.keywords);
  upsertMeta('name', 'robots', meta.robots);
  upsertMeta('property', 'og:type', 'website');
  upsertMeta('property', 'og:url', meta.canonical);
  upsertMeta('property', 'og:title', meta.title);
  upsertMeta('property', 'og:description', meta.description);
  upsertMeta('property', 'og:image', meta.image);
  upsertMeta('property', 'og:image:secure_url', meta.image);
  upsertMeta('property', 'og:locale', meta.locale);
  upsertMeta('name', 'twitter:card', 'summary_large_image');
  upsertMeta('name', 'twitter:title', meta.title);
  upsertMeta('name', 'twitter:description', meta.description);
  upsertMeta('name', 'twitter:image', meta.image);
}

function AppShell() {
  const rootRef = useRef(null);
  const location = useLocation();
  const [showBackToTop, setShowBackToTop] = useState(false);
  const { language } = useLanguage();

  useEffect(() => {
    applySeoMeta(getSeoMeta(location.pathname, location.hash, language));
  }, [language, location.hash, location.pathname]);

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

      setFavicon(resolveMediaUrl(site.logoUrl) || '/uploads/1778684122156-createMyojiImage.png');
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
  const { copy } = useLanguage();

  return (
    <section className="page-section not-found-page">
      <div className="page-hero">
        <p className="eyebrow">{copy.notFound.eyebrow}</p>
        <h1>{copy.notFound.title}</h1>
        <p>{copy.notFound.body}</p>
        <Link className="primary-action" to="/">{copy.notFound.action}</Link>
      </div>
    </section>
  );
}

function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <LanguageProvider>
        <AppShell />
      </LanguageProvider>
    </BrowserRouter>
  );
}

export default App;
