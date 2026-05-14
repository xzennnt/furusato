# Furusato

Website profil LPK Furusato berbasis React dengan backend Node.js untuk konten berita, galeri, login admin, dan upload gambar.

## Menjalankan Frontend

```bash
npm start
```

Frontend berjalan di `http://localhost:3000`.

Jika memakai PowerShell Windows dan muncul error `npm.ps1 cannot be loaded`, jalankan:

```bash
npm.cmd start
```

Atau buka `start-frontend.cmd`.

## Menjalankan Backend

```bash
npm run server
```

Backend berjalan di `http://localhost:4000`.

Jika memakai PowerShell Windows dan muncul error `npm.ps1 cannot be loaded`, jalankan:

```bash
npm.cmd run server
```

Atau buka `start-server.cmd`.

Endpoint awal:

- `GET /api/news`
- `GET /api/gallery`
- `POST /api/admin/login`
- `POST /api/admin/news`
- `POST /api/admin/gallery`
- `POST /api/admin/upload`

Default login lokal:

- username: `admin`
- password: `furusato123`

Untuk produksi, set environment variable `ADMIN_USERNAME`, `ADMIN_PASSWORD`, dan `ADMIN_TOKEN`.

## Deploy ke VPS dengan PM2

Di VPS, project ini bisa dijalankan sebagai satu server Node.js. Server Express akan otomatis menyajikan API dan file React dari folder `build`.

### 1. Install dependency dan build frontend

```bash
npm ci
npm run build
```

### 2. Jalankan dengan PM2

Install PM2 jika belum ada:

```bash
npm install -g pm2
```

Jalankan aplikasi:

```bash
npm run pm2:start
```

Server berjalan di port `4000` sesuai `ecosystem.config.cjs`. Jika ingin memakai port lain, ubah nilai `PORT` di file tersebut.

### 3. Buat otomatis online setelah VPS restart

Jalankan:

```bash
pm2 startup
```

PM2 akan menampilkan satu command tambahan. Salin dan jalankan command tersebut di terminal VPS.

Setelah itu simpan daftar proses PM2:

```bash
pm2 save
```

Mulai sekarang, saat VPS restart, aplikasi akan otomatis hidup lagi.

### 4. Update website setelah upload kode baru

```bash
git pull
npm ci
npm run build
pm2 restart furusato-web
pm2 save
```

### 5. Environment production

Buat file `.env` dari contoh yang tersedia:

```bash
cp .env.example .env
```

Untuk keamanan admin, isi environment berikut di `.env`:

```bash
ADMIN_USERNAME=admin
ADMIN_PASSWORD=password-yang-kuat
```

### 6. Nginx sebagai reverse proxy

Project tetap memakai Node.js + Express. Nginx dipakai di depan aplikasi untuk menerima akses domain publik lalu meneruskannya ke Express di port `4000`.

Contoh konfigurasi tersedia di:

```bash
deploy/nginx/furusato.conf
```

Edit bagian `server_name` menjadi domain kamu:

```nginx
server_name domainkamu.com www.domainkamu.com;
```

Lalu pasang ke Nginx:

```bash
sudo cp deploy/nginx/furusato.conf /etc/nginx/sites-available/furusato
sudo ln -s /etc/nginx/sites-available/furusato /etc/nginx/sites-enabled/furusato
sudo nginx -t
sudo systemctl reload nginx
```

Jika memakai SSL gratis:

```bash
sudo certbot --nginx -d domainkamu.com -d www.domainkamu.com
```

## Menggunakan Firestore

Secara default backend masih memakai file JSON lokal agar development tetap mudah. Untuk production dengan Firestore, ubah `.env`:

```bash
DATA_DRIVER=firestore
FIREBASE_PROJECT_ID=project-id-firebase-kamu
FIREBASE_SERVICE_ACCOUNT_PATH=furusato-homepage-firebase-adminsdk-fbsvc-ddea11d9ff.json
FIREBASE_STORAGE_BUCKET=furusato-homepage.firebasestorage.app
FIRESTORE_DATABASE_ID=default
FIRESTORE_LOCATION_ID=asia-southeast2
UPLOAD_DRIVER=firebase
FIRESTORE_AUTO_SEED=true
```

Jika tidak ingin menaruh file JSON credential di server, gunakan format base64:

```bash
DATA_DRIVER=firestore
FIREBASE_PROJECT_ID=project-id-firebase-kamu
FIREBASE_SERVICE_ACCOUNT_BASE64=isi-service-account-base64
FIREBASE_STORAGE_BUCKET=furusato-homepage.firebasestorage.app
FIRESTORE_DATABASE_ID=default
FIRESTORE_LOCATION_ID=asia-southeast2
UPLOAD_DRIVER=firebase
FIRESTORE_AUTO_SEED=true
```

Credential `FIREBASE_SERVICE_ACCOUNT_BASE64` dibuat dari file service account Firebase. Di VPS Linux:

```bash
base64 -w 0 service-account.json
```

Copy hasilnya ke `.env`.

Saat pertama kali jalan, jika document Firestore masih kosong, backend akan menyalin data awal dari:

- `server/data/content.json` ke collection `content`, document `main`
- `server/data/site.json` ke collection `site`, document `main`
- `server/data/accounts.json` ke collection `accounts`, document `main`

Setelah `.env` diubah, restart PM2:

```bash
pm2 restart furusato-web
pm2 save
```

Untuk menyalin data JSON lokal ke Firestore secara manual:

```bash
npm run firebase:create-db
npm run firebase:seed
```

Catatan: untuk Vercel, upload gambar memakai Firebase Storage. Gambar lama dari `server/uploads` juga disalin ke `public/uploads`, sehingga URL lama seperti `/uploads/nama-file.jpg` tetap terbaca setelah deploy.

## Deploy ke Vercel

Vercel tidak menjalankan `npm run server` atau PM2. Backend Express dijalankan sebagai serverless function melalui folder `api/`.

Di dashboard Vercel, isi Environment Variables berikut:

```bash
DATA_DRIVER=firestore
FIREBASE_PROJECT_ID=furusato-homepage
FIREBASE_STORAGE_BUCKET=furusato-homepage.firebasestorage.app
FIRESTORE_DATABASE_ID=default
FIRESTORE_AUTO_SEED=false
UPLOAD_DRIVER=firebase
ADMIN_USERNAME=admin
ADMIN_PASSWORD=password-yang-kuat
```

Credential Firebase tidak boleh mengandalkan file lokal `.json`, karena file private key tidak ikut dipush ke GitHub. Gunakan salah satu:

```bash
FIREBASE_SERVICE_ACCOUNT_BASE64=hasil-base64-service-account-json
```

atau:

```bash
FIREBASE_SERVICE_ACCOUNT_JSON={"type":"service_account",...}
```

Untuk membuat base64 dari file service account:

```bash
base64 -w 0 furusato-homepage-firebase-adminsdk-fbsvc-ddea11d9ff.json
```

Di Windows PowerShell:

```powershell
[Convert]::ToBase64String([IO.File]::ReadAllBytes("furusato-homepage-firebase-adminsdk-fbsvc-ddea11d9ff.json"))
```

Setelah environment variable disimpan, redeploy project di Vercel.
