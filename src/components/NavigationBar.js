import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { fallbackSite } from '../data/fallbackContent';
import { fetchSite, resolveMediaUrl } from '../lib/api';

const menuItems = [
  { label: 'Home', href: '/' },
  { label: 'Tentang Furusato', href: '/tentang' },
  { label: 'Map', href: '/#map' },
  { label: 'Galeri', href: '/galeri' },
  { label: 'Berita', href: '/berita' },
];

function NavigationBar() {
  const [site, setSite] = useState(fallbackSite);
  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    fetchSite(fallbackSite).then(setSite);
  }, []);

  useEffect(() => {
    const sentinel = document.getElementById('scroll-sentinel');

    if (!sentinel || typeof IntersectionObserver === 'undefined') {
      setIsCompact(window.scrollY > 24);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsCompact(!entry.isIntersecting);
      },
      {
        root: null,
        threshold: 0,
      },
    );

    observer.observe(sentinel);

    return () => observer.disconnect();
  }, []);

  const logoSrc = resolveMediaUrl(site.logoUrl);

  return (
    <header className={`site-header yutaka-header ${isCompact ? 'is-compact' : ''}`}>
      <NavLink className="brand yutaka-brand" to="/" aria-label="Furusato home">
        {logoSrc ? (
          <img src={logoSrc} alt={site.brandName} />
        ) : (
          <>
            <span className="brand-kanji">古里</span>
            <span className="brand-romaji">furusato</span>
          </>
        )}
      </NavLink>

      <nav className="menu-bar yutaka-menu" aria-label="Navigasi utama">
        {menuItems.map((item) => {
          const LinkComponent = item.href.includes('#') ? Link : NavLink;

          return (
            <LinkComponent key={item.href} to={item.href}>
              {item.label}
            </LinkComponent>
          );
        })}
      </nav>
    </header>
  );
}

export default NavigationBar;
