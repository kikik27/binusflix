# 🎨 FIGMA & FIGCRAFT UI/UX DESIGN SYSTEM & SPECIFICATION
### BINUSFLIX (Entertainment Hub: Film, Serial TV, & Musik) — Pemenuhan LO 3 (10 Poin)

Dokumen ini memuat spesifikasi desain UI/UX, token desain, wireframe, serta panduan berkas desain **Figma (`.fig`)** dan **FigCraft (`.figcraft`)** untuk platform **BINUSFLIX** (Web & Mobile).

---

## 📁 Berkas Desain Tersedia (Figma & FigCraft)

Seluruh rancangan antarmuka telah dikonstruksi secara presisi dan diekspor ke dalam beberapa format yang dapat langsung diakses atau diimpor:

| Berkas / Direktori | Format | Deskripsi & Cara Akses |
| :--- | :--- | :--- |
| [`docs/binusflix_design.fig`](binusflix_design.fig) | **Figma Binary (`.fig`)** | Berkas standar Figma. Buka di Figma Web / Desktop via menu **Import file**. Berisi 11 frame lengkap (5 Web, 5 Mobile, 1 Design System). |
| [`docs/binusflix_design.figcraft`](binusflix_design.figcraft) | **FigCraft Native** | Berkas proyek FigCraft. Buka langsung dengan aplikasi FigCraft Desktop. |
| [`docs/binusflix_design_overview.png`](binusflix_design_overview.png) | **High-Res Canvas Preview** | Render keseluruhan kanvas desain (resolusi 7840 × 2950 px) mencakup seluruh 11 frame. |
| [`docs/figma_exports/`](figma_exports/) | **Individual Frame PNGs** | Folder berisi 11 gambar PNG hasil render individu untuk setiap halaman dan screen. |

---

## 🖼️ Galeri Render Frame Desain

Berikut adalah daftar frame yang tersedia di dalam berkas Figma dan FigCraft:

### A. Desain Web (Desktop 1440 × 900 px)
1. **Web - 1. Beranda (Explore)**: [`docs/figma_exports/Web - 1. Beranda (Explore).png`](figma_exports/Web%20-%201.%20Beranda%20(Explore).png)
   - Hero banner sinematik ("Interstellar") dengan skor bintang, sinopsis, tombol tonton trailer, dan detail lengkap.
   - Search bar real-time dan category pills (*Semua*, *Film Layar Lebar*, *Serial TV*, *Musik & Lagu*).
   - Dynamic grid kartu konten dengan poster 2:3, category badges, bookmark toggle, dan rating.
2. **Web - 2. Detail Konten**: [`docs/figma_exports/Web - 2. Detail Konten.png`](figma_exports/Web%20-%202.%20Detail%20Konten.png)
   - Backdrop header dengan gradien gelap, metadata rilis (2014, 169 Menit, Sci-Fi/Drama), rating 4.9.
   - Embedded trailer player (YouTube 16:9) dan audio preview player untuk musik.
   - Sinopsis alur cerita, daftar pemeran (*cast chips*), tombol simpan ke favorit.
   - Formulir kirim rating bintang (1–5) & teks ulasan, beserta daftar ulasan komunitas terverifikasi.
3. **Web - 3. Favorit Saya**: [`docs/figma_exports/Web - 3. Favorit Saya.png`](figma_exports/Web%20-%203.%20Favorit%20Saya.png)
   - Header koleksi dengan filter kategori dan indikator jumlah konten tersimpan.
   - Grid kartu favorit dengan tombol cepat hapus dari koleksi (*remove action*).
   - Navigasi pagination (*Halaman 1 dari 2*).
4. **Web - 4. Login & Register**: [`docs/figma_exports/Web - 4. Login & Register.png`](figma_exports/Web%20-%204.%20Login%20&%20Register.png)
   - Split-card authentication modal dengan tab toggle Masuk / Daftar.
   - Banner tombol interaktif **"1-Click Isi Otomatis Akun Demo"** (`demo@binus.ac.id`).
   - Input username, email, password dengan validasi status.
5. **Web - 5. Profil Pengguna**: [`docs/figma_exports/Web - 5. Profil Pengguna.png`](figma_exports/Web%20-%205.%20Profil%20Pengguna.png)
   - Kartu profil pengguna dengan foto avatar berlingkar aksen (*crimson ring*), username `@binusian_user`, dan role Binusian Member.
   - Metrik statistik: Total Favorit (12) dan Total Ulasan (5).
   - Formulir pengubahan profil (Nama, Avatar URL, Bio) dan tombol Keluar (*Logout*).

### B. Desain Mobile (Mobile 390 × 844 px — iPhone 14 / Modern Android)
1. **Mobile - 1. Beranda**: [`docs/figma_exports/Mobile - 1. Beranda.png`](figma_exports/Mobile%20-%201.%20Beranda.png)
   - Sticky top bar dengan logo BINUSFLIX dan avatar mini.
   - Hero spotlight card dengan tombol tonton cepat.
   - Horizontal category selector pills.
   - Grid 2-kolom kartu konten dan Bottom Navigation Bar (Beranda, Favorit, Profil).
2. **Mobile - 2. Detail Konten**: [`docs/figma_exports/Mobile - 2. Detail Konten.png`](figma_exports/Mobile%20-%202.%20Detail%20Konten.png)
   - Tampilan vertikal responsif dengan video trailer container dan player status.
   - Metadata ringkas, sinopsis lipat, tombol tambah favorit mengambang.
   - Interactive star rating picker dan form ulasan ulasan ringkas.
3. **Mobile - 3. Favorit Saya**: [`docs/figma_exports/Mobile - 3. Favorit Saya.png`](figma_exports/Mobile%20-%203.%20Favorit%20Saya.png)
   - Header ringkas dengan filter chip.
   - Daftar konten favorit berformat card dengan tombol hapus satu ketukan.
4. **Mobile - 4. Login**: [`docs/figma_exports/Mobile - 4. Login.png`](figma_exports/Mobile%20-%204.%20Login.png)
   - Form autentikasi satu tangan dengan tombol **"1-Tap Masuk Akun Demo"**.
   - Input email dan password serta tautan registrasi baru.
5. **Mobile - 5. Profil**: [`docs/figma_exports/Mobile - 5. Profil.png`](figma_exports/Mobile%20-%205.%20Profil.png)
   - Header profil terpusat dengan avatar, nama, dan email.
   - Kartu statistik horizontal dan tombol aksi Akun / Keluar.

### C. Design System & UI Tokens
- **Design System & UI Tokens**: [`docs/figma_exports/Design System & UI Tokens.png`](figma_exports/Design%20System%20&%20UI%20Tokens.png)
  - Color Swatches: Primary Dark (`#141414`), Surface Card (`#181818`), Brand Crimson Red (`#E50914`), Match Green (`#46D369`), Indigo TV (`#6366F1`), Emerald Music (`#10B981`), Rating Gold (`#F59E0B`).
  - Typography Scale: Heading 1 (44px), Heading 2 (24px), Heading 3 (16px), Body (14px), Caption (11px).
  - Component Library: Primary Button, Outline Button, Category Badges, Form Inputs, Card Containers.

---

## 🎨 Design Tokens & Style Guide

### A. Color Palette
| Token Name | Hex Code | Penggunaan |
| :--- | :--- | :--- |
| `color-bg-primary` | `#141414` | Latar belakang canvas utama (*Netflix True Dark*) |
| `color-surface-card` | `#181818` | Latar kartu konten & modal panel |
| `color-brand-primary` | `#E50914` | Aksen tombol utama, badge film layar lebar, dan indikator aktif (*Crimson Red*) |
| `color-match-green` | `#46D369` | Indikator persentase kecocokan (*98% Cocok*) |
| `color-accent-tv` | `#6366F1` | Badge serial TV (*Indigo Blue*) |
| `color-accent-music` | `#10B981` | Badge musik & lagu (*Emerald Green*) |
| `color-rating-gold` | `#F59E0B` | Bintang penilaian rating & highlight skor (*Amber Gold*) |
| `color-text-white` | `#FFFFFF` | Teks judul utama & kontras tinggi |
| `color-text-muted` | `#94A3B8` | Teks sekunder, sinopsis, & metadata |

### B. Typography Scale
- **Font Family:** `Inter`, `Plus Jakarta Sans`, sans-serif
- **Heading 1 (Hero Title):** 44px / Extra-Bold 800
- **Heading 2 (Section Title):** 24px / Bold 700
- **Heading 3 (Card / Modal Title):** 16px / Semi-Bold 600
- **Body Regular:** 14px / Regular 400
- **Caption / Badge:** 11px / Bold 700 (Uppercase)

---

## 🔄 Alur Interaksi Prototipe (User Flow)

1. **Alur Autentikasi:**
   - Pengguna belum login mengakses halaman publik -> Membuka halaman/modal Login.
   - Menekan tombol **"1-Click Isi Otomatis Akun Demo"** -> Form terisi otomatis -> Klik Masuk -> Token JWT tersimpan -> Diarahkan ke Beranda dengan navbar memuat nama dan avatar user.
2. **Alur Eksplorasi & Filter:**
   - Pengguna menekan tombol pill kategori (*Film*, *Serial TV*, atau *Musik*) -> Daftar kartu konten terfilter secara real-time.
   - Pengguna mengetik kata kunci pada kolom pencarian -> Sistem melakukan filtering real-time dengan paginasi.
3. **Alur Media Player & Ulasan:**
   - Pengguna mengklik salah satu kartu konten -> Berpindah ke Halaman Detail.
   - Pemutar trailer video / sampel audio dapat langsung diputar secara interaktif.
   - Pengguna memilih rating bintang (1–5) pada formulir ulasan -> Mengetik testimoni -> Menekan "Kirim Ulasan" -> Ulasan tersimpan ke database MongoDB dan langsung muncul di daftar ulasan komunitas.
4. **Alur Manajemen Favorit:**
   - Pengguna menekan ikon bookmark hati pada kartu atau halaman detail -> Konten otomatis tersimpan ke koleksi database cloud pengguna.
   - Pengguna membuka halaman "Favorit Saya" -> Konten langsung tampil di daftar koleksi pribadi lintas platform (Web dan Mobile).

---

## 🛠️ Cara Membuka & Mengedit Desain

1. **Di Figma Web / Desktop:**
   - Kunjungi [Figma](https://www.figma.com).
   - Klik **Import** di sudut kanan atas dasbor Figma.
   - Pilih berkas [`docs/binusflix_design.fig`](binusflix_design.fig).
   - Seluruh 11 frame, layer komponen, teks, dan tata letak akan terbuka secara native.

2. **Di FigCraft Desktop:**
   - Buka aplikasi FigCraft.
   - Buka berkas [`docs/binusflix_design.figcraft`](binusflix_design.figcraft) atau jalankan via terminal:
     ```powershell
     & "C:\Program Files\ArtCraft\FigCraft\figcraft.exe" "E:\Project\BINUS\entertainment-hub\docs\binusflix_design.figcraft"
     ```
