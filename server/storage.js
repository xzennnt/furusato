const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, 'data', 'content.json');
const accountsPath = path.join(__dirname, 'data', 'accounts.json');
const sitePath = path.join(__dirname, 'data', 'site.json');

const useFirestore = process.env.DATA_DRIVER === 'firestore';
let firestore;

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function getFirestore() {
  if (!useFirestore) {
    return null;
  }

  if (firestore) {
    return firestore;
  }

  const admin = require('firebase-admin');

  if (!admin.apps.length) {
    const serviceAccountBase64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;
    const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
    const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
    let credential;

    if (serviceAccountBase64) {
      const serviceAccount = JSON.parse(Buffer.from(serviceAccountBase64, 'base64').toString('utf8'));
      credential = admin.credential.cert(serviceAccount);
    } else if (serviceAccountJson) {
      credential = admin.credential.cert(JSON.parse(serviceAccountJson));
    } else if (serviceAccountPath) {
      const resolvedPath = path.resolve(process.cwd(), serviceAccountPath);
      const serviceAccount = JSON.parse(fs.readFileSync(resolvedPath, 'utf8'));
      credential = admin.credential.cert(serviceAccount);
    } else {
      credential = admin.credential.applicationDefault();
    }

    admin.initializeApp({
      credential,
      projectId: process.env.FIREBASE_PROJECT_ID,
    });
  }

  firestore = admin.firestore();
  return firestore;
}

async function readFirestoreDocument(collectionName, documentId, fallbackPath) {
  const db = getFirestore();
  const ref = db.collection(collectionName).doc(documentId);
  const snapshot = await ref.get();

  if (snapshot.exists) {
    return snapshot.data();
  }

  const fallback = readJson(fallbackPath);

  if (process.env.FIRESTORE_AUTO_SEED !== 'false') {
    await ref.set(fallback);
  }

  return fallback;
}

async function writeFirestoreDocument(collectionName, documentId, data) {
  const db = getFirestore();
  await db.collection(collectionName).doc(documentId).set(data);
}

async function readContent() {
  if (useFirestore) {
    return readFirestoreDocument('content', 'main', dataPath);
  }

  return readJson(dataPath);
}

async function writeContent(content) {
  if (useFirestore) {
    await writeFirestoreDocument('content', 'main', content);
    return;
  }

  writeJson(dataPath, content);
}

async function readAccounts() {
  if (useFirestore) {
    return readFirestoreDocument('accounts', 'main', accountsPath);
  }

  return readJson(accountsPath);
}

async function writeAccounts(accounts) {
  if (useFirestore) {
    await writeFirestoreDocument('accounts', 'main', accounts);
    return;
  }

  writeJson(accountsPath, accounts);
}

async function readSite() {
  if (useFirestore) {
    return readFirestoreDocument('site', 'main', sitePath);
  }

  return readJson(sitePath);
}

async function writeSite(site) {
  if (useFirestore) {
    await writeFirestoreDocument('site', 'main', site);
    return;
  }

  writeJson(sitePath, site);
}

module.exports = {
  readAccounts,
  readContent,
  readSite,
  writeAccounts,
  writeContent,
  writeSite,
};
