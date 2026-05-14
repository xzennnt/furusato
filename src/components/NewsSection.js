import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fallbackNews, fallbackSite } from '../data/fallbackContent';
import { fetchJson, fetchSite, resolveMediaUrl } from '../lib/api';

function NewsSection() {
  const [site, setSite] = useState(fallbackSite);
  const [newsItems, setNewsItems] = useState(fallbackNews.slice(0, 2));
  const newsBackgroundUrl = site.backgrounds?.homeNewsUrl || '';
  const backgroundUrl = resolveMediaUrl(newsBackgroundUrl);

  useEffect(() => {
    fetchSite(fallbackSite).then((data) => {
      setSite({
        ...fallbackSite,
        ...data,
        backgrounds: { ...fallbackSite.backgrounds, ...(data.backgrounds || {}) },
      });
    });
    fetchJson('/api/news', fallbackNews).then((items) => {
      setNewsItems(items.slice(0, 2));
    });
  }, []);

  return (
    <section
      id="berita"
      className={`news-section ${backgroundUrl ? 'has-section-bg' : ''}`}
      style={backgroundUrl ? { '--section-bg': `url(${backgroundUrl})` } : undefined}
    >
      <p className="eyebrow">Berita</p>
      <div>
        <div className="section-heading-row">
          <h2>Informasi terbaru</h2>
          <Link className="text-action" to="/berita">Lihat semua berita</Link>
        </div>
        <div className="news-list">
          {newsItems.map((item) => (
            <article className={`news-home-card sticker-card ${item.imageUrl ? 'has-news-thumb' : ''}`} key={item.id}>
              {item.imageUrl && (
                <img
                  className="news-home-thumb"
                  src={resolveMediaUrl(item.imageUrl)}
                  alt={item.title}
                />
              )}
              <div className="news-home-copy">
                <time>{item.date}</time>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default NewsSection;
