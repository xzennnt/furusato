require('dotenv').config();

const fs = require('fs');
const path = require('path');
const admin = require('firebase-admin');

const rootDir = path.join(__dirname, '..');
const defaultLocationId = 'asia-southeast2';

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function getServiceAccount() {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
    const json = Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, 'base64').toString('utf8');
    return JSON.parse(json);
  }

  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    return JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
  }

  if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
    return readJson(path.resolve(rootDir, process.env.FIREBASE_SERVICE_ACCOUNT_PATH));
  }

  throw new Error('Credential Firebase belum diatur di .env.');
}

async function getAccessToken() {
  const credential = admin.credential.cert(getServiceAccount());
  const token = await credential.getAccessToken();
  return token.access_token;
}

async function requestJson(url, options = {}) {
  const response = await fetch(url, options);
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const message = data?.error?.message || response.statusText;
    const error = new Error(message);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

async function waitForOperation(operationName, token) {
  const url = `https://firestore.googleapis.com/v1/${operationName}`;

  for (let attempt = 1; attempt <= 60; attempt += 1) {
    const operation = await requestJson(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (operation.done) {
      if (operation.error) {
        throw new Error(operation.error.message);
      }

      return operation;
    }

    await new Promise((resolve) => setTimeout(resolve, 5000));
  }

  throw new Error('Timeout menunggu pembuatan Firestore database selesai.');
}

async function main() {
  const projectId = process.env.FIREBASE_PROJECT_ID || getServiceAccount().project_id;
  const databaseId = process.env.FIRESTORE_DATABASE_ID || 'default';
  const locationId = process.env.FIRESTORE_LOCATION_ID || defaultLocationId;
  const token = await getAccessToken();
  const databaseUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/${encodeURIComponent(databaseId)}`;

  try {
    const existing = await requestJson(databaseUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log(`Firestore database sudah ada: ${existing.name}`);
    return;
  } catch (error) {
    if (error.status !== 404) {
      throw error;
    }
  }

  const createUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases?databaseId=${encodeURIComponent(databaseId)}`;
  const operation = await requestJson(createUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      locationId,
      type: 'FIRESTORE_NATIVE',
    }),
  });

  console.log(`Membuat Firestore database ${databaseId} di ${locationId}...`);
  await waitForOperation(operation.name, token);
  console.log('Firestore database selesai dibuat.');
}

main()
  .catch((error) => {
    console.error(error.message);

    if (error.data) {
      console.error(JSON.stringify(error.data, null, 2));
    }

    process.exitCode = 1;
  });
