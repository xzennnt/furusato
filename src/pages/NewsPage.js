import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { fallbackNews, fallbackSite } from '../data/fallbackContent';
import { fetchJson, fetchSite, resolveMediaUrl } from '../lib/api';
import { useLanguage } from '../i18n/LanguageProvider';
import { useTranslatedItems } from '../i18n/useTranslatedItems';
import { scrollToHashTarget } from '../lib/scroll';

function stripLinkInformation(content = '') {
  return String(content)
    .split('\n')
    .filter((line) => !/^Link informasi:\s*/i.test(line.trim()))
    .join('\n')
    .trim();
}

function NewsPage() {
  const location = useLocation();
  const [newsItems, setNewsItems] = useState(fallbackNews);
  const [site, setSite] = useState(fallbackSite);
  const [expandedNewsId, setExpandedNewsId] = useState('');
  const { copy, language } = useLanguage();
  const translatedNewsItems = useTranslatedItems(newsItems, ['title', 'description', 'content'], language);
  const newsHeroBackground = site.backgrounds?.homeNewsUrl || '';
  const newsHeroStyle = newsHeroBackground
    ? { '--page-hero-bg': `url(${resolveMediaUrl(newsHeroBackground)})` }
    : undefined;

  useEffect(() => {
    fetchJson('/api/news', fallbackNews).then((items) => {
      setNewsItems(items);
      setExpandedNewsId(location.hash.replace('#', '') || '');
    });
    fetchSite(fallbackSite).then((data) => {
      setSite({
        ...fallbackSite,
        ...data,
        backgrounds: { ...fallbackSite.backgrounds, ...(data.backgrounds || {}) },
      });
    });
  }, [location.hash]);

  useEffect(() => {
    if (!location.hash) {
      return;
    }

    window.requestAnimationFrame(() => {
      scrollToHashTarget(location.hash, {
        headerSelector: '.site-header',
        extraOffset: 24,
        maxAttempts: 16,
        delayMs: 60,
      });
    });
  }, [location.hash, newsItems]);

  return (
    <section className="page-section">
      <div className={`page-hero news-page-hero ${newsHeroBackground ? 'has-page-hero-bg' : ''}`} style={newsHeroStyle}>
        <p className="eyebrow">{copy.newsPage.eyebrow}</p>
        <h1>{copy.newsPage.title}</h1>
        <p>{copy.newsPage.breadcrumb}</p>
      </div>

      <div className="news-page-list">
        {translatedNewsItems.map((item) => (
          <article className={`sticker-card ${expandedNewsId === item.id ? 'is-expanded' : ''}`} id={item.id} key={item.id}>
            {item.imageUrl && (
              <div className="news-card-media">
                <img className="news-card-image" src={resolveMediaUrl(item.imageUrl)} alt={item.title} />
              </div>
            )}
            <div className="news-card-body">
              <time>{item.date}</time>
              <h2>{item.title}</h2>
              <p>{item.description}</p>
                {expandedNewsId === item.id && (
                  <div className="news-content">{stripLinkInformation(item.content)}</div>
                )}
              <button
                className="news-expand-button"
                type="button"
                onClick={() => setExpandedNewsId(expandedNewsId === item.id ? '' : item.id)}
              >
                {expandedNewsId === item.id ? copy.newsPage.closeAction : copy.newsPage.readAction}
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default NewsPage;
