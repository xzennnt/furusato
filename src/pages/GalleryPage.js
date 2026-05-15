import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { fallbackGallery, fallbackSite } from '../data/fallbackContent';
import { fetchJson, fetchSite, resolveMediaUrl } from '../lib/api';
import { scrollToHashTarget } from '../lib/scroll';

const getGalleryItemId = (id) => `galeri-${id}`;

function GalleryPage() {
  const [galleryItems, setGalleryItems] = useState(fallbackGallery);
  const [site, setSite] = useState(fallbackSite);
  const location = useLocation();
  const galleryHeroBackground = site.backgrounds?.galleryPageUrl || '';
  const galleryHeroStyle = galleryHeroBackground
    ? { '--page-hero-bg': `url(${resolveMediaUrl(galleryHeroBackground)})` }
    : undefined;

  useEffect(() => {
    fetchJson('/api/gallery', fallbackGallery).then(setGalleryItems);
    fetchSite(fallbackSite).then((data) => {
      setSite({
        ...fallbackSite,
        ...data,
        backgrounds: { ...fallbackSite.backgrounds, ...(data.backgrounds || {}) },
      });
    });
  }, []);

  useEffect(() => {
    if (location.hash) {
      window.requestAnimationFrame(() => {
        scrollToHashTarget(location.hash, {
          headerSelector: '.site-header',
          extraOffset: 24,
          maxAttempts: 16,
          delayMs: 60,
        });
      });
    }
  }, [galleryItems, location.hash]);

  return (
    <section className="page-section">
      <div className={`page-hero ${galleryHeroBackground ? 'has-page-hero-bg' : ''}`} style={galleryHeroStyle}>
        <p className="eyebrow">Galeri</p>
        <h1>Dokumentasi ruang belajar dan aktivitas peserta.</h1>
        <p>
          Halaman ini disiapkan untuk menampung foto kegiatan, fasilitas, kelas,
          dan dokumentasi terbaru Furusato dari dashboard admin.
        </p>
      </div>

      <div className="gallery-grid page-gallery-grid">
        {galleryItems.map((item) => (
          <article className="gallery-card sticker-card" id={getGalleryItemId(item.id)} key={item.id}>
            {item.imageUrl ? (
              <img src={resolveMediaUrl(item.imageUrl)} alt={item.title} />
            ) : (
              <div className="gallery-placeholder image-marker">
                <span>UPLOAD GAMBAR</span>
              </div>
            )}
            <div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default GalleryPage;
