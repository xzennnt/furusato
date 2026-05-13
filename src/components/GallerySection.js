import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fallbackGallery } from '../data/fallbackContent';
import { API_BASE_URL, fetchJson } from '../lib/api';

function GallerySection() {
  const [galleryItems, setGalleryItems] = useState(fallbackGallery);
  const marqueeItems = [...galleryItems, ...galleryItems];

  useEffect(() => {
    fetchJson('/api/gallery', fallbackGallery).then(setGalleryItems);
  }, []);

  return (
    <section id="galeri" className="gallery-section shida-gallery">
      <p className="eyebrow">Galeri</p>
      <div className="section-heading-row">
        <h2>Dokumentasi kegiatan Furusato</h2>
        <Link className="text-action" to="/galeri">Lihat semua galeri</Link>
      </div>
      <div className="gallery-marquee" aria-label="Galeri berjalan">
        <div className="gallery-marquee-track">
          {marqueeItems.map((item, index) => (
            <article className="gallery-run-card" key={`${item.id}-${index}`}>
              {item.imageUrl ? (
                <img src={`${API_BASE_URL}${item.imageUrl}`} alt={item.title} />
              ) : (
                <div className="gallery-placeholder image-marker">
                  <span>UPLOAD GAMBAR</span>
                </div>
              )}
              <strong>{item.title}</strong>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default GallerySection;
