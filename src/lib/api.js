const isBrowserOnLocalhost = typeof window !== 'undefined'
  && ['localhost', '127.0.0.1'].includes(window.location.hostname);

const API_BASE_URL = process.env.REACT_APP_API_URL || (
  isBrowserOnLocalhost ? 'http://localhost:4000' : ''
);
const translationCache = new Map();

export function resolveMediaUrl(url) {
  if (!url) {
    return '';
  }

  if (/^(https?:)?\/\//i.test(url) || url.startsWith('data:')) {
    return url;
  }

  return `${API_BASE_URL}${url}`;
}

export async function fetchJson(path, fallback) {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, { cache: 'no-store' });

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }

    return await response.json();
  } catch (_error) {
    return fallback;
  }
}

export async function fetchSite(fallback) {
  return fetchJson('/api/site', fallback);
}

function getTranslationCacheKey(source, target, text) {
  return `${source}::${target}::${text}`;
}

export async function translateTexts(texts, options = {}) {
  const source = options.source || 'id';
  const target = options.target || 'ja';
  const normalizedTexts = Array.isArray(texts) ? texts.map((text) => (typeof text === 'string' ? text : '')) : [];

  if (!normalizedTexts.length || source === target) {
    return normalizedTexts;
  }

  const results = new Array(normalizedTexts.length);
  const missingTexts = [];
  const missingIndices = [];

  normalizedTexts.forEach((text, index) => {
    if (!text) {
      results[index] = text;
      return;
    }

    const cacheKey = getTranslationCacheKey(source, target, text);
    if (translationCache.has(cacheKey)) {
      results[index] = translationCache.get(cacheKey);
      return;
    }

    missingTexts.push(text);
    missingIndices.push(index);
  });

  if (missingTexts.length) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/translate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ texts: missingTexts, source, target }),
      });

      if (!response.ok) {
        throw new Error(`Translate request failed: ${response.status}`);
      }

      const payload = await response.json();
      const translatedTexts = Array.isArray(payload.translations) ? payload.translations : [];

      translatedTexts.forEach((translatedText, index) => {
        const originalText = missingTexts[index];
        const cacheKey = getTranslationCacheKey(source, target, originalText);
        const finalText = typeof translatedText === 'string' && translatedText ? translatedText : originalText;
        translationCache.set(cacheKey, finalText);
      });

      missingIndices.forEach((resultIndex, translatedIndex) => {
        const originalText = missingTexts[translatedIndex];
        const cacheKey = getTranslationCacheKey(source, target, originalText);
        results[resultIndex] = translationCache.get(cacheKey) || originalText;
      });
    } catch (_error) {
      return normalizedTexts.map((text, index) => results[index] || translationCache.get(getTranslationCacheKey(source, target, text)) || text);
    }
  }

  return normalizedTexts.map((text, index) => results[index] || translationCache.get(getTranslationCacheKey(source, target, text)) || text);
}

export { API_BASE_URL };
