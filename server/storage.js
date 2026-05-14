const fs = require('fs');
const mysql = require('mysql2/promise');
const path = require('path');
const { get: getBlob, put: putBlob } = require('@vercel/blob');

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

const isServerless = Boolean(process.env.VERCEL);
const hasBlobConfig = Boolean(process.env.BLOB_READ_WRITE_TOKEN);
const explicitDataDriver = (process.env.DATA_DRIVER || '').toLowerCase();
const useBlob = explicitDataDriver === 'blob'
  || (isServerless && hasBlobConfig && !hasMysqlConfig());
const useMysql = explicitDataDriver === 'mysql'
  ? hasMysqlConfig()
  : hasMysqlConfig() && !useBlob;
let pool;

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, data) {
  if (isServerless) {
    throw new Error('Storage production belum dikonfigurasi. Isi MYSQL_URL/MYSQL_HOST atau BLOB_READ_WRITE_TOKEN di Vercel Environment Variables.');
  }

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function getBlobToken() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error('Konfigurasi Blob belum lengkap. Isi BLOB_READ_WRITE_TOKEN di Vercel Environment Variables.');
  }

  return process.env.BLOB_READ_WRITE_TOKEN;
}

function getDocumentBlobPath(documentKey) {
  return `dashboard/${documentKey}.json`;
}

async function readStreamText(stream) {
  if (!stream) {
    return '';
  }

  if (typeof Response !== 'undefined') {
    return new Response(stream).text();
  }

  const reader = stream.getReader();
  const chunks = [];

  // Fallback for older runtimes that do not expose Response globally.
  // The blob SDK returns a web stream here, so we gather the chunks manually.
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { done, value } = await reader.read();

    if (done) {
      break;
    }

    chunks.push(Buffer.from(value));
  }

  return Buffer.concat(chunks).toString('utf8');
}

async function readBlobDocument(documentKey, fallbackPath) {
  const blobPath = getDocumentBlobPath(documentKey);
  const result = await getBlob(blobPath, {
    access: process.env.BLOB_ACCESS || 'public',
    token: getBlobToken(),
  });

  if (result?.stream) {
    const text = await readStreamText(result.stream);
    if (text) {
      return JSON.parse(text);
    }
  }

  const fallback = readJson(fallbackPath);

  if (process.env.BLOB_AUTO_SEED !== 'false') {
    await writeBlobDocument(documentKey, fallback);
  }

  return fallback;
}

async function writeBlobDocument(documentKey, data) {
  const blobPath = getDocumentBlobPath(documentKey);
  await putBlob(blobPath, JSON.stringify(data, null, 2), {
    access: process.env.BLOB_ACCESS || 'public',
    contentType: 'application/json',
    allowOverwrite: true,
    token: getBlobToken(),
  });
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
      data LONGTEXT NOT NULL,
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
      ON DUPLICATE KEY UPDATE data = ?
    `,
    [documentKey, JSON.stringify(data), JSON.stringify(data)],
  );
}

function getStorageStatus() {
  return {
    driver: useMysql ? 'mysql' : (useBlob ? 'blob' : 'json'),
    mysqlConfigured: hasMysqlConfig(),
    blobConfigured: hasBlobConfig,
  };
}

async function readContent() {
  if (useMysql) {
    return readMysqlDocument('content', dataPath);
  }

  if (useBlob) {
    return readBlobDocument('content', dataPath);
  }

  return readJson(dataPath);
}

async function writeContent(content) {
  if (useMysql) {
    await writeMysqlDocument('content', content);
    return;
  }

  if (useBlob) {
    await writeBlobDocument('content', content);
    return;
  }

  writeJson(dataPath, content);
}

async function readAccounts() {
  if (useMysql) {
    return readMysqlDocument('accounts', accountsPath);
  }

  if (useBlob) {
    return readBlobDocument('accounts', accountsPath);
  }

  return readJson(accountsPath);
}

async function writeAccounts(accounts) {
  if (useMysql) {
    await writeMysqlDocument('accounts', accounts);
    return;
  }

  if (useBlob) {
    await writeBlobDocument('accounts', accounts);
    return;
  }

  writeJson(accountsPath, accounts);
}

async function readSite() {
  if (useMysql) {
    return readMysqlDocument('site', sitePath);
  }

  if (useBlob) {
    return readBlobDocument('site', sitePath);
  }

  return readJson(sitePath);
}

async function writeSite(site) {
  if (useMysql) {
    await writeMysqlDocument('site', site);
    return;
  }

  if (useBlob) {
    await writeBlobDocument('site', site);
    return;
  }

  writeJson(sitePath, site);
}

module.exports = {
  ensureMysqlSchema,
  getStorageStatus,
  readAccounts,
  readContent,
  readSite,
  writeAccounts,
  writeContent,
  writeMysqlDocument,
  writeSite,
};
