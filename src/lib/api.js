const API_BASE_URL = process.env.REACT_APP_API_URL || (
  process.env.NODE_ENV === 'production' ? '' : 'http://localhost:4000'
);

export async function fetchJson(path, fallback) {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, { cache: 'no-store' });

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }

    return response.json();
  } catch (_error) {
    return fallback;
  }
}

export async function fetchSite(fallback) {
  return fetchJson('/api/site', fallback);
}

export { API_BASE_URL };
