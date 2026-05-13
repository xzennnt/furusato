import { useEffect, useState } from 'react';
import { fallbackHomeContent } from '../data/fallbackContent';
import { API_BASE_URL, fetchJson } from '../lib/api';
import NewsTicker from './NewsTicker';

function HeroSection() {
  const [homeContent, setHomeContent] = useState(fallbackHomeContent);
  const backgroundUrl = homeContent.heroBackgroundUrl
    ? `${API_BASE_URL}${homeContent.heroBackgroundUrl}`
    : '';

  useEffect(() => {
    fetchJson('/api/home-content', fallbackHomeContent).then((data) => {
      setHomeContent({ ...fallbackHomeContent, ...data });
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

      <div className="hero-feature image-marker">
        <div>
          <span className="hero-badge">Berita Terkini</span>
          <h2>Informasi kelas, seleksi, dan kegiatan peserta.</h2>
        </div>
        <NewsTicker />
      </div>
    </section>
  );
}

export default HeroSection;
