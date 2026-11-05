import React from 'react';
import { Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="border-t border-white/[0.08] bg-[#07080A] text-neutral-500 py-12 px-4 sm:px-8 lg:px-12 text-xs">
      <div className="max-w-[1720px] mx-auto space-y-6">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-1 select-none">
            <span className="text-base sm:text-lg font-black tracking-tighter text-white">
              BINUS<span className="text-[#E50914]">FLIX</span>
            </span>
            <span className="px-1.5 py-0.2 rounded text-[8px] font-black tracking-widest bg-[#E50914] text-white uppercase ml-1">
              PRO
            </span>
          </Link>
          <span className="text-neutral-600">•</span>
          <span className="text-neutral-400 text-xs font-medium">
            The Official BINUS Digital Entertainment & Streaming Hub
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-[11px] text-neutral-400">
          <ul className="space-y-2">
            <li><Link to="/?type=movie" className="hover:text-white transition">Film Layar Lebar</Link></li>
            <li><Link to="/?type=tv" className="hover:text-white transition">Serial TV Populer</Link></li>
            <li><Link to="/?type=music" className="hover:text-white transition">Tangga Lagu Hits</Link></li>
          </ul>
          <ul className="space-y-2">
            <li><Link to="/favorites" className="hover:text-white transition">Daftar Saya (Watchlist)</Link></li>
            <li><Link to="/profile" className="hover:text-white transition">Akun & Preferensi</Link></li>
            <li><Link to="/login" className="hover:text-white transition">Pusat Masuk Akun</Link></li>
          </ul>
          <ul className="space-y-2">
            <li>Platform Web & Mobile</li>
            <li>Node.js • React • Expo</li>
            <li>Database MongoDB Atlas</li>
          </ul>
          <ul className="space-y-2">
            <li>BINUS University</li>
            <li>Tugas Akhir LO 3</li>
            <li className="text-emerald-400">Server & Database Terhubung</li>
          </ul>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-white/[0.06] text-[11px]">
          <div className="flex items-center gap-2 px-3 py-1.5 border border-white/10 rounded-lg text-neutral-300 bg-[#0D1017]">
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <span>Bahasa Indonesia</span>
          </div>

          <p className="text-neutral-500">
            © 2026 BINUSFLIX — Proyek Studi Kasus Ujian Pemrograman Web & Mobile BINUS University.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
