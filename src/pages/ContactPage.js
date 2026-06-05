import { useEffect, useState } from 'react';
import { SocialIcon } from '../components/Footer';
import MapSection from '../components/MapSection';
import { fallbackSite } from '../data/fallbackContent';
import { fetchSite, resolveMediaUrl } from '../lib/api';
import { useLanguage } from '../i18n/LanguageProvider';

function ContactPage() {
  const [site, setSite] = useState(fallbackSite);
  const { copy } = useLanguage();
  const contactHeroBackground = site.backgrounds?.contactPageUrl || '';
  const contactHeroStyle = contactHeroBackground
    ? { '--page-hero-bg': `url(${resolveMediaUrl(contactHeroBackground)})` }
    : undefined;
  const socialLinks = Object.entries(site.socials || {}).filter(([, url]) => url);

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
    <section className="page-section contact-page">
      <div
        className={`page-hero contact-page-hero ${contactHeroBackground ? 'has-page-hero-bg' : ''}`}
        style={contactHeroStyle}
      >
        <div className="contact-hero-copy">
          <p className="eyebrow">{copy.contactPage.heroEyebrow}</p>
          <h1>{copy.contactPage.heroTitle}</h1>
        </div>
      </div>

      <section className="contact-info-grid">
        <article>
          <h2>{copy.contactPage.addressTitle}</h2>
          <p className="contact-info-note">{copy.footer.brandNote}</p>
          <p>{site.address}</p>
        </article>
        <article>
          <h2>{copy.footer.contactHeading}</h2>
          <div className="contact-link-list">
            <a href={`mailto:${site.email}`}>{site.email}</a>
            <a href={`tel:${site.phone}`}>{site.phone}</a>
            <a className="contact-icon-link" href={site.whatsapp} target="_blank" rel="noreferrer">
              <SocialIcon name="whatsapp" />
              <span>WhatsApp</span>
            </a>
          </div>
        </article>
        <article>
          <h2>{copy.footer.socialHeading}</h2>
          <div className="contact-socials">
            {socialLinks.map(([label, url]) => (
              <a className="contact-icon-link" key={label} href={url} target="_blank" rel="noreferrer" aria-label={label} title={label}>
                <SocialIcon name={label} />
                {label}
              </a>
            ))}
          </div>
        </article>
      </section>

      <MapSection />
    </section>
  );
}

export default ContactPage;
