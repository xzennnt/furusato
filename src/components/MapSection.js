const mapsUrl = 'https://maps.app.goo.gl/Z63VmpDGFfvVYGxW7';
const mapsEmbedUrl = 'https://www.google.com/maps?q=-7.298989,110.177072&z=16&output=embed';

function MapSection() {
  return (
    <section id="map" className="map-section">
      <div className="map-copy">
        <p className="eyebrow">Map</p>
        <h2>Lokasi pelatihan yang mudah ditemukan.</h2>
        <p>
          Peta Google Maps ini memakai titik lokasi LPK Furusato. 
          {/* Jika nanti ada lokasi resmi baru, cukup ganti nilai `mapsUrl` dan `mapsEmbedUrl` di file ini. */}
        </p>
        <a href={mapsUrl} target="_blank" rel="noreferrer">
          Buka lokasi
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
