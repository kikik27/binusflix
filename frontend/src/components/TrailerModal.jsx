import React, { useEffect } from 'react';
import { X, Play, Music, Film, ExternalLink } from 'lucide-react';

const TrailerModal = ({ isOpen, onClose, item }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !item) return null;

  const isMusic = item.contentType === 'music';
  const trailerKey = item.trailerKey || 'Wayb2Kd083Y';
  const youtubeWatchUrl = item.trailerUrl || `https://www.youtube.com/watch?v=${trailerKey}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div
        className="relative w-full max-w-4xl bg-[#0D1017] border border-white/[0.08] rounded-2xl overflow-hidden shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.08] bg-[#07080A]">
          <div className="flex items-center gap-2">
            {isMusic ? (
              <Music className="w-5 h-5 text-emerald-400" />
            ) : (
              <Film className="w-5 h-5 text-[#E50914]" />
            )}
            <h3 className="font-bold text-white text-sm md:text-base truncate max-w-lg">
              {item.title} {isMusic ? '— Audio Preview' : '— Trailer Resmi'}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            {!isMusic && (
              <a
                href={youtubeWatchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#E50914] hover:bg-[#b20710] text-white text-xs font-bold transition shadow"
              >
                <span>Buka di YouTube</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition"
              title="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 md:p-6 bg-[#07080A]">
          {isMusic ? (
            <div className="flex flex-col md:flex-row items-center gap-6 p-6 rounded-xl bg-[#0D1017] border border-white/[0.08]">
              <img
                src={item.posterUrl || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80'}
                alt={item.title}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80';
                }}
                className="w-36 h-36 rounded-xl object-cover shadow-2xl ring-2 ring-emerald-500/40"
              />
              <div className="flex-1 space-y-3 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <span className="text-xs uppercase font-extrabold text-emerald-400 tracking-wider bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                    Apple Music Studio Preview
                  </span>
                  <span className="text-xs font-bold text-neutral-400">30 Detik High-Fi</span>
                </div>
                <h4 className="text-2xl font-black text-white">{item.title}</h4>
                <p className="text-sm text-neutral-300">{item.subtitle} • {item.durationOrAlbum}</p>

                {item.previewUrl ? (
                  <div className="pt-2 space-y-2">
                    <audio
                      controls
                      autoPlay
                      preload="auto"
                      className="w-full h-11 rounded-lg"
                      src={item.previewUrl}
                    >
                      Browser Anda tidak mendukung elemen audio.
                    </audio>
                    <p className="text-[11px] text-neutral-400">
                      Pratinjau audio resmi durasi 30 detik kualitas studio dari Apple Music Catalog.
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-amber-400">Pratinjau audio tidak tersedia secara streaming.</p>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black shadow-2xl border border-white/10">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&enablejsapi=1&rel=0`}
                  title={`${item.title} Trailer`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>

              {/* YouTube Playback Notice & Direct Link */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2 p-2.5 rounded-lg bg-[#0D1017] border border-white/[0.08] text-xs">
                <span className="text-neutral-400 text-center sm:text-left">
                  Kendala pemutaran embed karena batasan studio di browser?
                </span>
                <a
                  href={youtubeWatchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 font-bold underline shrink-0"
                >
                  <span>Tonton di YouTube Resmi</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}

          {/* Modal Footer Info */}
          <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-neutral-400">
            <p className="line-clamp-2 max-w-xl">{item.overview}</p>
            <Link
              to={`/detail/${item.contentType}/${item.id}`}
              onClick={onClose}
              className="text-white hover:text-cyan-400 font-bold shrink-0 underline"
            >
              Lihat Halaman Lengkap &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrailerModal;
