import { useEffect, useState } from 'react';
import { fallbackSite } from '../data/fallbackContent';
import { fetchSite, resolveMediaUrl } from '../lib/api';
import { useLanguage } from '../i18n/LanguageProvider';

function AboutSection() {
  const [site, setSite] = useState(fallbackSite);
  const { copy } = useLanguage();
  const aboutBackgroundUrl = site.backgrounds?.homeAboutUrl || '';
  const backgroundUrl = resolveMediaUrl(aboutBackgroundUrl);

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
    <section
      id="tentang"
      className={`section-grid about-section ${backgroundUrl ? 'has-section-bg' : ''}`}
      style={backgroundUrl ? { '--section-bg': `url(${backgroundUrl})` } : undefined}
    >
      <div>
        <p className="eyebrow">{copy.about.eyebrow}</p>
        <h2>{copy.about.title}</h2>
      </div>
      <div className="editable-note">
        <p>{copy.about.body}</p>
      </div>
    </section>
  );
}

export default AboutSection;
