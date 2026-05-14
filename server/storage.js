const fs = require('fs');
const mysql = require('mysql2/promise');
const path = require('path');

const dataPath = path.join(__dirname, 'data', 'content.json');
const accountsPath = path.join(__dirname, 'data', 'accounts.json');
const sitePath = path.join(__dirname, 'data', 'site.json');

function hasMysqlConfig() {
  return Boolean(
    process.env.MYSQL_URL
    || process.env.DATABASE_URL
    || (process.env.MYSQL_HOST && process.env.MYSQL_USER && process.env.MYSQL_DATABASE)
  );
}

const useMysql = process.env.DATA_DRIVER === 'mysql' || hasMysqlConfig();
const isServerless = Boolean(process.env.VERCEL);
let pool;

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, data) {
  if (isServerless) {
    throw new Error('Production belum terhubung ke MySQL. Isi MYSQL_URL atau MYSQL_HOST/MYSQL_USER/MYSQL_DATABASE di Vercel Environment Variables.');
  }

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function getMysqlPool() {
  if (!useMysql) {
    return null;
  }

  if (pool) {
    return pool;
  }

  const connectionUri = process.env.MYSQL_URL || process.env.DATABASE_URL;

  if (!connectionUri && !hasMysqlConfig()) {
    throw new Error('Konfigurasi MySQL belum lengkap. Isi MYSQL_URL atau MYSQL_HOST, MYSQL_USER, dan MYSQL_DATABASE.');
  }

  pool = connectionUri
    ? mysql.createPool({
      uri: connectionUri,
      waitForConnections: true,
      connectionLimit: Number(process.env.MYSQL_CONNECTION_LIMIT || 5),
    })
    : mysql.createPool({
      host: process.env.MYSQL_HOST,
      port: Number(process.env.MYSQL_PORT || 3306),
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      waitForConnections: true,
      connectionLimit: Number(process.env.MYSQL_CONNECTION_LIMIT || 5),
    });

  return pool;
}

async function ensureMysqlSchema() {
  const db = getMysqlPool();

  await db.query(`
    CREATE TABLE IF NOT EXISTS app_documents (
      document_key VARCHAR(50) PRIMARY KEY,
      data JSON NOT NULL,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);
}

async function readMysqlDocument(documentKey, fallbackPath) {
  await ensureMysqlSchema();

  const db = getMysqlPool();
  const [rows] = await db.query(
    'SELECT data FROM app_documents WHERE document_key = ? LIMIT 1',
    [documentKey],
  );

  if (rows.length) {
    return typeof rows[0].data === 'string' ? JSON.parse(rows[0].data) : rows[0].data;
  }

  const fallback = readJson(fallbackPath);

  if (process.env.MYSQL_AUTO_SEED !== 'false') {
    await writeMysqlDocument(documentKey, fallback);
  }

  return fallback;
}

async function writeMysqlDocument(documentKey, data) {
  await ensureMysqlSchema();

  const db = getMysqlPool();
  await db.query(
    `
      INSERT INTO app_documents (document_key, data)
      VALUES (?, ?)
      ON DUPLICATE KEY UPDATE data = VALUES(data)
    `,
    [documentKey, JSON.stringify(data)],
  );
}

async function readContent() {
  if (useMysql) {
    return readMysqlDocument('content', dataPath);
  }

  return readJson(dataPath);
}

async function writeContent(content) {
  if (useMysql) {
    await writeMysqlDocument('content', content);
    return;
  }

  writeJson(dataPath, content);
}

async function readAccounts() {
  if (useMysql) {
    return readMysqlDocument('accounts', accountsPath);
  }

  return readJson(accountsPath);
}

async function writeAccounts(accounts) {
  if (useMysql) {
    await writeMysqlDocument('accounts', accounts);
    return;
  }

  writeJson(accountsPath, accounts);
}

async function readSite() {
  if (useMysql) {
    return readMysqlDocument('site', sitePath);
  }

  return readJson(sitePath);
}

async function writeSite(site) {
  if (useMysql) {
    await writeMysqlDocument('site', site);
    return;
  }

  writeJson(sitePath, site);
}

module.exports = {
  ensureMysqlSchema,
  readAccounts,
  readContent,
  readSite,
  writeAccounts,
  writeContent,
  writeMysqlDocument,
  writeSite,
};
