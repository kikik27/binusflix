"""
BINUSFLIX FigCraft & Figma Design Generator
Builds the complete multi-screen UI/UX design specification for Web & Mobile in FigCraft.
Outputs:
  - binusflix_design.figcraft (Native FigCraft project file)
  - binusflix_design.fig (Figma official file)
  - Individual exported frames (PNG)
"""

import json
import os
import subprocess

commands = []
current_id = 1  # root is 0, page is 1, next created node is 2

def next_id():
    global current_id
    current_id += 1
    return current_id

def add_frame(name, x, y, width, height, fill="#07080A"):
    fid = next_id()
    commands.append({
        "command": "frame.create",
        "params": {
            "name": name,
            "x": x,
            "y": y,
            "width": width,
            "height": height,
            "props": {
                "fill": fill
            }
        }
    })
    return fid

def add_rect(parent, name, x, y, width, height, fill="#0D1017", radius=0, stroke=None, stroke_w=1):
    rid = next_id()
    props = {"fill": fill}
    if radius > 0:
        props["cornerRadius"] = radius
    if stroke:
        props["stroke"] = stroke
        props["strokeWeight"] = stroke_w
    commands.append({
        "command": "shape.rectangle",
        "params": {
            "parent": parent,
            "name": name,
            "x": x,
            "y": y,
            "width": width,
            "height": height,
            "props": props
        }
    })
    return rid

def add_ellipse(parent, name, x, y, width, height, fill="#E50914"):
    eid = next_id()
    commands.append({
        "command": "shape.ellipse",
        "params": {
            "parent": parent,
            "name": name,
            "x": x,
            "y": y,
            "width": width,
            "height": height,
            "props": {"fill": fill}
        }
    })
    return eid

def add_text(parent, text, x, y, size=14, fill="#FFFFFF", name=None):
    tid = next_id()
    commands.append({
        "command": "text.create",
        "params": {
            "parent": parent,
            "name": name or text[:30],
            "text": text,
            "x": x,
            "y": y,
            "props": {
                "fontSize": size,
                "fill": fill
            }
        }
    })
    return tid

def add_badge(parent, text, x, y, bg="#E50914", text_color="#FFFFFF", size=10, pad_x=10, pad_y=4, radius=4):
    width = len(text) * (size * 0.65) + (pad_x * 2)
    height = size + (pad_y * 2)
    add_rect(parent, f"Badge-{text}", x, y, width, height, fill=bg, radius=radius)
    add_text(parent, text, x + pad_x, y + pad_y - 1, size=size, fill=text_color)
    return width, height

def add_button(parent, text, x, y, width, height, bg="#E50914", text_color="#FFFFFF", radius=8, stroke=None):
    add_rect(parent, f"Btn-{text}", x, y, width, height, fill=bg, radius=radius, stroke=stroke)
    text_w = len(text) * 7.5
    tx = x + (width - text_w) / 2
    ty = y + (height - 14) / 2
    add_text(parent, text, max(x + 12, tx), max(y + 6, ty), size=13, fill=text_color)

# ==============================================================================
# 1. WEB - BERANDA (EXPLORE & RAILS) — 1440 x 1024
# ==============================================================================
def build_web_home(f):
    # Navbar
    add_rect(f, "Navbar-Bg", 0, 0, 1440, 68, fill="#0D1017", stroke="rgba(255,255,255,0.08)", stroke_w=1)
    add_text(f, "BINUS", 48, 22, size=22, fill="#FFFFFF")
    add_text(f, "FLIX", 118, 22, size=22, fill="#E50914")
    
    # Nav links
    navs = ["Beranda", "Film", "Serial TV", "Musik", "Favorit Saya"]
    nx = 210
    for i, n in enumerate(navs):
        color = "#FFFFFF" if i == 0 else "#9CA3AF"
        add_text(f, n, nx, 26, size=13, fill=color)
        if i == 0:
            add_rect(f, "Nav-Active-Indicator", nx, 48, 48, 2, fill="#E50914")
        nx += 95
        
    # Search Box
    add_rect(f, "Search-Input", 980, 16, 240, 36, fill="#141824", radius=6, stroke="rgba(255,255,255,0.1)", stroke_w=1)
    add_text(f, "🔍  Cari judul, genre...", 996, 26, size=12, fill="#9CA3AF")
    
    # User Profile Avatar
    add_ellipse(f, "User-Avatar", 1240, 16, 36, 36, fill="#E50914")
    add_text(f, "B", 1252, 24, size=15, fill="#FFFFFF")
    add_text(f, "Demo User", 1290, 26, size=13, fill="#D1D5DB")
    
    # Billboard Hero Banner
    add_rect(f, "Hero-Container", 48, 88, 1344, 400, fill="#12151E", radius=16, stroke="rgba(255,255,255,0.06)", stroke_w=1)
    add_rect(f, "Hero-Backdrop-Visual", 48, 88, 1344, 400, fill="#1A1520", radius=16)
    
    # Hero Tag & Title
    add_badge(f, "🔥 #1 PILIHAN TERATAS HARI INI", 88, 120, bg="#E50914", text_color="#FFFFFF", size=10, pad_x=10, pad_y=4, radius=4)
    add_text(f, "DUNE: PART TWO", 88, 155, size=40, fill="#FFFFFF")
    add_text(f, "⭐ 8.6 / 10   •   2024   •   166 Menit   •   Sci-Fi / Adventure   •   4K Ultra HD", 88, 215, size=13, fill="#D1D5DB")
    add_text(f, "Paul Atreides bersatu dengan Chani dan kaum Fremen dalam perjalanan membalas dendam", 88, 245, size=14, fill="#9CA3AF")
    add_text(f, "terhadap para konspirator yang telah meruntuhkan keluarganya di gurun Arrakis.", 88, 268, size=14, fill="#9CA3AF")
    
    # Hero Action Buttons
    add_button(f, "▶  Tonton Trailer", 88, 315, 160, 44, bg="#E50914", text_color="#FFFFFF", radius=8)
    add_button(f, "❤️  Tambah ke Favorit", 264, 315, 175, 44, bg="#1E2330", text_color="#FFFFFF", radius=8, stroke="rgba(255,255,255,0.15)")
    add_button(f, "ℹ  Detail Konten", 455, 315, 140, 44, bg="rgba(255,255,255,0.08)", text_color="#D1D5DB", radius=8)
    
    # Category Filter Pills
    add_text(f, "Kategori Hiburan:", 48, 516, size=13, fill="#9CA3AF")
    cats = [("Semua Konten", True), ("Film Layar Lebar", False), ("Serial TV & Drama", False), ("Musik Studio", False)]
    cx = 175
    for cname, active in cats:
        bg = "#E50914" if active else "#0D1017"
        color = "#FFFFFF" if active else "#D1D5DB"
        stroke = None if active else "rgba(255,255,255,0.1)"
        bw = len(cname) * 8 + 24
        add_button(f, cname, cx, 508, bw, 32, bg=bg, text_color=color, radius=16, stroke=stroke)
        cx += bw + 12

    # Rail 1: Sedang Tren Sekarang
    add_text(f, "🔥 Sedang Tren Sekarang di Indonesia", 48, 565, size=18, fill="#FFFFFF")
    movies = [
        ("Dune: Part Two", "Sci-Fi", "8.6", "#201826"),
        ("Oppenheimer", "Biography", "8.9", "#1A1720"),
        ("Interstellar", "Sci-Fi", "8.7", "#141A28"),
        ("Stranger Things", "TV Series", "8.7", "#22141A"),
        ("The Dark Knight", "Action", "9.0", "#161B24"),
    ]
    card_x = 48
    for title, genre, rating, col in movies:
        # Card Poster
        add_rect(f, f"Card-{title}", card_x, 600, 245, 190, fill=col, radius=10, stroke="rgba(255,255,255,0.08)", stroke_w=1)
        add_badge(f, genre, card_x + 12, 612, bg="rgba(0,0,0,0.6)", text_color="#FFFFFF", size=9, pad_x=6, pad_y=2, radius=4)
        add_badge(f, f"⭐ {rating}", card_x + 180, 612, bg="rgba(0,0,0,0.6)", text_color="#FFB800", size=9, pad_x=6, pad_y=2, radius=4)
        # Title under poster
        add_text(f, title, card_x, 802, size=13, fill="#FFFFFF")
        add_text(f, f"{genre} • 2024", card_x, 822, size=11, fill="#9CA3AF")
        card_x += 275

    # Rail 2: Top 10 Konten Teratas
    add_text(f, "🏆 10 Konten Teratas Hari Ini", 48, 860, size=18, fill="#FFFFFF")
    top_items = [
        ("1", "Dune: Part Two", "#201826"),
        ("2", "Oppenheimer", "#1A1720"),
        ("3", "Interstellar", "#141A28"),
        ("4", "Stranger Things", "#22141A"),
    ]
    tx = 48
    for rank, title, col in top_items:
        # Giant Rank Number
        add_text(f, rank, tx, 915, size=64, fill="#E50914")
        # Poster beside rank
        add_rect(f, f"TopCard-{title}", tx + 60, 900, 240, 110, fill=col, radius=8, stroke="rgba(255,255,255,0.08)", stroke_w=1)
        add_text(f, title, tx + 72, 935, size=13, fill="#FFFFFF")
        add_text(f, "Trending Rank #" + rank, tx + 72, 955, size=11, fill="#9CA3AF")
        tx += 345

# ==============================================================================
# 2. WEB - DETAIL KONTEN (MEDIA PLAYER & REVIEWS) — 1440 x 1024
# ==============================================================================
def build_web_detail(f):
    # Navbar
    add_rect(f, "Navbar-Bg", 0, 0, 1440, 68, fill="#0D1017", stroke="rgba(255,255,255,0.08)", stroke_w=1)
    add_text(f, "BINUS", 48, 22, size=22, fill="#FFFFFF")
    add_text(f, "FLIX", 118, 22, size=22, fill="#E50914")
    add_text(f, "← Kembali ke Katalog Utama", 220, 26, size=13, fill="#9CA3AF")
    add_ellipse(f, "User-Avatar", 1350, 16, 36, 36, fill="#E50914")
    
    # Breadcrumbs
    add_text(f, "Beranda  /  Film Layar Lebar  /  Dune: Part Two", 48, 88, size=12, fill="#9CA3AF")
    
    # Split view: Left Poster (w: 320)
    add_rect(f, "Detail-Poster", 48, 120, 320, 480, fill="#1C1524", radius=14, stroke="rgba(255,255,255,0.1)", stroke_w=1)
    add_badge(f, "⭐ 8.6 IMDB", 64, 136, bg="#E50914", text_color="#FFFFFF", size=10, pad_x=8, pad_y=4, radius=4)
    add_button(f, "❤️  Tersimpan di Favorit", 48, 620, 320, 44, bg="#1E2330", text_color="#FFFFFF", radius=8, stroke="#E50914")
    add_button(f, "↗  Bagikan Tautan", 48, 676, 320, 40, bg="rgba(255,255,255,0.06)", text_color="#D1D5DB", radius=8)

    # Right Column: Metadata + Cinema Player (x: 400, w: 990)
    add_badge(f, "FILM LAYAR LEBAR", 400, 120, bg="#E50914", text_color="#FFFFFF", size=10, pad_x=10, pad_y=4, radius=4)
    add_badge(f, "4K ULTRA HD", 520, 120, bg="#1F2937", text_color="#00D2FF", size=10, pad_x=10, pad_y=4, radius=4)
    add_badge(f, "DOLBY ATMOS", 620, 120, bg="#1F2937", text_color="#22C55E", size=10, pad_x=10, pad_y=4, radius=4)
    
    add_text(f, "Dune: Part Two", 400, 155, size=36, fill="#FFFFFF")
    add_text(f, "Disutradarai oleh Denis Villeneuve  •  Rilis: 1 Maret 2024  •  Durasi: 166 Menit", 400, 205, size=13, fill="#D1D5DB")
    add_text(f, "Sinopsis:", 400, 235, size=13, fill="#FFFFFF")
    add_text(f, "Paul Atreides bersatu dengan Chani dan Fremen untuk membalas dendam terhadap para konspirator", 400, 258, size=13, fill="#9CA3AF")
    add_text(f, "yang menghancurkan keluarganya. Menghadapi pilihan antara cinta dalam hidupnya dan nasib alam semesta.", 400, 278, size=13, fill="#9CA3AF")
    
    # Cast Chips
    add_text(f, "Pemeran Utama:", 400, 310, size=12, fill="#FFFFFF")
    cast = ["Timothée Chalamet", "Zendaya", "Rebecca Ferguson", "Javier Bardem", "Austin Butler"]
    chip_x = 400
    for name in cast:
        cw = len(name) * 7.5 + 20
        add_rect(f, f"Chip-{name}", chip_x, 332, cw, 26, fill="#141824", radius=13, stroke="rgba(255,255,255,0.08)", stroke_w=1)
        add_text(f, name, chip_x + 10, 338, size=11, fill="#D1D5DB")
        chip_x += cw + 8

    # Embedded Cinema Media Player Box (16:9 look)
    add_rect(f, "Media-Player-Box", 400, 375, 990, 340, fill="#040508", radius=12, stroke="rgba(255,255,255,0.1)", stroke_w=1)
    add_ellipse(f, "Play-Btn-Icon", 870, 515, 60, 60, fill="#E50914")
    add_text(f, "▶", 895, 532, size=24, fill="#FFFFFF")
    add_text(f, "Official Trailer — Warner Bros. Pictures (1080p Full HD)", 420, 680, size=12, fill="#D1D5DB")
    # Player timeline bar
    add_rect(f, "Timeline-Track", 420, 700, 950, 4, fill="rgba(255,255,255,0.2)", radius=2)
    add_rect(f, "Timeline-Progress", 420, 700, 320, 4, fill="#E50914", radius=2)

    # Reviews Section
    add_text(f, "💬 Ulasan & Rating Komunitas Pengguna (4 Ulasan)", 48, 740, size=18, fill="#FFFFFF")
    
    # Review Input Card
    add_rect(f, "Review-Input-Box", 48, 775, 650, 160, fill="#0D1017", radius=10, stroke="rgba(255,255,255,0.08)", stroke_w=1)
    add_text(f, "Berikan Rating Anda:", 68, 795, size=12, fill="#D1D5DB")
    add_text(f, "⭐ ⭐ ⭐ ⭐ ⭐  (5/5 Sangat Puas)", 200, 795, size=12, fill="#FFB800")
    add_rect(f, "Review-Textarea", 68, 825, 610, 50, fill="#141824", radius=6, stroke="rgba(255,255,255,0.08)", stroke_w=1)
    add_text(f, "Tulis ulasan Anda tentang alur cerita, audio, atau sinematografi...", 80, 840, size=12, fill="#9CA3AF")
    add_button(f, "Kirim Ulasan", 548, 885, 130, 36, bg="#E50914", text_color="#FFFFFF", radius=6)

    # User Review Cards
    add_rect(f, "User-Review-1", 720, 775, 670, 95, fill="#0D1017", radius=10, stroke="rgba(255,255,255,0.08)", stroke_w=1)
    add_text(f, "Andi Pratama  •  ⭐⭐⭐⭐⭐ (5/5)", 740, 790, size=13, fill="#FFFFFF")
    add_text(f, '"Visualnya luar biasa megah, audio scoring Hans Zimmer juara dan aktingnya sangat berkelas!"', 740, 815, size=12, fill="#9CA3AF")
    add_text(f, "Diposting 2 jam yang lalu  •  Terverifikasi", 740, 840, size=10, fill="#6B7280")

    add_rect(f, "User-Review-2", 720, 885, 670, 95, fill="#0D1017", radius=10, stroke="rgba(255,255,255,0.08)", stroke_w=1)
    add_text(f, "Siti Rahma  •  ⭐⭐⭐⭐⭐ (5/5)", 740, 900, size=13, fill="#FFFFFF")
    add_text(f, '"Adaptasi novel Frank Herbert paling sempurna sepanjang masa. Durasi 2.5 jam tidak terasa membosankan."', 740, 925, size=12, fill="#9CA3AF")
    add_text(f, "Diposting 1 hari yang lalu  •  Terverifikasi", 740, 950, size=10, fill="#6B7280")

# ==============================================================================
# 3. WEB - FAVORIT SAYA (WATCHLIST) — 1440 x 1024
# ==============================================================================
def build_web_favorites(f):
    # Navbar
    add_rect(f, "Navbar-Bg", 0, 0, 1440, 68, fill="#0D1017", stroke="rgba(255,255,255,0.08)", stroke_w=1)
    add_text(f, "BINUS", 48, 22, size=22, fill="#FFFFFF")
    add_text(f, "FLIX", 118, 22, size=22, fill="#E50914")
    add_text(f, "Koleksi Favorit Saya", 210, 26, size=13, fill="#FFFFFF")
    add_ellipse(f, "User-Avatar", 1350, 16, 36, 36, fill="#E50914")
    
    # Page Header
    add_text(f, "Daftar Koleksi Favorit Saya", 48, 95, size=28, fill="#FFFFFF")
    add_text(f, "Koleksi film, serial TV, dan musik yang Anda simpan untuk dinikmati nanti (Tersinkronisasi ke Cloud)", 48, 135, size=13, fill="#9CA3AF")
    
    # Filter Tabs
    fav_tabs = [("Semua (6)", True), ("Film (3)", False), ("Serial TV (2)", False), ("Musik (1)", False)]
    tx = 48
    for tname, active in fav_tabs:
        bg = "#E50914" if active else "#0D1017"
        color = "#FFFFFF" if active else "#D1D5DB"
        tw = len(tname) * 8 + 24
        add_button(f, tname, tx, 175, tw, 32, bg=bg, text_color=color, radius=6)
        tx += tw + 10
        
    # Grid of Saved Items (4 columns x 2 rows)
    fav_items = [
        ("Dune: Part Two", "Film", "8.6", "#201826"),
        ("Oppenheimer", "Film", "8.9", "#1A1720"),
        ("Interstellar", "Film", "8.7", "#141A28"),
        ("Stranger Things", "Serial TV", "8.7", "#22141A"),
        ("Breaking Bad", "Serial TV", "9.5", "#1B2216"),
        ("Midnight City - M83", "Musik", "8.8", "#121F24"),
    ]
    gx, gy = 48, 230
    for i, (title, category, rating, col) in enumerate(fav_items):
        col_idx = i % 4
        row_idx = i // 4
        px = gx + (col_idx * 345)
        py = gy + (row_idx * 380)
        
        # Card Poster
        add_rect(f, f"FavCard-{title}", px, py, 320, 240, fill=col, radius=12, stroke="rgba(255,255,255,0.08)", stroke_w=1)
        add_badge(f, category, px + 12, py + 12, bg="rgba(0,0,0,0.7)", text_color="#FFFFFF", size=10, pad_x=8, pad_y=3, radius=4)
        add_badge(f, f"⭐ {rating}", px + 245, py + 12, bg="rgba(0,0,0,0.7)", text_color="#FFB800", size=10, pad_x=8, pad_y=3, radius=4)
        
        # Action overlay: Remove button
        add_button(f, "🗑️ Hapus", px + 225, py + 195, 85, 32, bg="rgba(229,9,20,0.85)", text_color="#FFFFFF", radius=6)
        
        # Info below poster
        add_text(f, title, px, py + 255, size=15, fill="#FFFFFF")
        add_text(f, f"{category} • Ditambahkan 05 Nov 2026", px, py + 278, size=12, fill="#9CA3AF")
        add_button(f, "▶  Tonton / Dengar Sekarang", px, py + 305, 320, 36, bg="#141824", text_color="#FFFFFF", radius=6, stroke="rgba(255,255,255,0.1)")

# ==============================================================================
# 4. WEB - LOGIN & REGISTER MODAL — 1440 x 900
# ==============================================================================
def build_web_auth(f):
    # Dim Background with Cinema Ambience
    add_rect(f, "Auth-Backdrop-Dim", 0, 0, 1440, 900, fill="#07080A")
    add_rect(f, "Brand-Glow", 470, 70, 500, 750, fill="#150E12", radius=20)
    
    # Auth Modal Card
    add_rect(f, "Auth-Card-Box", 470, 70, 500, 750, fill="#0D1017", radius=16, stroke="rgba(255,255,255,0.1)", stroke_w=1)
    
    # Logo
    add_text(f, "BINUS", 640, 105, size=28, fill="#FFFFFF")
    add_text(f, "FLIX", 735, 105, size=28, fill="#E50914")
    add_text(f, "Selamat Datang di Hub Hiburan Digital", 560, 145, size=14, fill="#9CA3AF")
    
    # 1-Click Demo Account Quick Box
    add_rect(f, "Demo-Autofill-Box", 510, 185, 420, 70, fill="#1A1114", radius=10, stroke="#E50914", stroke_w=1)
    add_text(f, "⚡ Akun Pengujian Demo (1-Click Isi Otomatis)", 530, 198, size=11, fill="#E50914")
    add_text(f, "Email: demo@binus.ac.id  |  Pass: password123", 530, 222, size=12, fill="#FFFFFF")
    add_button(f, "Pakai Akun Demo", 810, 203, 110, 32, bg="#E50914", text_color="#FFFFFF", radius=6)

    # Input 1: Email
    add_text(f, "Email Mahasiswa / Akun", 510, 280, size=12, fill="#D1D5DB")
    add_rect(f, "Input-Email", 510, 305, 420, 48, fill="#141824", radius=8, stroke="rgba(255,255,255,0.12)", stroke_w=1)
    add_text(f, "demo@binus.ac.id", 526, 320, size=13, fill="#FFFFFF")
    
    # Input 2: Password
    add_text(f, "Kata Sandi", 510, 375, size=12, fill="#D1D5DB")
    add_rect(f, "Input-Password", 510, 400, 420, 48, fill="#141824", radius=8, stroke="rgba(255,255,255,0.12)", stroke_w=1)
    add_text(f, "••••••••••••", 526, 415, size=15, fill="#FFFFFF")
    
    # Checkbox Remember Me & Forgot Password
    add_rect(f, "Check-Remember", 510, 465, 16, 16, fill="#E50914", radius=3)
    add_text(f, "✓", 514, 467, size=11, fill="#FFFFFF")
    add_text(f, "Ingat sesi login saya", 534, 466, size=12, fill="#9CA3AF")
    add_text(f, "Lupa kata sandi?", 825, 466, size=12, fill="#E50914")

    # Login CTA Button
    add_button(f, "Masuk Sekarang  ➔", 510, 510, 420, 48, bg="#E50914", text_color="#FFFFFF", radius=8)
    
    # Divider
    add_rect(f, "Divider-1", 510, 585, 180, 1, fill="rgba(255,255,255,0.1)")
    add_text(f, "atau", 705, 577, size=12, fill="#6B7280")
    add_rect(f, "Divider-2", 750, 585, 180, 1, fill="rgba(255,255,255,0.1)")

    # Register Switch CTA
    add_text(f, "Belum memiliki akun mahasiswa?", 560, 620, size=13, fill="#9CA3AF")
    add_text(f, "Daftar Akun Baru", 780, 620, size=13, fill="#E50914")
    add_button(f, "Buat Akun BINUSFLIX", 510, 655, 420, 44, bg="#141824", text_color="#FFFFFF", radius=8, stroke="rgba(255,255,255,0.15)")

# ==============================================================================
# 5. WEB - PROFIL & PENGATURAN — 1440 x 900
# ==============================================================================
def build_web_profile(f):
    # Navbar
    add_rect(f, "Navbar-Bg", 0, 0, 1440, 68, fill="#0D1017", stroke="rgba(255,255,255,0.08)", stroke_w=1)
    add_text(f, "BINUS", 48, 22, size=22, fill="#FFFFFF")
    add_text(f, "FLIX", 118, 22, size=22, fill="#E50914")
    add_text(f, "Profil & Pengaturan Akun", 210, 26, size=13, fill="#FFFFFF")
    
    # Profile Card
    add_rect(f, "Profile-Header-Card", 48, 95, 1344, 200, fill="#0D1017", radius=16, stroke="rgba(255,255,255,0.08)", stroke_w=1)
    add_ellipse(f, "Profile-Avatar", 88, 135, 90, 90, fill="#E50914")
    add_text(f, "B", 120, 160, size=36, fill="#FFFFFF")
    
    add_text(f, "Binus Student Demo", 205, 140, size=24, fill="#FFFFFF")
    add_badge(f, "MAHASISWA AKTIF — COMPUTER SCIENCE", 445, 145, bg="#1F2937", text_color="#00D2FF", size=10, pad_x=8, pad_y=3, radius=4)
    add_text(f, "@binusian_user  •  demo@binus.ac.id  •  NIM: 2602123456", 205, 175, size=13, fill="#9CA3AF")
    add_text(f, "Bergabung sejak November 2026  •  Paket: Premium Mahasiswa Unlimited", 205, 198, size=12, fill="#6B7280")

    # Stat Badges (Right side of profile header)
    add_rect(f, "Stat-Box-1", 930, 125, 120, 140, fill="#141824", radius=10)
    add_text(f, "6", 975, 150, size=28, fill="#E50914")
    add_text(f, "Koleksi Favorit", 945, 195, size=11, fill="#9CA3AF")

    add_rect(f, "Stat-Box-2", 1070, 125, 120, 140, fill="#141824", radius=10)
    add_text(f, "14", 1115, 150, size=28, fill="#00D2FF")
    add_text(f, "Konten Ditonton", 1085, 195, size=11, fill="#9CA3AF")

    add_rect(f, "Stat-Box-3", 1210, 125, 120, 140, fill="#141824", radius=10)
    add_text(f, "4", 1255, 150, size=28, fill="#22C55E")
    add_text(f, "Ulasan Dibuat", 1230, 195, size=11, fill="#9CA3AF")

    # Edit Profile Form
    add_text(f, "Pengaturan Profil Pengguna", 48, 320, size=18, fill="#FFFFFF")
    
    add_rect(f, "Form-Card", 48, 355, 840, 480, fill="#0D1017", radius=12, stroke="rgba(255,255,255,0.08)", stroke_w=1)
    
    # Input Nama
    add_text(f, "Nama Lengkap:", 80, 385, size=12, fill="#D1D5DB")
    add_rect(f, "In-Name", 80, 408, 360, 42, fill="#141824", radius=6)
    add_text(f, "Binus Student Demo", 95, 420, size=13, fill="#FFFFFF")
    
    # Input Username
    add_text(f, "Username:", 480, 385, size=12, fill="#D1D5DB")
    add_rect(f, "In-User", 480, 408, 360, 42, fill="#141824", radius=6)
    add_text(f, "binusian_user", 495, 420, size=13, fill="#FFFFFF")
    
    # Input Email
    add_text(f, "Alamat Email:", 80, 475, size=12, fill="#D1D5DB")
    add_rect(f, "In-Email", 80, 498, 760, 42, fill="#141824", radius=6)
    add_text(f, "demo@binus.ac.id", 95, 510, size=13, fill="#FFFFFF")
    
    # Bio Textarea
    add_text(f, "Biodata / Kutipan Favorit:", 80, 565, size=12, fill="#D1D5DB")
    add_rect(f, "In-Bio", 80, 588, 760, 70, fill="#141824", radius=6)
    add_text(f, "Mahasiswa Teknik Informatika BINUS University, penggemar berat film sci-fi dan scoring orchestral.", 95, 605, size=12, fill="#D1D5DB")

    add_button(f, "Simpan Perubahan", 80, 685, 180, 44, bg="#E50914", text_color="#FFFFFF", radius=8)
    add_button(f, "Keluar dari Akun (Logout)", 280, 685, 200, 44, bg="rgba(255,255,255,0.06)", text_color="#EF4444", radius=8, stroke="rgba(239,68,68,0.3)")

# ==============================================================================
# 6. MOBILE - BERANDA (HOME SCREEN) — 390 x 844
# ==============================================================================
def build_mobile_home(f):
    # Status bar
    add_text(f, "9:41", 24, 14, size=13, fill="#FFFFFF")
    add_text(f, "📶  🔋", 325, 14, size=11, fill="#FFFFFF")
    
    # Mobile Header
    add_text(f, "BINUS", 20, 48, size=18, fill="#FFFFFF")
    add_text(f, "FLIX", 78, 48, size=18, fill="#E50914")
    add_badge(f, "PRO", 130, 50, bg="#E50914", text_color="#FFFFFF", size=8, pad_x=5, pad_y=2, radius=3)
    add_ellipse(f, "Mobile-Avatar", 340, 44, 28, 28, fill="#E50914")
    
    # Category Filter Pills
    m_cats = ["Semua", "Film", "Serial TV", "Musik"]
    mx = 20
    for i, c in enumerate(m_cats):
        bg = "#E50914" if i == 0 else "#141824"
        color = "#FFFFFF" if i == 0 else "#9CA3AF"
        bw = len(c) * 7 + 18
        add_button(f, c, mx, 86, bw, 26, bg=bg, text_color=color, radius=13)
        mx += bw + 8

    # Search Bar
    add_rect(f, "Mobile-Search", 20, 122, 350, 36, fill="#141824", radius=8, stroke="rgba(255,255,255,0.08)", stroke_w=1)
    add_text(f, "🔍  Cari film, serial, musik...", 36, 132, size=12, fill="#9CA3AF")

    # Featured Billboard Hero Card
    add_rect(f, "Mobile-Hero-Card", 20, 170, 350, 240, fill="#1D1624", radius=12, stroke="rgba(255,255,255,0.08)", stroke_w=1)
    add_badge(f, "🔥 POPULER HARI INI", 36, 186, bg="#E50914", text_color="#FFFFFF", size=9, pad_x=6, pad_y=2, radius=3)
    add_text(f, "Dune: Part Two", 36, 230, size=24, fill="#FFFFFF")
    add_text(f, "Sci-Fi / Adventure  •  ⭐ 8.6", 36, 262, size=11, fill="#D1D5DB")
    
    # Hero action buttons
    add_button(f, "▶  Putar", 36, 300, 150, 38, bg="#FFFFFF", text_color="#000000", radius=6)
    add_button(f, "+  Favorit", 198, 300, 155, 38, bg="rgba(0,0,0,0.6)", text_color="#FFFFFF", radius=6, stroke="rgba(255,255,255,0.2)")

    # Section 1: Sedang Tren
    add_text(f, "Sedang Tren Sekarang", 20, 430, size=15, fill="#FFFFFF")
    # 2 Poster cards visible in view
    add_rect(f, "Card-1", 20, 458, 165, 140, fill="#1A1720", radius=8)
    add_text(f, "Oppenheimer", 20, 606, size=12, fill="#FFFFFF")
    add_text(f, "⭐ 8.9  •  Film", 20, 624, size=10, fill="#9CA3AF")

    add_rect(f, "Card-2", 205, 458, 165, 140, fill="#141A28", radius=8)
    add_text(f, "Stranger Things", 205, 606, size=12, fill="#FFFFFF")
    add_text(f, "⭐ 8.7  •  Serial TV", 205, 624, size=10, fill="#9CA3AF")

    # Section 2: Top 10
    add_text(f, "Top 10 Hari Ini", 20, 650, size=15, fill="#FFFFFF")
    add_text(f, "1", 20, 690, size=44, fill="#E50914")
    add_rect(f, "Top-1", 55, 680, 130, 80, fill="#1C1824", radius=6)
    
    add_text(f, "2", 205, 690, size=44, fill="#E50914")
    add_rect(f, "Top-2", 240, 680, 130, 80, fill="#141822", radius=6)

    # Bottom Tab Navigation Bar
    add_rect(f, "Bottom-Bar", 0, 774, 390, 70, fill="#0D1017", stroke="rgba(255,255,255,0.08)", stroke_w=1)
    add_text(f, "🏠", 55, 786, size=18, fill="#E50914")
    add_text(f, "Beranda", 48, 810, size=10, fill="#E50914")

    add_text(f, "❤️", 185, 786, size=18, fill="#9CA3AF")
    add_text(f, "Favorit", 178, 810, size=10, fill="#9CA3AF")

    add_text(f, "👤", 315, 786, size=18, fill="#9CA3AF")
    add_text(f, "Profil", 310, 810, size=10, fill="#9CA3AF")

# ==============================================================================
# 7. MOBILE - DETAIL KONTEN — 390 x 844
# ==============================================================================
def build_mobile_detail(f):
    # Status bar
    add_text(f, "9:41", 24, 14, size=13, fill="#FFFFFF")
    add_text(f, "📶  🔋", 325, 14, size=11, fill="#FFFFFF")
    
    # Top Action Bar
    add_text(f, "← Kembali", 20, 48, size=14, fill="#FFFFFF")
    add_text(f, "❤️  ↗", 325, 48, size=16, fill="#FFFFFF")
    
    # 16:9 Media Player Preview
    add_rect(f, "Mobile-Video-Player", 0, 80, 390, 220, fill="#000000")
    add_ellipse(f, "M-Play-Icon", 175, 170, 44, 44, fill="#E50914")
    add_text(f, "▶", 190, 183, size=18, fill="#FFFFFF")
    
    # Metadata
    add_text(f, "Dune: Part Two", 20, 318, size=22, fill="#FFFFFF")
    add_text(f, "98% Cocok   2024   166 min   4K Ultra HD", 20, 350, size=11, fill="#46D369")
    
    # Action Buttons
    add_button(f, "▶  Putar Trailer", 20, 375, 350, 42, bg="#E50914", text_color="#FFFFFF", radius=6)
    add_button(f, "⬇  Unduh untuk Offline", 20, 425, 350, 38, bg="#141824", text_color="#D1D5DB", radius=6, stroke="rgba(255,255,255,0.1)")

    # Synopsis
    add_text(f, "Paul Atreides bersatu dengan Chani dan suku Fremen untuk membalas dendam terhadap pihak yang menghancurkan keluarganya...", 20, 480, size=12, fill="#9CA3AF")
    add_text(f, "Pemeran: Timothée Chalamet, Zendaya, Rebecca Ferguson", 20, 528, size=11, fill="#6B7280")

    # Star Rating & Community Reviews
    add_text(f, "Ulasan & Rating (18)", 20, 565, size=15, fill="#FFFFFF")
    add_rect(f, "M-Review-Box", 20, 595, 350, 120, fill="#0D1017", radius=8, stroke="rgba(255,255,255,0.08)", stroke_w=1)
    add_text(f, "Andi Pratama  •  ⭐⭐⭐⭐⭐", 34, 608, size=12, fill="#FFFFFF")
    add_text(f, '"Visualnya luar biasa megah, audio scoring juara!"', 34, 630, size=11, fill="#9CA3AF")
    add_button(f, "+ Tulis Ulasan Anda", 34, 665, 320, 34, bg="#141824", text_color="#E50914", radius=6, stroke="#E50914")

    # Bottom Bar
    add_rect(f, "Bottom-Bar", 0, 774, 390, 70, fill="#0D1017", stroke="rgba(255,255,255,0.08)", stroke_w=1)
    add_text(f, "🏠", 55, 786, size=18, fill="#9CA3AF")
    add_text(f, "❤️", 185, 786, size=18, fill="#E50914")
    add_text(f, "👤", 315, 786, size=18, fill="#9CA3AF")

# ==============================================================================
# 8. MOBILE - FAVORIT SAYA — 390 x 844
# ==============================================================================
def build_mobile_favorites(f):
    add_text(f, "9:41", 24, 14, size=13, fill="#FFFFFF")
    add_text(f, "📶  🔋", 325, 14, size=11, fill="#FFFFFF")
    
    add_text(f, "Favorit Saya", 20, 48, size=20, fill="#FFFFFF")
    add_text(f, "6 Konten Tersimpan di Cloud", 20, 75, size=12, fill="#9CA3AF")
    
    # 2-Column Grid
    favs = [
        ("Dune: Part Two", "8.6", "#201826"),
        ("Oppenheimer", "8.9", "#1A1720"),
        ("Interstellar", "8.7", "#141A28"),
        ("Stranger Things", "8.7", "#22141A"),
    ]
    for i, (title, rating, col) in enumerate(favs):
        col_idx = i % 2
        row_idx = i // 2
        px = 20 + (col_idx * 180)
        py = 110 + (row_idx * 210)
        
        add_rect(f, f"MFav-{title}", px, py, 170, 160, fill=col, radius=8, stroke="rgba(255,255,255,0.08)", stroke_w=1)
        add_badge(f, f"⭐ {rating}", px + 110, py + 8, bg="rgba(0,0,0,0.6)", text_color="#FFB800", size=9, pad_x=5, pad_y=2, radius=3)
        add_text(f, title, px, py + 170, size=12, fill="#FFFFFF")
        add_text(f, "🗑️ Hapus", px, py + 188, size=11, fill="#E50914")

    # Bottom Bar
    add_rect(f, "Bottom-Bar", 0, 774, 390, 70, fill="#0D1017", stroke="rgba(255,255,255,0.08)", stroke_w=1)
    add_text(f, "🏠", 55, 786, size=18, fill="#9CA3AF")
    add_text(f, "❤️", 185, 786, size=18, fill="#E50914")
    add_text(f, "👤", 315, 786, size=18, fill="#9CA3AF")

# ==============================================================================
# 9. MOBILE - LOGIN & REGISTER — 390 x 844
# ==============================================================================
def build_mobile_login(f):
    add_text(f, "9:41", 24, 14, size=13, fill="#FFFFFF")
    add_text(f, "📶  🔋", 325, 14, size=11, fill="#FFFFFF")

    add_text(f, "BINUS", 130, 90, size=28, fill="#FFFFFF")
    add_text(f, "FLIX", 215, 90, size=28, fill="#E50914")
    add_text(f, "Masuk ke Akun Mahasiswa", 110, 130, size=13, fill="#9CA3AF")

    # Demo 1-Click Button
    add_rect(f, "M-Demo-Box", 24, 175, 342, 60, fill="#1A1114", radius=8, stroke="#E50914", stroke_w=1)
    add_text(f, "⚡ Demo 1-Click Autofill", 40, 188, size=11, fill="#E50914")
    add_text(f, "demo@binus.ac.id  |  password123", 40, 208, size=11, fill="#FFFFFF")

    # Inputs
    add_text(f, "Email:", 24, 260, size=12, fill="#D1D5DB")
    add_rect(f, "M-Input-Email", 24, 282, 342, 44, fill="#141824", radius=6)
    add_text(f, "demo@binus.ac.id", 36, 296, size=13, fill="#FFFFFF")

    add_text(f, "Password:", 24, 345, size=12, fill="#D1D5DB")
    add_rect(f, "M-Input-Pass", 24, 367, 342, 44, fill="#141824", radius=6)
    add_text(f, "••••••••••••", 36, 381, size=15, fill="#FFFFFF")

    add_button(f, "Masuk Sekarang", 24, 440, 342, 46, bg="#E50914", text_color="#FFFFFF", radius=8)
    add_text(f, "Belum punya akun? Daftar Baru", 95, 510, size=12, fill="#9CA3AF")

# ==============================================================================
# 10. MOBILE - PROFIL — 390 x 844
# ==============================================================================
def build_mobile_profile(f):
    add_text(f, "9:41", 24, 14, size=13, fill="#FFFFFF")
    add_text(f, "📶  🔋", 325, 14, size=11, fill="#FFFFFF")

    add_ellipse(f, "M-Profile-Pic", 155, 70, 80, 80, fill="#E50914")
    add_text(f, "B", 185, 95, size=32, fill="#FFFFFF")

    add_text(f, "Binus Student Demo", 115, 165, size=18, fill="#FFFFFF")
    add_text(f, "demo@binus.ac.id  •  Computer Science", 85, 190, size=11, fill="#9CA3AF")

    # Stats row
    add_rect(f, "M-Stats-Row", 24, 220, 342, 70, fill="#0D1017", radius=8)
    add_text(f, "6", 85, 235, size=20, fill="#E50914")
    add_text(f, "Favorit", 75, 260, size=11, fill="#9CA3AF")
    add_text(f, "14", 185, 235, size=20, fill="#00D2FF")
    add_text(f, "Ditonton", 170, 260, size=11, fill="#9CA3AF")
    add_text(f, "4", 285, 235, size=20, fill="#22C55E")
    add_text(f, "Ulasan", 275, 260, size=11, fill="#9CA3AF")

    # Menu items
    menus = ["👤  Edit Profil Pengguna", "🔒  Ubah Kata Sandi", "📥  Pengaturan Unduhan Offline", "❓  Bantuan & FAQ", "🚪  Keluar dari Akun (Logout)"]
    my = 315
    for m in menus:
        add_rect(f, f"Menu-{m[:10]}", 24, my, 342, 46, fill="#0D1017", radius=6)
        color = "#EF4444" if "Keluar" in m else "#FFFFFF"
        add_text(f, m, 40, my + 15, size=13, fill=color)
        my += 56

    # Bottom Bar
    add_rect(f, "Bottom-Bar", 0, 774, 390, 70, fill="#0D1017", stroke="rgba(255,255,255,0.08)", stroke_w=1)
    add_text(f, "🏠", 55, 786, size=18, fill="#9CA3AF")
    add_text(f, "❤️", 185, 786, size=18, fill="#9CA3AF")
    add_text(f, "👤", 315, 786, size=18, fill="#E50914")

# ==============================================================================
# 11. DESIGN SYSTEM & COMPONENT TOKENS — 1440 x 850
# ==============================================================================
def build_design_system(f):
    add_text(f, "BINUSFLIX — DESIGN SYSTEM & UI TOKENS (LO 3)", 48, 40, size=24, fill="#FFFFFF")
    add_text(f, "Spesifikasi token warna resmi, tipografi, dan komponen master antarmuka web dan mobile.", 48, 75, size=13, fill="#9CA3AF")

    # 1. Color Palette Tokens
    add_text(f, "1. Color Palette Tokens", 48, 120, size=18, fill="#FFFFFF")
    swatches = [
        ("Obsidian Black", "#07080A", "Background"),
        ("Surface Dark", "#0D1017", "Card Panel"),
        ("Elevated Surface", "#141824", "Input / Hover"),
        ("BINUS Red", "#E50914", "Brand Primary"),
        ("Match Green", "#22C55E", "Match Indicator"),
        ("Rating Gold", "#FFB800", "Star Score"),
        ("Cyan Accent", "#00D2FF", "Badges / HD"),
        ("Text Secondary", "#9CA3AF", "Muted Labels"),
    ]
    sx = 48
    for name, hexcode, role in swatches:
        add_rect(f, f"Swatch-{hexcode}", sx, 155, 140, 80, fill=hexcode, radius=8, stroke="rgba(255,255,255,0.15)", stroke_w=1)
        add_text(f, hexcode, sx, 245, size=12, fill="#FFFFFF")
        add_text(f, name, sx, 265, size=11, fill="#9CA3AF")
        add_text(f, role, sx, 282, size=10, fill="#6B7280")
        sx += 165

    # 2. Typography Scale
    add_text(f, "2. Typography Scale (Plus Jakarta Sans / Inter)", 48, 330, size=18, fill="#FFFFFF")
    add_text(f, "Display Hero — 40px Bold (Header)", 48, 365, size=40, fill="#FFFFFF")
    add_text(f, "Heading 1 — 28px Bold (Page Title)", 48, 425, size=28, fill="#FFFFFF")
    add_text(f, "Heading 2 — 20px SemiBold (Section Header)", 48, 470, size=20, fill="#FFFFFF")
    add_text(f, "Body Regular — 14px Regular (Sinopsis & Konten)", 48, 505, size=14, fill="#D1D5DB")
    add_text(f, "Caption & Microcopy — 11px Bold (Pills & Badges)", 48, 535, size=11, fill="#9CA3AF")

    # 3. Master Reusable Components
    add_text(f, "3. Component Library Master", 48, 580, size=18, fill="#FFFFFF")
    
    # Buttons
    add_button(f, "Primary Button", 48, 615, 150, 42, bg="#E50914", text_color="#FFFFFF", radius=8)
    add_button(f, "Secondary Button", 215, 615, 160, 42, bg="#141824", text_color="#FFFFFF", radius=8, stroke="rgba(255,255,255,0.15)")
    add_button(f, "Outline Button", 395, 615, 150, 42, bg="transparent", text_color="#E50914", radius=8, stroke="#E50914")

    # Badges
    add_badge(f, "FILM LAYAR LEBAR", 48, 680, bg="#E50914", text_color="#FFFFFF", size=10, pad_x=10, pad_y=4, radius=4)
    add_badge(f, "SERIAL TV", 185, 680, bg="#6366F1", text_color="#FFFFFF", size=10, pad_x=10, pad_y=4, radius=4)
    add_badge(f, "MUSIK STUDIO", 280, 680, bg="#10B981", text_color="#FFFFFF", size=10, pad_x=10, pad_y=4, radius=4)
    add_badge(f, "⭐ 8.6 RATING", 395, 680, bg="#FFB800", text_color="#000000", size=10, pad_x=10, pad_y=4, radius=4)
    add_badge(f, "4K ULTRA HD", 510, 680, bg="#1F2937", text_color="#00D2FF", size=10, pad_x=10, pad_y=4, radius=4)

    # Content Card Master
    add_rect(f, "Master-Card-Preview", 750, 600, 240, 160, fill="#1C1826", radius=10, stroke="rgba(255,255,255,0.1)", stroke_w=1)
    add_badge(f, "HD", 762, 612, bg="#E50914", text_color="#FFFFFF", size=9, pad_x=5, pad_y=2, radius=3)
    add_badge(f, "⭐ 8.9", 930, 612, bg="rgba(0,0,0,0.6)", text_color="#FFB800", size=9, pad_x=6, pad_y=2, radius=4)
    add_text(f, "Card Component Master", 750, 775, size=13, fill="#FFFFFF")
    add_text(f, "Aspect 2:3 with hover states", 750, 795, size=11, fill="#9CA3AF")

def main():
    print("Building BINUSFLIX FigCraft design project...")
    
    # Row 1: Web Frames
    f1 = add_frame("Web - 1. Beranda (Explore)", 0, 0, 1440, 1024)
    build_web_home(f1)

    f2 = add_frame("Web - 2. Detail Konten", 1600, 0, 1440, 1024)
    build_web_detail(f2)

    f3 = add_frame("Web - 3. Favorit Saya", 3200, 0, 1440, 1024)
    build_web_favorites(f3)

    f4 = add_frame("Web - 4. Login & Register", 4800, 0, 1440, 900)
    build_web_auth(f4)

    f5 = add_frame("Web - 5. Profil Pengguna", 6400, 0, 1440, 900)
    build_web_profile(f5)

    # Row 2: Mobile Frames (390 x 844)
    f6 = add_frame("Mobile - 1. Beranda", 0, 1150, 390, 844)
    build_mobile_home(f6)

    f7 = add_frame("Mobile - 2. Detail Konten", 480, 1150, 390, 844)
    build_mobile_detail(f7)

    f8 = add_frame("Mobile - 3. Favorit Saya", 960, 1150, 390, 844)
    build_mobile_favorites(f8)

    f9 = add_frame("Mobile - 4. Login", 1440, 1150, 390, 844)
    build_mobile_login(f9)

    f10 = add_frame("Mobile - 5. Profil", 1920, 1150, 390, 844)
    build_mobile_profile(f10)

    # Row 3: Design System Tokens & Components
    f11 = add_frame("Design System & UI Tokens", 0, 2100, 1440, 850)
    build_design_system(f11)

    output_json_path = "E:/Project/BINUS/entertainment-hub/docs/binusflix_design_commands.json"
    with open(output_json_path, "w", encoding="utf-8") as f:
        json.dump(commands, f, indent=2)

    print(f"Generated {len(commands)} commands in {output_json_path}")

if __name__ == "__main__":
    main()
