const isBrowserOnLocalhost = typeof window !== 'undefined'
  && ['localhost', '127.0.0.1'].includes(window.location.hostname);

const API_BASE_URL = process.env.REACT_APP_API_URL || (
  isBrowserOnLocalhost ? 'http://localhost:4000' : ''
);

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

export { API_BASE_URL };
