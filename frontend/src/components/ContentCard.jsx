import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Play, Plus, Check, Heart, ChevronDown, Star, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';

const ContentCard = ({
  item,
  isFavorited: initialFavorited = false,
  onFavoriteToggle,
  onOpenQuickTrailer,
}) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isFav, setIsFav] = useState(initialFavorited);
  const [favLoading, setFavLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const defaultFallback = item.contentType === 'music'
    ? 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80'
    : item.contentType === 'tv'
    ? 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?auto=format&fit=crop&w=600&q=80'
    : 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80';

  const [imgSrc, setImgSrc] = useState(item.posterUrl || defaultFallback);

  // Netflix dynamic match score (94% to 99%)
  const matchPercentage = Math.min(99, Math.max(92, Math.round((item.rating || 8.5) * 10) + 5));

  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      setFavLoading(true);
      if (isFav) {
        await api.delete(`/favorites/${item.id}`);
        setIsFav(false);
        if (onFavoriteToggle) onFavoriteToggle(item.id, false);
      } else {
        await api.post('/favorites', {
          contentId: item.id,
          contentType: item.contentType,
          title: item.title,
          subtitle: item.subtitle,
          posterUrl: item.posterUrl,
          backdropUrl: item.backdropUrl,
          releaseDate: item.releaseDate,
          rating: item.rating,
          genre: item.genre,
          durationOrAlbum: item.durationOrAlbum,
        });
        setIsFav(true);
        if (onFavoriteToggle) onFavoriteToggle(item.id, true);
      }
    } catch (err) {
      console.error('Favorite action failed:', err);
    } finally {
      setFavLoading(false);
    }
  };

  const getCategoryRibbon = () => {
    switch (item.contentType) {
      case 'movie':
        return 'FILM';
      case 'tv':
        return 'SERIAL';
      case 'music':
        return 'MUSIK';
      default:
        return 'HD';
    }
  };

  return (
    <div
      className="group relative select-none rounded-lg bg-[#0D1017] border border-white/[0.08] transition-all duration-300 ease-out hover:scale-105 hover:z-40 hover:border-[#E50914]/50 hover:shadow-2xl hover:shadow-black/90 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Poster Image Container */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-[#07080A]">
        <img
          src={imgSrc}
          alt={item.title}
          onError={() => setImgSrc(defaultFallback)}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:brightness-105"
          loading="lazy"
        />

        {/* Category Ribbon */}
        <div className="absolute top-2 left-2 z-10">
          <span
            className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-black tracking-wider uppercase shadow-md ${
              item.contentType === 'tv'
                ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/40'
                : item.contentType === 'music'
                ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                : 'bg-[#E50914] text-white'
            }`}
          >
            {getCategoryRibbon()}
          </span>
        </div>

        {/* Quality Tag - Specific to content type */}
        <div className="absolute top-2 right-2 z-10 flex items-center gap-1">
          {item.contentType === 'music' ? (
            <>
              <span className="px-1.5 py-0.5 rounded text-[8px] font-extrabold bg-black/80 text-emerald-400 border border-emerald-500/30 backdrop-blur-sm">
                AUDIO
              </span>
              <span className="px-1.5 py-0.5 rounded text-[8px] font-extrabold bg-black/80 text-neutral-300 border border-white/20 backdrop-blur-sm">
                LOSSLESS
              </span>
            </>
          ) : (
            <>
              <span className="px-1.5 py-0.5 rounded text-[8px] font-extrabold bg-black/80 text-cyan-400 border border-cyan-500/30 backdrop-blur-sm">
                SUB INDO
              </span>
              <span className="px-1.5 py-0.5 rounded text-[8px] font-extrabold bg-black/80 text-neutral-300 border border-white/20 backdrop-blur-sm">
                HD
              </span>
            </>
          )}
        </div>

        {/* Gradient Overlay for Title Clarity */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D1017] via-transparent to-transparent opacity-70 group-hover:opacity-40 transition-opacity" />
      </div>

      {/* Card Info Details */}
      <div className="p-3 bg-[#0D1017] space-y-2">
        {/* Interactive Action Bar */}
        <div className="flex items-center justify-between pt-0.5">
          <div className="flex items-center gap-1.5">
            {/* Play Button */}
            <Link
              to={`/detail/${item.contentType}/${item.id}`}
              className="w-8 h-8 rounded-full bg-white hover:bg-neutral-200 text-black flex items-center justify-center transition shadow-lg transform active:scale-95"
              title="Putar Konten"
            >
              <Play className="w-3.5 h-3.5 fill-black ml-0.5" />
            </Link>

            {/* Add to My List (Favorite) */}
            <button
              onClick={handleFavoriteClick}
              disabled={favLoading}
              className={`w-8 h-8 rounded-full border flex items-center justify-center transition ${
                isFav
                  ? 'border-[#E50914] bg-[#E50914]/20 text-[#E50914]'
                  : 'border-white/20 hover:border-white text-white bg-black/40'
              }`}
              title={isFav ? 'Hapus dari Daftar Saya' : 'Tambahkan ke Daftar Saya'}
            >
              {isFav ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            </button>

            {/* Rating Bintang */}
            <div className="flex items-center gap-1 text-[11px] font-bold text-amber-400 px-1.5 py-0.5 bg-black/50 rounded border border-white/10">
              <Star className="w-3 h-3 fill-current" />
              <span>{typeof item.rating === 'number' ? item.rating.toFixed(1) : item.rating}</span>
            </div>
          </div>

          {/* More Info Chevron Button */}
          <Link
            to={`/detail/${item.contentType}/${item.id}`}
            className="w-8 h-8 rounded-full border border-white/20 hover:border-cyan-400 text-neutral-300 hover:text-cyan-400 flex items-center justify-center transition bg-black/40"
            title="Info Selengkapnya"
          >
            <ChevronDown className="w-4 h-4" />
          </Link>
        </div>

        {/* Match Score & Badges */}
        <div className="flex items-center gap-2 text-[11px] font-semibold">
          <span className="text-emerald-400 font-extrabold">{matchPercentage}% Cocok</span>
          {item.contentType === 'music' ? (
            <span className="border border-emerald-500/30 bg-emerald-950/40 text-emerald-400 px-1.5 py-0.2 rounded text-[9px] font-bold">
              LOSSLESS
            </span>
          ) : (
            <span className="border border-white/20 px-1 py-0.2 rounded text-[9px] text-neutral-400 font-bold">
              {item.rating >= 9 ? '18+' : item.rating >= 8.5 ? '16+' : '13+'}
            </span>
          )}
          <span className="text-neutral-400 truncate max-w-[80px]">
            {item.durationOrAlbum || '2j 10m'}
          </span>
        </div>

        {/* Title */}
        <Link
          to={`/detail/${item.contentType}/${item.id}`}
          className="block text-xs font-bold text-white hover:text-cyan-400 transition truncate"
        >
          {item.title}
        </Link>

        {/* Genre Tags Dot Separated */}
        <p className="text-[10px] text-neutral-400 truncate">
          {item.genre || 'Entertainment'}
        </p>
      </div>
    </div>
  );
};

export default ContentCard;
