import { useEffect, useState } from 'react';
import MapSection from '../components/MapSection';
import { fallbackSite } from '../data/fallbackContent';
import { fetchSite } from '../lib/api';

function ContactPage() {
  const [site, setSite] = useState(fallbackSite);

  useEffect(() => {
    fetchSite(fallbackSite).then(setSite);
  }, []);

  return (
    <>
      <section className="contact-hero">
        <div>
          <p className="eyebrow">Kontak Furusato</p>
          <h1>Mari bicara tentang kelas, pendaftaran, dan rencana kerja ke Jepang.</h1>
        </div>
        <div className="contact-card">
          <span>Hubungi Kami</span>
          <a href={site.whatsapp} target="_blank" rel="noreferrer">WhatsApp</a>
          <a href={`mailto:${site.email}`}>{site.email}</a>
          <a href={`tel:${site.phone}`}>{site.phone}</a>
        </div>
      </section>

      <section className="contact-info-grid">
        <article>
          <span>01</span>
          <h2>Alamat</h2>
          <p>{site.address}</p>
        </article>
        <article>
          <span>02</span>
          <h2>Jam Layanan</h2>
          <p>Senin - Sabtu, 09.00 - 17.00. Jadwal dapat disesuaikan melalui admin.</p>
        </article>
        <article>
          <span>03</span>
          <h2>Media Sosial</h2>
          <div className="contact-socials">
            {Object.entries(site.socials || {}).map(([label, url]) => (
              <a key={label} href={url} target="_blank" rel="noreferrer">
                {label}
              </a>
            ))}
          </div>
        </article>
      </section>

      <MapSection />
    </>
  );
}

export default ContactPage;
