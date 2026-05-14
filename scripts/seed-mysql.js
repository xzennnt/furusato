require('dotenv').config();

if (process.env.DATA_DRIVER !== 'mysql') {
  process.env.DATA_DRIVER = 'mysql';
}

const fs = require('fs');
const path = require('path');
const { ensureMysqlSchema, writeMysqlDocument } = require('../server/storage');

const rootDir = path.join(__dirname, '..');

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(rootDir, relativePath), 'utf8'));
}

async function main() {
  await ensureMysqlSchema();

  const documents = [
    ['content', readJson('server/data/content.json')],
    ['site', readJson('server/data/site.json')],
    ['accounts', readJson('server/data/accounts.json')],
  ];

  for (const [documentKey, data] of documents) {
    await writeMysqlDocument(documentKey, data);
    console.log(`Seeded app_documents/${documentKey}`);
  }

  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
