import { Link } from 'react-router-dom';
import { fallbackNews } from '../data/fallbackContent';

function NewsSection() {
  const newsItems = fallbackNews.slice(0, 2);

  return (
    <section id="berita" className="news-section">
      <p className="eyebrow">Berita</p>
      <div>
        <div className="section-heading-row">
          <h2>Informasi terbaru</h2>
          <Link className="text-action" to="/berita">Lihat semua berita</Link>
        </div>
        <div className="news-list">
          {newsItems.map((item) => (
            <article key={item.id}>
              <time>{item.date}</time>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default NewsSection;
