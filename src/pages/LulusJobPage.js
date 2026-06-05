import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { fallbackLulusJobs, fallbackSite } from '../data/fallbackContent';
import { fetchJson, fetchSite, resolveMediaUrl } from '../lib/api';
import { useLanguage } from '../i18n/LanguageProvider';
import { useTranslatedItems } from '../i18n/useTranslatedItems';

const getLulusJobItemId = (id) => `lulus-job-${id}`;

function LulusJobPage() {
  const [lulusJobItems, setLulusJobItems] = useState(fallbackLulusJobs);
  const [site, setSite] = useState(fallbackSite);
  const location = useLocation();
  const { copy, language } = useLanguage();
  const translatedLulusJobItems = useTranslatedItems(lulusJobItems, ['origin', 'quote'], language);
  const lulusJobHeroBackground = site.backgrounds?.lulusJobPageUrl || site.backgrounds?.galleryPageUrl || '';
  const lulusJobHeroStyle = lulusJobHeroBackground
    ? { '--page-hero-bg': `url(${resolveMediaUrl(lulusJobHeroBackground)})` }
    : undefined;

  useEffect(() => {
    fetchJson('/api/lulus-job', fallbackLulusJobs).then(setLulusJobItems);
    fetchSite(fallbackSite).then((data) => {
      setSite({
        ...fallbackSite,
        ...data,
        backgrounds: { ...fallbackSite.backgrounds, ...(data.backgrounds || {}) },
      });
    });
  }, []);

  useEffect(() => {
    if (location.hash) {
      window.requestAnimationFrame(() => {
        const target = document.querySelector(location.hash);

        if (!target) {
          return;
        }

        const headerHeight = document.querySelector('.site-header')?.offsetHeight || 0;
        const targetTop = target.getBoundingClientRect().top + window.scrollY - (headerHeight + 24);

        window.scrollTo({ top: Math.max(targetTop, 0), behavior: 'smooth' });
      });
    }
  }, [lulusJobItems, location.hash]);

  return (
    <section className="page-section lulus-job-page">
      <div className={`page-hero ${lulusJobHeroBackground ? 'has-page-hero-bg' : ''}`} style={lulusJobHeroStyle}>
        <p className="eyebrow">{copy.lulusJobPage.eyebrow}</p>
        <h1>{copy.lulusJobPage.title}</h1>
        <p>{copy.lulusJobPage.description}</p>
      </div>

      <div className="lulus-job-grid page-lulus-job-grid">
        {translatedLulusJobItems.map((item) => (
          <article className="gallery-card sticker-card lulus-job-card" id={getLulusJobItemId(item.id)} key={item.id}>
            {item.imageUrl ? (
              <img src={resolveMediaUrl(item.imageUrl)} alt={item.name} />
            ) : (
              <div className="gallery-placeholder image-marker">
                <span>{copy.lulusJobPage.placeholder}</span>
              </div>
            )}
            <div>
              <p className="lulus-job-origin">{item.origin}</p>
              <h3>{item.name}</h3>
              <p>{item.quote}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default LulusJobPage;
