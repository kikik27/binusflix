# 🎬 BINUSFLIX — Web & Mobile Entertainment Platform

Proyek Tugas Akhir mata kuliah **Pemrograman Web & Mobile** — BINUS University.

Aplikasi katalog hiburan terintegrasi (Film, Serial TV, dan Musik) yang terdiri dari Backend REST API, Web Frontend (React), dan Mobile App (React Native Expo).

---

## 🌐 Tautan Akses & Live Deployment

| Komponen | Platform | URL | Keterangan |
| :--- | :--- | :--- | :--- |
| **Frontend Web** | Vercel | [https://binusflix.vercel.app](https://binusflix.vercel.app) | Antarmuka web responsif (Desktop & Mobile Browser) |
| **Backend REST API** | Vercel Serverless | [https://binusflix-api.vercel.app](https://binusflix-api.vercel.app) | Base URL API publik |
| **API Health Check** | Vercel Serverless | [https://binusflix-api.vercel.app/api/health](https://binusflix-api.vercel.app/api/health) | Endpoint cek status server |
| **API Explore (Pagination)** | Vercel Serverless | [https://binusflix-api.vercel.app/api/content/explore?page=1&limit=10](https://binusflix-api.vercel.app/api/content/explore?page=1&limit=10) | Contoh endpoint katalog dengan pagination & limit |
| **Download Android APK** | Expo EAS Artifacts | [Download APK Langsung](https://expo.dev/artifacts/eas/0EQ_KfHEjSmYLjKIx8GJFUXihfudxFjuDcf_nVcocNY.apk) | Berkas standalone APK v1.0.0 siap pasang di HP Android |
| **Mobile Build (EAS)** | Expo EAS | [Expo Build Dashboard](https://expo.dev/accounts/kyy27/projects/binusflix/builds/f7cb5a6c-1c39-409e-b471-d1a32496c27a) | Dasbor build cloud & manajemen artefak APK |
| **GitHub Release v1.0.0** | GitHub | [Release v1.0.0](https://github.com/kikik27/binusflix/releases/tag/v1.0.0) | Catatan rilis resmi & tautan unduhan APK |
| **Figma Design File** | Figma (`.fig`) | [docs/binusflix_design.fig](docs/binusflix_design.fig) | Berkas desain native Figma (11 Frame: 5 Web, 5 Mobile, Design System) |
| **FigCraft Native File** | FigCraft (`.figcraft`) | [docs/binusflix_design.figcraft](docs/binusflix_design.figcraft) | Berkas desain FigCraft (dapat diedit di FigCraft Desktop) |
| **Design Overview Preview** | PNG Image | [docs/binusflix_design_overview.png](docs/binusflix_design_overview.png) | Render kanvas desain lengkap resolusi tinggi |
| **Dokumentasi Lengkap** | Markdown | [docs/DOKUMENTASI_PROYEK.md](docs/DOKUMENTASI_PROYEK.md) | Penjelasan teknis arsitektur dan pemenuhan LO 3 |
| **Design System Specs** | Markdown | [docs/FIGMA_DESIGN_SYSTEM.md](docs/FIGMA_DESIGN_SYSTEM.md) | Wireframe, token warna, tipografi, dan spesifikasi UI |

---

## 🔑 Akun Demo untuk Pengujian

Aplikasi sudah dilengkapi data awal (*pre-seeded*). Tombol **"Isi Otomatis"** tersedia di halaman login web maupun mobile:
- **Email:** `demo@binus.ac.id`
- **Password:** `password123`
- **Username:** `binusian_user`
- **Nama:** Binus Student Demo

---

## 🛠️ Tech Stack

- **Backend:** Node.js, Express.js, MongoDB Atlas (Mongoose), JWT, Bcrypt.
- **Frontend Web:** React 18, Vite, Tailwind CSS, React Router v6, Axios, Lucide Icons.
- **Mobile:** React Native, Expo (SDK 58), React Navigation v7, AsyncStorage.
- **Deployment:** Vercel (Frontend & Serverless API), Expo EAS (Android APK Build).

---

## 🚀 Fitur Utama & Kriteria Penilaian (LO 3)

1. **Autentikasi & Profil Pengguna**
   - Registrasi akun baru dan login dengan JWT token.
   - Penyimpanan sesi aman di `localStorage` (Web) dan `AsyncStorage` (Mobile).
   - Halaman profil pengguna beserta riwayat favorit.

2. **Katalog Konten & Pencarian Terpadu**
   - Pengelompokan kategori: Film, Serial TV, dan Musik.
   - Pencarian real-time dengan debouncing.
   - Dukungan pagination (`page`, `limit`) pada sisi API backend.

3. **Detail Konten & Media Player**
   - Informasi detail: sinopsis, rating, genre, durasi/album, dan daftar pemeran (*cast*).
   - Pemutar trailer video (YouTube embedded) dan pemutar sampel audio musik.

4. **Favorit & Sinkronisasi Data**
   - Tambah dan hapus konten favorit yang tersinkronisasi lintas web dan mobile melalui database cloud.

5. **Ulasan & Rating Bintang**
   - Pengguna dapat memberikan ulasan teks dan skor rating (1–5 bintang) pada konten.
   - Perhitungan rata-rata skor ulasan komunitas secara dinamis.

---

## 📡 Dokumentasi Endpoint REST API

Host: `https://binusflix-api.vercel.app`

### Format Response Standard & Pagination
Endpoint yang mengembalikan daftar item (seperti `/api/content/explore` dan `/api/favorites`) menggunakan format pagination:
```json
{
  "success": true,
  "count": 10,
  "pagination": {
    "page": 1,
    "limit": 10,
    "totalItems": 18,
    "totalPages": 2,
    "hasMore": true
  },
  "data": [ ... ]
}
```

### Ringkasan Endpoint

| Method | Endpoint | Query / Body Params | Keterangan | Auth |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | - | Cek uptime server | Tidak |
| `POST` | `/api/auth/register` | `{ username, email, password, fullName }` | Daftar akun | Tidak |
| `POST` | `/api/auth/login` | `{ email, password }` | Login & dapatkan token JWT | Tidak |
| `GET` | `/api/auth/me` | - | Data profil user yang sedang login | Ya (Bearer) |
| `GET` | `/api/content/explore` | `type`, `search`, `page`, `limit` | Mengambil katalog dengan filter dan pagination | Tidak |
| `GET` | `/api/content/featured` | - | Mengambil banner unggulan | Tidak |
| `GET` | `/api/content/detail/:type/:id` | - | Detail konten, rating, dan status favorit | Opsional |
| `GET` | `/api/favorites` | `type`, `page`, `limit` | Mengambil daftar favorit user | Ya (Bearer) |
| `POST` | `/api/favorites` | `{ contentId, contentType, title, ... }` | Menambahkan ke favorit | Ya (Bearer) |
| `DELETE`| `/api/favorites/:contentId` | - | Menghapus dari favorit | Ya (Bearer) |
| `GET` | `/api/reviews/:contentId` | `page`, `limit` | Mengambil ulasan konten tertentu | Tidak |
| `POST` | `/api/reviews` | `{ contentId, contentType, rating, reviewText }` | Mengirim ulasan & rating | Ya (Bearer) |

---

## 💻 Panduan Menjalankan Secara Lokal

### 1. Backend Server
```bash
cd backend
npm install
cp .env.example .env    # Konfigurasi MONGO_URI dan JWT_SECRET
npm run seed            # Mengisi data demo awal ke MongoDB
npm run dev             # Server berjalan di http://localhost:5000
```

### 2. Frontend Web
```bash
cd frontend
npm install
npm run dev             # Web berjalan di http://localhost:5173
```

### 3. Mobile App (Expo)
```bash
cd mobile
npm install
npx expo start
```
- Pindai QR Code dengan aplikasi **Expo Go** di ponsel fisik Android / iOS.
- Tekan `w` di terminal untuk menjalankan versi web mobile.

#### Build Standalone APK Android (EAS Build)
```bash
cd mobile
npx eas build -p android --profile preview
```

---

## 📂 Struktur Direktori

```
binusflix/
├── backend/            # Express.js REST API & MongoDB Atlas
│   ├── api/            # Serverless handler untuk Vercel
│   ├── config/         # Koneksi MongoDB Mongoose
│   ├── controllers/    # Controller Auth, Content, Favorite, Review
│   ├── middleware/     # JWT Auth Middleware
│   ├── models/         # Schema User, Content, Favorite, Review
│   ├── routes/         # Express Route Handlers
│   ├── services/       # Integrasi open API TVMaze & iTunes
│   ├── seed.js         # Script seeder data awal
│   └── server.js       # Entry point Express
├── frontend/           # Aplikasi Web (React 18 + Vite)
│   ├── src/
│   │   ├── api/        # Axios client & JWT interceptor
│   │   ├── components/ # Komponen UI (Navbar, Footer, HeroBanner, ContentCard, dll)
│   │   ├── context/    # AuthContext (State login & profil)
│   │   └── pages/      # Halaman aplikasi (Home, Detail, Favorites, Login, Profile)
│   └── vercel.json     # Konfigurasi SPA rewrite Vercel
├── mobile/             # Aplikasi Mobile (React Native + Expo SDK 58)
│   ├── src/
│   │   ├── api/        # Axios mobile client
│   │   ├── components/ # ContentCard native
│   │   ├── constants/  # Theme & default API URL
│   │   ├── context/    # AuthContext & token AsyncStorage
│   │   ├── navigation/ # Tab & Stack Navigation
│   │   └── screens/    # Screen aplikasi (Home, Detail, Favorites, Login, Profile)
│   ├── app.json        # Konfigurasi Expo & EAS Project ID
│   └── eas.json        # Profil build EAS (preview APK & production)
└── docs/               # Laporan Proyek & Spesifikasi Figma / FigCraft
    ├── binusflix_design.fig         # Berkas Figma native (11 Frame)
    ├── binusflix_design.figcraft    # Berkas FigCraft native
    ├── binusflix_design_overview.png # Render kanvas menyeluruh resolusi tinggi
    ├── figma_exports/               # 11 Frame PNG render individu
    ├── DOKUMENTASI_PROYEK.md
    ├── DOKUMENTASI_PROYEK.html
    └── FIGMA_DESIGN_SYSTEM.md
```

---

## 🔒 Catatan Keamanan
Kredensial database MongoDB Atlas dan JWT Secret tidak disimpan di dalam repositori publik. Konfigurasi untuk deployment live diinjeksi melalui environment variables pada Vercel.
