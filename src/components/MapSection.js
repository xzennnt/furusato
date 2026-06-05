import { useLanguage } from '../i18n/LanguageProvider';

const mapsUrl = 'https://maps.app.goo.gl/Z63VmpDGFfvVYGxW7';
const mapsEmbedUrl = 'https://www.google.com/maps?q=-7.298989,110.177072&z=16&output=embed';

function MapSection() {
  const { copy } = useLanguage();

  return (
    <section id="map" className="map-section">
      <div className="map-copy">
        <p className="eyebrow">{copy.map.eyebrow}</p>
        <h2>{copy.map.title}</h2>
        <p>{copy.map.body}</p>
        <a href={mapsUrl} target="_blank" rel="noreferrer">
          {copy.map.action}
        </a>
      </div>
      <iframe
        className="map-frame"
        title="Lokasi Furusato di Google Maps"
        src={mapsEmbedUrl}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
    </section>
  );
}

export default MapSection;
