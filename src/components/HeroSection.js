import { useEffect, useState } from 'react';
import { fallbackSite } from '../data/fallbackContent';
import { API_BASE_URL, fetchSite } from '../lib/api';

function HeroSection() {
  const [site, setSite] = useState(fallbackSite);
  const heroBackgroundUrl = site.backgrounds?.homeHeroUrl || '';
  const backgroundUrl = heroBackgroundUrl
    ? `${API_BASE_URL}${heroBackgroundUrl}`
    : '';

  useEffect(() => {
    fetchSite(fallbackSite).then((data) => {
      setSite({
        ...fallbackSite,
        ...data,
        backgrounds: { ...fallbackSite.backgrounds, ...(data.backgrounds || {}) },
      });
    });
  }, []);

  return (
    <section
      id="home"
      className={`hero-section money-hero ${backgroundUrl ? 'has-hero-bg' : ''}`}
      style={backgroundUrl ? { '--hero-bg': `url(${backgroundUrl})` } : undefined}
    >
      <div className="hero-copy">
        <p className="eyebrow">LPK Furusato</p>
        <h1>Raih mimpi kerja ke Jepang bersama Furusato.</h1>
        <p>
          Kelas bahasa Jepang, pembinaan karakter, budaya kerja, dan persiapan
          seleksi dibuat terarah agar peserta siap memasuki dunia kerja.
        </p>
        <div className="hero-actions">
          <a className="primary-action" href="#tentang">Tentang Furusato</a>
          <a className="secondary-action" href="/kontak">Hubungi Kami</a>
        </div>
      </div>

    </section>
  );
}

export default HeroSection;
