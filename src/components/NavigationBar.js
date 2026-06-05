import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { fallbackSite } from '../data/fallbackContent';
import { fetchSite, resolveMediaUrl } from '../lib/api';
import { useLanguage } from '../i18n/LanguageProvider';
import { scrollToMapSection } from '../lib/scroll';

const menuItems = [
  { key: 'home', href: '/' },
  { key: 'about', href: '/tentang' },
  { key: 'map', href: '/#map' },
  { key: 'gallery', href: '/galeri' },
  { key: 'job', href: '/lulus-job' },
  { key: 'news', href: '/berita' },
];

function NavigationBar() {
  const [site, setSite] = useState(fallbackSite);
  const location = useLocation();
  const { copy, language, setLanguage } = useLanguage();

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

      <div className="header-actions">
        <nav className="menu-bar yutaka-menu" aria-label={copy.nav.ariaLabel}>
        {menuItems.map((item) => {
          const LinkComponent = item.href.includes('#') ? Link : NavLink;

          return (
            <LinkComponent
              key={item.href}
              to={item.href}
              onClick={item.href === '/#map' ? handleMapClick : undefined}
            >
              {copy.nav.links[item.key]}
            </LinkComponent>
          );
        })}
        </nav>

        <div className="language-switcher" aria-label="Language switcher">
          <button
            type="button"
            className={language === 'id' ? 'active' : ''}
            onClick={() => setLanguage('id')}
            aria-pressed={language === 'id'}
          >
            ID
          </button>
          <button
            type="button"
            className={language === 'ja' ? 'active' : ''}
            onClick={() => setLanguage('ja')}
            aria-pressed={language === 'ja'}
          >
            日本語
          </button>
        </div>
      </div>
    </header>
  );
}

export default NavigationBar;
