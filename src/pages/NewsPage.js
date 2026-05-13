import { useEffect, useState } from 'react';
import { fallbackNews } from '../data/fallbackContent';
import { fetchJson } from '../lib/api';

function NewsPage() {
  const [newsItems, setNewsItems] = useState(fallbackNews);

  useEffect(() => {
    fetchJson('/api/news', fallbackNews).then(setNewsItems);
  }, []);

  return (
    <section className="page-section">
      <div className="page-hero">
        <p className="eyebrow">Berita</p>
        <h1>Pengumuman, agenda, dan kabar terbaru Furusato.</h1>
        <p>
          Halaman ini disiapkan agar konten berita dapat terus ditambah melalui
          backend Node.js tanpa mengubah kode homepage.
        </p>
      </div>

      <div className="news-page-list">
        {newsItems.map((item) => (
          <article key={item.id}>
            <time>{item.date}</time>
            <h2>{item.title}</h2>
            <p>{item.description}</p>
            <div className="news-content">{item.content}</div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default NewsPage;
