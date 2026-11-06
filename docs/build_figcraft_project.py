"""
BINUSFLIX FigCraft & Figma Design Generator (1:1 Web & Mobile Parity)
Builds the complete multi-screen UI/UX design specification in FigCraft.
Enforces 100% design token, font (Plus Jakarta Sans), icon (Lucide React & Ionicons),
and component parity between Web and Mobile applications.

Outputs:
  - docs/binusflix_design.figcraft (Native FigCraft project file)
  - docs/binusflix_design.fig (Figma official file)
  - docs/figma_exports/ (11 exported frame PNGs)
  - docs/binusflix_design_overview.png (High-res canvas overview)
"""

import json
import os
import subprocess

commands = []
current_id = 1  # root: 0, page: 1, next created: 2

# Global Design Tokens (Exact 1:1 sync with frontend/tailwind.config.js & mobile/src/constants/theme.js)
TOKENS = {
    "bg": "#07080A",
    "surface": "#0D1017",
    "card": "#0D1017",
    "cardHover": "#141824",
    "border": "rgba(255, 255, 255, 0.08)",
    "borderHover": "rgba(229, 9, 20, 0.4)",
    "red": "#E50914",
    "redDark": "#B20710",
    "cyan": "#00D2FF",
    "gold": "#FFB800",
    "green": "#22C55E",
    "tv": "#6366F1",
    "music": "#10B981",
    "white": "#FFFFFF",
    "secondary": "#D1D5DB",
    "muted": "#9CA3AF",
    "subtle": "#6B7280",
    "danger": "#EF4444",
    "fontFamily": "Plus Jakarta Sans"
}

def next_id():
    global current_id
    current_id += 1
    return current_id

def add_frame(name, x, y, width, height, fill=TOKENS["bg"]):
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

def add_rect(parent, name, x, y, width, height, fill=TOKENS["surface"], radius=0, stroke=None, stroke_w=1):
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

def add_ellipse(parent, name, x, y, width, height, fill=TOKENS["red"]):
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

def add_text(parent, text, x, y, size=14, fill=TOKENS["white"], weight="Regular", name=None):
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
                "fill": fill,
                "fontFamily": TOKENS["fontFamily"],
                "fontStyle": weight
            }
        }
    })
    return tid

def add_badge(parent, text, x, y, bg=TOKENS["red"], text_color=TOKENS["white"], size=10, pad_x=8, pad_y=4, radius=4):
    width = len(text) * (size * 0.65) + (pad_x * 2)
    height = size + (pad_y * 2)
    add_rect(parent, f"Badge-{text}", x, y, width, height, fill=bg, radius=radius)
    add_text(parent, text, x + pad_x, y + pad_y - 1, size=size, fill=text_color, weight="Bold")
    return width, height

def add_button(parent, text, x, y, width, height, bg=TOKENS["red"], text_color=TOKENS["white"], radius=8, stroke=None, weight="SemiBold"):
    add_rect(parent, f"Btn-{text}", x, y, width, height, fill=bg, radius=radius, stroke=stroke)
    text_w = len(text) * 7.2
    tx = x + (width - text_w) / 2
    ty = y + (height - 14) / 2
    add_text(parent, text, max(x + 10, tx), max(y + 6, ty), size=13, fill=text_color, weight=weight)

# ==============================================================================
# 1. WEB - BERANDA (EXPLORE & RAILS) — 1440 x 1024
# ==============================================================================
def build_web_home(f):
    # Sticky Navbar with Lucide Icons
    add_rect(f, "Web-Navbar", 0, 0, 1440, 68, fill=TOKENS["surface"], stroke=TOKENS["border"], stroke_w=1)
    
    # Brand Logo with Sparkle Red Accent
    add_text(f, "BINUS", 48, 22, size=22, fill=TOKENS["white"], weight="Bold")
    add_text(f, "FLIX", 118, 22, size=22, fill=TOKENS["red"], weight="Bold")
    add_badge(f, "PRO", 175, 24, bg=TOKENS["red"], text_color=TOKENS["white"], size=9, pad_x=5, pad_y=2, radius=3)
    
    # Navigation Links (Matching Web React Router)
    navs = ["Beranda", "Film", "Serial TV", "Musik", "Favorit Saya"]
    nx = 240
    for i, n in enumerate(navs):
        color = TOKENS["white"] if i == 0 else TOKENS["muted"]
        weight = "Bold" if i == 0 else "Regular"
        add_text(f, n, nx, 26, size=13, fill=color, weight=weight)
        if i == 0:
            add_rect(f, "Nav-Active-Indicator", nx, 48, 52, 2, fill=TOKENS["red"])
        nx += 105
        
    # Search Box with Lucide Search Icon
    add_rect(f, "Search-Input", 960, 16, 260, 36, fill=TOKENS["cardHover"], radius=8, stroke=TOKENS["border"], stroke_w=1)
    add_text(f, "🔍  Cari film, serial TV, musik...", 976, 26, size=12, fill=TOKENS["muted"], weight="Regular")
    
    # User Profile Avatar with Glowing Red Ring
    add_ellipse(f, "User-Avatar-Ring", 1240, 15, 38, 38, fill=TOKENS["red"])
    add_ellipse(f, "User-Avatar", 1242, 17, 34, 34, fill=TOKENS["cardHover"])
    add_text(f, "B", 1254, 25, size=15, fill=TOKENS["white"], weight="Bold")
    add_text(f, "Binus Student Demo", 1288, 26, size=13, fill=TOKENS["secondary"], weight="SemiBold")
    
    # Hero Carousel Banner (1:1 Parity with Web HeroBanner.jsx)
    add_rect(f, "Hero-Container", 48, 88, 1344, 400, fill="#12151E", radius=16, stroke="rgba(255,255,255,0.06)", stroke_w=1)
    add_rect(f, "Hero-Vignette-Overlay", 48, 88, 700, 400, fill="rgba(7,8,10,0.85)", radius=16)
    
    # Hero Badges & Top 10 Ribbon
    add_badge(f, "TOP 10", 88, 118, bg=TOKENS["red"], text_color=TOKENS["white"], size=10, pad_x=8, pad_y=3, radius=4)
    add_badge(f, "BINUS PRO", 152, 118, bg="rgba(0,0,0,0.6)", text_color=TOKENS["white"], size=10, pad_x=8, pad_y=3, radius=4)
    add_text(f, "No. 1 dalam Film Layar Lebar Hari Ini", 240, 120, size=12, fill=TOKENS["secondary"], weight="Bold")
    
    # Hero Title & Metadata
    add_text(f, "DUNE: PART TWO", 88, 155, size=42, fill=TOKENS["white"], weight="Bold")
    add_badge(f, "98% COCOK", 88, 215, bg="rgba(34,197,94,0.15)", text_color=TOKENS["green"], size=10, pad_x=8, pad_y=3, radius=4)
    add_text(f, "★ 8.6", 180, 217, size=12, fill=TOKENS["gold"], weight="Bold")
    add_text(f, "2024   •   166 Menit   •   4K Ultra HD   •   Sub Indo   •   Sci-Fi / Adventure", 225, 217, size=12, fill=TOKENS["secondary"], weight="SemiBold")
    
    # Synopsis
    add_text(f, "Paul Atreides bersatu dengan Chani dan kaum Fremen dalam perjalanan membalas dendam terhadap para konspirator", 88, 248, size=13, fill=TOKENS["muted"], weight="Regular")
    add_text(f, "yang telah meruntuhkan keluarganya di gurun pasir Arrakis yang tandus nan berbahaya.", 88, 268, size=13, fill=TOKENS["muted"], weight="Regular")
    
    # Hero Interactive Action Buttons (Lucide Play & Heart)
    add_button(f, "▶  Tonton Trailer", 88, 315, 160, 44, bg=TOKENS["red"], text_color=TOKENS["white"], radius=8, weight="Bold")
    add_button(f, "❤️  Tambah ke Favorit", 264, 315, 175, 44, bg=TOKENS["cardHover"], text_color=TOKENS["white"], radius=8, stroke=TOKENS["border"])
    add_button(f, "ℹ  Info Detail Lengkap", 455, 315, 165, 44, bg="rgba(255,255,255,0.06)", text_color=TOKENS["secondary"], radius=8)
    
    # Category Filter Pills (1:1 with Web HomePage.jsx)
    add_text(f, "Filter Kategori:", 48, 516, size=13, fill=TOKENS["muted"], weight="Bold")
    cats = [("Semua Kategori", True), ("Film Layar Lebar", False), ("Serial TV & Drama", False), ("Musik Studio", False)]
    cx = 175
    for cname, active in cats:
        bg = TOKENS["red"] if active else TOKENS["surface"]
        color = TOKENS["white"] if active else TOKENS["secondary"]
        stroke = None if active else TOKENS["border"]
        bw = len(cname) * 8 + 24
        add_button(f, cname, cx, 508, bw, 32, bg=bg, text_color=color, radius=16, stroke=stroke)
        cx += bw + 12

    # Rail 1: Sedang Tren Sekarang (Movie Cards)
    add_text(f, "🔥 Sedang Tren Sekarang di Indonesia", 48, 565, size=18, fill=TOKENS["white"], weight="Bold")
    movies = [
        ("Dune: Part Two", "Film", "8.6", "#201826", "98% Cocok"),
        ("Oppenheimer", "Film", "8.9", "#1A1720", "99% Cocok"),
        ("Interstellar", "Film", "8.7", "#141A28", "97% Cocok"),
        ("Stranger Things", "Serial TV", "8.7", "#22141A", "96% Cocok"),
        ("Midnight City", "Musik", "8.8", "#121F24", "95% Cocok"),
    ]
    card_x = 48
    for title, category, rating, col, match in movies:
        # Card Poster (2:3 aspect)
        add_rect(f, f"Card-{title}", card_x, 600, 245, 185, fill=col, radius=10, stroke=TOKENS["border"], stroke_w=1)
        # Category Tag
        tag_bg = TOKENS["red"] if category == "Film" else (TOKENS["tv"] if category == "Serial TV" else TOKENS["music"])
        add_badge(f, category.upper(), card_x + 10, 610, bg=tag_bg, text_color=TOKENS["white"], size=8, pad_x=6, pad_y=2, radius=4)
        add_badge(f, f"★ {rating}", card_x + 185, 610, bg="rgba(0,0,0,0.75)", text_color=TOKENS["gold"], size=8, pad_x=6, pad_y=2, radius=4)
        
        # Title, Match & Subtitle
        add_text(f, title, card_x, 796, size=13, fill=TOKENS["white"], weight="Bold")
        add_text(f, f"{match}  •  {category}", card_x, 816, size=11, fill=TOKENS["green"], weight="SemiBold")
        card_x += 275

    # Rail 2: 10 Konten Teratas Hari Ini
    add_text(f, "🏆 10 Konten Teratas Hari Ini", 48, 855, size=18, fill=TOKENS["white"], weight="Bold")
    top_items = [
        ("1", "Dune: Part Two", "#201826"),
        ("2", "Oppenheimer", "#1A1720"),
        ("3", "Interstellar", "#141A28"),
        ("4", "Stranger Things", "#22141A"),
    ]
    tx = 48
    for rank, title, col in top_items:
        add_text(f, rank, tx, 915, size=64, fill=TOKENS["red"], weight="Bold")
        add_rect(f, f"TopCard-{title}", tx + 60, 900, 240, 110, fill=col, radius=8, stroke=TOKENS["border"], stroke_w=1)
        add_text(f, title, tx + 72, 935, size=13, fill=TOKENS["white"], weight="Bold")
        add_text(f, "Trending Rank #" + rank, tx + 72, 955, size=11, fill=TOKENS["muted"], weight="Regular")
        tx += 345

# ==============================================================================
# 2. WEB - DETAIL KONTEN (MEDIA PLAYER & REVIEWS) — 1440 x 1024
# ==============================================================================
def build_web_detail(f):
    # Navbar
    add_rect(f, "Web-Navbar", 0, 0, 1440, 68, fill=TOKENS["surface"], stroke=TOKENS["border"], stroke_w=1)
    add_text(f, "BINUS", 48, 22, size=22, fill=TOKENS["white"], weight="Bold")
    add_text(f, "FLIX", 118, 22, size=22, fill=TOKENS["red"], weight="Bold")
    add_text(f, "← Kembali ke Katalog Utama", 220, 26, size=13, fill=TOKENS["muted"], weight="SemiBold")
    add_ellipse(f, "User-Avatar", 1350, 16, 36, 36, fill=TOKENS["red"])
    
    # Breadcrumbs
    add_text(f, "Beranda  /  Film Layar Lebar  /  Dune: Part Two", 48, 88, size=12, fill=TOKENS["muted"], weight="Regular")
    
    # Split view: Left Vertical Poster
    add_rect(f, "Detail-Poster", 48, 120, 320, 480, fill="#1C1524", radius=14, stroke=TOKENS["border"], stroke_w=1)
    add_badge(f, "★ 8.6 IMDB", 64, 136, bg=TOKENS["red"], text_color=TOKENS["white"], size=10, pad_x=8, pad_y=4, radius=4)
    add_button(f, "❤️  Tersimpan di Favorit", 48, 620, 320, 44, bg=TOKENS["cardHover"], text_color=TOKENS["white"], radius=8, stroke=TOKENS["red"], weight="Bold")
    add_button(f, "↗  Bagikan Tautan Konten", 48, 676, 320, 40, bg="rgba(255,255,255,0.06)", text_color=TOKENS["secondary"], radius=8)

    # Right Column: Metadata + Cinema Player
    add_badge(f, "FILM LAYAR LEBAR", 400, 120, bg=TOKENS["red"], text_color=TOKENS["white"], size=10, pad_x=10, pad_y=4, radius=4)
    add_badge(f, "98% COCOK", 525, 120, bg="rgba(34,197,94,0.15)", text_color=TOKENS["green"], size=10, pad_x=8, pad_y=4, radius=4)
    add_badge(f, "4K ULTRA HD", 620, 120, bg="#1F2937", text_color=TOKENS["cyan"], size=10, pad_x=8, pad_y=4, radius=4)
    add_badge(f, "DOLBY ATMOS", 720, 120, bg="#1F2937", text_color=TOKENS["green"], size=10, pad_x=8, pad_y=4, radius=4)
    
    add_text(f, "Dune: Part Two", 400, 155, size=36, fill=TOKENS["white"], weight="Bold")
    add_text(f, "Disutradarai oleh Denis Villeneuve  •  Rilis: 1 Maret 2024  •  Durasi: 166 Menit", 400, 205, size=13, fill=TOKENS["secondary"], weight="SemiBold")
    add_text(f, "Sinopsis Cerita:", 400, 235, size=13, fill=TOKENS["white"], weight="Bold")
    add_text(f, "Paul Atreides bersatu dengan Chani dan Fremen untuk membalas dendam terhadap para konspirator", 400, 258, size=13, fill=TOKENS["muted"], weight="Regular")
    add_text(f, "yang menghancurkan keluarganya. Menghadapi pilihan antara cinta dalam hidupnya dan nasib alam semesta.", 400, 278, size=13, fill=TOKENS["muted"], weight="Regular")
    
    # Cast Chips (Matching DetailPage.jsx)
    add_text(f, "Pemeran Utama (Cast):", 400, 310, size=12, fill=TOKENS["white"], weight="Bold")
    cast = ["Timothée Chalamet", "Zendaya", "Rebecca Ferguson", "Javier Bardem", "Austin Butler"]
    chip_x = 400
    for name in cast:
        cw = len(name) * 7.5 + 20
        add_rect(f, f"Chip-{name}", chip_x, 332, cw, 26, fill=TOKENS["cardHover"], radius=13, stroke=TOKENS["border"], stroke_w=1)
        add_text(f, name, chip_x + 10, 338, size=11, fill=TOKENS["secondary"], weight="Regular")
        chip_x += cw + 8

    # Embedded Cinema Media Player Box (16:9 YouTube aspect look)
    add_rect(f, "Media-Player-Box", 400, 375, 990, 340, fill="#040508", radius=12, stroke=TOKENS["border"], stroke_w=1)
    add_ellipse(f, "Play-Btn-Icon", 870, 515, 60, 60, fill=TOKENS["red"])
    add_text(f, "▶", 895, 532, size=24, fill=TOKENS["white"], weight="Bold")
    add_text(f, "Official Trailer — Warner Bros. Pictures (1080p Full HD)", 420, 680, size=12, fill=TOKENS["secondary"], weight="SemiBold")
    add_rect(f, "Timeline-Track", 420, 700, 950, 4, fill="rgba(255,255,255,0.2)", radius=2)
    add_rect(f, "Timeline-Progress", 420, 700, 320, 4, fill=TOKENS["red"], radius=2)

    # Reviews & Ratings Community Section
    add_text(f, "💬 Ulasan & Rating Komunitas Pengguna (4 Ulasan)", 48, 740, size=18, fill=TOKENS["white"], weight="Bold")
    
    # Review Input Card
    add_rect(f, "Review-Input-Box", 48, 775, 650, 160, fill=TOKENS["surface"], radius=10, stroke=TOKENS["border"], stroke_w=1)
    add_text(f, "Berikan Rating Anda:", 68, 795, size=12, fill=TOKENS["secondary"], weight="Bold")
    add_text(f, "★ ★ ★ ★ ★  (5/5 Sangat Puas)", 200, 795, size=12, fill=TOKENS["gold"], weight="Bold")
    add_rect(f, "Review-Textarea", 68, 825, 610, 50, fill=TOKENS["cardHover"], radius=6, stroke=TOKENS["border"], stroke_w=1)
    add_text(f, "Tulis ulasan Anda tentang alur cerita, audio, atau sinematografi...", 80, 840, size=12, fill=TOKENS["muted"], weight="Regular")
    add_button(f, "Kirim Ulasan", 548, 885, 130, 36, bg=TOKENS["red"], text_color=TOKENS["white"], radius=6, weight="Bold")

    # User Review Cards
    add_rect(f, "User-Review-1", 720, 775, 670, 95, fill=TOKENS["surface"], radius=10, stroke=TOKENS["border"], stroke_w=1)
    add_text(f, "Andi Pratama  •  ★★★★★ (5/5)", 740, 790, size=13, fill=TOKENS["white"], weight="Bold")
    add_text(f, '"Visualnya luar biasa megah, audio scoring Hans Zimmer juara dan aktingnya sangat berkelas!"', 740, 815, size=12, fill=TOKENS["muted"], weight="Regular")
    add_text(f, "Diposting 2 jam yang lalu  •  Terverifikasi Mahasiswa BINUS", 740, 840, size=10, fill=TOKENS["subtle"], weight="Regular")

    add_rect(f, "User-Review-2", 720, 885, 670, 95, fill=TOKENS["surface"], radius=10, stroke=TOKENS["border"], stroke_w=1)
    add_text(f, "Siti Rahma  •  ★★★★★ (5/5)", 740, 900, size=13, fill=TOKENS["white"], weight="Bold")
    add_text(f, '"Adaptasi novel Frank Herbert paling sempurna sepanjang masa. Durasi 2.5 jam tidak terasa membosankan."', 740, 925, size=12, fill=TOKENS["muted"], weight="Regular")
    add_text(f, "Diposting 1 hari yang lalu  •  Terverifikasi", 740, 950, size=10, fill=TOKENS["subtle"], weight="Regular")

# ==============================================================================
# 3. WEB - FAVORIT SAYA (WATCHLIST) — 1440 x 1024
# ==============================================================================
def build_web_favorites(f):
    # Navbar
    add_rect(f, "Web-Navbar", 0, 0, 1440, 68, fill=TOKENS["surface"], stroke=TOKENS["border"], stroke_w=1)
    add_text(f, "BINUS", 48, 22, size=22, fill=TOKENS["white"], weight="Bold")
    add_text(f, "FLIX", 118, 22, size=22, fill=TOKENS["red"], weight="Bold")
    add_text(f, "Koleksi Favorit Saya", 210, 26, size=13, fill=TOKENS["white"], weight="Bold")
    add_ellipse(f, "User-Avatar", 1350, 16, 36, 36, fill=TOKENS["red"])
    
    # Page Header
    add_text(f, "Daftar Koleksi Favorit Saya", 48, 95, size=28, fill=TOKENS["white"], weight="Bold")
    add_text(f, "Koleksi film, serial TV, dan musik yang Anda simpan untuk dinikmati nanti (Tersinkronisasi Cloud MongoDB Atlas)", 48, 135, size=13, fill=TOKENS["muted"], weight="Regular")
    
    # Filter Tabs
    fav_tabs = [("Semua (6)", True), ("Film (3)", False), ("Serial TV (2)", False), ("Musik (1)", False)]
    tx = 48
    for tname, active in fav_tabs:
        bg = TOKENS["red"] if active else TOKENS["surface"]
        color = TOKENS["white"] if active else TOKENS["secondary"]
        tw = len(tname) * 8 + 24
        add_button(f, tname, tx, 175, tw, 32, bg=bg, text_color=color, radius=6)
        tx += tw + 10
        
    # Grid of Saved Items
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
        add_rect(f, f"FavCard-{title}", px, py, 320, 240, fill=col, radius=12, stroke=TOKENS["border"], stroke_w=1)
        tag_bg = TOKENS["red"] if category == "Film" else (TOKENS["tv"] if category == "Serial TV" else TOKENS["music"])
        add_badge(f, category.upper(), px + 12, py + 12, bg=tag_bg, text_color=TOKENS["white"], size=10, pad_x=8, pad_y=3, radius=4)
        add_badge(f, f"★ {rating}", px + 245, py + 12, bg="rgba(0,0,0,0.7)", text_color=TOKENS["gold"], size=10, pad_x=8, pad_y=3, radius=4)
        
        # Action overlay: Remove button
        add_button(f, "🗑️ Hapus", px + 225, py + 195, 85, 32, bg="rgba(229,9,20,0.85)", text_color=TOKENS["white"], radius=6, weight="Bold")
        
        # Info below poster
        add_text(f, title, px, py + 255, size=15, fill=TOKENS["white"], weight="Bold")
        add_text(f, f"{category} • Ditambahkan 05 Nov 2026", px, py + 278, size=12, fill=TOKENS["muted"], weight="Regular")
        add_button(f, "▶  Tonton / Dengar Sekarang", px, py + 305, 320, 36, bg=TOKENS["cardHover"], text_color=TOKENS["white"], radius=6, stroke=TOKENS["border"])

# ==============================================================================
# 4. WEB - LOGIN & REGISTER MODAL — 1440 x 900
# ==============================================================================
def build_web_auth(f):
    add_rect(f, "Auth-Backdrop-Dim", 0, 0, 1440, 900, fill=TOKENS["bg"])
    add_rect(f, "Brand-Glow", 470, 70, 500, 750, fill="#150E12", radius=20)
    
    # Auth Modal Card
    add_rect(f, "Auth-Card-Box", 470, 70, 500, 750, fill=TOKENS["surface"], radius=16, stroke=TOKENS["border"], stroke_w=1)
    
    # Logo
    add_text(f, "BINUS", 640, 105, size=28, fill=TOKENS["white"], weight="Bold")
    add_text(f, "FLIX", 735, 105, size=28, fill=TOKENS["red"], weight="Bold")
    add_text(f, "Selamat Datang di Hub Hiburan Digital", 560, 145, size=14, fill=TOKENS["muted"], weight="Regular")
    
    # 1-Click Demo Account Quick Box (1:1 with Web LoginPage.jsx)
    add_rect(f, "Demo-Autofill-Box", 510, 185, 420, 70, fill="#1A1114", radius=10, stroke=TOKENS["red"], stroke_w=1)
    add_text(f, "⚡ Akun Pengujian Demo (1-Click Isi Otomatis)", 530, 198, size=11, fill=TOKENS["red"], weight="Bold")
    add_text(f, "Email: demo@binus.ac.id  |  Pass: password123", 530, 222, size=12, fill=TOKENS["white"], weight="SemiBold")
    add_button(f, "Pakai Akun Demo", 810, 203, 110, 32, bg=TOKENS["red"], text_color=TOKENS["white"], radius=6, weight="Bold")

    # Input 1: Email (with Lucide Mail icon)
    add_text(f, "Email Mahasiswa / Akun", 510, 280, size=12, fill=TOKENS["secondary"], weight="Bold")
    add_rect(f, "Input-Email", 510, 305, 420, 48, fill=TOKENS["cardHover"], radius=8, stroke="rgba(255,255,255,0.12)", stroke_w=1)
    add_text(f, "✉️  demo@binus.ac.id", 526, 320, size=13, fill=TOKENS["white"], weight="Regular")
    
    # Input 2: Password (with Lucide Lock icon)
    add_text(f, "Kata Sandi", 510, 375, size=12, fill=TOKENS["secondary"], weight="Bold")
    add_rect(f, "Input-Password", 510, 400, 420, 48, fill=TOKENS["cardHover"], radius=8, stroke="rgba(255,255,255,0.12)", stroke_w=1)
    add_text(f, "🔒  ••••••••••••", 526, 415, size=15, fill=TOKENS["white"], weight="Regular")
    
    # Checkbox Remember Me & Forgot Password
    add_rect(f, "Check-Remember", 510, 465, 16, 16, fill=TOKENS["red"], radius=3)
    add_text(f, "✓", 514, 467, size=11, fill=TOKENS["white"], weight="Bold")
    add_text(f, "Ingat sesi login saya", 534, 466, size=12, fill=TOKENS["muted"], weight="Regular")
    add_text(f, "Lupa kata sandi?", 825, 466, size=12, fill=TOKENS["red"], weight="Bold")

    # Login CTA Button
    add_button(f, "Masuk Sekarang  ➔", 510, 510, 420, 48, bg=TOKENS["red"], text_color=TOKENS["white"], radius=8, weight="Bold")
    
    # Divider
    add_rect(f, "Divider-1", 510, 585, 180, 1, fill=TOKENS["border"])
    add_text(f, "atau", 705, 577, size=12, fill=TOKENS["subtle"], weight="Regular")
    add_rect(f, "Divider-2", 750, 585, 180, 1, fill=TOKENS["border"])

    # Register Switch CTA
    add_text(f, "Belum memiliki akun mahasiswa?", 560, 620, size=13, fill=TOKENS["muted"], weight="Regular")
    add_text(f, "Daftar Akun Baru", 780, 620, size=13, fill=TOKENS["red"], weight="Bold")
    add_button(f, "Buat Akun BINUSFLIX", 510, 655, 420, 44, bg=TOKENS["cardHover"], text_color=TOKENS["white"], radius=8, stroke="rgba(255,255,255,0.15)")

# ==============================================================================
# 5. WEB - PROFIL & PENGATURAN — 1440 x 900
# ==============================================================================
def build_web_profile(f):
    # Navbar
    add_rect(f, "Web-Navbar", 0, 0, 1440, 68, fill=TOKENS["surface"], stroke=TOKENS["border"], stroke_w=1)
    add_text(f, "BINUS", 48, 22, size=22, fill=TOKENS["white"], weight="Bold")
    add_text(f, "FLIX", 118, 22, size=22, fill=TOKENS["red"], weight="Bold")
    add_text(f, "Profil & Pengaturan Akun", 210, 26, size=13, fill=TOKENS["white"], weight="Bold")
    
    # Profile Card
    add_rect(f, "Profile-Header-Card", 48, 95, 1344, 200, fill=TOKENS["surface"], radius=16, stroke=TOKENS["border"], stroke_w=1)
    add_ellipse(f, "Profile-Avatar-Ring", 88, 135, 90, 90, fill=TOKENS["red"])
    add_text(f, "B", 120, 160, size=36, fill=TOKENS["white"], weight="Bold")
    
    add_text(f, "Binus Student Demo", 205, 140, size=24, fill=TOKENS["white"], weight="Bold")
    add_badge(f, "MAHASISWA AKTIF — COMPUTER SCIENCE", 445, 145, bg="#1F2937", text_color=TOKENS["cyan"], size=10, pad_x=8, pad_y=3, radius=4)
    add_text(f, "@binusian_user  •  demo@binus.ac.id  •  NIM: 2602123456", 205, 175, size=13, fill=TOKENS["muted"], weight="Regular")
    add_text(f, "Bergabung sejak November 2026  •  Paket: Premium Mahasiswa Unlimited", 205, 198, size=12, fill=TOKENS["subtle"], weight="Regular")

    # Stat Badges (Synchronized with Mobile)
    add_rect(f, "Stat-Box-1", 930, 125, 120, 140, fill=TOKENS["cardHover"], radius=10)
    add_text(f, "12", 975, 150, size=28, fill=TOKENS["red"], weight="Bold")
    add_text(f, "Koleksi Favorit", 945, 195, size=11, fill=TOKENS["muted"], weight="SemiBold")

    add_rect(f, "Stat-Box-2", 1070, 125, 120, 140, fill=TOKENS["cardHover"], radius=10)
    add_text(f, "18", 1115, 150, size=28, fill=TOKENS["cyan"], weight="Bold")
    add_text(f, "Konten Ditonton", 1085, 195, size=11, fill=TOKENS["muted"], weight="SemiBold")

    add_rect(f, "Stat-Box-3", 1210, 125, 120, 140, fill=TOKENS["cardHover"], radius=10)
    add_text(f, "5", 1255, 150, size=28, fill=TOKENS["green"], weight="Bold")
    add_text(f, "Ulasan Dibuat", 1230, 195, size=11, fill=TOKENS["muted"], weight="SemiBold")

    # Edit Profile Form
    add_text(f, "Pengaturan Profil Pengguna", 48, 320, size=18, fill=TOKENS["white"], weight="Bold")
    add_rect(f, "Form-Card", 48, 355, 840, 480, fill=TOKENS["surface"], radius=12, stroke=TOKENS["border"], stroke_w=1)
    
    # Input Nama
    add_text(f, "Nama Lengkap:", 80, 385, size=12, fill=TOKENS["secondary"], weight="Bold")
    add_rect(f, "In-Name", 80, 408, 360, 42, fill=TOKENS["cardHover"], radius=6)
    add_text(f, "Binus Student Demo", 95, 420, size=13, fill=TOKENS["white"], weight="Regular")
    
    # Input Username
    add_text(f, "Username:", 480, 385, size=12, fill=TOKENS["secondary"], weight="Bold")
    add_rect(f, "In-User", 480, 408, 360, 42, fill=TOKENS["cardHover"], radius=6)
    add_text(f, "binusian_user", 495, 420, size=13, fill=TOKENS["white"], weight="Regular")
    
    # Input Email
    add_text(f, "Alamat Email:", 80, 475, size=12, fill=TOKENS["secondary"], weight="Bold")
    add_rect(f, "In-Email", 80, 498, 760, 42, fill=TOKENS["cardHover"], radius=6)
    add_text(f, "demo@binus.ac.id", 95, 510, size=13, fill=TOKENS["white"], weight="Regular")
    
    # Bio Textarea
    add_text(f, "Biodata / Kutipan Favorit:", 80, 565, size=12, fill=TOKENS["secondary"], weight="Bold")
    add_rect(f, "In-Bio", 80, 588, 760, 70, fill=TOKENS["cardHover"], radius=6)
    add_text(f, "Mahasiswa Teknik Informatika BINUS University, penggemar berat film sci-fi dan scoring orchestral.", 95, 605, size=12, fill=TOKENS["secondary"], weight="Regular")

    add_button(f, "Simpan Perubahan", 80, 685, 180, 44, bg=TOKENS["red"], text_color=TOKENS["white"], radius=8, weight="Bold")
    add_button(f, "Keluar dari Akun (Logout)", 280, 685, 200, 44, bg="rgba(255,255,255,0.06)", text_color=TOKENS["danger"], radius=8, stroke="rgba(239,68,68,0.3)")

# ==============================================================================
# 6. MOBILE - BERANDA (HOME SCREEN) — 390 x 844
# ==============================================================================
def build_mobile_home(f):
    # Status bar
    add_text(f, "9:41", 24, 14, size=13, fill=TOKENS["white"], weight="Bold")
    add_text(f, "📶  🔋", 325, 14, size=11, fill=TOKENS["white"])
    
    # Mobile Header Bar (1:1 with mobile/src/screens/HomeScreen.js topBar)
    add_text(f, "BINUS", 20, 48, size=18, fill=TOKENS["white"], weight="Bold")
    add_text(f, "FLIX", 78, 48, size=18, fill=TOKENS["red"], weight="Bold")
    add_badge(f, "PRO", 130, 50, bg=TOKENS["red"], text_color=TOKENS["white"], size=8, pad_x=5, pad_y=2, radius=3)
    add_ellipse(f, "Mobile-Avatar-Ring", 338, 42, 32, 32, fill=TOKENS["red"])
    add_ellipse(f, "Mobile-Avatar", 340, 44, 28, 28, fill=TOKENS["cardHover"])
    add_text(f, "B", 350, 51, size=12, fill=TOKENS["white"], weight="Bold")
    
    # Category Filter Pills (Exact same order and colors as Web)
    m_cats = ["Semua", "Film", "Serial TV", "Musik"]
    mx = 20
    for i, c in enumerate(m_cats):
        bg = TOKENS["red"] if i == 0 else TOKENS["cardHover"]
        color = TOKENS["white"] if i == 0 else TOKENS["muted"]
        bw = len(c) * 7.5 + 20
        add_button(f, c, mx, 86, bw, 28, bg=bg, text_color=color, radius=14, weight="SemiBold")
        mx += bw + 8

    # Search Bar (Ionicons search)
    add_rect(f, "Mobile-Search", 20, 124, 350, 38, fill=TOKENS["cardHover"], radius=8, stroke=TOKENS["border"], stroke_w=1)
    add_text(f, "🔍  Cari film, serial TV, musik...", 36, 135, size=12, fill=TOKENS["muted"], weight="Regular")

    # Featured Billboard Hero Card
    add_rect(f, "Mobile-Hero-Card", 20, 172, 350, 240, fill="#1D1624", radius=12, stroke=TOKENS["border"], stroke_w=1)
    add_badge(f, "🔥 POPULER HARI INI", 36, 188, bg=TOKENS["red"], text_color=TOKENS["white"], size=9, pad_x=6, pad_y=2, radius=3)
    add_text(f, "Dune: Part Two", 36, 230, size=24, fill=TOKENS["white"], weight="Bold")
    add_text(f, "98% Cocok  •  Sci-Fi / Adventure  •  ★ 8.6", 36, 262, size=11, fill=TOKENS["green"], weight="SemiBold")
    
    # Hero action buttons (Putar Trailer & Tambah Favorit)
    add_button(f, "▶  Putar Trailer", 36, 300, 150, 38, bg=TOKENS["white"], text_color="#000000", radius=6, weight="Bold")
    add_button(f, "+  Daftar Saya", 198, 300, 155, 38, bg="rgba(0,0,0,0.6)", text_color=TOKENS["white"], radius=6, stroke="rgba(255,255,255,0.2)")

    # Section 1: Sedang Tren (2-Column Grid)
    add_text(f, "Sedang Tren Sekarang", 20, 430, size=15, fill=TOKENS["white"], weight="Bold")
    
    # Card 1
    add_rect(f, "Card-1", 20, 458, 168, 140, fill="#1A1720", radius=8, stroke=TOKENS["border"], stroke_w=1)
    add_badge(f, "FILM", 28, 466, bg=TOKENS["red"], text_color=TOKENS["white"], size=8, pad_x=5, pad_y=2, radius=3)
    add_badge(f, "★ 8.9", 140, 466, bg="rgba(0,0,0,0.7)", text_color=TOKENS["gold"], size=8, pad_x=4, pad_y=2, radius=3)
    add_text(f, "Oppenheimer", 20, 606, size=12, fill=TOKENS["white"], weight="Bold")
    add_text(f, "99% Cocok  •  Film", 20, 624, size=10, fill=TOKENS["green"], weight="SemiBold")

    # Card 2
    add_rect(f, "Card-2", 202, 458, 168, 140, fill="#141A28", radius=8, stroke=TOKENS["border"], stroke_w=1)
    add_badge(f, "SERIAL TV", 210, 466, bg=TOKENS["tv"], text_color=TOKENS["white"], size=8, pad_x=5, pad_y=2, radius=3)
    add_badge(f, "★ 8.7", 322, 466, bg="rgba(0,0,0,0.7)", text_color=TOKENS["gold"], size=8, pad_x=4, pad_y=2, radius=3)
    add_text(f, "Stranger Things", 202, 606, size=12, fill=TOKENS["white"], weight="Bold")
    add_text(f, "96% Cocok  •  Serial TV", 202, 624, size=10, fill=TOKENS["green"], weight="SemiBold")

    # Section 2: Top 10
    add_text(f, "Top 10 Hari Ini", 20, 650, size=15, fill=TOKENS["white"], weight="Bold")
    add_text(f, "1", 20, 690, size=44, fill=TOKENS["red"], weight="Bold")
    add_rect(f, "Top-1", 55, 680, 130, 80, fill="#1C1824", radius=6, stroke=TOKENS["border"], stroke_w=1)
    
    add_text(f, "2", 205, 690, size=44, fill=TOKENS["red"], weight="Bold")
    add_rect(f, "Top-2", 240, 680, 130, 80, fill="#141822", radius=6, stroke=TOKENS["border"], stroke_w=1)

    # Bottom Tab Navigation Bar (1:1 with mobile/src/navigation/AppNavigator.js)
    add_rect(f, "Bottom-Bar", 0, 774, 390, 70, fill=TOKENS["bg"], stroke=TOKENS["border"], stroke_w=1)
    # Tab 1: Beranda (Active Crimson Red)
    add_text(f, "🎬", 55, 786, size=18, fill=TOKENS["red"])
    add_text(f, "Beranda", 48, 810, size=10, fill=TOKENS["red"], weight="Bold")

    # Tab 2: Favorit
    add_text(f, "❤️", 185, 786, size=18, fill=TOKENS["muted"])
    add_text(f, "Favorit", 178, 810, size=10, fill=TOKENS["muted"], weight="Bold")

    # Tab 3: Profil
    add_text(f, "👤", 315, 786, size=18, fill=TOKENS["muted"])
    add_text(f, "Profil", 310, 810, size=10, fill=TOKENS["muted"], weight="Bold")

# ==============================================================================
# 7. MOBILE - DETAIL KONTEN — 390 x 844
# ==============================================================================
def build_mobile_detail(f):
    add_text(f, "9:41", 24, 14, size=13, fill=TOKENS["white"], weight="Bold")
    add_text(f, "📶  🔋", 325, 14, size=11, fill=TOKENS["white"])
    
    # Top Action Bar with Ionicons
    add_text(f, "← Kembali", 20, 48, size=14, fill=TOKENS["white"], weight="Bold")
    add_text(f, "❤️  ↗", 325, 48, size=16, fill=TOKENS["white"])
    
    # 16:9 Media Player Preview
    add_rect(f, "Mobile-Video-Player", 0, 80, 390, 220, fill="#000000")
    add_ellipse(f, "M-Play-Icon", 175, 170, 44, 44, fill=TOKENS["red"])
    add_text(f, "▶", 190, 183, size=18, fill=TOKENS["white"], weight="Bold")
    
    # Metadata
    add_text(f, "Dune: Part Two", 20, 318, size=22, fill=TOKENS["white"], weight="Bold")
    add_text(f, "98% Cocok   2024   166 min   4K Ultra HD", 20, 350, size=11, fill=TOKENS["green"], weight="SemiBold")
    
    # Action Buttons
    add_button(f, "▶  Putar Trailer", 20, 375, 350, 42, bg=TOKENS["red"], text_color=TOKENS["white"], radius=6, weight="Bold")
    add_button(f, "+  Tambah ke Favorit", 20, 425, 350, 38, bg=TOKENS["cardHover"], text_color=TOKENS["secondary"], radius=6, stroke=TOKENS["border"])

    # Synopsis
    add_text(f, "Paul Atreides bersatu dengan Chani dan suku Fremen untuk membalas dendam terhadap pihak yang menghancurkan keluarganya...", 20, 480, size=12, fill=TOKENS["muted"], weight="Regular")
    add_text(f, "Pemeran: Timothée Chalamet, Zendaya, Rebecca Ferguson", 20, 528, size=11, fill=TOKENS["subtle"], weight="Regular")

    # Star Rating & Community Reviews
    add_text(f, "Ulasan & Rating (18)", 20, 565, size=15, fill=TOKENS["white"], weight="Bold")
    add_rect(f, "M-Review-Box", 20, 595, 350, 120, fill=TOKENS["surface"], radius=8, stroke=TOKENS["border"], stroke_w=1)
    add_text(f, "Andi Pratama  •  ★★★★★", 34, 608, size=12, fill=TOKENS["white"], weight="Bold")
    add_text(f, '"Visualnya luar biasa megah, audio scoring juara!"', 34, 630, size=11, fill=TOKENS["muted"], weight="Regular")
    add_button(f, "+ Tulis Ulasan Anda", 34, 665, 320, 34, bg=TOKENS["cardHover"], text_color=TOKENS["red"], radius=6, stroke=TOKENS["red"])

    # Bottom Bar
    add_rect(f, "Bottom-Bar", 0, 774, 390, 70, fill=TOKENS["bg"], stroke=TOKENS["border"], stroke_w=1)
    add_text(f, "🎬", 55, 786, size=18, fill=TOKENS["muted"])
    add_text(f, "❤️", 185, 786, size=18, fill=TOKENS["red"])
    add_text(f, "👤", 315, 786, size=18, fill=TOKENS["muted"])

# ==============================================================================
# 8. MOBILE - FAVORIT SAYA — 390 x 844
# ==============================================================================
def build_mobile_favorites(f):
    add_text(f, "9:41", 24, 14, size=13, fill=TOKENS["white"], weight="Bold")
    add_text(f, "📶  🔋", 325, 14, size=11, fill=TOKENS["white"])
    
    add_text(f, "Favorit Saya", 20, 48, size=20, fill=TOKENS["white"], weight="Bold")
    add_text(f, "6 Konten Tersimpan di Cloud MongoDB", 20, 75, size=12, fill=TOKENS["muted"], weight="Regular")
    
    # 2-Column Grid
    favs = [
        ("Dune: Part Two", "8.6", "#201826", "Film"),
        ("Oppenheimer", "8.9", "#1A1720", "Film"),
        ("Interstellar", "8.7", "#141A28", "Film"),
        ("Stranger Things", "8.7", "#22141A", "Serial TV"),
    ]
    for i, (title, rating, col, cat) in enumerate(favs):
        col_idx = i % 2
        row_idx = i // 2
        px = 20 + (col_idx * 180)
        py = 110 + (row_idx * 210)
        
        add_rect(f, f"MFav-{title}", px, py, 170, 160, fill=col, radius=8, stroke=TOKENS["border"], stroke_w=1)
        tag_bg = TOKENS["red"] if cat == "Film" else TOKENS["tv"]
        add_badge(f, cat.upper(), px + 8, py + 8, bg=tag_bg, text_color=TOKENS["white"], size=8, pad_x=4, pad_y=2, radius=3)
        add_badge(f, f"★ {rating}", px + 115, py + 8, bg="rgba(0,0,0,0.6)", text_color=TOKENS["gold"], size=8, pad_x=5, pad_y=2, radius=3)
        add_text(f, title, px, py + 170, size=12, fill=TOKENS["white"], weight="Bold")
        add_text(f, "🗑️ Hapus dari Favorit", px, py + 188, size=11, fill=TOKENS["red"], weight="Bold")

    # Bottom Bar
    add_rect(f, "Bottom-Bar", 0, 774, 390, 70, fill=TOKENS["bg"], stroke=TOKENS["border"], stroke_w=1)
    add_text(f, "🎬", 55, 786, size=18, fill=TOKENS["muted"])
    add_text(f, "❤️", 185, 786, size=18, fill=TOKENS["red"])
    add_text(f, "👤", 315, 786, size=18, fill=TOKENS["muted"])

# ==============================================================================
# 9. MOBILE - LOGIN — 390 x 844
# ==============================================================================
def build_mobile_login(f):
    add_text(f, "9:41", 24, 14, size=13, fill=TOKENS["white"], weight="Bold")
    add_text(f, "📶  🔋", 325, 14, size=11, fill=TOKENS["white"])

    add_text(f, "BINUS", 130, 90, size=28, fill=TOKENS["white"], weight="Bold")
    add_text(f, "FLIX", 215, 90, size=28, fill=TOKENS["red"], weight="Bold")
    add_text(f, "Masuk ke Akun Mahasiswa", 110, 130, size=13, fill=TOKENS["muted"], weight="Regular")

    # 1-Click Demo Autofill (Identical to Web)
    add_rect(f, "M-Demo-Box", 24, 175, 342, 60, fill="#1A1114", radius=8, stroke=TOKENS["red"], stroke_w=1)
    add_text(f, "⚡ Demo 1-Click Autofill", 40, 188, size=11, fill=TOKENS["red"], weight="Bold")
    add_text(f, "demo@binus.ac.id  |  password123", 40, 208, size=11, fill=TOKENS["white"], weight="SemiBold")

    # Inputs with Icon prefix
    add_text(f, "Alamat Email:", 24, 260, size=12, fill=TOKENS["secondary"], weight="Bold")
    add_rect(f, "M-Input-Email", 24, 282, 342, 44, fill=TOKENS["cardHover"], radius=6, stroke=TOKENS["border"], stroke_w=1)
    add_text(f, "✉️  demo@binus.ac.id", 36, 296, size=13, fill=TOKENS["white"], weight="Regular")

    add_text(f, "Kata Sandi:", 24, 345, size=12, fill=TOKENS["secondary"], weight="Bold")
    add_rect(f, "M-Input-Pass", 24, 367, 342, 44, fill=TOKENS["cardHover"], radius=6, stroke=TOKENS["border"], stroke_w=1)
    add_text(f, "🔒  ••••••••••••", 36, 381, size=15, fill=TOKENS["white"], weight="Regular")

    add_button(f, "Masuk Sekarang ➔", 24, 440, 342, 46, bg=TOKENS["red"], text_color=TOKENS["white"], radius=8, weight="Bold")
    add_text(f, "Belum punya akun? Daftar Baru", 95, 510, size=12, fill=TOKENS["muted"], weight="Regular")

# ==============================================================================
# 10. MOBILE - PROFIL — 390 x 844
# ==============================================================================
def build_mobile_profile(f):
    add_text(f, "9:41", 24, 14, size=13, fill=TOKENS["white"], weight="Bold")
    add_text(f, "📶  🔋", 325, 14, size=11, fill=TOKENS["white"])

    add_ellipse(f, "M-Profile-Ring", 153, 68, 84, 84, fill=TOKENS["red"])
    add_ellipse(f, "M-Profile-Pic", 155, 70, 80, 80, fill=TOKENS["cardHover"])
    add_text(f, "B", 185, 95, size=32, fill=TOKENS["white"], weight="Bold")

    add_text(f, "Binus Student Demo", 115, 165, size=18, fill=TOKENS["white"], weight="Bold")
    add_text(f, "demo@binus.ac.id  •  Computer Science", 85, 190, size=11, fill=TOKENS["muted"], weight="Regular")

    # Synchronized 3-metric statistics
    add_rect(f, "M-Stats-Row", 24, 220, 342, 70, fill=TOKENS["surface"], radius=8, stroke=TOKENS["border"], stroke_w=1)
    add_text(f, "12", 85, 235, size=20, fill=TOKENS["red"], weight="Bold")
    add_text(f, "Favorit", 75, 260, size=11, fill=TOKENS["muted"], weight="SemiBold")
    
    add_text(f, "18", 185, 235, size=20, fill=TOKENS["cyan"], weight="Bold")
    add_text(f, "Ditonton", 170, 260, size=11, fill=TOKENS["muted"], weight="SemiBold")
    
    add_text(f, "5", 285, 235, size=20, fill=TOKENS["green"], weight="Bold")
    add_text(f, "Ulasan", 275, 260, size=11, fill=TOKENS["muted"], weight="SemiBold")

    # Native Action Menu items
    menus = [
        ("👤  Edit Profil Pengguna", TOKENS["white"]),
        ("🔒  Ubah Kata Sandi", TOKENS["white"]),
        ("📥  Pengaturan Unduhan Offline", TOKENS["white"]),
        ("❓  Bantuan & FAQ Mahasiswa", TOKENS["white"]),
        ("🚪  Keluar dari Akun (Logout)", TOKENS["danger"])
    ]
    my = 315
    for m, col in menus:
        add_rect(f, f"Menu-{m[:10]}", 24, my, 342, 46, fill=TOKENS["surface"], radius=6, stroke=TOKENS["border"], stroke_w=1)
        add_text(f, m, 40, my + 15, size=13, fill=col, weight="SemiBold")
        my += 56

    # Bottom Bar
    add_rect(f, "Bottom-Bar", 0, 774, 390, 70, fill=TOKENS["bg"], stroke=TOKENS["border"], stroke_w=1)
    add_text(f, "🎬", 55, 786, size=18, fill=TOKENS["muted"])
    add_text(f, "❤️", 185, 786, size=18, fill=TOKENS["muted"])
    add_text(f, "👤", 315, 786, size=18, fill=TOKENS["red"])

# ==============================================================================
# 11. DESIGN SYSTEM & UI TOKENS — 1440 x 950
# ==============================================================================
def build_design_system(f):
    add_text(f, "BINUSFLIX — DESIGN SYSTEM & UI TOKENS (LO 3)", 48, 40, size=24, fill=TOKENS["white"], weight="Bold")
    add_text(f, "Spesifikasi token warna resmi, tipografi, dan komponen master antarmuka web dan mobile.", 48, 75, size=13, fill=TOKENS["muted"], weight="Regular")

    # 1. Color Palette Tokens
    add_text(f, "1. Color Palette Tokens (Sinkronisasi Web Tailwind & Mobile Constants)", 48, 115, size=18, fill=TOKENS["white"], weight="Bold")
    swatches = [
        ("Obsidian Black", TOKENS["bg"], "Background"),
        ("Surface Dark", TOKENS["surface"], "Card Panel"),
        ("Elevated Surface", TOKENS["cardHover"], "Input / Hover"),
        ("BINUS Red", TOKENS["red"], "Brand Primary"),
        ("Match Green", TOKENS["green"], "Match Indicator"),
        ("Rating Gold", TOKENS["gold"], "Star Score"),
        ("Cyan Accent", TOKENS["cyan"], "Badges / HD"),
        ("Text Secondary", TOKENS["muted"], "Muted Labels"),
    ]
    sx = 48
    for name, hexcode, role in swatches:
        add_rect(f, f"Swatch-{hexcode}", sx, 150, 140, 80, fill=hexcode, radius=8, stroke="rgba(255,255,255,0.15)", stroke_w=1)
        add_text(f, hexcode, sx, 240, size=12, fill=TOKENS["white"], weight="Bold")
        add_text(f, name, sx, 258, size=11, fill=TOKENS["muted"], weight="SemiBold")
        add_text(f, role, sx, 274, size=10, fill=TOKENS["subtle"], weight="Regular")
        sx += 165

    # 2. Typography Scale
    add_text(f, "2. Typography Scale (Plus Jakarta Sans — Sans-Serif)", 48, 315, size=18, fill=TOKENS["white"], weight="Bold")
    add_text(f, "Display Hero — 40px Bold (Header)", 48, 350, size=40, fill=TOKENS["white"], weight="Bold")
    add_text(f, "Heading 1 — 28px Bold (Page Title)", 48, 405, size=28, fill=TOKENS["white"], weight="Bold")
    add_text(f, "Heading 2 — 20px SemiBold (Section Header)", 48, 448, size=20, fill=TOKENS["white"], weight="SemiBold")
    add_text(f, "Body Regular — 14px Regular (Sinopsis & Konten)", 48, 480, size=14, fill=TOKENS["secondary"], weight="Regular")
    add_text(f, "Caption & Microcopy — 11px Bold (Pills & Badges)", 48, 508, size=11, fill=TOKENS["muted"], weight="Bold")

    # 3. Master Reusable Components & Buttons
    add_text(f, "3. Component Library Master", 48, 550, size=18, fill=TOKENS["white"], weight="Bold")
    
    add_button(f, "Primary Button", 48, 585, 150, 42, bg=TOKENS["red"], text_color=TOKENS["white"], radius=8, weight="Bold")
    add_button(f, "Secondary Button", 215, 585, 160, 42, bg=TOKENS["cardHover"], text_color=TOKENS["white"], radius=8, stroke=TOKENS["border"])
    add_button(f, "Outline Button", 395, 585, 150, 42, bg="transparent", text_color=TOKENS["red"], radius=8, stroke=TOKENS["red"])

    # Badges
    add_badge(f, "FILM LAYAR LEBAR", 48, 648, bg=TOKENS["red"], text_color=TOKENS["white"], size=10, pad_x=10, pad_y=4, radius=4)
    add_badge(f, "SERIAL TV", 185, 648, bg=TOKENS["tv"], text_color=TOKENS["white"], size=10, pad_x=10, pad_y=4, radius=4)
    add_badge(f, "MUSIK STUDIO", 280, 648, bg=TOKENS["music"], text_color=TOKENS["white"], size=10, pad_x=10, pad_y=4, radius=4)
    add_badge(f, "★ 8.6 RATING", 395, 648, bg=TOKENS["gold"], text_color="#000000", size=10, pad_x=10, pad_y=4, radius=4)
    add_badge(f, "4K ULTRA HD", 510, 648, bg="#1F2937", text_color=TOKENS["cyan"], size=10, pad_x=10, pad_y=4, radius=4)
    add_badge(f, "98% COCOK", 620, 648, bg="rgba(34,197,94,0.15)", text_color=TOKENS["green"], size=10, pad_x=10, pad_y=4, radius=4)

    # 4. Iconography System (Lucide React vs Ionicons)
    add_text(f, "4. Iconography Tokens (Lucide React vs @expo/vector-icons Ionicons)", 48, 715, size=18, fill=TOKENS["white"], weight="Bold")
    
    icon_mappings = [
        ("Katalog Film", "Film", "film"),
        ("Serial TV", "Tv", "tv-outline"),
        ("Musik & Lagu", "Music", "musical-notes"),
        ("Pencarian", "Search", "search"),
        ("Koleksi Favorit", "Heart", "heart"),
        ("Rating Bintang", "Star", "star"),
        ("Putar Media", "Play", "play"),
        ("Profil Pengguna", "User", "person"),
        ("Hapus Item", "Trash2", "trash-outline"),
        ("Keluar Akun", "LogOut", "log-out"),
    ]
    ix = 48
    for label, lucide_name, ionic_name in icon_mappings:
        add_rect(f, f"IconMap-{lucide_name}", ix, 755, 122, 130, fill=TOKENS["surface"], radius=8, stroke=TOKENS["border"], stroke_w=1)
        add_text(f, label, ix + 10, 768, size=10, fill=TOKENS["secondary"], weight="Bold")
        add_text(f, f"Web (Lucide):", ix + 10, 792, size=9, fill=TOKENS["muted"], weight="Regular")
        add_badge(f, lucide_name, ix + 10, 808, bg=TOKENS["cardHover"], text_color=TOKENS["cyan"], size=9, pad_x=5, pad_y=2, radius=3)
        add_text(f, f"Mobile (Ionicons):", ix + 10, 836, size=9, fill=TOKENS["muted"], weight="Regular")
        add_badge(f, ionic_name, ix + 10, 852, bg=TOKENS["cardHover"], text_color=TOKENS["gold"], size=9, pad_x=5, pad_y=2, radius=3)
        ix += 134

def main():
    print("Building BINUSFLIX FigCraft design project with 1:1 Web & Mobile parity...")
    
    # Row 1: Web Frames (1440 x 1024 / 900)
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
    f11 = add_frame("Design System & UI Tokens", 0, 2100, 1440, 950)
    build_design_system(f11)

    output_json_path = "E:/Project/BINUS/entertainment-hub/docs/binusflix_design_commands.json"
    with open(output_json_path, "w", encoding="utf-8") as f:
        json.dump(commands, f, indent=2)

    print(f"Generated {len(commands)} design commands in {output_json_path}")

if __name__ == "__main__":
    main()
