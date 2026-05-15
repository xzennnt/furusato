import { API_BASE_URL } from '../lib/api';

export { API_BASE_URL };

const TOKEN_KEY = 'furusato_admin_token';
const ADMIN_SESSION_SECONDS = 20 * 60;

function getCookie(name) {
  const cookie = document.cookie
    .split('; ')
    .find((item) => item.startsWith(`${name}=`));

  return cookie ? decodeURIComponent(cookie.split('=').slice(1).join('=')) : '';
}

function setAdminCookie(token) {
  document.cookie = `${TOKEN_KEY}=${encodeURIComponent(token)}; max-age=${ADMIN_SESSION_SECONDS}; path=/; samesite=lax`;
}

function clearAdminCookie() {
  document.cookie = `${TOKEN_KEY}=; max-age=0; path=/; samesite=lax`;
}

export function getAdminToken() {
  const token = getCookie(TOKEN_KEY);

  if (token) {
    return token;
  }

  const legacySessionToken = sessionStorage.getItem(TOKEN_KEY);

  if (legacySessionToken) {
    setAdminCookie(legacySessionToken);
    sessionStorage.removeItem(TOKEN_KEY);
    return legacySessionToken;
  }

  return '';
}

export function setAdminToken(token) {
  localStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
  setAdminCookie(token);
}

export function clearAdminToken() {
  localStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
  clearAdminCookie();
}

export function refreshAdminSession() {
  const token = getAdminToken();

  if (token) {
    setAdminCookie(token);
  }
}

export function isAdminLoggedIn() {
  return Boolean(getAdminToken());
}

async function request(path, options = {}) {
  const headers = {
    ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
    ...(getAdminToken() ? { Authorization: `Bearer ${getAdminToken()}` } : {}),
    ...options.headers,
  };

  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, { cache: 'no-store', ...options, headers });
  } catch (_error) {
    if (getAdminToken()) {
      clearAdminToken();
    }
    throw new Error('Tidak bisa terhubung ke backend. Jalankan server dengan npm.cmd run server.');
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request gagal.' }));
    if (response.status === 401) {
      clearAdminToken();
    }
    throw new Error(error.message || 'Request gagal.');
  }

  if (getAdminToken()) {
    refreshAdminSession();
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export async function loginAdmin(credentials) {
  return request('/api/admin/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}

export async function getNews() {
  return request('/api/news');
}

export async function createNews(payload) {
  return request('/api/admin/news', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function updateNews(id, payload) {
  return request(`/api/admin/news/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export async function deleteNews(id) {
  return request(`/api/admin/news/${id}`, { method: 'DELETE' });
}

export async function getGallery() {
  return request('/api/gallery');
}

export async function getLulusJobs() {
  return request('/api/lulus-job');
}

export async function createGallery(payload) {
  return request('/api/admin/gallery', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function updateGallery(id, payload) {
  return request(`/api/admin/gallery/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export async function deleteGallery(id) {
  return request(`/api/admin/gallery/${id}`, { method: 'DELETE' });
}

export async function createLulusJob(payload) {
  return request('/api/admin/lulus-job', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function updateLulusJob(id, payload) {
  return request(`/api/admin/lulus-job/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export async function deleteLulusJob(id) {
  return request(`/api/admin/lulus-job/${id}`, { method: 'DELETE' });
}

export async function uploadImage(file) {
  const formData = new FormData();
  formData.append('image', file);

  return request('/api/admin/upload', {
    method: 'POST',
    body: formData,
  });
}

export async function getAdminAccount() {
  return request('/api/admin/account');
}

export async function updateAdminAccount(payload) {
  return request('/api/admin/account', {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export async function getSiteSettings() {
  return request('/api/site');
}

export async function updateSiteSettings(payload) {
  return request('/api/admin/site', {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export async function getHomeContent() {
  return request('/api/home-content');
}

export async function getAboutContent() {
  return request('/api/about-content');
}

export async function updateHomeContent(payload) {
  return request('/api/admin/home-content', {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export async function updateJobBanner(payload) {
  return request('/api/admin/home-content/job-banner', {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export async function updateAboutContent(payload) {
  return request('/api/admin/about-content', {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}
