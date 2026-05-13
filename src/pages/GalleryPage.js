import { useEffect, useState } from 'react';
import { fallbackGallery } from '../data/fallbackContent';
import { API_BASE_URL, fetchJson } from '../lib/api';

function GalleryPage() {
  const [galleryItems, setGalleryItems] = useState(fallbackGallery);

  useEffect(() => {
    fetchJson('/api/gallery', fallbackGallery).then(setGalleryItems);
  }, []);

  return (
    <section className="page-section">
      <div className="page-hero">
        <p className="eyebrow">Galeri</p>
        <h1>Dokumentasi ruang belajar dan aktivitas peserta.</h1>
        <p>
          Halaman ini disiapkan untuk menampung foto kegiatan, fasilitas, kelas,
          dan dokumentasi terbaru Furusato dari dashboard admin.
        </p>
      </div>

      <div className="gallery-grid page-gallery-grid">
        {galleryItems.map((item) => (
          <article className="gallery-card" key={item.id}>
            {item.imageUrl ? (
              <img src={`${API_BASE_URL}${item.imageUrl}`} alt={item.title} />
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
