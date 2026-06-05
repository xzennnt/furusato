import { useEffect, useState } from 'react';
import { fallbackNews } from '../data/fallbackContent';
import { fetchJson } from '../lib/api';
import { useLanguage } from '../i18n/LanguageProvider';
import { useTranslatedItems } from '../i18n/useTranslatedItems';

function NewsTicker() {
  const [newsItems, setNewsItems] = useState(fallbackNews);
  const { language, copy } = useLanguage();
  const translatedNewsItems = useTranslatedItems(newsItems, ['title'], language);
  const tickerItems = [...translatedNewsItems, ...translatedNewsItems];

  useEffect(() => {
    fetchJson('/api/news', fallbackNews).then(setNewsItems);
  }, []);

  return (
    <div className="news-ticker" aria-label={copy.news.title}>
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
