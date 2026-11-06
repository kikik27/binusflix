# 🎬 BINUSFLIX — Specialized Entertainment Hub

[![Web App](https://img.shields.io/badge/Web_Live-https%3A%2F%2Fbinusflix.vercel.app-E50914?style=for-the-badge&logo=vercel&logoColor=white)](https://binusflix.vercel.app)
[![API Gateway](https://img.shields.io/badge/API_Live-https%3A%2F%2Fbinusflix--api.vercel.app-00D2FF?style=for-the-badge&logo=express&logoColor=white)](https://binusflix-api.vercel.app)
[![Expo EAS](https://img.shields.io/badge/Expo_EAS-Connected-4630EB?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/accounts/kyy27/projects/binusflix)
[![Database](https://img.shields.io/badge/MongoDB_Atlas-Connected-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://cloud.mongodb.com)

> **Proyek Tugas Akhir Pemrograman Web & Mobile — BINUS University**  
> Mini specialized entertainment platform resmi bernuansa merah tegas Almamater BINUS yang memadukan katalog **Film Layar Lebar**, **Serial Televisi**, dan **Musik** dalam satu ekosistem interaktif modern.

---

## 🌐 Tautan Cepat & Akses Publik (Live Deployments)

| Layanan | Platform | URL Akses Langsung | Keterangan |
| :--- | :--- | :--- | :--- |
| **Aplikasi Web** | Vercel (SPA Vite) | 🚀 [**https://binusflix.vercel.app**](https://binusflix.vercel.app) | Antarmuka pengguna responsif (Desktop & Mobile Browser) |
| **Backend REST API** | Vercel Serverless | 📡 [**https://binusflix-api.vercel.app**](https://binusflix-api.vercel.app) | Gateway API utama, JWT auth & integrasi MongoDB |
| **API Health Check** | Vercel Serverless | 🟢 [**https://binusflix-api.vercel.app/api/health**](https://binusflix-api.vercel.app/api/health) | Status uptime & koneksi server |
| **API Katalog Explore** | Vercel Serverless | 🎬 [**https://binusflix-api.vercel.app/api/content/explore**](https://binusflix-api.vercel.app/api/content/explore) | Katalog gabungan Film, TV Series, & Musik |
| **Mobile App (EAS)** | Expo Application Services | 📱 [**Expo Project Dashboard**](https://expo.dev/accounts/kyy27/projects/binusflix) | Manajemen build & cloud artifacts Expo (ID: `62ae8bf5-0fc2-449e-a9ce-fc900df4161c`) |
| **Dokumentasi Lengkap** | Markdown | 📖 [**docs/DOKUMENTASI_PROYEK.md**](docs/DOKUMENTASI_PROYEK.md) | Panduan komprehensif, arsitektur & LO 3 |
| **Figma Design System** | Markdown | 🎨 [**docs/FIGMA_DESIGN_SYSTEM.md**](docs/FIGMA_DESIGN_SYSTEM.md) | Wireframes, color tokens, typography & specs |

---

## 🔑 Akun Demo Pengujian (Pre-Seeded)

Tersedia akun demonstrasi siap pakai (lengkap dengan fitur **"Isi Otomatis"** di form Login web & mobile):
- **Email:** `demo@binus.ac.id`
- **Password:** `password123`
- **Username:** `binusian_user`
- **Nama:** Binus Student Demo

---

## 🏆 Pemenuhan Kriteria Penilaian (LO 3)

- [x] **[LO 3 – 10 Points] Desain UI/UX menggunakan Figma**: Wireframes, design tokens, typography, dan interactive prototype ([docs/FIGMA_DESIGN_SYSTEM.md](docs/FIGMA_DESIGN_SYSTEM.md)).
- [x] **[LO 3 – 15 Points] Aplikasi Web Minimal 4 Halaman**: Memiliki 6 halaman responsif:
  - Register (`/register`)
  - Login (`/login`)
  - Beranda / Explore (`/`)
  - Detail Konten dengan Player Video & Musik (`/detail/:type/:id`)
  - Favorit Saya (`/favorites`)
  - Profil Pengguna (`/profile`)
- [x] **[LO 3 – 15 Points] Aplikasi Mobile Minimal 4 Halaman**: Memiliki 6 screen native pada React Native Expo:
  - Login Screen
  - Register Screen
  - Home / Explore Screen
  - Detail Konten dengan Trailer Video & Preview Audio
  - Favorites Screen
  - Profile Screen
- [x] **[LO 3 – 15 Points] Aplikasi Server dan Database**: REST API Express.js lengkap dengan:
  - Otentikasi JWT & Bcrypt password hashing
  - CRUD Favorit & Sinkronisasi Lintas Perangkat
  - Ulasan, Komentar & Rating Bintang
  - Integrasi Live Data TVMaze & Apple iTunes Search API
  - Basis data cloud MongoDB Atlas

---

## 📡 Daftar Endpoint REST API Publik

Semua endpoint berikut aktif dan dapat diakses langsung pada host: `https://binusflix-api.vercel.app`

### 1. Otentikasi
| Method | Endpoint | Deskripsi | Auth |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Mendaftarkan akun mahasiswa baru | Publik |
| `POST` | `/api/auth/login` | Autentikasi dan penerbitan JWT token | Publik |
| `GET` | `/api/auth/me` | Mengambil data profil pengguna yang login | Bearer Token |
| `PUT` | `/api/auth/profile` | Memperbarui data pengguna | Bearer Token |

### 2. Konten Hiburan (Film, TV Series, Musik)
| Method | Endpoint | Deskripsi | Auth |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/content/explore` | Mengambil seluruh katalog (filter query: `type`, `limit`, `search`) | Publik |
| `GET` | `/api/content/featured` | Mengambil item unggulan untuk carousel / hero banner | Publik |
| `GET` | `/api/content/detail/:type/:id` | Detail spesifik konten beserta video/audio preview | Publik |

### 3. Favorit Saya
| Method | Endpoint | Deskripsi | Auth |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/favorites` | Daftar konten yang difavoritkan pengguna | Bearer Token |
| `POST` | `/api/favorites` | Menambahkan konten ke daftar favorit | Bearer Token |
| `DELETE` | `/api/favorites/:contentId` | Menghapus konten dari favorit | Bearer Token |
| `GET` | `/api/favorites/check/:contentId` | Cek status apakah konten sudah difavoritkan | Bearer Token |

### 4. Ulasan & Rating
| Method | Endpoint | Deskripsi | Auth |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/reviews/:contentId` | Mengambil semua ulasan untuk suatu konten | Publik |
| `POST` | `/api/reviews` | Mengirimkan ulasan & skor rating (1–10) | Bearer Token |
| `DELETE` | `/api/reviews/:id` | Menghapus ulasan milik pengguna | Bearer Token |

---

## 🚀 Panduan Menjalankan & Membangun Aplikasi

### A. Menjalankan Mobile App (React Native Expo)

Aplikasi mobile sudah terhubung ke backend produksi di Vercel:

```bash
cd mobile
npm install
npx expo start
```
- Pindai QR Code menggunakan aplikasi **Expo Go** pada ponsel fisik Android / iOS.
- Tekan `w` di terminal jika ingin menjalankan versi Web Mobile.

#### Build Standalone APK Android (Cloud EAS Build)
Untuk menghasilkan file `.apk` mandiri yang dapat di-install langsung tanpa Expo Go:
```bash
cd mobile
npx eas build -p android --profile preview
```

---

### B. Menjalankan Frontend Web Secara Lokal

```bash
cd frontend
npm install
npm run dev
```
Akses di browser: `http://localhost:5173`

---

### C. Menjalankan Backend Server Secara Lokal

```bash
cd backend
npm install
cp .env.example .env   # Sesuaikan kredensial MongoDB & JWT Secret jika diperlukan
npm run seed           # (Opsional) Mengisi data awal akun demo & katalog konten
npm run dev            # Menjalankan server pada http://localhost:5000
```

---

## 📂 Struktur Direktori Proyek

```
binusflix/
├── backend/            # Express.js REST API & MongoDB Atlas
│   ├── api/            # Serverless entrypoint untuk Vercel (index.js)
│   ├── config/         # Koneksi Mongoose ke MongoDB Atlas
│   ├── controllers/    # Handler Auth, Content, Favorite, Review
│   ├── middleware/     # JWT Auth Verification Middleware
│   ├── models/         # Mongoose Schemas (User, Content, Favorite, Review)
│   ├── routes/         # Express Route Handlers
│   ├── services/       # Aggregator Service (TVMaze & iTunes Search API)
│   ├── seed.js         # Seeder data katalog & akun demonstrasi
│   ├── server.js       # Entry point utama Express
│   └── vercel.json     # Konfigurasi routing serverless Vercel
├── frontend/           # React.js Vite Web Application
│   ├── src/
│   │   ├── api/        # Axios API Client dengan JWT Interceptor
│   │   ├── components/ # Navbar, Footer, HeroBanner, ContentCard, TrailerModal
│   │   ├── context/    # AuthContext (Login, Register, State Session)
│   │   ├── pages/      # Home, Detail, Favorites, Login, Register, Profile
│   │   ├── App.jsx     # Route Layout React Router
│   │   └── main.jsx    # React Mount Entry
│   └── vercel.json     # Konfigurasi Single Page Application (SPA) Vercel
├── mobile/             # React Native Expo Mobile Application (SDK 58)
│   ├── src/
│   │   ├── api/        # Axios Mobile Client
│   │   ├── components/ # ContentCard Native
│   │   ├── constants/  # Theme Tokens, Warna Almamater BINUS, Live API URL
│   │   ├── context/    # Mobile AuthContext & AsyncStorage Token Storage
│   │   ├── navigation/ # Tab & Stack Navigation (React Navigation v7)
│   │   └── screens/    # Home, Detail, Favorites, Login, Register, Profile
│   ├── App.js          # Expo Root
│   ├── app.json        # Expo Metadata & EAS Project Configuration
│   └── eas.json        # Profil build EAS (preview apk, production aab)
└── docs/               # Dokumentasi Proyek, Spesifikasi Figma & Bukti
    ├── DOKUMENTASI_PROYEK.md
    ├── DOKUMENTASI_PROYEK.html
    └── FIGMA_DESIGN_SYSTEM.md
```

---

## 🔒 Catatan Keamanan
Kredensial database MongoDB Atlas dan JWT Secret tidak disimpan dalam commit git publik. Environment variables diinjeksi secara aman melalui Vercel Dashboard dan file `.env.example` disediakan sebagai acuan konfigurasi lokal.
