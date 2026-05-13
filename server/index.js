const cors = require('cors');
const express = require('express');
const fs = require('fs');
const multer = require('multer');
const path = require('path');

const app = express();
const port = process.env.PORT || 4000;
const dataPath = path.join(__dirname, 'data', 'content.json');
const accountsPath = path.join(__dirname, 'data', 'accounts.json');
const sitePath = path.join(__dirname, 'data', 'site.json');
const uploadDir = path.join(__dirname, 'uploads');
const adminToken = process.env.ADMIN_TOKEN || 'furusato-admin-token';

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

app.get('/', (_req, res) => {
  res.json({
    message: 'Furusato backend berjalan.',
    frontend: 'Buka http://localhost:3000 untuk melihat website.',
    endpoints: ['/api/health', '/api/news', '/api/gallery'],
  });
});

function readContent() {
  return JSON.parse(fs.readFileSync(dataPath, 'utf8'));
}

function writeContent(content) {
  fs.writeFileSync(dataPath, JSON.stringify(content, null, 2));
}

function readAccounts() {
  return JSON.parse(fs.readFileSync(accountsPath, 'utf8'));
}

function writeAccounts(accounts) {
  fs.writeFileSync(accountsPath, JSON.stringify(accounts, null, 2));
}

function readSite() {
  return JSON.parse(fs.readFileSync(sitePath, 'utf8'));
}

function writeSite(site) {
  fs.writeFileSync(sitePath, JSON.stringify(site, null, 2));
}

function requireAdmin(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (token !== adminToken) {
    return res.status(401).json({ message: 'Akses admin diperlukan.' });
  }

  return next();
}

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'furusato-api' });
});

app.get('/api/news', (_req, res) => {
  res.json(readContent().news);
});

app.get('/api/gallery', (_req, res) => {
  res.json(readContent().gallery);
});

app.get('/api/home-content', (_req, res) => {
  const content = readContent();
  res.json({
    heroBackgroundUrl: content.heroBackgroundUrl || '',
    jobInfo: content.jobInfo,
    jobBanner: content.jobBanner,
    partners: content.partners || [],
  });
});

app.get('/api/site', (_req, res) => {
  res.json(readSite());
});

app.post('/api/admin/login', (req, res) => {
  const accounts = readAccounts();
  const username = process.env.ADMIN_USERNAME || accounts.admin.username;
  const password = process.env.ADMIN_PASSWORD || accounts.admin.password;

  if (req.body.username === username && req.body.password === password) {
    return res.json({ token: adminToken });
  }

  return res.status(401).json({ message: 'Username atau password salah.' });
});

app.get('/api/admin/account', requireAdmin, (_req, res) => {
  const accounts = readAccounts();
  res.json({ username: accounts.admin.username });
});

app.put('/api/admin/account', requireAdmin, (req, res) => {
  const username = req.body.username?.trim();
  const password = req.body.password?.trim();

  if (!username || !password) {
    return res.status(400).json({ message: 'Username dan password wajib diisi.' });
  }

  const accounts = readAccounts();
  accounts.admin = { username, password };
  writeAccounts(accounts);

  return res.json({ username });
});

app.put('/api/admin/site', requireAdmin, (req, res) => {
  const currentSite = readSite();
  const nextSite = {
    ...currentSite,
    ...req.body,
    socials: {
      ...currentSite.socials,
      ...(req.body.socials || {}),
    },
  };

  writeSite(nextSite);
  return res.json(nextSite);
});

app.put('/api/admin/home-content', requireAdmin, (req, res) => {
  const content = readContent();
  content.heroBackgroundUrl = req.body.heroBackgroundUrl || '';
  content.jobInfo = {
    ...(content.jobInfo || {}),
    ...(req.body.jobInfo || {}),
  };
  content.jobBanner = {
    ...(content.jobBanner || {}),
    ...(req.body.jobBanner || {}),
  };
  content.partners = req.body.partners || content.partners || [];
  writeContent(content);

  return res.json({
    heroBackgroundUrl: content.heroBackgroundUrl,
    jobInfo: content.jobInfo,
    jobBanner: content.jobBanner,
    partners: content.partners,
  });
});

app.post('/api/admin/news', requireAdmin, (req, res) => {
  const content = readContent();
  const item = {
    id: `news-${Date.now()}`,
    date: req.body.date || '',
    title: req.body.title || 'Judul berita baru',
    description: req.body.description || '',
    content: req.body.content || '',
  };

  content.news.unshift(item);
  writeContent(content);
  res.status(201).json(item);
});

app.put('/api/admin/news/:id', requireAdmin, (req, res) => {
  const content = readContent();
  const index = content.news.findIndex((item) => item.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ message: 'Berita tidak ditemukan.' });
  }

  content.news[index] = { ...content.news[index], ...req.body, id: req.params.id };
  writeContent(content);
  return res.json(content.news[index]);
});

app.delete('/api/admin/news/:id', requireAdmin, (req, res) => {
  const content = readContent();
  content.news = content.news.filter((item) => item.id !== req.params.id);
  writeContent(content);
  res.status(204).send();
});

app.post('/api/admin/gallery', requireAdmin, (req, res) => {
  const content = readContent();
  const item = {
    id: `gallery-${Date.now()}`,
    title: req.body.title || 'Galeri baru',
    description: req.body.description || '',
    imageUrl: req.body.imageUrl || '',
  };

  content.gallery.unshift(item);
  writeContent(content);
  res.status(201).json(item);
});

app.put('/api/admin/gallery/:id', requireAdmin, (req, res) => {
  const content = readContent();
  const index = content.gallery.findIndex((item) => item.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ message: 'Galeri tidak ditemukan.' });
  }

  content.gallery[index] = { ...content.gallery[index], ...req.body, id: req.params.id };
  writeContent(content);
  return res.json(content.gallery[index]);
});

app.delete('/api/admin/gallery/:id', requireAdmin, (req, res) => {
  const content = readContent();
  content.gallery = content.gallery.filter((item) => item.id !== req.params.id);
  writeContent(content);
  res.status(204).send();
});

app.post('/api/admin/upload', requireAdmin, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'File gambar belum dikirim.' });
  }

  return res.status(201).json({
    filename: req.file.filename,
    imageUrl: `/uploads/${req.file.filename}`,
  });
});

app.listen(port, () => {
  console.log(`Furusato API berjalan di http://localhost:${port}`);
});
