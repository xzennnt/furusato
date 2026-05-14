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

Untuk keamanan admin, set environment variable di VPS atau di `ecosystem.config.cjs`:

```bash
ADMIN_USERNAME=admin
ADMIN_PASSWORD=password-yang-kuat
```

Jika memakai Nginx, arahkan domain ke `http://127.0.0.1:4000`.
