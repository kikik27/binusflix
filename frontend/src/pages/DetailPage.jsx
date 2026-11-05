import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Star,
  Plus,
  Check,
  Play,
  Calendar,
  Clock,
  ArrowLeft,
  Share2,
  Send,
  MessageSquare,
  Users,
  CheckCircle,
  AlertCircle,
  Film,
  Music,
  Tv,
  ExternalLink,
} from 'lucide-react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import TrailerModal from '../components/TrailerModal';
import ContentCard from '../components/ContentCard';
import { getActorDetails } from '../utils/castHelper';

const DetailPage = () => {
  const { type, id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [similarItems, setSimilarItems] = useState([]);
  const [isFavorited, setIsFavorited] = useState(false);
  const [loading, setLoading] = useState(true);
  const [favLoading, setFavLoading] = useState(false);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);

  // Review Form State
  const [userRating, setUserRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewMessage, setReviewMessage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      window.scrollTo(0, 0);
      try {
        const [detailRes, reviewsRes, exploreRes] = await Promise.all([
          api.get(`/content/detail/${type}/${id}`),
          api.get(`/reviews/${id}`),
          api.get('/content/explore', { params: { type, limit: 7 } }),
        ]);

        setItem(detailRes.data.data);
        setIsFavorited(detailRes.data.data.isFavorited || false);
        setReviews(reviewsRes.data.data || []);
        const similar = (exploreRes.data.data || []).filter((i) => i.id !== id).slice(0, 6);
        setSimilarItems(similar);
      } catch (err) {
        console.error('Error fetching detail:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [type, id]);

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      setFavLoading(true);
      if (isFavorited) {
        await api.delete(`/favorites/${item.id}`);
        setIsFavorited(false);
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
        setIsFavorited(true);
      }
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
    } finally {
      setFavLoading(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!reviewText.trim()) return;

    setSubmittingReview(true);
    setReviewMessage(null);
    try {
      const res = await api.post('/reviews', {
        contentId: item.id,
        contentType: item.contentType,
        contentTitle: item.title,
        rating: userRating,
        reviewText: reviewText.trim(),
      });

      setReviews([res.data.data, ...reviews]);
      setReviewText('');
      setReviewMessage({ type: 'success', text: 'Ulasan Anda berhasil dikirimkan!' });
    } catch (err) {
      setReviewMessage({
        type: 'error',
        text: err.response?.data?.message || 'Gagal mengirimkan ulasan',
      });
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07080A] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-[#E50914] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-neutral-400 font-semibold tracking-wider uppercase">
          Memuat Detail Konten BINUSFLIX...
        </p>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-[#07080A] flex items-center justify-center p-6 text-center">
        <div className="max-w-md bg-[#0D1017] p-8 rounded-xl border border-white/[0.08] space-y-4 shadow-2xl">
          <AlertCircle className="w-12 h-12 text-[#E50914] mx-auto" />
          <h2 className="text-xl font-bold text-white">Konten Tidak Ditemukan</h2>
          <p className="text-xs text-neutral-400">Konten yang Anda tuju mungkin sudah dipindahkan atau tidak tersedia.</p>
          <Link to="/" className="inline-block px-6 py-2.5 bg-[#E50914] hover:bg-[#b20710] text-white rounded text-xs font-bold transition">
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  const isMusic = item.contentType === 'music';
  const defaultPoster = isMusic
    ? 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80'
    : 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80';
  const defaultBackdrop = 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1200&q=80';

  const matchPercentage = Math.min(99, Math.max(92, Math.round((item.rating || 8.5) * 10) + 5));
  const categoryLabel = item.contentType === 'movie' ? 'Film Layar Lebar' : item.contentType === 'tv' ? 'Serial TV' : 'Musik & Audio';

  return (
    <div className="min-h-screen bg-[#07080A] text-white pb-24">
      {/* 1. Cinematic Billboard Header Banner (Full Bleed - No Leaks) */}
      <div className="relative w-full h-[65vh] min-h-[460px] max-h-[660px] overflow-hidden">
        <img
          src={item.backdropUrl || item.posterUrl || defaultBackdrop}
          alt={item.title}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = defaultBackdrop;
          }}
          className="w-full h-full object-cover object-center filter brightness-75"
        />

        {/* Cinematic Vignettes & Bottom Fade */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#07080A] via-[#07080A]/40 to-black/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#07080A] via-[#07080A]/75 to-transparent w-full md:w-3/4" />
        <div className="absolute bottom-0 left-0 right-0 h-44 binus-bottom-fade" />

        {/* Floating Back Button & Discreet Breadcrumb */}
        <div className="absolute top-24 left-0 right-0 z-30 max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12 flex items-center justify-between pointer-events-none">
          <button
            onClick={() => navigate(-1)}
            className="pointer-events-auto flex items-center gap-2 px-4 py-2 rounded-full bg-black/60 hover:bg-black/90 text-white text-xs font-bold backdrop-blur-md border border-white/20 hover:border-[#E50914] transition-all duration-200 shadow-xl group cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform text-[#E50914]" />
            <span>Kembali</span>
          </button>

          <div className="hidden sm:flex items-center gap-2 text-xs text-neutral-400 bg-black/50 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 pointer-events-auto">
            <Link to="/" className="hover:text-white transition">Beranda</Link>
            <span>/</span>
            <span className="text-[#E50914] font-bold uppercase tracking-wider">{categoryLabel}</span>
            <span>/</span>
            <span className="text-white font-semibold truncate max-w-xs">{item.title}</span>
          </div>
        </div>

        {/* Header Content Overlay */}
        <div className="absolute bottom-8 left-0 right-0 z-20 max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12">
          <div className="max-w-2xl space-y-3.5">
            {/* Category Ribbon */}
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-black tracking-widest bg-[#E50914] text-white uppercase shadow">
                {isMusic ? 'MUSIK & AUDIO' : item.contentType === 'tv' ? 'SERIAL TV' : 'FILM'}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-black tracking-wider bg-black/60 text-white border border-white/20 uppercase">
                BINUSFLIX ORIGINAL
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-none drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]">
              {item.title}
            </h1>

            {/* Play Button & Favorite Action */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setIsTrailerOpen(true)}
                className="flex items-center gap-2 px-7 py-3 rounded-lg bg-white hover:bg-neutral-200 text-black font-black text-sm sm:text-base transition shadow-xl transform active:scale-95 shadow-white/10 cursor-pointer"
              >
                <Play className="w-5 h-5 fill-black" />
                <span>{isMusic ? 'Putar Musik' : 'Putar Trailer'}</span>
              </button>

              <button
                onClick={handleToggleFavorite}
                disabled={favLoading}
                className={`flex items-center gap-2 px-5 py-3 rounded-lg border text-sm font-bold transition shadow-lg cursor-pointer ${
                  isFavorited
                    ? 'border-[#E50914] bg-[#E50914] text-white shadow-red-950/50'
                    : 'border-white/30 hover:border-white text-white bg-black/60 hover:bg-black/80'
                }`}
                title={isFavorited ? 'Hapus dari Favorit' : 'Tambah ke Favorit'}
              >
                {isFavorited ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                <span>{isFavorited ? 'Tersimpan di Favorit' : 'Tambah Favorit'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Details Section */}
      <div className="max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12 pt-6 space-y-8">
        {/* Transparent Clean Metadata Row (Tanpa Card Box - 100% Transparan) */}
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm font-semibold text-neutral-300 pb-3 border-b border-white/[0.08]">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-emerald-400 font-extrabold bg-emerald-950/60 px-2.5 py-0.5 rounded border border-emerald-500/30">
              {matchPercentage}% Cocok
            </span>
            <span className="text-amber-400 font-bold flex items-center gap-1 bg-amber-950/30 px-2 py-0.5 rounded border border-amber-500/20">
              <Star className="w-3.5 h-3.5 fill-current" />
              {typeof item.rating === 'number' ? item.rating.toFixed(1) : item.rating} / 10
            </span>
            <span>{item.releaseDate ? item.releaseDate.substring(0, 4) : '2024'}</span>

            {/* Khusus Film & Serial TV (Bukan Musik) */}
            {!isMusic && (
              <span className="border border-white/20 bg-white/5 px-2 py-0.5 rounded text-[10px] text-white font-bold">
                16+
              </span>
            )}
            {!isMusic && (
              <span className="border border-white/20 bg-white/5 px-2 py-0.5 rounded text-[10px] text-white font-bold">
                Ultra HD 4K
              </span>
            )}

            {/* Badge Kualitas / Format Audio vs Video */}
            <span className={`border px-2 py-0.5 rounded text-[10px] font-bold ${
              isMusic
                ? 'border-emerald-500/30 bg-emerald-950/50 text-emerald-300'
                : 'border-cyan-500/30 bg-cyan-950/30 text-cyan-300'
            }`}>
              {isMusic ? 'AUDIO LOSSLESS' : 'SUB INDO'}
            </span>

            <span className="text-neutral-400">• {item.durationOrAlbum}</span>
          </div>

          <div className="text-xs text-neutral-400 font-medium">
            Genre: <span className="text-white font-bold">{item.genre}</span>
          </div>
        </div>

        {/* 2-Column Symmetrical Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Left Column (8 cols): Player & Synopsis */}
          <div className="lg:col-span-8 space-y-6">
            {/* Embedded Media Player Container */}
            <div className="rounded-xl overflow-hidden bg-black border border-white/[0.08] shadow-2xl">
              <div className="bg-[#0D1017] px-4 py-2.5 border-b border-white/[0.08] flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-200 uppercase tracking-wider flex items-center gap-2">
                  <Play className="w-3.5 h-3.5 text-[#E50914] fill-current" />
                  <span>{isMusic ? 'Apple Music High-Res Studio Audio Preview' : 'Official YouTube Trailer'}</span>
                </span>
                <span className="text-[10px] text-neutral-400 font-mono">{isMusic ? 'Lossless 24-bit' : '1080p Ultra HD'}</span>
              </div>

              {isMusic ? (
                <div className="p-6 bg-[#0D1017] space-y-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={item.posterUrl || defaultPoster}
                      alt={item.title}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = defaultPoster;
                      }}
                      className="w-20 h-20 rounded-xl object-cover shadow-xl ring-2 ring-emerald-500/30"
                    />
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                        Apple Music Live Preview
                      </span>
                      <h4 className="text-xl font-black text-white mt-1">{item.title}</h4>
                      <p className="text-xs text-neutral-400">{item.subtitle} • {item.durationOrAlbum}</p>
                    </div>
                  </div>
                  {item.previewUrl ? (
                    <div className="space-y-2 pt-2">
                      <audio controls preload="auto" className="w-full h-11 rounded-lg" src={item.previewUrl}>
                        Browser Anda tidak mendukung audio.
                      </audio>
                      <p className="text-[11px] text-neutral-400">
                        Sampel audio resmi durasi 30 detik kualitas studio dari Apple Music Catalog.
                      </p>
                    </div>
                  ) : (
                    <p className="text-xs text-amber-400">Pratinjau audio tidak tersedia.</p>
                  )}
                </div>
              ) : (
                <div className="space-y-2 bg-[#0D1017] p-3 rounded-b">
                  <div className="relative aspect-video w-full bg-black rounded-lg overflow-hidden border border-white/5">
                    <iframe
                      className="w-full h-full"
                      src={`https://www.youtube.com/embed/${item.trailerKey || 'Wayb2Kd083Y'}?enablejsapi=1&rel=0`}
                      title={`${item.title} Trailer`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row items-center justify-between px-2 pt-1.5 text-xs gap-2">
                    <span className="text-neutral-400 text-[11px]">
                      Mengalami kendala pemutaran embed YouTube di browser?
                    </span>
                    <a
                      href={item.trailerUrl || `https://www.youtube.com/watch?v=${item.trailerKey || 'Wayb2Kd083Y'}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 font-bold underline"
                    >
                      <span>Buka di YouTube Resmi</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Synopsis */}
            <div className="p-6 rounded-xl bg-[#0D1017] border border-white/[0.08] space-y-2.5 shadow-xl">
              <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
                <span className="w-1.5 h-4 bg-[#E50914] rounded-sm" />
                <span>Ringkasan Sinopsis</span>
              </h3>
              <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
                {item.overview || 'Informasi ringkasan cerita lengkap tersedia di platform BINUSFLIX.'}
              </p>
            </div>
          </div>

          {/* Right Column (4 cols): Detailed Specifications Card (Balanced Height) */}
          <div className="lg:col-span-4 bg-[#0D1017] p-6 rounded-xl border border-white/[0.08] space-y-5 shadow-xl">
            <h4 className="text-xs font-black text-neutral-300 uppercase tracking-wider border-b border-white/10 pb-3 flex items-center justify-between">
              <span>Informasi Detail Konten</span>
              <span className="text-[10px] text-[#E50914] font-mono">BINUSFLIX</span>
            </h4>

            <div className="space-y-3.5 text-xs">
              <div className="space-y-1 pb-2 border-b border-white/5">
                <span className="text-neutral-400 block font-medium">Judul Konten</span>
                <span className="text-white font-bold text-sm">{item.title}</span>
              </div>

              <div className="space-y-1 pb-2 border-b border-white/5">
                <span className="text-neutral-400 block font-medium">Sutradara / Kreator / Artis</span>
                <span className="text-white font-semibold">{item.subtitle || 'Official Production'}</span>
              </div>

              <div className="space-y-1 pb-2 border-b border-white/5">
                <span className="text-neutral-400 block font-medium">Genre & Kategori</span>
                <span className="text-cyan-400 font-semibold">{item.genre || 'Entertainment'}</span>
              </div>

              <div className="space-y-1 pb-2 border-b border-white/5">
                <span className="text-neutral-400 block font-medium">Tahun & Tanggal Rilis</span>
                <span className="text-white font-medium">{item.releaseDate || '2024'}</span>
              </div>

              <div className="space-y-1 pb-2 border-b border-white/5">
                <span className="text-neutral-400 block font-medium">Durasi / Format Media</span>
                <span className="text-white font-medium">{item.durationOrAlbum || 'Durasi Standar'}</span>
              </div>

              <div className="space-y-1">
                <span className="text-neutral-400 block font-medium">Rating Komunitas Pengguna</span>
                <div className="flex items-center gap-1.5 text-amber-400 font-bold text-sm">
                  <Star className="w-4 h-4 fill-current" />
                  <span>{typeof item.rating === 'number' ? item.rating.toFixed(1) : item.rating} / 10</span>
                  <span className="text-[11px] text-neutral-400 font-normal">({item.voteCount || 100} penilaian)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Pemeran & Karakter Utama (Actor & Cast Photo Cards Showcase) */}
        <div className="space-y-4 pt-4 border-t border-white/[0.08]">
          <div className="flex items-center justify-between">
            <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-[#E50914]" />
              <span>{isMusic ? 'Musisi & Tim Produksi Musik' : 'Daftar Pemeran & Karakter Utama'}</span>
            </h3>
            <span className="text-xs text-neutral-400 font-mono">
              {item.cast?.length || 0} Pemeran
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
            {(item.cast && item.cast.length > 0 ? item.cast : ['Pemeran Utama']).map((actorName, idx) => {
              const actor = getActorDetails(actorName, idx);
              return (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-3 rounded-xl bg-[#0D1017] border border-white/[0.08] hover:border-[#E50914]/40 hover:bg-[#141824] transition-all duration-200 group shadow-lg"
                >
                  <img
                    src={actor.photo}
                    alt={actor.name}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80';
                    }}
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl object-cover shrink-0 border border-white/10 group-hover:scale-105 group-hover:border-[#E50914]/50 transition-all shadow-md"
                  />
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-[#E50914] transition truncate">
                      {actor.name}
                    </h4>
                    <p className="text-[11px] text-cyan-400 font-medium truncate">
                      {actor.character}
                    </p>
                    <span className="text-[9px] text-neutral-500 font-medium truncate block">
                      {actor.role}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. Rekomendasi Konten Terkait */}
        {similarItems.length > 0 && (
          <div className="space-y-4 pt-6 border-t border-white/[0.08]">
            <h3 className="text-lg sm:text-xl font-black text-white tracking-tight flex items-center gap-2">
              <span className="w-1.5 h-4 bg-[#E50914] rounded-sm" />
              <span>Rekomendasi Lainnya Untuk Anda</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
              {similarItems.map((sim) => (
                <ContentCard key={sim.id} item={sim} />
              ))}
            </div>
          </div>
        )}

        {/* 5. Community Reviews & Star Ratings Section */}
        <div className="pt-8 border-t border-white/[0.08] space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-6 bg-[#E50914] rounded-sm" />
            <h3 className="text-xl font-bold text-white">
              Ulasan & Penilaian Komunitas BINUSFLIX ({reviews.length})
            </h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Submit Review Box */}
            <div className="lg:col-span-5 bg-[#0D1017] p-6 rounded-xl border border-white/[0.08] space-y-4 shadow-xl">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-400 fill-current" />
                <span>Berikan Nilai Anda</span>
              </h4>

              {!isAuthenticated ? (
                <div className="p-5 bg-[#07080A] rounded-xl text-center space-y-3 border border-white/5">
                  <p className="text-xs text-neutral-400">
                    Masuk ke akun Anda untuk memberikan ulasan dan rating pada konten ini.
                  </p>
                  <Link
                    to="/login"
                    className="inline-block px-5 py-2 bg-[#E50914] hover:bg-[#b20710] text-white text-xs font-bold rounded-lg transition shadow"
                  >
                    Masuk Sekarang
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  {reviewMessage && (
                    <div
                      className={`p-3 rounded-lg text-xs flex items-center gap-2 ${
                        reviewMessage.type === 'success'
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : 'bg-red-500/15 text-red-400 border border-red-500/30'
                      }`}
                    >
                      {reviewMessage.type === 'success' ? (
                        <CheckCircle className="w-4 h-4 shrink-0" />
                      ) : (
                        <AlertCircle className="w-4 h-4 shrink-0" />
                      )}
                      <span>{reviewMessage.text}</span>
                    </div>
                  )}

                  {/* Stars 1 - 5 */}
                  <div>
                    <label className="block text-xs font-semibold text-neutral-400 mb-2">
                      Pilih Nilai Bintang:
                    </label>
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setUserRating(star)}
                          className="p-1 hover:scale-110 transition"
                        >
                          <Star
                            className={`w-6 h-6 ${
                              star <= userRating
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-neutral-700'
                            }`}
                          />
                        </button>
                      ))}
                      <span className="text-xs font-bold text-amber-400 ml-2">
                        {userRating} / 5 Bintang
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-400 mb-2">
                      Tulis Ulasan:
                    </label>
                    <textarea
                      rows={3}
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      placeholder="Bagikan opini Anda mengenai alur, akting, atau melodi..."
                      className="w-full p-3.5 rounded-lg bg-[#07080A] border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400 transition"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="w-full py-2.5 rounded-lg bg-[#E50914] hover:bg-[#b20710] text-white text-xs font-bold transition disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-red-950/40"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{submittingReview ? 'Mengirim...' : 'Kirim Ulasan'}</span>
                  </button>
                </form>
              )}
            </div>

            {/* Reviews List */}
            <div className="lg:col-span-7 space-y-3">
              {reviews.length > 0 ? (
                reviews.map((rev) => (
                  <div key={rev._id} className="p-4 bg-[#0D1017] rounded-xl border border-white/[0.08] space-y-2 shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={rev.userAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                          alt={rev.username}
                          className="w-7 h-7 rounded-full object-cover border border-white/10"
                        />
                        <span className="text-xs font-bold text-white">{rev.username}</span>
                      </div>
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < rev.rating ? 'text-amber-400 fill-amber-400' : 'text-neutral-700'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-neutral-300 leading-relaxed">{rev.reviewText}</p>
                  </div>
                ))
              ) : (
                <div className="p-8 bg-[#0D1017] rounded-xl border border-white/[0.08] text-center">
                  <p className="text-xs text-neutral-400">Belum ada ulasan untuk konten ini. Jadilah yang pertama!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Trailer Modal */}
      <TrailerModal
        isOpen={isTrailerOpen}
        onClose={() => setIsTrailerOpen(false)}
        item={item}
      />
    </div>
  );
};

export default DetailPage;
