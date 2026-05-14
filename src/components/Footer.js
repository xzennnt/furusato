import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fallbackSite } from '../data/fallbackContent';
import { fetchSite, resolveMediaUrl } from '../lib/api';

function SocialIcon({ name }) {
  const iconName = name.toLowerCase();

  if (iconName === 'instagram') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1.1" />
      </svg>
    );
  }

  if (iconName === 'facebook') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M14 8.4h2.2V4.8A14 14 0 0 0 13 4.6c-3.2 0-5.4 1.9-5.4 5.5v3.1H4v4h3.6V23H12v-5.8h3.4l.6-4H12v-2.7c0-1.2.4-2.1 2-2.1Z" />
      </svg>
    );
  }

  if (iconName === 'youtube') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M22 12s0-3.4-.4-5c-.2-.9-.9-1.6-1.8-1.8C18.2 4.8 12 4.8 12 4.8s-6.2 0-7.8.4c-.9.2-1.6.9-1.8 1.8C2 8.6 2 12 2 12s0 3.4.4 5c.2.9.9 1.6 1.8 1.8 1.6.4 7.8.4 7.8.4s6.2 0 7.8-.4c.9-.2 1.6-.9 1.8-1.8.4-1.6.4-5 .4-5Z" />
        <path d="m10 15.3 5.2-3.3L10 8.7v6.6Z" />
      </svg>
    );
  }

  if (iconName === 'tiktok') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M15.4 3c.4 3 2.1 4.9 5 5.1v4.1a8.7 8.7 0 0 1-5-1.5v6.1c0 4-2.7 6.2-6 6.2A6 6 0 0 1 3.3 17c0-3.7 3.4-6.5 7.1-5.6v4.3c-1.6-.5-2.9.4-2.9 1.7 0 1.1.8 1.9 1.9 1.9 1.2 0 2-.7 2-2.5V3h4Z" />
      </svg>
    );
  }

  if (iconName === 'whatsapp') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 3.2a8.7 8.7 0 0 0-7.4 13.3L3.5 21l4.6-1.1A8.7 8.7 0 1 0 12 3.2Z" />
        <path d="M8.7 7.8c.2-.4.4-.4.7-.4h.5c.2 0 .4 0 .6.5l.8 1.9c.1.2.1.4 0 .6l-.5.7c-.2.2-.2.4 0 .6.4.7 1 1.4 1.7 1.9.6.4 1 .6 1.2.4l.8-1c.2-.2.4-.2.7-.1l1.9.9c.3.1.5.3.5.5 0 .6-.4 1.5-.9 1.8-.5.4-1.3.5-2.2.3-1.4-.3-3-1.2-4.3-2.5-1.3-1.2-2.4-2.9-2.7-4.2-.2-.9 0-1.7.4-2.4Z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm4.8 7.2-6 6a1 1 0 0 1-1.4 0l-2.2-2.1 1.4-1.4 1.5 1.4 5.3-5.3 1.4 1.4Z" />
    </svg>
  );
}

function Footer() {
  const [site, setSite] = useState(fallbackSite);

  useEffect(() => {
    fetchSite(fallbackSite).then(setSite);
  }, []);

  const logoSrc = resolveMediaUrl(site.logoUrl);

  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-brand-block">
          <Link className="footer-logo" to="/">
            {logoSrc ? (
              <img src={logoSrc} alt={site.brandName} />
            ) : (
              <>
                <span className="brand-kanji">古里</span>
                <span className="brand-romaji">furusato</span>
              </>
            )}
          </Link>
          <p className="footer-address">{site.address}</p>
        </div>

        <div className="footer-column">
          <h2>Perusahaan</h2>
          <Link to="/#tentang">Tentang Furusato</Link>
          <Link to="/#map">Map</Link>
          <Link to="/galeri">Galeri</Link>
          <Link to="/berita">Berita</Link>
        </div>

        <div className="footer-column footer-news-column">
          <h2>Berita</h2>
          <p>Dapatkan informasi terbaru terkait pelatihan, seleksi, dan kegiatan Furusato.</p>
        </div>

        <div className="footer-column footer-social-column">
          <h2>Sosial Media</h2>
          <div className="footer-socials" aria-label="Sosial media">
            {Object.entries(site.socials || {}).filter(([, url]) => url).map(([label, url]) => (
              <a className="footer-icon-link" key={label} href={url} target="_blank" rel="noreferrer" aria-label={label} title={label}>
                <SocialIcon name={label} />
                <span>{label}</span>
              </a>
            ))}
          </div>
        </div>

        <div className="footer-column footer-contact-column">
          <h2>Kontak</h2>
          <a href={`mailto:${site.email}`}>{site.email}</a>
          <a href={`tel:${site.phone}`}>{site.phone}</a>
          <a className="footer-contact-icon-link" href={site.whatsapp} target="_blank" rel="noreferrer">
            <SocialIcon name="whatsapp" />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>

      <div className="footer-copyright">
        <p>&copy; {new Date().getFullYear()} {site.brandName || 'Furusato'}. All Rights Reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
