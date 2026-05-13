import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fallbackSite } from '../data/fallbackContent';
import { API_BASE_URL, fetchSite } from '../lib/api';

function Footer() {
  const [site, setSite] = useState(fallbackSite);

  useEffect(() => {
    fetchSite(fallbackSite).then(setSite);
  }, []);

  const logoSrc = site.logoUrl ? `${API_BASE_URL}${site.logoUrl}` : '';

  return (
    <footer className="site-footer">
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
        <p>{site.address}</p>
        <div className="footer-socials" aria-label="Sosial media">
          {Object.entries(site.socials || {}).map(([label, url]) => (
            <a key={label} href={url} target="_blank" rel="noreferrer">
              {label}
            </a>
          ))}
        </div>
      </div>

      <div className="footer-column">
        <h2>Perusahaan</h2>
        <Link to="/#tentang">Tentang Furusato</Link>
        <Link to="/#map">Map</Link>
        <Link to="/galeri">Galeri</Link>
        <Link to="/berita">Berita</Link>
      </div>

      <div className="footer-column">
        <h2>Berita</h2>
        <p>Dapatkan informasi terbaru terkait pelatihan, seleksi, dan kegiatan Furusato.</p>
      </div>

      <div className="footer-column">
        <h2>Kontak</h2>
        <a href={`mailto:${site.email}`}>{site.email}</a>
        <a href={`tel:${site.phone}`}>{site.phone}</a>
        <a href={site.whatsapp} target="_blank" rel="noreferrer">WhatsApp</a>
      </div>
    </footer>
  );
}

export default Footer;
