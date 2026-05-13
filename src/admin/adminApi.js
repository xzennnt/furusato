import { API_BASE_URL } from '../lib/api';

export { API_BASE_URL };

const TOKEN_KEY = 'furusato_admin_token';

export function getAdminToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAdminToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearAdminToken() {
  localStorage.removeItem(TOKEN_KEY);
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
    response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
  } catch (_error) {
    throw new Error('Tidak bisa terhubung ke backend. Jalankan server dengan npm.cmd run server.');
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request gagal.' }));
    throw new Error(error.message || 'Request gagal.');
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

export async function updateHomeContent(payload) {
  return request('/api/admin/home-content', {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}
