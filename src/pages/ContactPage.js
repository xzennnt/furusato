import { useEffect, useState } from 'react';
import MapSection from '../components/MapSection';
import { fallbackSite } from '../data/fallbackContent';
import { fetchSite } from '../lib/api';
import { useLanguage } from '../i18n/LanguageProvider';

function ContactPage() {
  const [site, setSite] = useState(fallbackSite);
  const { copy } = useLanguage();

  useEffect(() => {
    fetchSite(fallbackSite).then(setSite);
  }, []);

  return (
    <>
      <section className="contact-hero">
        <div>
          <p className="eyebrow">{copy.contactPage.heroEyebrow}</p>
          <h1>{copy.contactPage.heroTitle}</h1>
        </div>
        <div className="contact-card">
          <span>{copy.contactPage.contactLabel}</span>
          <a href={site.whatsapp} target="_blank" rel="noreferrer">WhatsApp</a>
          <a href={`mailto:${site.email}`}>{site.email}</a>
          <a href={`tel:${site.phone}`}>{site.phone}</a>
        </div>
      </section>

      <section className="contact-info-grid">
        <article>
          <span>01</span>
          <h2>{copy.contactPage.addressTitle}</h2>
          <p>{site.address}</p>
          <p>{copy.contactPage.addressDescription}</p>
        </article>
        <article>
          <span>02</span>
          <h2>{copy.contactPage.serviceTitle}</h2>
          <p>{copy.contactPage.serviceDescription}</p>
        </article>
        <article>
          <span>03</span>
          <h2>{copy.contactPage.socialTitle}</h2>
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
