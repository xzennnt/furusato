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
