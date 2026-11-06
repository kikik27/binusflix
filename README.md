# 🎬 BINUSFLIX
### Specialized Entertainment Hub Platform (Film, Serial TV, & Musik)
**Proyek Tugas Akhir Pemrograman Web & Mobile — BINUS University**

---

## 📌 Ringkasan Proyek
**BINUSFLIX** adalah platform hiburan digital (*mini specialized platform*) resmi bernuansa merah tegas Almamater BINUS yang menyatukan katalog **Film Layar Lebar**, **Serial Televisi**, dan **Musik** dalam satu ekosistem interaktif modern. Aplikasi ini tersedia dalam dua wujud:
1. **Aplikasi Web**: Dibangun menggunakan **React JS**, Vite, Tailwind CSS, dan React Router.
2. **Aplikasi Mobile**: Dibangun menggunakan **React Native & Expo (SDK 58)**, React Navigation, dan AsyncStorage (Dapat langsung dijalankan melalui QR code pada aplikasi **Expo Go**).
3. **Backend REST API**: Menggunakan **Node.js / Express.js** dan basis data cloud **MongoDB Atlas**.

---

## 🏆 Pemenuhan Kriteria Penilaian (LO 3)
- [x] **[LO 3 – 10 Points] Desain UI/UX menggunakan Figma**: Wireframes, design tokens, typography, dan interactive prototype (`docs/FIGMA_DESIGN_SYSTEM.md`).
- [x] **[LO 3 – 15 Points] Aplikasi Web Minimal 4 Halaman**: Memiliki 6 halaman responsif (Register, Login, Beranda/Explore, Detail Konten, Favorit Saya, dan Profil).
- [x] **[LO 3 – 15 Points] Aplikasi Mobile Minimal 4 Halaman**: Memiliki 6 screen mobile (Login, Register, Home, Detail Konten dengan Trailer Video & Audio Player, Favorites, Profil).
- [x] **[LO 3 – 15 Points] Aplikasi Server dan Database**: REST API Express.js lengkap dengan otentikasi JWT, Bcrypt password hashing, CRUD Favorit, Ulasan & Rating, integrasi open API TVMaze & Apple iTunes, serta MongoDB Atlas.

---

## 🌐 URL Deployment Live (Production)
- **Frontend Web App (Vercel):** [https://binusflix.vercel.app](https://binusflix.vercel.app)
- **Backend REST API (Vercel):** [https://binusflix-api.vercel.app](https://binusflix-api.vercel.app)
  - API Health Check: `https://binusflix-api.vercel.app/api/health`
  - API Explore: `https://binusflix-api.vercel.app/api/content/explore`
- **Mobile Expo Dashboard (EAS):** [https://expo.dev/accounts/kyy27/projects/binusflix](https://expo.dev/accounts/kyy27/projects/binusflix)
  - EAS Project ID: `62ae8bf5-0fc2-449e-a9ce-fc900df4161c`

---

## 🔑 Akun Demo Pengujian (Pre-Seeded)
Tersedia akun demonstrasi siap pakai (lengkap dengan tombol **"Isi Otomatis"** di halaman Login):
- **Email:** `demo@binus.ac.id`
- **Password:** `password123`
- **Username:** `binusian_user`
- **Nama:** Binus Student Demo

---

## 🚀 Panduan Menjalankan Aplikasi

### 1. Backend Server & Database
```bash
cd backend
npm install
cp .env.example .env   # Sesuaikan kredensial MongoDB & JWT Secret
npm run seed           # Mengisi data awal akun demo & katalog konten
npm run dev            # Menjalankan server pada http://localhost:5000
```

### 2. Frontend Web (React JS + Vite)
```bash
cd frontend
npm install
npm run dev            # Menjalankan web pada http://localhost:5173
```
Buka browser di: `http://localhost:5173`

### 3. Mobile App (React Native Expo)
```bash
cd mobile
npm install
npx expo start
```
- Pindai QR Code dengan aplikasi **Expo Go** di Android / iOS fisik.
- Tekan `w` di terminal untuk pratinjau di Web Browser.

---

## 📂 Struktur Direktori
```
binusflix/
├── backend/            # Express.js REST API & MongoDB Mongoose Models
│   ├── config/         # Koneksi MongoDB Atlas
│   ├── controllers/    # Auth, Content, Favorite, Review Controllers
│   ├── middleware/     # JWT Auth Middleware
│   ├── models/         # User, Content, Favorite, Review Schemas
│   ├── routes/         # Express API Route Handlers
│   ├── services/       # Aggregator Service (TVMaze & iTunes Search API)
│   ├── seed.js         # Seeder database awal
│   └── server.js       # Entry point Express API
├── frontend/           # React.js Vite Web Application
│   ├── src/
│   │   ├── api/        # Axios API Client dengan JWT interceptor
│   │   ├── components/ # Navbar, Footer, HeroBanner, ContentCard, TrailerModal
│   │   ├── context/    # AuthContext (Login, Register, Session)
│   │   ├── pages/      # Home, Detail, Favorites, Login, Register, Profile
│   │   ├── App.jsx     # Route Layout
│   │   └── main.jsx    # React Mount Entry
│   └── vite.config.js  # Vite Proxy & Server Config
├── mobile/             # React Native Expo Mobile Application
│   ├── src/
│   │   ├── api/        # Axios Mobile Client
│   │   ├── components/ # ContentCard Native
│   │   ├── constants/  # Theme, Colors, Default API URL
│   │   ├── context/    # Mobile AuthContext & Token Storage
│   │   ├── navigation/ # Tab & Stack Navigation
│   │   └── screens/    # Home, Detail, Favorites, Login, Register, Profile
│   ├── App.js          # Expo Root
│   └── app.json        # Expo Metadata
└── docs/               # Laporan Lengkap, Spesifikasi Figma & Bukti Proyek
    ├── DOKUMENTASI_PROYEK.md
    ├── DOKUMENTASI_PROYEK.html
    └── FIGMA_DESIGN_SYSTEM.md
```

---

## 🔒 Catatan Keamanan
Kredensial database MongoDB dan JWT Secret tidak disimpan dalam commit git publik. Harap gunakan file `.env.example` sebagai referensi konfigurasi lingkungan lokal.
