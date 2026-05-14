require('dotenv').config();

const fs = require('fs');
const path = require('path');
const admin = require('firebase-admin');

const rootDir = path.join(__dirname, '..');
const contentPath = path.join(rootDir, 'server', 'data', 'content.json');
const sitePath = path.join(rootDir, 'server', 'data', 'site.json');
const accountsPath = path.join(rootDir, 'server', 'data', 'accounts.json');

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function getCredential() {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
    const json = Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, 'base64').toString('utf8');
    return admin.credential.cert(JSON.parse(json));
  }

  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    return admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON));
  }

  if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
    const serviceAccountPath = path.resolve(rootDir, process.env.FIREBASE_SERVICE_ACCOUNT_PATH);
    return admin.credential.cert(readJson(serviceAccountPath));
  }

  return admin.credential.applicationDefault();
}

async function main() {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: getCredential(),
      projectId: process.env.FIREBASE_PROJECT_ID,
    });
  }

  const db = process.env.FIRESTORE_DATABASE_ID
    ? admin.firestore(process.env.FIRESTORE_DATABASE_ID)
    : admin.firestore();
  const batch = db.batch();
  const documents = [
    ['content', 'main', readJson(contentPath)],
    ['site', 'main', readJson(sitePath)],
    ['accounts', 'main', readJson(accountsPath)],
  ];

  documents.forEach(([collectionName, documentId, data]) => {
    batch.set(db.collection(collectionName).doc(documentId), data);
  });

  await batch.commit();

  console.log('Firestore seed selesai:');
  documents.forEach(([collectionName, documentId]) => {
    console.log(`- ${collectionName}/${documentId}`);
  });
}

main()
  .catch((error) => {
    if (error.code === 5) {
      console.error(
        'Firestore database tidak ditemukan. Aktifkan Cloud Firestore di Firebase Console, ' +
        'atau isi FIRESTORE_DATABASE_ID jika memakai database ID selain default.'
      );
    }

    console.error(error);
    process.exitCode = 1;
  });
