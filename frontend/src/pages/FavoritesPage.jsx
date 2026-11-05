import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ArrowRight } from 'lucide-react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import ContentCard from '../components/ContentCard';

const FavoritesPage = () => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [favorites, setFavorites] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [authLoading, isAuthenticated, navigate]);

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const res = await api.get('/favorites', {
        params: { type: activeFilter },
      });
      setFavorites(res.data.data || []);
    } catch (err) {
      console.error('Failed to load favorites:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchFavorites();
    }
  }, [isAuthenticated, activeFilter]);

  const handleFavoriteRemoved = (contentId) => {
    setFavorites((prev) => prev.filter((item) => item.contentId !== contentId));
  };

  const filters = [
    { id: 'all', label: 'Semua Konten' },
    { id: 'movie', label: 'Film' },
    { id: 'tv', label: 'Serial TV' },
    { id: 'music', label: 'Musik' },
  ];

  return (
    <div className="min-h-screen bg-[#07080A] text-white pt-28 pb-20">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12 space-y-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-6 bg-[#E50914] rounded-sm inline-block" />
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Daftar Saya</h1>
            </div>
            <p className="text-xs text-neutral-400 mt-1 pl-4.5">
              Koleksi film, serial TV, dan musik tersimpan di cloud MongoDB Atlas untuk Anda nikmati kapan saja.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 bg-[#0D1017] border border-white/[0.08] rounded-lg">
            {filters.map((f) => {
              const isActive = activeFilter === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => setActiveFilter(f.id)}
                  className={`px-3.5 py-1.5 rounded-md text-xs font-bold transition ${
                    isActive
                      ? 'bg-[#E50914] text-white shadow-md'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>

      {/* Grid of Favorites */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-[2/3] bg-[#0D1017] rounded-xl animate-pulse border border-white/[0.05]" />
          ))}
        </div>
      ) : favorites.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
          {favorites.map((fav) => {
            const mappedItem = {
              id: fav.contentId,
              contentType: fav.contentType,
              title: fav.title,
              subtitle: fav.subtitle,
              posterUrl: fav.posterUrl,
              backdropUrl: fav.backdropUrl,
              releaseDate: fav.releaseDate,
              rating: fav.rating,
              genre: fav.genre,
              durationOrAlbum: fav.durationOrAlbum,
            };
            return (
              <ContentCard
                key={fav._id}
                item={mappedItem}
                isFavorited={true}
                onFavoriteToggle={(id, isFav) => {
                  if (!isFav) handleFavoriteRemoved(id);
                }}
              />
            );
          })}
        </div>
      ) : (
        <div className="py-24 text-center max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#0D1017] text-neutral-400 flex items-center justify-center mx-auto border border-white/[0.08] shadow-xl">
            <Heart className="w-8 h-8 text-[#E50914]" />
          </div>
          <h3 className="text-lg font-bold text-white">Daftar Saya Masih Kosong</h3>
          <p className="text-xs text-neutral-400">
            Simpan film, serial TV, atau musik kesukaan Anda dengan menekan ikon tambah (+) pada kartu konten.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded bg-[#E50914] hover:bg-[#b20710] text-white text-xs font-bold transition shadow-lg shadow-red-950/40"
          >
            <span>Mulai Jelajahi Konten</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
      </div>
    </div>
  );
};

export default FavoritesPage;
