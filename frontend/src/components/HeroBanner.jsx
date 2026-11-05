import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, Info, ChevronRight, ChevronLeft, Volume2 } from 'lucide-react';

const HeroBanner = ({ banners = [], onOpenTrailer }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!banners || banners.length === 0) return null;

  const current = banners[currentIndex] || banners[0];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const isMusic = current.contentType === 'music';

  return (
    <div className="relative w-full h-[75vh] min-h-[520px] max-h-[780px] -mt-16 sm:-mt-20 overflow-hidden select-none">
      {/* Background Poster/Backdrop */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-700 transform scale-100"
        style={{
          backgroundImage: `url(${current.backdropUrl || current.posterUrl})`,
        }}
      />

      {/* BINUSFLIX Dark Vignette Overlays: Left Dark Gradient & Bottom Fade into #07080A */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#07080A] via-[#07080A]/85 to-transparent w-full md:w-3/5 z-[1]" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#07080A] via-[#07080A]/30 to-transparent h-full z-[1]" />
      <div className="absolute bottom-0 left-0 right-0 h-40 binus-bottom-fade z-[1]" />

      {/* Content Container - Strictly Left-Aligned with Layout Padding */}
      <div className="relative z-10 h-full max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12 flex flex-col justify-end pb-16 sm:pb-20 w-full">
        <div className="max-w-xl sm:max-w-2xl lg:max-w-3xl text-left">
          {/* Top 10 & BINUSFLIX Exclusive Ribbon Badge */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <div className="flex items-center gap-1 bg-[#E50914] px-2 py-0.5 rounded shadow-lg shadow-red-950/50">
              <span className="text-[10px] font-black text-white tracking-widest uppercase">TOP 10</span>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-black tracking-wider bg-black/60 text-white border border-white/20 uppercase">
              BINUS PRO
            </span>
            <span className="text-xs sm:text-sm font-bold text-neutral-200 tracking-wide uppercase drop-shadow-md">
              No. 1 dalam {current.contentType === 'movie' ? 'Film Layar Lebar' : current.contentType === 'tv' ? 'Serial TV' : 'Tangga Musik'} Hari Ini
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tighter leading-none mb-3 drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]">
            {current.title}
          </h1>

          {/* Tags & Match Score */}
          <div className="flex flex-wrap items-center gap-2.5 text-xs sm:text-sm mb-4 font-semibold text-neutral-300">
            <span className="text-emerald-400 font-extrabold flex items-center gap-1 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/20">
              98% Cocok
            </span>
            <span className="text-amber-400 font-bold flex items-center gap-1">
              ★ {current.rating ? Number(current.rating).toFixed(1) : '8.6'}
            </span>
            <span>{current.releaseDate ? current.releaseDate.substring(0, 4) : '2024'}</span>
            <span className="border border-white/20 bg-white/5 px-1.5 py-0.5 text-[10px] rounded text-white font-bold tracking-wider">
              {isMusic ? 'LOSSLESS' : '4K UHD'}
            </span>
            <span className="border border-cyan-500/30 bg-cyan-950/30 px-1.5 py-0.5 text-[10px] rounded text-cyan-300 font-bold tracking-wider">
              {isMusic ? 'AUDIO MASTER' : 'SUB INDO'}
            </span>
            <span className="text-neutral-400">• {current.genre}</span>
          </div>

          {/* Synopsis */}
          <p className="text-xs sm:text-sm md:text-base text-neutral-300 line-clamp-3 leading-relaxed mb-6 drop-shadow-md max-w-xl">
            {current.overview}
          </p>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            {/* Bold White Play Button */}
            <button
              onClick={() => onOpenTrailer && onOpenTrailer(current)}
              className="flex items-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3 rounded bg-white hover:bg-neutral-200 text-black font-extrabold text-sm sm:text-base transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-xl shadow-white/10"
            >
              <Play className="w-5 h-5 fill-black" />
              <span>{isMusic ? 'Putar Musik' : 'Putar Trailer'}</span>
            </button>

            {/* Translucent More Info Button */}
            <Link
              to={`/detail/${current.contentType}/${current.id}`}
              className="flex items-center gap-2 px-6 sm:px-7 py-2.5 sm:py-3 rounded bg-[#0D1017]/80 hover:bg-[#141824] text-white font-bold text-sm sm:text-base border border-white/10 backdrop-blur-md transition-all duration-200"
            >
              <Info className="w-5 h-5 text-cyan-400" />
              <span>Selengkapnya</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Right Edge: Maturity Rating Pill & Switcher Buttons */}
      <div className="absolute right-0 bottom-24 z-20 flex items-center gap-4">
        {/* Next / Prev Slider Controls */}
        <div className="hidden sm:flex items-center gap-1 bg-black/40 p-1 rounded-l-lg border-l border-y border-white/10 backdrop-blur-sm">
          <button
            onClick={handlePrev}
            className="p-1.5 text-neutral-300 hover:text-white transition"
            title="Sebelumnya"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            className="p-1.5 text-neutral-300 hover:text-white transition"
            title="Berikutnya"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Maturity Rating Badge */}
        <div className="bg-black/60 border-l-2 border-white/80 py-1 px-4 text-xs font-bold text-neutral-200 tracking-wider">
          16+ • Ultra HD 4K
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
