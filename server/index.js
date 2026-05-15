require('dotenv').config();

const cors = require('cors');
const crypto = require('crypto');
const express = require('express');
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const { del, put } = require('@vercel/blob');
const {
  readAccounts,
  readContent,
  readSite,
  getStorageStatus,
  writeAccounts,
  writeContent,
  writeSite,
} = require('./storage');

const app = express();
const port = process.env.PORT || 4000;
const host = process.env.HOST || '0.0.0.0';
const uploadDir = path.join(__dirname, 'uploads');
const buildPath = path.join(__dirname, '..', 'build');
const buildIndexPath = path.join(buildPath, 'index.html');
const ADMIN_SESSION_MS = 20 * 60 * 1000;
const MAX_UPLOAD_BYTES = Number(process.env.MAX_UPLOAD_BYTES || 8 * 1024 * 1024);
const requestedUploadDriver = (process.env.UPLOAD_DRIVER || '').toLowerCase();
const uploadDriver = requestedUploadDriver === 'local'
  ? 'local'
  : (process.env.VERCEL ? 'blob' : 'local');
const blobAccess = process.env.BLOB_ACCESS || 'public';
const fallbackLulusJobs = [
  {
    id: 'lulus-job-001',
    name: 'Siswa Lulus 1',
    origin: 'Temanggung',
    quote: 'Terima kasih Furusato, saya jadi lebih siap bekerja dan lebih percaya diri.',
    imageUrl: '',
  },
  {
    id: 'lulus-job-002',
    name: 'Siswa Lulus 2',
    origin: 'Wonosobo',
    quote: 'Pembinaan dan latihan di Furusato membantu saya sampai ke tahap kerja.',
    imageUrl: '',
  },
  {
    id: 'lulus-job-003',
    name: 'Siswa Lulus 3',
    origin: 'Magelang',
    quote: 'Ilmu bahasa dan budaya kerja sangat berguna saat memasuki dunia kerja Jepang.',
    imageUrl: '',
  },
];

if (uploadDriver === 'local') {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const diskStorage = multer.diskStorage({
  destination: uploadDir,
  filename: (_req, file, callback) => {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '-');
    callback(null, `${Date.now()}-${safeName}`);
  },
});

const upload = multer({
  storage: uploadDriver === 'blob' ? multer.memoryStorage() : diskStorage,
  limits: {
    fileSize: MAX_UPLOAD_BYTES,
  },
});

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadDir));

const asyncHandler = (handler) => (req, res, next) => {
  Promise.resolve(handler(req, res, next)).catch(next);
};

function base64UrlEncode(data) {
  return Buffer.from(data).toString('base64url');
}

function base64UrlDecode(data) {
  return Buffer.from(data, 'base64url').toString('utf8');
}

function isRemoteBlobUrl(urlOrPathname) {
  return Boolean(urlOrPathname) && /^https?:\/\//i.test(urlOrPathname);
}

async function deleteStoredImage(urlOrPathname) {
  if (!urlOrPathname) {
    return;
  }

  try {
    if (uploadDriver === 'blob' && isRemoteBlobUrl(urlOrPathname)) {
      await del(urlOrPathname, {
        token: process.env.BLOB_READ_WRITE_TOKEN,
      });
      return;
    }

    if (urlOrPathname.startsWith('/uploads/')) {
      const localFilePath = path.join(uploadDir, path.basename(urlOrPathname));

      if (fs.existsSync(localFilePath)) {
        await fs.promises.unlink(localFilePath);
      }
    }
  } catch (error) {
    console.warn('Gagal menghapus file gambar lama:', error.message || error);
  }
}

function getAdminTokenSecret() {
  return process.env.ADMIN_TOKEN_SECRET || process.env.ADMIN_PASSWORD || 'furusato-admin-token-secret';
}

function signTokenPayload(payload) {
  return crypto
    .createHmac('sha256', getAdminTokenSecret())
    .update(payload)
    .digest('base64url');
}

function createAdminToken(username) {
  const payload = base64UrlEncode(JSON.stringify({
    username,
    exp: Date.now() + ADMIN_SESSION_MS,
  }));
  const signature = signTokenPayload(payload);

  return `${payload}.${signature}`;
}

function verifyAdminToken(token) {
  const [payload, signature] = token.split('.');

  if (!payload || !signature) {
    return false;
  }

  const expectedSignature = signTokenPayload(payload);

  if (Buffer.byteLength(signature) !== Buffer.byteLength(expectedSignature)) {
    return false;
  }

  if (
    !crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature),
    )
  ) {
    return false;
  }

  try {
    const data = JSON.parse(base64UrlDecode(payload));
    return data.exp > Date.now();
  } catch (_error) {
    return false;
  }
}

app.use('/api', (_req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});

if (!fs.existsSync(buildIndexPath)) {
  app.get('/', (_req, res) => {
    res.json({
      message: 'Furusato backend berjalan.',
      frontend: 'Buka http://localhost:3000 untuk melihat website.',
      production: 'Jalankan npm run build agar backend bisa menyajikan website React.',
      endpoints: ['/api/health', '/api/news', '/api/gallery', '/api/lulus-job'],
    });
  });
}

function requireAdmin(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token || !verifyAdminToken(token)) {
    return res.status(401).json({ message: 'Akses admin diperlukan.' });
  }

  return next();
}

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'furusato-api',
    storage: getStorageStatus(),
    uploadDriver,
    blobConfigured: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
  });
});

app.get('/api/news', asyncHandler(async (_req, res) => {
  const content = await readContent();
  res.json((content.news || []).map((item) => ({
    imageUrl: '',
    source: '',
    ...item,
  })));
}));

app.get('/api/gallery', asyncHandler(async (_req, res) => {
  const content = await readContent();
  res.json(content.gallery);
}));

app.get('/api/lulus-job', asyncHandler(async (_req, res) => {
  const content = await readContent();
  if (Object.prototype.hasOwnProperty.call(content, 'lulusJobs')) {
    return res.json(content.lulusJobs || []);
  }

  return res.json(fallbackLulusJobs);
}));

app.get('/api/home-content', asyncHandler(async (_req, res) => {
  const content = await readContent();
  res.json({
    heroBackgroundUrl: content.heroBackgroundUrl || '',
    jobInfo: content.jobInfo || {},
    jobBanner: content.jobBanner || {},
    partners: content.partners || [],
  });
}));

app.get('/api/about-content', asyncHandler(async (_req, res) => {
  const content = await readContent();
  res.json(content.aboutContent || {});
}));

app.get('/api/site', asyncHandler(async (_req, res) => {
  res.json(await readSite());
}));

app.get('/api/share-image', asyncHandler(async (_req, res) => {
  const site = await readSite();
  const shareImageUrl = site.logoUrl || '/favicon.svg';

  if (/^https?:\/\//i.test(shareImageUrl)) {
    return res.redirect(302, shareImageUrl);
  }

  return res.redirect(302, shareImageUrl.startsWith('/') ? shareImageUrl : `/${shareImageUrl}`);
}));

app.get('/api/share-preview', asyncHandler(async (_req, res) => {
  const site = await readSite();
  const logoUrl = site.logoUrl || '';

  res.set('Cache-Control', 'no-store, max-age=0');

  const fallbackSvg = `<?xml version="1.0" encoding="UTF-8"?>
  <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" role="img" aria-label="LPK FURUSATO TEMANGGUNG">
    <rect width="1200" height="630" fill="#111827"/>
    <rect x="64" y="64" width="1072" height="502" rx="32" fill="#1f2937" stroke="#374151" stroke-width="2"/>
    <text x="116" y="170" fill="#f3f4f6" font-family="Arial, Helvetica, sans-serif" font-size="36" font-weight="700">LPK FURUSATO TEMANGGUNG</text>
    <text x="116" y="236" fill="#60a5fa" font-family="Arial, Helvetica, sans-serif" font-size="52" font-weight="700">LPK FURUSATO TEMANGGUNG</text>
    <text x="116" y="288" fill="#93c5fd" font-family="Arial, Helvetica, sans-serif" font-size="32" font-weight="700">Lembaga Pelatihan Kerja Bahasa Jepang</text>
    <text x="116" y="354" fill="#e5e7eb" font-family="Arial, Helvetica, sans-serif" font-size="28">Furusato Temanggung adalah lembaga pelatihan kerja bahasa Jepang</text>
    <text x="116" y="398" fill="#e5e7eb" font-family="Arial, Helvetica, sans-serif" font-size="28">yang membekali peserta dengan kemampuan bahasa, disiplin, dan kesiapan</text>
    <text x="116" y="442" fill="#e5e7eb" font-family="Arial, Helvetica, sans-serif" font-size="28">kerja untuk Jepang.</text>
  </svg>`;

  if (!logoUrl) {
    res.type('image/svg+xml');
    return res.send(fallbackSvg);
  }

  const isAbsoluteUrl = /^https?:\/\//i.test(logoUrl);
  const logoPath = logoUrl.startsWith('/') ? path.join(uploadDir, path.basename(logoUrl)) : null;

  try {
    if (logoPath && fs.existsSync(logoPath)) {
      const fileBuffer = await fs.promises.readFile(logoPath);
      const ext = path.extname(logoPath).toLowerCase();
      res.type(ext === '.svg' ? 'image/svg+xml' : 'image/png');
      return res.send(fileBuffer);
    }

    if (isAbsoluteUrl) {
      const response = await fetch(logoUrl);

      if (!response.ok) {
        throw new Error(`Failed to fetch logo: ${response.status}`);
      }

      const contentType = response.headers.get('content-type') || 'image/png';
      const buffer = Buffer.from(await response.arrayBuffer());
      res.type(contentType);
      return res.send(buffer);
    }
  } catch (error) {
    console.warn('Gagal menyiapkan social preview image:', error.message || error);
  }

  res.type('image/svg+xml');
  return res.send(fallbackSvg);
}));

app.post('/api/admin/login', asyncHandler(async (req, res) => {
  const accounts = await readAccounts();
  const username = process.env.ADMIN_USERNAME || accounts.admin.username;
  const password = process.env.ADMIN_PASSWORD || accounts.admin.password;

  if (req.body.username === username && req.body.password === password) {
    const token = createAdminToken(username);
    return res.json({ token });
  }

  return res.status(401).json({ message: 'Username atau password salah.' });
}));

app.get('/api/admin/account', requireAdmin, asyncHandler(async (_req, res) => {
  const accounts = await readAccounts();
  res.json({ username: accounts.admin.username });
}));

app.put('/api/admin/account', requireAdmin, asyncHandler(async (req, res) => {
  const username = req.body.username?.trim();
  const password = req.body.password?.trim();

  if (!username || !password) {
    return res.status(400).json({ message: 'Username dan password wajib diisi.' });
  }

  const accounts = await readAccounts();
  accounts.admin = { username, password };
  await writeAccounts(accounts);

  return res.json({ username });
}));

app.put('/api/admin/site', requireAdmin, asyncHandler(async (req, res) => {
  const currentSite = await readSite();
  const nextSite = {
    ...currentSite,
    ...req.body,
    backgrounds: {
      ...(currentSite.backgrounds || {}),
      ...(req.body.backgrounds || {}),
    },
    socials: {
      ...currentSite.socials,
      ...(req.body.socials || {}),
    },
  };

  await writeSite(nextSite);
  return res.json(nextSite);
}));

app.put('/api/admin/home-content', requireAdmin, asyncHandler(async (req, res) => {
  const content = await readContent();

  if (Object.prototype.hasOwnProperty.call(req.body, 'heroBackgroundUrl')) {
    content.heroBackgroundUrl = req.body.heroBackgroundUrl || '';
  }

  content.jobInfo = {
    ...(content.jobInfo || {}),
    ...(req.body.jobInfo || {}),
  };
  content.jobBanner = {
    ...(content.jobBanner || {}),
    ...(req.body.jobBanner || {}),
  };
  content.partners = req.body.partners || content.partners || [];
  await writeContent(content);

  return res.json({
    heroBackgroundUrl: content.heroBackgroundUrl,
    jobInfo: content.jobInfo,
    jobBanner: content.jobBanner,
    partners: content.partners,
  });
}));

app.put('/api/admin/home-content/job-banner', requireAdmin, asyncHandler(async (req, res) => {
  const content = await readContent();
  content.jobInfo = {
    ...(content.jobInfo || {}),
    ...(req.body.jobInfo || {}),
  };
  content.jobBanner = {
    ...(content.jobBanner || {}),
    ...(req.body.jobBanner || {}),
  };
  await writeContent(content);

  return res.json({
    heroBackgroundUrl: content.heroBackgroundUrl || '',
    jobInfo: content.jobInfo || {},
    jobBanner: content.jobBanner || {},
    partners: content.partners || [],
  });
}));

app.put('/api/admin/about-content', requireAdmin, asyncHandler(async (req, res) => {
  const content = await readContent();
  content.aboutContent = {
    ...(content.aboutContent || {}),
    ...req.body,
    profile: {
      ...(content.aboutContent?.profile || {}),
      ...(req.body.profile || {}),
    },
    chairman: {
      ...(content.aboutContent?.chairman || {}),
      ...(req.body.chairman || {}),
    },
    visionMission: {
      ...(content.aboutContent?.visionMission || {}),
      ...(req.body.visionMission || {}),
    },
    programs: req.body.programs || content.aboutContent?.programs || [],
    slogan: {
      ...(content.aboutContent?.slogan || {}),
      ...(req.body.slogan || {}),
    },
  };
  await writeContent(content);
  return res.json(content.aboutContent);
}));

app.post('/api/admin/news', requireAdmin, asyncHandler(async (req, res) => {
  if (req.body?.action === 'update' && req.body.id) {
    const content = await readContent();
    const index = content.news.findIndex((item) => item.id === req.body.id);

    if (index === -1) {
      return res.status(404).json({ message: 'Berita tidak ditemukan.' });
    }

    const currentItem = content.news[index];
    const nextImageUrl = req.body.imageUrl ?? currentItem.imageUrl ?? '';

    content.news[index] = {
      imageUrl: '',
      source: '',
      ...currentItem,
      ...req.body,
      imageUrl: nextImageUrl,
      id: req.body.id,
    };

    if (currentItem.imageUrl && currentItem.imageUrl !== nextImageUrl) {
      await deleteStoredImage(currentItem.imageUrl);
    }

    await writeContent(content);
    return res.json(content.news[index]);
  }

  if (req.body?.action === 'delete' && req.body.id) {
    const content = await readContent();
    const currentItem = content.news.find((item) => item.id === req.body.id);

    if (currentItem?.imageUrl) {
      await deleteStoredImage(currentItem.imageUrl);
    }

    content.news = content.news.filter((item) => item.id !== req.body.id);
    await writeContent(content);
    return res.status(204).send();
  }

  const content = await readContent();
  const imageUrl = req.body.imageUrl || (
    req.body.source === 'job-banner' ? content.jobBanner?.imageUrl || '' : ''
  );
  const item = {
    id: `news-${Date.now()}`,
    date: req.body.date || new Date().toISOString().slice(0, 10),
    title: req.body.title || 'Judul berita baru',
    description: req.body.description || '',
    content: req.body.content || '',
    imageUrl,
    source: req.body.source || '',
  };

  content.news.unshift(item);
  await writeContent(content);
  res.status(201).json(item);
}));

app.put('/api/admin/news/:id', requireAdmin, asyncHandler(async (req, res) => {
  const content = await readContent();
  const index = content.news.findIndex((item) => item.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ message: 'Berita tidak ditemukan.' });
  }

  const currentItem = content.news[index];
  const nextImageUrl = req.body.imageUrl ?? currentItem.imageUrl ?? '';

  content.news[index] = {
    imageUrl: '',
    source: '',
    ...currentItem,
    ...req.body,
    imageUrl: nextImageUrl,
    id: req.params.id,
  };

  if (currentItem.imageUrl && currentItem.imageUrl !== nextImageUrl) {
    await deleteStoredImage(currentItem.imageUrl);
  }

  await writeContent(content);
  return res.json(content.news[index]);
}));

app.post('/api/admin/news/:id', requireAdmin, asyncHandler(async (req, res) => {
  const content = await readContent();
  const index = content.news.findIndex((item) => item.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ message: 'Berita tidak ditemukan.' });
  }

  const currentItem = content.news[index];
  const nextImageUrl = req.body.imageUrl ?? currentItem.imageUrl ?? '';

  content.news[index] = {
    imageUrl: '',
    source: '',
    ...currentItem,
    ...req.body,
    imageUrl: nextImageUrl,
    id: req.params.id,
  };

  if (currentItem.imageUrl && currentItem.imageUrl !== nextImageUrl) {
    await deleteStoredImage(currentItem.imageUrl);
  }

  await writeContent(content);
  return res.json(content.news[index]);
}));

app.post('/api/admin/news/:id/delete', requireAdmin, asyncHandler(async (req, res) => {
  const content = await readContent();
  const currentItem = content.news.find((item) => item.id === req.params.id);

  if (currentItem?.imageUrl) {
    await deleteStoredImage(currentItem.imageUrl);
  }

  content.news = content.news.filter((item) => item.id !== req.params.id);
  await writeContent(content);
  res.status(204).send();
}));

app.delete('/api/admin/news/:id', requireAdmin, asyncHandler(async (req, res) => {
  const content = await readContent();
  const currentItem = content.news.find((item) => item.id === req.params.id);

  if (currentItem?.imageUrl) {
    await deleteStoredImage(currentItem.imageUrl);
  }

  content.news = content.news.filter((item) => item.id !== req.params.id);
  await writeContent(content);
  res.status(204).send();
}));

app.post('/api/admin/gallery', requireAdmin, asyncHandler(async (req, res) => {
  if (req.body?.action === 'update' && req.body.id) {
    const content = await readContent();
    const index = content.gallery.findIndex((item) => item.id === req.body.id);

    if (index === -1) {
      return res.status(404).json({ message: 'Galeri tidak ditemukan.' });
    }

    const currentItem = content.gallery[index];
    const nextImageUrl = req.body.imageUrl ?? currentItem.imageUrl ?? '';

    content.gallery[index] = { ...currentItem, ...req.body, imageUrl: nextImageUrl, id: req.body.id };

    if (currentItem.imageUrl && currentItem.imageUrl !== nextImageUrl) {
      await deleteStoredImage(currentItem.imageUrl);
    }

    await writeContent(content);
    return res.json(content.gallery[index]);
  }

  if (req.body?.action === 'delete' && req.body.id) {
    const content = await readContent();
    const currentItem = content.gallery.find((item) => item.id === req.body.id);

    if (currentItem?.imageUrl) {
      await deleteStoredImage(currentItem.imageUrl);
    }

    content.gallery = content.gallery.filter((item) => item.id !== req.body.id);
    await writeContent(content);
    return res.status(204).send();
  }

  const content = await readContent();
  const item = {
    id: `gallery-${Date.now()}`,
    title: req.body.title || 'Galeri baru',
    description: req.body.description || '',
    imageUrl: req.body.imageUrl || '',
  };

  content.gallery.unshift(item);
  await writeContent(content);
  res.status(201).json(item);
}));

app.put('/api/admin/gallery/:id', requireAdmin, asyncHandler(async (req, res) => {
  const content = await readContent();
  const index = content.gallery.findIndex((item) => item.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ message: 'Galeri tidak ditemukan.' });
  }

  const currentItem = content.gallery[index];
  const nextImageUrl = req.body.imageUrl ?? currentItem.imageUrl ?? '';

  content.gallery[index] = { ...currentItem, ...req.body, imageUrl: nextImageUrl, id: req.params.id };

  if (currentItem.imageUrl && currentItem.imageUrl !== nextImageUrl) {
    await deleteStoredImage(currentItem.imageUrl);
  }

  await writeContent(content);
  return res.json(content.gallery[index]);
}));

app.post('/api/admin/gallery/:id', requireAdmin, asyncHandler(async (req, res) => {
  const content = await readContent();
  const index = content.gallery.findIndex((item) => item.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ message: 'Galeri tidak ditemukan.' });
  }

  const currentItem = content.gallery[index];
  const nextImageUrl = req.body.imageUrl ?? currentItem.imageUrl ?? '';

  content.gallery[index] = { ...currentItem, ...req.body, imageUrl: nextImageUrl, id: req.params.id };

  if (currentItem.imageUrl && currentItem.imageUrl !== nextImageUrl) {
    await deleteStoredImage(currentItem.imageUrl);
  }

  await writeContent(content);
  return res.json(content.gallery[index]);
}));

app.post('/api/admin/gallery/:id/delete', requireAdmin, asyncHandler(async (req, res) => {
  const content = await readContent();
  const currentItem = content.gallery.find((item) => item.id === req.params.id);

  if (currentItem?.imageUrl) {
    await deleteStoredImage(currentItem.imageUrl);
  }

  content.gallery = content.gallery.filter((item) => item.id !== req.params.id);
  await writeContent(content);
  res.status(204).send();
}));

app.delete('/api/admin/gallery/:id', requireAdmin, asyncHandler(async (req, res) => {
  const content = await readContent();
  const currentItem = content.gallery.find((item) => item.id === req.params.id);

  if (currentItem?.imageUrl) {
    await deleteStoredImage(currentItem.imageUrl);
  }

  content.gallery = content.gallery.filter((item) => item.id !== req.params.id);
  await writeContent(content);
  res.status(204).send();
}));

app.post('/api/admin/lulus-job', requireAdmin, asyncHandler(async (req, res) => {
  if (req.body?.action === 'update' && req.body.id) {
    const content = await readContent();
    const index = (content.lulusJobs || []).findIndex((item) => item.id === req.body.id);

    if (index === -1) {
      return res.status(404).json({ message: 'Data siswa lulus job tidak ditemukan.' });
    }

    const currentItem = content.lulusJobs[index];
    const nextImageUrl = req.body.imageUrl ?? currentItem.imageUrl ?? '';

    content.lulusJobs[index] = {
      ...currentItem,
      ...req.body,
      imageUrl: nextImageUrl,
      id: req.body.id,
    };

    if (currentItem.imageUrl && currentItem.imageUrl !== nextImageUrl) {
      await deleteStoredImage(currentItem.imageUrl);
    }

    await writeContent(content);
    return res.json(content.lulusJobs[index]);
  }

  if (req.body?.action === 'delete' && req.body.id) {
    const content = await readContent();
    const currentItem = (content.lulusJobs || []).find((item) => item.id === req.body.id);

    if (currentItem?.imageUrl) {
      await deleteStoredImage(currentItem.imageUrl);
    }

    content.lulusJobs = (content.lulusJobs || []).filter((item) => item.id !== req.body.id);
    await writeContent(content);
    return res.status(204).send();
  }

  const content = await readContent();
  const item = {
    id: `lulus-job-${Date.now()}`,
    name: req.body.name || 'Siswa lulus job',
    origin: req.body.origin || '',
    quote: req.body.quote || '',
    imageUrl: req.body.imageUrl || '',
  };

  content.lulusJobs = [item, ...(content.lulusJobs || [])];
  await writeContent(content);
  res.status(201).json(item);
}));

app.put('/api/admin/lulus-job/:id', requireAdmin, asyncHandler(async (req, res) => {
  const content = await readContent();
  const index = (content.lulusJobs || []).findIndex((item) => item.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ message: 'Data siswa lulus job tidak ditemukan.' });
  }

  const currentItem = content.lulusJobs[index];
  const nextImageUrl = req.body.imageUrl ?? currentItem.imageUrl ?? '';

  content.lulusJobs[index] = {
    ...currentItem,
    ...req.body,
    imageUrl: nextImageUrl,
    id: req.params.id,
  };

  if (currentItem.imageUrl && currentItem.imageUrl !== nextImageUrl) {
    await deleteStoredImage(currentItem.imageUrl);
  }

  await writeContent(content);
  return res.json(content.lulusJobs[index]);
}));

app.post('/api/admin/lulus-job/:id', requireAdmin, asyncHandler(async (req, res) => {
  const content = await readContent();
  const index = (content.lulusJobs || []).findIndex((item) => item.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ message: 'Data siswa lulus job tidak ditemukan.' });
  }

  const currentItem = content.lulusJobs[index];
  const nextImageUrl = req.body.imageUrl ?? currentItem.imageUrl ?? '';

  content.lulusJobs[index] = {
    ...currentItem,
    ...req.body,
    imageUrl: nextImageUrl,
    id: req.params.id,
  };

  if (currentItem.imageUrl && currentItem.imageUrl !== nextImageUrl) {
    await deleteStoredImage(currentItem.imageUrl);
  }

  await writeContent(content);
  return res.json(content.lulusJobs[index]);
}));

app.post('/api/admin/lulus-job/:id/delete', requireAdmin, asyncHandler(async (req, res) => {
  const content = await readContent();
  const currentItem = (content.lulusJobs || []).find((item) => item.id === req.params.id);

  if (currentItem?.imageUrl) {
    await deleteStoredImage(currentItem.imageUrl);
  }

  content.lulusJobs = (content.lulusJobs || []).filter((item) => item.id !== req.params.id);
  await writeContent(content);
  res.status(204).send();
}));

app.delete('/api/admin/lulus-job/:id', requireAdmin, asyncHandler(async (req, res) => {
  const content = await readContent();
  const currentItem = (content.lulusJobs || []).find((item) => item.id === req.params.id);

  if (currentItem?.imageUrl) {
    await deleteStoredImage(currentItem.imageUrl);
  }

  content.lulusJobs = (content.lulusJobs || []).filter((item) => item.id !== req.params.id);
  await writeContent(content);
  res.status(204).send();
}));

async function uploadBufferToBlob(file) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error('BLOB_READ_WRITE_TOKEN belum diset di environment variables.');
  }

  const pathname = `uploads/${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9.-]/g, '-')}`;
  const blob = await put(pathname, new Blob([file.buffer], { type: file.mimetype }), {
    access: blobAccess,
    contentType: file.mimetype,
    addRandomSuffix: true,
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });

  return blob;
}

app.post('/api/admin/upload', requireAdmin, upload.single('image'), asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'File gambar belum dikirim.' });
  }

  if (uploadDriver === 'blob') {
    try {
      const blob = await uploadBufferToBlob(req.file);
      return res.status(201).json({
        filename: blob.pathname,
        imageUrl: blob.url,
      });
    } catch (error) {
      console.error('Blob upload failed:', error);
      return res.status(502).json({
        message: error.message || 'Upload ke Vercel Blob gagal. Periksa BLOB_READ_WRITE_TOKEN atau coba lagi.',
      });
    }
  }

  return res.status(201).json({
    filename: req.file.filename,
    imageUrl: `/uploads/${req.file.filename}`,
  });
}));

app.use('/api', (error, _req, res, _next) => {
  console.error(error);

  if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE') {
    const maxUploadMb = Math.round(MAX_UPLOAD_BYTES / 1024 / 1024);
    return res.status(413).json({ message: `Ukuran gambar terlalu besar. Maksimal ${maxUploadMb} MB.` });
  }

  const isConfigurationError = /MySQL|Blob|Production belum terhubung/.test(error.message || '');
  const isDatabaseError = Boolean(error.code && /^(ER_|ECONN|ETIMEDOUT|ENOTFOUND|PROTOCOL_)/.test(error.code));
  const message = process.env.NODE_ENV === 'production' && !isConfigurationError
    ? (isDatabaseError ? `Database error: ${error.code}` : 'Terjadi kesalahan pada server.')
    : error.message || 'Terjadi kesalahan pada server.';

  res.status(500).json({ message });
});

if (fs.existsSync(buildIndexPath)) {
  app.use(express.static(buildPath));

  app.use((req, res, next) => {
    if (req.method !== 'GET' || req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      return next();
    }

    return res.sendFile(buildIndexPath);
  });
}

if (require.main === module) {
  const server = app.listen(port, host, () => {
    console.log(`Furusato berjalan di http://${host}:${port}`);
  });

  function shutdown(signal) {
    console.log(`${signal} diterima, server dimatikan...`);
    server.close(() => {
      process.exit(0);
    });
  }

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

module.exports = app;
