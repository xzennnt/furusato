require('dotenv').config();

const cors = require('cors');
const crypto = require('crypto');
const express = require('express');
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const {
  readAccounts,
  readContent,
  readSite,
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
const activeAdminTokens = new Set();

fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (_req, file, callback) => {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '-');
    callback(null, `${Date.now()}-${safeName}`);
  },
});

const upload = multer({ storage });

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadDir));

const asyncHandler = (handler) => (req, res, next) => {
  Promise.resolve(handler(req, res, next)).catch(next);
};

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
      endpoints: ['/api/health', '/api/news', '/api/gallery'],
    });
  });
}

function requireAdmin(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token || !activeAdminTokens.has(token)) {
    return res.status(401).json({ message: 'Akses admin diperlukan.' });
  }

  return next();
}

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'furusato-api' });
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

app.post('/api/admin/login', asyncHandler(async (req, res) => {
  const accounts = await readAccounts();
  const username = process.env.ADMIN_USERNAME || accounts.admin.username;
  const password = process.env.ADMIN_PASSWORD || accounts.admin.password;

  if (req.body.username === username && req.body.password === password) {
    const token = crypto.randomUUID();
    activeAdminTokens.add(token);
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

  content.news[index] = {
    imageUrl: '',
    source: '',
    ...content.news[index],
    ...req.body,
    imageUrl: req.body.imageUrl ?? content.news[index].imageUrl ?? '',
    id: req.params.id,
  };
  await writeContent(content);
  return res.json(content.news[index]);
}));

app.delete('/api/admin/news/:id', requireAdmin, asyncHandler(async (req, res) => {
  const content = await readContent();
  content.news = content.news.filter((item) => item.id !== req.params.id);
  await writeContent(content);
  res.status(204).send();
}));

app.post('/api/admin/gallery', requireAdmin, asyncHandler(async (req, res) => {
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

  content.gallery[index] = { ...content.gallery[index], ...req.body, id: req.params.id };
  await writeContent(content);
  return res.json(content.gallery[index]);
}));

app.delete('/api/admin/gallery/:id', requireAdmin, asyncHandler(async (req, res) => {
  const content = await readContent();
  content.gallery = content.gallery.filter((item) => item.id !== req.params.id);
  await writeContent(content);
  res.status(204).send();
}));

app.post('/api/admin/upload', requireAdmin, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'File gambar belum dikirim.' });
  }

  return res.status(201).json({
    filename: req.file.filename,
    imageUrl: `/uploads/${req.file.filename}`,
  });
});

app.use('/api', (error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
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
