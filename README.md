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

## Menggunakan MySQL

Secara default backend masih bisa memakai file JSON lokal agar development tetap mudah. Untuk production dengan MySQL, ubah `.env`:

```bash
DATA_DRIVER=mysql
MYSQL_HOST=host-mysql-kamu
MYSQL_PORT=3306
MYSQL_USER=user-mysql
MYSQL_PASSWORD=password-mysql
MYSQL_DATABASE=nama-database
MYSQL_AUTO_SEED=true
```

Jika provider database memberi connection string, gunakan:

```bash
DATA_DRIVER=mysql
MYSQL_URL=mysql://user:password@host:3306/nama-database
```

Saat pertama kali jalan, jika tabel MySQL masih kosong, backend akan menyalin data awal dari:

- `server/data/content.json` ke document key `content`
- `server/data/site.json` ke document key `site`
- `server/data/accounts.json` ke document key `accounts`

Setelah `.env` diubah, restart PM2:

```bash
pm2 restart furusato-web
pm2 save
```

Untuk menyalin data JSON lokal ke MySQL secara manual:

```bash
npm run mysql:seed
```

Data disimpan di tabel `app_documents` sebagai JSON document agar struktur dashboard yang sudah ada tetap kompatibel.

## Upload Gambar Vercel Blob

Untuk upload gambar production, gunakan Vercel Blob:

```bash
UPLOAD_DRIVER=blob
BLOB_ACCESS=public
BLOB_READ_WRITE_TOKEN=isi-token-dari-vercel
MAX_UPLOAD_BYTES=8388608
```

Jika kamu masih menjalankan lokal tanpa Blob, `UPLOAD_DRIVER=local` tetap menyimpan file ke folder `server/uploads`.

## Deploy ke Vercel

Vercel tidak menjalankan `npm run server` atau PM2. Backend Express dijalankan sebagai serverless function melalui folder `api/`.

Di dashboard Vercel, isi Environment Variables berikut:

```bash
DATA_DRIVER=mysql
MYSQL_URL=mysql://user:password@host:3306/nama-database
MYSQL_AUTO_SEED=false
UPLOAD_DRIVER=blob
BLOB_ACCESS=public
BLOB_READ_WRITE_TOKEN=isi-token-dari-vercel
MAX_UPLOAD_BYTES=8388608
ADMIN_USERNAME=admin
ADMIN_PASSWORD=password-yang-kuat
ADMIN_TOKEN_SECRET=isi-random-panjang
```

Setelah environment variable disimpan, redeploy project di Vercel.
