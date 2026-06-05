import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fallbackGallery } from '../data/fallbackContent';
import { fetchJson, resolveMediaUrl } from '../lib/api';
import { useLanguage } from '../i18n/LanguageProvider';
import { useTranslatedItems } from '../i18n/useTranslatedItems';

const getGalleryItemId = (id) => `galeri-${id}`;

function GallerySection() {
  const [galleryItems, setGalleryItems] = useState(fallbackGallery);
  const { copy, language } = useLanguage();
  const translatedGalleryItems = useTranslatedItems(galleryItems, ['title'], language);

  useEffect(() => {
    fetchJson('/api/gallery', fallbackGallery).then(setGalleryItems);
  }, []);

  return (
    <section id="galeri" className="gallery-section shida-gallery">
      <p className="eyebrow">{copy.gallery.eyebrow}</p>
      <div className="section-heading-row">
        <h2>{copy.gallery.title}</h2>
        <Link className="text-action" to="/galeri">{copy.gallery.action}</Link>
      </div>
      <div className="gallery-marquee" aria-label="Galeri berjalan">
        <div className="gallery-marquee-track">
          {[...translatedGalleryItems, ...translatedGalleryItems].map((item, index) => {
            const imageSrc = resolveMediaUrl(item.imageUrl);
            const cardContent = (
              <>
                {imageSrc ? (
                  <img src={imageSrc} alt={item.title} />
                ) : (
                  <div className="gallery-placeholder image-marker">
                    <span>{copy.gallery.placeholder}</span>
                  </div>
                )}
                <strong>{item.title}</strong>
              </>
            );

            return (
              <Link
                className="gallery-run-card sticker-card"
                key={`${item.id}-${index}`}
                to={`/galeri#${getGalleryItemId(item.id)}`}
              >
                {cardContent}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default GallerySection;
