import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/client';
import HeroBanner from '../components/HeroBanner';
import ContentRow from '../components/ContentRow';
import Top10Row from '../components/Top10Row';
import ContentCard from '../components/ContentCard';
import TrailerModal from '../components/TrailerModal';
import { Film, Tv, Music, Flame, Sparkles, Search, X } from 'lucide-react';

const HomePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const typeParam = searchParams.get('type') || 'all';
  const queryParam = searchParams.get('search') || '';

  const [activeType, setActiveType] = useState(typeParam);
  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [debouncedQuery, setDebouncedQuery] = useState(queryParam);
  const [items, setItems] = useState([]);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrailerItem, setSelectedTrailerItem] = useState(null);

  // Sync state if URL query param changes
  useEffect(() => {
    setActiveType(typeParam);
  }, [typeParam]);

  useEffect(() => {
    if (queryParam !== searchQuery) {
      setSearchQuery(queryParam);
    }
  }, [queryParam]);

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 350);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Fetch explore items and banners
  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      try {
        const [exploreRes, bannersRes] = await Promise.all([
          api.get('/content/explore', {
            params: {
              type: activeType,
              search: debouncedQuery,
              limit: 50,
            },
          }),
          api.get('/content/featured'),
        ]);

        setItems(exploreRes.data.data || []);
        setBanners(bannersRes.data.data || []);
      } catch (err) {
        console.error('Error fetching content:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [activeType, debouncedQuery]);

  const handleTypeChange = (newType) => {
    setActiveType(newType);
    if (newType === 'all') {
      searchParams.delete('type');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ type: newType });
    }
  };

  const categories = [
    { id: 'all', label: 'Semua Kategori' },
    { id: 'movie', label: 'Film Layar Lebar' },
    { id: 'tv', label: 'Serial TV' },
    { id: 'music', label: 'Musik & Audio' },
  ];

  // Netflix segmented content collections
  const movies = items.filter((i) => i.contentType === 'movie');
  const tvShows = items.filter((i) => i.contentType === 'tv');
  const musicList = items.filter((i) => i.contentType === 'music');
  const trendingList = [...items].sort((a, b) => (b.rating || 0) - (a.rating || 0));

  return (
    <div className="min-h-screen bg-[#07080A] pb-24 text-white overflow-x-hidden">
      {/* 1. Full-Bleed BINUSFLIX Hero Banner (when not searching) */}
      {!debouncedQuery && (
        <HeroBanner
          banners={banners}
          onOpenTrailer={(item) => setSelectedTrailerItem(item)}
        />
      )}

      {/* 2. Navigation / Category Subhead Filter */}
      <div className="max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12 pt-6 pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {categories.map((cat) => {
              const isActive = activeType === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleTypeChange(cat.id)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                    isActive
                      ? 'bg-[#E50914] text-white shadow-lg shadow-red-950/60 ring-2 ring-red-500/30'
                      : 'bg-[#0D1017] text-neutral-300 hover:text-white hover:bg-[#141824] border border-white/[0.08]'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Quick Search Active Badge if any */}
          {debouncedQuery && (
            <div className="flex items-center gap-2 text-xs text-neutral-300">
              <span>Hasil pencarian: <strong className="text-white">"{debouncedQuery}"</strong></span>
              <button
                onClick={() => setSearchQuery('')}
                className="p-1 hover:text-[#E50914]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 3. Main Content: Search Grid Mode vs Netflix Horizontal Rails Mode */}
      {debouncedQuery ? (
        /* Search Results Grid View */
        <div className="max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12 pt-6">
          <h2 className="text-xl font-bold text-white mb-6">
            Ditemukan {items.length} konten untuk "{debouncedQuery}"
          </h2>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="aspect-[2/3] bg-[#0D1017] border border-white/[0.08] rounded-lg animate-pulse" />
              ))}
            </div>
          ) : items.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
              {items.map((item) => (
                <ContentCard
                  key={item.id}
                  item={item}
                  onOpenQuickTrailer={(i) => setSelectedTrailerItem(i)}
                />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center max-w-md mx-auto space-y-3">
              <Search className="w-12 h-12 text-neutral-500 mx-auto" />
              <h3 className="text-base font-bold text-white">Tidak ada kecocokan ditemukan</h3>
              <p className="text-xs text-neutral-400">
                Pencarian tidak menemukan judul yang cocok. Coba kata kunci lain seperti "Dune", "Stranger", atau "Taylor Swift".
              </p>
            </div>
          )}
        </div>
      ) : (
        /* Horizontal Sliding Rails Mode */
        <div className="space-y-6 pt-2">
          {/* Row 1: Sedang Tren Sekarang (Trending Now) */}
          <ContentRow
            title="Sedang Tren Sekarang"
            items={trendingList}
            icon={Flame}
            onOpenTrailer={(i) => setSelectedTrailerItem(i)}
          />

          {/* Row 2: Top 10 Konten Teratas Hari Ini (Iconic Netflix Giant Numbers) */}
          <Top10Row
            title="10 Konten Teratas di BINUSFLIX Hari Ini"
            items={trendingList}
          />

          {/* Row 3: Film Layar Lebar Terpopuler (Blockbuster Movies) */}
          {(activeType === 'all' || activeType === 'movie') && (
            <ContentRow
              title="Film Layar Lebar & Box Office Pilihan"
              items={movies}
              icon={Film}
              onOpenTrailer={(i) => setSelectedTrailerItem(i)}
            />
          )}

          {/* Row 4: Serial TV Wajib Tonton (TV Shows) */}
          {(activeType === 'all' || activeType === 'tv') && (
            <ContentRow
              title="Serial TV & Drama Wajib Tonton"
              items={tvShows}
              icon={Tv}
              onOpenTrailer={(i) => setSelectedTrailerItem(i)}
            />
          )}

          {/* Row 5: Hits Musik & Tangga Lagu Populer (Music) */}
          {(activeType === 'all' || activeType === 'music') && (
            <ContentRow
              title="Hits Musik & Audio Studio Paling Banyak Diputar"
              items={musicList}
              icon={Music}
              onOpenTrailer={(i) => setSelectedTrailerItem(i)}
            />
          )}
        </div>
      )}

      {/* Trailer / Audio Player Modal */}
      <TrailerModal
        isOpen={!!selectedTrailerItem}
        onClose={() => setSelectedTrailerItem(null)}
        item={selectedTrailerItem}
      />
    </div>
  );
};

export default HomePage;
