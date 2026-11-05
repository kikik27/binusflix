# 🎨 FIGMA UI/UX DESIGN SYSTEM & PROTOTYPE SPECIFICATION
### Entertainment Hub (Film, Serial TV, & Musik) — LO 3 (10 Points)

---

## 1. Tautan Figma
- **Figma Design Link:** [https://www.figma.com/design/entertainment-hub-binus-2026](https://www.figma.com/design/entertainment-hub-binus-2026)
- **Figma Interactive Prototype Link:** [https://www.figma.com/proto/entertainment-hub-binus-2026](https://www.figma.com/proto/entertainment-hub-binus-2026)

---

## 2. Brand Identity & Design Tokens

### A. Color Palette
| Token Name | Hex Code | Tampilan / Penggunaan |
| :--- | :--- | :--- |
| `color-bg-primary` | `#141414` | Latar belakang utama aplikasi (*Netflix / Idlix True Dark Black*) |
| `color-surface-card` | `#181818` | Latar belakang kartu konten & panel sekunder (*Netflix Dark Surface*) |
| `color-brand-primary` | `#E50914` | Aksen tombol utama, badge film layar lebar, dan indikator aktif (*Netflix Crimson Red*) |
| `color-match-green` | `#46D369` | Indikator persentase kecocokan (*98% Cocok - Netflix Match Score*) |
| `color-accent-tv` | `#6366F1` | Badge serial TV (*Indigo Blue*) |
| `color-accent-music` | `#10B981` | Badge musik & lagu (*Emerald Green*) |
| `color-rating-gold` | `#F59E0B` | Bintang penilaian rating & highlight skor (*Amber Gold*) |
| `color-text-white` | `#FFFFFF` | Teks judul utama & kontras tinggi |
| `color-text-muted` | `#94A3B8` | Teks sekunder, sinopsis, & metadata rilis |

### B. Typography Scale
- **Display Font:** `Plus Jakarta Sans` / `Inter`, sans-serif
- **Heading 1 (Hero Title):** 44px / Bold 900
- **Heading 2 (Section Title):** 24px / Bold 800
- **Heading 3 (Card / Modal Title):** 16px / Semi-Bold 700
- **Body Regular:** 13px - 14px / Regular 400
- **Caption / Badge:** 10px - 11px / Bold 700 (Uppercase, Tracking +0.05em)

---

## 3. Spesifikasi Wireframe & Layout Screen

### Screen 1: Register Page & Screen
- **Frame Size Web:** 1440 x 900 px
- **Frame Size Mobile:** 390 x 844 px (iPhone 14 / modern Android)
- **Komponen:**
  1. Header Logo Entertainment Hub dengan ikon gradien berkilau (*sparkle badge*).
  2. Input Field Nama Lengkap.
  3. Input Field Username dengan prefix `@`.
  4. Input Field Email.
  5. Input Field Password dengan masked bullet dots.
  6. Tombol "Daftar Akun Baru" (Primary Crimson Red).
  7. Tautan beralih ke Halaman Masuk.

### Screen 2: Login Page & Screen
- **Komponen:**
  1. Header Sambutan "Selamat Datang Kembali".
  2. Banner Interaktif **"1-Click Isi Otomatis Akun Demo"** (`demo@binus.ac.id`).
  3. Input Email / Username.
  4. Input Password.
  5. Tombol "Masuk ke Akun".
  6. Error state toast alert jika kredensial tidak sesuai.

### Screen 3: Home / Explore Page & Screen
- **Komponen:**
  1. Sticky Navigation Bar dengan Brand Logo, Quick Links, Search Bar, dan Avatar Profil Pengguna.
  2. **Hero Carousel Banner:** Backdrop lanskap sinematik, skor bintang, sinopsis ringkas, tombol "Tonton Trailer / Dengar Audio", dan tombol "Detail Lengkap".
  3. **Live Search Bar & Kategori Filter Pills:**
     * `Semua Kategori`
     * `Film Layar Lebar` (Aksen Merah)
     * `Serial TV & Drama` (Aksen Indigo)
     * `Musik & Lagu` (Aksen Emerald)
  4. **Dynamic Grid Cards:**
     * Aspect Ratio poster 2:3
     * Pill kategori di sudut kiri atas
     * Tombol bookmark hati di sudut kanan atas
     * Rating bintang di sudut kiri bawah
     * Judul, sutradara/artis, dan tahun rilis

### Screen 4: Detail Content Page & Screen
- **Komponen:**
  1. High-resolution Backdrop Header dengan gradien *fade-to-black*.
  2. **Embedded Media Player:**
     * Video player YouTube responsif 16:9 untuk Film & TV.
     * Audio Preview Player 30 detik untuk Lagu Musik.
  3. Thumbnail poster vertikal dengan tombol *Quick Play*.
  4. Informasi metadata: Tanggal rilis, durasi film / nama album, dan genre.
  5. Sinopsis & Ringkasan alur cerita.
  6. Daftar nama pemeran / artis (*actor chips*).
  7. Tombol interaktif "Tambah ke Favorit" (*heart toggle*).
  8. **Formulir Rating & Ulasan Komunitas:**
     * Star Selector 1 s.d. 5 bintang
     * Textarea penulisan opini / ulasan
     * Tombol submit ulasan
  9. Daftar ulasan terverifikasi dari pengguna lain.

### Screen 5: Favorites / Watchlist Page & Screen
- **Komponen:**
  1. Header halaman "Koleksi Favorit Saya".
  2. Filter pill kategori (Semua, Film, Serial TV, Musik).
  3. Grid kartu konten favorit yang tersimpan di akun pengguna.
  4. Aksi cepat penghapusan dari daftar favorit.
  5. Tampilan *Empty State* edukatif jika belum ada konten yang disimpan.

### Screen 6: Profile & User Preferences Page & Screen
- **Komponen:**
  1. Foto avatar profil pengguna dengan ring glowing.
  2. Nama lengkap, username, email, dan biodata pengguna.
  3. Kartu metrik statistik: Total Favorit & Total Ulasan.
  4. Form pengubahan preferensi profil (nama, URL avatar, biodata).
  5. Tombol keluar akun (*logout*).

---

## 4. Alur Interaksi Prototipe (User Flow)
1. **Flow Autentikasi:** Guest membuka aplikasi -> Memilih Login -> Menekan tombol "Isi Otomatis" -> Berhasil masuk -> Diarahkan ke Beranda dengan status login aktif.
2. **Flow Eksplorasi & Filter:** Pengguna memilih tab "Musik" -> Grid secara instan menampilkan lagu-lagu hits -> Pengguna mengetik nama artis di kolom pencarian -> Hasil terfilter secara *real-time*.
3. **Flow Media & Ulasan:** Pengguna menekan salah satu kartu konten -> Masuk ke halaman Detail -> Memutar video trailer / sampel audio -> Memilih rating 5 bintang -> Mengetik ulasan -> Menekan tombol Kirim -> Ulasan langsung muncul pada daftar ulasan komunitas.
4. **Flow Bookmark:** Pengguna menekan ikon hati -> Konten tersimpan di database -> Pengguna membuka tab "Favorit" -> Konten langsung terlihat di daftar koleksi pribadi.
