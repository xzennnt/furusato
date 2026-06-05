import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fallbackSite } from '../data/fallbackContent';
import { fetchSite, resolveMediaUrl } from '../lib/api';
import { useLanguage } from '../i18n/LanguageProvider';

function HeroSection() {
  const [site, setSite] = useState(fallbackSite);
  const { copy } = useLanguage();
  const heroBackgroundUrl = site.backgrounds?.homeHeroUrl || '';
  const backgroundUrl = resolveMediaUrl(heroBackgroundUrl);

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
      id="home"
      className={`hero-section money-hero ${backgroundUrl ? 'has-hero-bg' : ''}`}
      style={backgroundUrl ? { '--hero-bg': `url(${backgroundUrl})` } : undefined}
    >
      <div className="hero-copy hero-copy--narrow">
        <p className="eyebrow">{copy.hero.eyebrow}</p>
        <h1>{copy.hero.title}</h1>
        <p>{copy.hero.description}</p>
        <div className="hero-actions">
          <a className="primary-action" href="#tentang">{copy.hero.primaryAction}</a>
          <Link className="secondary-action" to="/kontak">{copy.hero.secondaryAction}</Link>
        </div>
      </div>

    </section>
  );
}

export default HeroSection;
