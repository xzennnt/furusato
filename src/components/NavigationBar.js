import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { fallbackSite } from '../data/fallbackContent';
import { fetchSite, resolveMediaUrl } from '../lib/api';
import { scrollToMapSection } from '../lib/scroll';

const menuItems = [
  { label: 'Home', href: '/' },
  { label: 'Tentang Furusato', href: '/tentang' },
  { label: 'Map', href: '/#map' },
  { label: 'Galeri', href: '/galeri' },
  { label: 'Lulus Job', href: '/lulus-job' },
  { label: 'Berita', href: '/berita' },
];

function NavigationBar() {
  const [site, setSite] = useState(fallbackSite);
  const location = useLocation();

  useEffect(() => {
    fetchSite(fallbackSite).then(setSite);
  }, []);

  function handleMapClick(event) {
    if (location.pathname === '/' && location.hash === '#map') {
      event.preventDefault();
      scrollToMapSection();
    }
  }

  const logoSrc = resolveMediaUrl(site.logoUrl);

  return (
    <header className="site-header yutaka-header">
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
            <LinkComponent
              key={item.href}
              to={item.href}
              onClick={item.href === '/#map' ? handleMapClick : undefined}
            >
              {item.label}
            </LinkComponent>
          );
        })}
      </nav>
    </header>
  );
}

export default NavigationBar;
