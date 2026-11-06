# 🎨 FIGMA & FIGCRAFT UI/UX DESIGN SYSTEM & SPECIFICATION
### BINUSFLIX (Entertainment Hub: Film, Serial TV, & Musik) — Pemenuhan LO 3 (10 Poin)

Dokumen ini memuat spesifikasi desain UI/UX terpadu, token desain resmi, sistem tipografi, pemetaan ikon (Lucide React & Ionicons), serta spesifikasi komparatif 1:1 antara versi **Web Frontend** dan **Mobile App**. Seluruh desain tersedia dalam format **Figma (`.fig`)** dan **FigCraft (`.figcraft`)**.

---

## 📁 Berkas Desain Tersedia (Figma & FigCraft)

| Berkas / Direktori | Format | Deskripsi & Cara Akses |
| :--- | :--- | :--- |
| [`docs/binusflix_design.fig`](binusflix_design.fig) | **Figma Binary (`.fig`)** | Berkas resmi Figma. Buka di [Figma](https://www.figma.com) via menu **Import file**. Memuat 11 frame lengkap (5 Web, 5 Mobile, 1 Design System & UI Tokens). |
| [`docs/binusflix_design.figcraft`](binusflix_design.figcraft) | **FigCraft Native** | Berkas proyek FigCraft native. Buka langsung di FigCraft Desktop. |
| [`docs/binusflix_design_overview.png`](binusflix_design_overview.png) | **High-Res Canvas Preview** | Render keseluruhan kanvas desain (resolusi tinggi 7840 × 3050 px) mencakup 11 frame. |
| [`docs/figma_exports/`](figma_exports/) | **Individual Frame PNGs** | Folder berisi 11 gambar PNG hasil render individu untuk setiap layar. |

---

## 🎨 1. Design Tokens & Color Palette (100% Identik Web & Mobile)

Seluruh token warna disinkronisasikan 1:1 antara `frontend/tailwind.config.js` dan `mobile/src/constants/theme.js`:

| Token Name | Hex Code | Peran / Penggunaan Desain |
| :--- | :--- | :--- |
| `color-bg-primary` | `#07080A` | Latar belakang kanvas utama (*Obsidian Cinema Black*) |
| `color-surface-card` | `#0D1017` | Latar panel kartu konten, modal auth, dan review box |
| `color-surface-elevated`| `#141824` | Latar kolom input formulir, status chip, & state hover kartu |
| `color-border` | `rgba(255, 255, 255, 0.08)` | Garis batas tipis netral untuk pemisah kartu dan bar |
| `color-border-hover` | `rgba(229, 9, 20, 0.4)` | Efek border glowing saat elemen di-hover / aktif |
| `color-brand-primary` | `#E50914` | Aksen tombol utama, logo FLIX, active tab, & badge film (*BINUS Crimson Red*) |
| `color-brand-dark` | `#B20710` | State tombol saat ditekan (*pressed state*) |
| `color-match-green` | `#22C55E` | Skor kecocokan dinamis (*98% Cocok*) |
| `color-rating-gold` | `#FFB800` | Bintang penilaian rating & highlight skor (*Star Rating Gold*) |
| `color-accent-cyan` | `#00D2FF` | Badge resolusi 4K Ultra HD & chip status mahasiswa |
| `color-accent-tv` | `#6366F1` | Badge kategori Serial TV & Drama (*Indigo Blue*) |
| `color-accent-music` | `#10B981` | Badge kategori Musik Studio (*Emerald Green*) |
| `color-text-white` | `#FFFFFF` | Teks judul utama & tipografi kontras tinggi |
| `color-text-secondary`| `#D1D5DB` | Teks keterangan, metadata rilis, & subtitle |
| `color-text-muted` | `#9CA3AF` | Teks placeholder, sinopsis, & label non-aktif |
| `color-danger` | `#EF4444` | Tombol hapus favorit & tombol keluar (*Logout*) |

---

## 🔤 2. Typography System (Plus Jakarta Sans)

Desain Web dan Mobile menggunakan jenis font modern **Plus Jakarta Sans** (dengan fallback **Inter** dan sans-serif):

| Hierarki | Ukuran Font | Bobot (*Weight*) | Penggunaan |
| :--- | :--- | :--- | :--- |
| **Display Hero** | 40px – 42px | **Bold** (800) | Judul utama Billboard Hero Banner (*Dune: Part Two*) |
| **Heading 1** | 24px – 28px | **Bold** (700) | Judul halaman (*Daftar Koleksi Favorit Saya*, *Profil Pengguna*) |
| **Heading 2** | 18px – 20px | **Bold** (700) | Judul baris rail (*Sedang Tren Sekarang*, *Top 10 Hari Ini*) |
| **Heading 3** | 14px – 16px | **SemiBold** (600) | Judul kartu konten & header form input |
| **Body Regular** | 13px – 14px | **Regular** (400) | Teks sinopsis, isi testimoni ulasan, dan nilai input |
| **Caption / Badge** | 9px – 11px | **Bold** (700) | Category pills, badge `TOP 10`, `98% COCOK`, & `4K ULTRA HD` |

---

## 🔍 3. Pemetaan Ikonografi 1:1 (Lucide React vs Ionicons)

Untuk menjamin keseragaman pengalaman pengguna (UX consistency), setiap komponen yang menggunakan ikon memiliki padanan identik:

| Fungsi Komponen | Web (`lucide-react`) | Mobile (`@expo/vector-icons Ionicons`) | Letak Tampilan |
| :--- | :--- | :--- | :--- |
| **Katalog Film** | `<Film size={18} />` | `<Ionicons name="film" size={22} />` | Tab Beranda & Filter Pill |
| **Serial TV** | `<Tv size={18} />` | `<Ionicons name="tv-outline" size={16} />` | Filter Pill & Detail Badge |
| **Musik & Lagu** | `<Music size={18} />` | `<Ionicons name="musical-notes" size={16} />` | Filter Pill & Audio Player |
| **Pencarian** | `<Search size={18} />` | `<Ionicons name="search" size={16} />` | Search Input Box |
| **Koleksi Favorit** | `<Heart size={18} />` | `<Ionicons name="heart" size={22} />` | Bookmark Button & Tab Nav |
| **Rating Bintang** | `<Star size={16} />` | `<Ionicons name="star" size={16} />` | Score Badge & Review Picker |
| **Putar Media** | `<Play size={18} />` | `<Ionicons name="play" size={18} />` | Tombol Putar Trailer / Audio |
| **Profil User** | `<User size={18} />` | `<Ionicons name="person" size={22} />` | Avatar Dropdown & Tab Nav |
| **Hapus Favorit** | `<Trash2 size={16} />` | `<Ionicons name="trash-outline" size={16} />` | Kartu Favorit |
| **Autentikasi Email** | `<Mail size={16} />` | `<Ionicons name="mail-outline" size={16} />` | Input Email Login |
| **Kata Sandi** | `<Lock size={16} />` | `<Ionicons name="lock-closed-outline" size={16} />` | Input Password Login |
| **Kembali** | `<ArrowLeft size={18} />` | `<Ionicons name="arrow-back" size={20} />` | Top Action Bar Detail |
| **Keluar Akun** | `<LogOut size={16} />` | `<Ionicons name="log-out-outline" size={16} />` | Tombol Logout Profil |

---

## 🖼️ 4. Komparasi Layar & Frame Desain (Web vs Mobile)

### A. Beranda (Home & Explore)
* **Web (1440 × 1024 px):** [`Web - 1. Beranda (Explore).png`](figma_exports/Web%20-%201.%20Beranda%20(Explore).png)
* **Mobile (390 × 844 px):** [`Mobile - 1. Beranda.png`](figma_exports/Mobile%20-%201.%20Beranda.png)
* **Elemen Identik:**
  - Header: Logo `BINUS` (Putih) + `FLIX` (Merah `#E50914`) + Badge `PRO` + Avatar pengguna dengan ring merah.
  - Filter Pills: `Semua`, `Film`, `Serial TV`, `Musik` (pill pill merah saat aktif, abu-abu saat inaktif).
  - Search Input: Placeholder *"Cari film, serial TV, musik..."* dengan ikon search.
  - Billboard Hero Banner: "Dune: Part Two", badge `TOP 10` & `BINUS PRO`, `98% Cocok` hijau, `★ 8.6` emas, tombol `▶ Tonton Trailer` dan `+ Tambah ke Favorit`.
  - Content Cards: Rasio poster vertikal 2:3, badge kategori sudut kiri atas (`FILM`, `SERIAL TV`, `MUSIK`), badge rating `★ 8.9` sudut kanan atas, judul bold, dan persentase kecocokan.
  - Bottom Tab Bar (Mobile): Menampilkan `🎬 Beranda` (merah aktif), `❤️ Favorit`, dan `👤 Profil`.

### B. Detail Konten & Media Player
* **Web (1440 × 1024 px):** [`Web - 2. Detail Konten.png`](figma_exports/Web%20-%202.%20Detail%20Konten.png)
* **Mobile (390 × 844 px):** [`Mobile - 2. Detail Konten.png`](figma_exports/Mobile%20-%202.%20Detail%20Konten.png)
* **Elemen Identik:**
  - Tombol Navigasi: `← Kembali` ke katalog utama.
  - Cinema Media Player: Rasio 16:9, tombol putar melingkar merah `▶`, bar progres durasi merah `#E50914`, label "Trailer Resmi YouTube (1080p Full HD)".
  - Metadata & Badges: `FILM LAYAR LEBAR`, `98% COCOK`, `4K ULTRA HD`, `DOLBY ATMOS`.
  - Cast Chips: Kapsul pemeran (`Timothée Chalamet`, `Zendaya`, dll) dengan latar `#141824`.
  - Ulasan Komunitas: Pemilih rating bintang interaktif (1–5 bintang emas), formulir penulisan opini ulasan, tombol `Kirim Ulasan` merah, dan daftar kartu ulasan pengguna terverifikasi.

### C. Favorit Saya (Watchlist)
* **Web (1440 × 1024 px):** [`Web - 3. Favorit Saya.png`](figma_exports/Web%20-%203.%20Favorit%20Saya.png)
* **Mobile (390 × 844 px):** [`Mobile - 3. Favorit Saya.png`](figma_exports/Mobile%20-%203.%20Favorit%20Saya.png)
* **Elemen Identik:**
  - Header: "Daftar Koleksi Favorit Saya" dengan subjudul sinkronisasi cloud MongoDB Atlas.
  - Filter Tabs: `Semua`, `Film`, `Serial TV`, `Musik`.
  - Tombol Aksi: `🗑️ Hapus dari Favorit` warna merah pada setiap item koleksi.
  - Aksi Putar Cepat: `▶ Putar Sekarang`.

### D. Login & Autentikasi
* **Web (1440 × 900 px):** [`Web - 4. Login & Register.png`](figma_exports/Web%20-%204.%20Login%20&%20Register.png)
* **Mobile (390 × 844 px):** [`Mobile - 4. Login.png`](figma_exports/Mobile%20-%204.%20Login.png)
* **Elemen Identik:**
  - Logo `BINUSFLIX` dan teks sambutan mahasiswa.
  - **Banner 1-Click Demo Quick Autofill:** Kotak aksen merah `#1A1114` berisi `demo@binus.ac.id | password123` dengan tombol **"Pakai Akun Demo"**.
  - Kolom Input: Email dengan awalan ikon `✉️` dan Kata Sandi dengan ikon `🔒`.
  - Tombol Utama: `Masuk Sekarang ➔` (merah Crimson `#E50914`).
  - Tautan registrasi bagi pengguna baru.

### E. Profil & Pengaturan Akun
* **Web (1440 × 900 px):** [`Web - 5. Profil Pengguna.png`](figma_exports/Web%20-%205.%20Profil%20Pengguna.png)
* **Mobile (390 × 844 px):** [`Mobile - 5. Profil.png`](figma_exports/Mobile%20-%205.%20Profil.png)
* **Elemen Identik:**
  - Avatar pengguna berlingkar aksen merah menyala.
  - Informasi akun: `Binus Student Demo`, `Computer Science`, `@binusian_user`, `demo@binus.ac.id`, `NIM: 2602123456`.
  - **Kartu Metrik Statistik Terpadu:**
    * **12** Koleksi Favorit (Merah `#E50914`)
    * **18** Konten Ditonton (Cyan `#00D2FF`)
    * **5** Ulasan Dibuat (Hijau `#22C55E`)
  - Aksi Pengaturan Akun dan tombol `Keluar dari Akun (Logout)` berwarna merah peringatan `#EF4444`.

### F. Design System & UI Tokens
* **Design System (1440 × 950 px):** [`Design System & UI Tokens.png`](figma_exports/Design%20System%20&%20UI%20Tokens.png)
  - Color Swatches, Skala Tipografi, Master Button Library, Badges, dan Tabel Pemetaan Ikonografi Lucide vs Ionicons.

---

## 🛠️ Cara Membuka & Mengedit Desain

1. **Di Figma Web / Desktop:**
   - Kunjungi [Figma](https://www.figma.com).
   - Klik tombol **Import** di sudut kanan atas layar dasbor Figma.
   - Pilih berkas [`docs/binusflix_design.fig`](binusflix_design.fig).
   - Seluruh layer komponen, token teks, dan struktur frame akan langsung terbuka.

2. **Di FigCraft Desktop:**
   - Buka aplikasi FigCraft.
   - Buka berkas [`docs/binusflix_design.figcraft`](binusflix_design.figcraft) atau jalankan via terminal:
     ```powershell
     & "C:\Program Files\ArtCraft\FigCraft\figcraft.exe" "E:\Project\BINUS\entertainment-hub\docs\binusflix_design.figcraft"
     ```
