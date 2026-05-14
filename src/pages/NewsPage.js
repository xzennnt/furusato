import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { fallbackNews, fallbackSite } from '../data/fallbackContent';
import { API_BASE_URL, fetchJson, fetchSite } from '../lib/api';

function NewsPage() {
  const location = useLocation();
  const [newsItems, setNewsItems] = useState(fallbackNews);
  const [site, setSite] = useState(fallbackSite);
  const [expandedNewsId, setExpandedNewsId] = useState('');
  const newsHeroBackground = site.backgrounds?.homeNewsUrl || '';
  const newsHeroStyle = newsHeroBackground
    ? { '--page-hero-bg': `url(${API_BASE_URL}${newsHeroBackground})` }
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
      window.requestAnimationFrame(() => {
        document.querySelector(location.hash)?.scrollIntoView({ block: 'start', behavior: 'smooth' });
      });
    });
  }, [location.hash, newsItems]);

  return (
    <section className="page-section">
      <div className={`page-hero news-page-hero ${newsHeroBackground ? 'has-page-hero-bg' : ''}`} style={newsHeroStyle}>
        <p className="eyebrow">Berita</p>
        <h1>Berita Furusato</h1>
        <p>Beranda / Berita</p>
      </div>

      <div className="news-page-list">
        {newsItems.map((item) => (
          <article className={`sticker-card ${expandedNewsId === item.id ? 'is-expanded' : ''}`} id={item.id} key={item.id}>
            {item.imageUrl && (
              <div className="news-card-media">
                <img className="news-card-image" src={`${API_BASE_URL}${item.imageUrl}`} alt={item.title} />
              </div>
            )}
            <div className="news-card-body">
              <time>{item.date}</time>
              <h2>{item.title}</h2>
              <p>{item.description}</p>
              {expandedNewsId === item.id && (
                <div className="news-content">{item.content}</div>
              )}
              <button
                className="news-expand-button"
                type="button"
                onClick={() => setExpandedNewsId(expandedNewsId === item.id ? '' : item.id)}
              >
                {expandedNewsId === item.id ? 'Tutup berita' : 'Baca selengkapnya'}
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default NewsPage;
