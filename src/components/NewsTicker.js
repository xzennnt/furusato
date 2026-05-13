import { useEffect, useState } from 'react';
import { fallbackNews } from '../data/fallbackContent';
import { fetchJson } from '../lib/api';

function NewsTicker() {
  const [newsItems, setNewsItems] = useState(fallbackNews);
  const tickerItems = [...newsItems, ...newsItems];

  useEffect(() => {
    fetchJson('/api/news', fallbackNews).then(setNewsItems);
  }, []);

  return (
    <div className="news-ticker" aria-label="Berita terbaru">
      <div className="ticker-track">
        {tickerItems.map((item, index) => (
          <span key={`${item.id}-${index}`}>
            {item.date} · {item.title}
          </span>
        ))}
      </div>
    </div>
  );
}

export default NewsTicker;
