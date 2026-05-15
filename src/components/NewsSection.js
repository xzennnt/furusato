import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fallbackNews, fallbackSite } from '../data/fallbackContent';
import { fetchJson, fetchSite, resolveMediaUrl } from '../lib/api';

function sleep(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function NewsSection() {
  const [site, setSite] = useState(fallbackSite);
  const [newsItems, setNewsItems] = useState(fallbackNews.slice(0, 2));
  const newsBackgroundUrl = site.backgrounds?.homeNewsUrl || '';
  const backgroundUrl = resolveMediaUrl(newsBackgroundUrl);

  useEffect(() => {
    let cancelled = false;

    const refreshNews = async () => {
      const delays = [0, 2500, 5000, 10000];

      for (let index = 0; index < delays.length; index += 1) {
        if (index > 0) {
          await sleep(delays[index]);
        }

        if (cancelled) {
          return;
        }

        const items = await fetchJson('/api/news', fallbackNews);

        if (cancelled) {
          return;
        }

        setNewsItems(items.slice(0, 2));
      }
    };

    fetchSite(fallbackSite).then((data) => {
      setSite({
        ...fallbackSite,
        ...data,
        backgrounds: { ...fallbackSite.backgrounds, ...(data.backgrounds || {}) },
      });
    });

    refreshNews();

    return () => {
      cancelled = true;
    };
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
