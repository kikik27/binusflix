import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import {
  Search,
  Bell,
  Heart,
  User,
  LogOut,
  Menu,
  X,
  Play,
  ChevronDown,
  Star,
  Film,
  Tv,
  Music,
} from 'lucide-react';

const Navbar = ({ onSearchQuery, currentQuery = '' }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState(currentQuery);
  const [hints, setHints] = useState([]);
  const [hintsLoading, setHintsLoading] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const searchContainerRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Click outside to close hints
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setShowHints(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search for live hints
  useEffect(() => {
    if (!localSearch || localSearch.trim().length === 0) {
      setHints([]);
      setShowHints(false);
      return;
    }

    const timer = setTimeout(async () => {
      setHintsLoading(true);
      try {
        const res = await api.get('/content/explore', {
          params: { search: localSearch.trim(), limit: 6 },
        });
        setHints(res.data.data || []);
        setShowHints(true);
      } catch (err) {
        console.warn('Hints fetch failed:', err.message);
      } finally {
        setHintsLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [localSearch]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearchQuery) {
      onSearchQuery(localSearch);
    } else {
      navigate(`/?search=${encodeURIComponent(localSearch)}`);
    }
  };

  const navLinks = [
    { name: 'Beranda', path: '/' },
    { name: 'Film', path: '/?type=movie' },
    { name: 'Serial TV', path: '/?type=tv' },
    { name: 'Musik', path: '/?type=music' },
    { name: 'Daftar Saya', path: '/favorites', requireAuth: true },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-[#07080A]/95 backdrop-blur-md border-b border-white/[0.08] shadow-2xl shadow-black'
          : 'bg-gradient-to-b from-[#07080A]/95 via-[#07080A]/60 to-transparent'
      }`}
    >
      <div className="max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Left: Brand Logo & Navigation */}
          <div className="flex items-center gap-8 lg:gap-10">
            {/* BINUSFLIX Bold Logo */}
            <Link to="/" className="flex items-center gap-1.5 group select-none">
              <span className="text-2xl sm:text-3xl font-black tracking-tighter text-white drop-shadow-[0_2px_12px_rgba(229,9,20,0.5)]">
                BINUS<span className="text-[#E50914]">FLIX</span>
              </span>
              <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[9px] font-black tracking-widest bg-[#E50914] text-white uppercase ml-1 shadow">
                PRO
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-5 lg:gap-6 text-sm font-medium">
              {navLinks.map((link) => {
                if (link.requireAuth && !isAuthenticated) return null;
                const isActive =
                  location.pathname === link.path ||
                  (link.path.includes('type=') && location.search.includes(link.path.split('?')[1]));

                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`transition-colors duration-200 ${
                      isActive
                        ? 'text-white font-bold'
                        : 'text-neutral-300 hover:text-neutral-100'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right: Search, Notifications, Profile */}
          <div className="flex items-center gap-4 sm:gap-6">
            {/* BINUSFLIX Expanding Search Bar with Live Hints Dropdown */}
            <div ref={searchContainerRef} className="relative flex items-center">
              {searchOpen ? (
                <div className="relative">
                  <form
                    onSubmit={(e) => {
                      setShowHints(false);
                      handleSearchSubmit(e);
                    }}
                    className="flex items-center bg-[#0D1017] border border-white/20 focus-within:border-[#E50914] px-3 py-1.5 rounded-full transition-all duration-300 w-56 sm:w-80 shadow-xl shadow-black/80"
                  >
                    <Search className="w-4 h-4 text-[#E50914] mr-2 shrink-0" />
                    <input
                      type="text"
                      autoFocus
                      value={localSearch}
                      onChange={(e) => {
                        setLocalSearch(e.target.value);
                        if (onSearchQuery) onSearchQuery(e.target.value);
                      }}
                      onFocus={() => {
                        if (hints.length > 0) setShowHints(true);
                      }}
                      placeholder="Cari film, serial, musisi..."
                      className="bg-transparent text-white text-xs placeholder-neutral-400 focus:outline-none w-full"
                    />
                    {hintsLoading && (
                      <div className="w-3 h-3 border-2 border-[#E50914] border-t-transparent rounded-full animate-spin mr-1.5 shrink-0" />
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setSearchOpen(false);
                        setLocalSearch('');
                        setShowHints(false);
                        if (onSearchQuery) onSearchQuery('');
                      }}
                      className="text-neutral-400 hover:text-white ml-1 shrink-0"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </form>

                  {/* Live Search Hints Dropdown */}
                  {showHints && localSearch.trim().length >= 1 && (
                    <div className="absolute right-0 top-11 w-80 sm:w-96 bg-[#0D1017] border border-white/[0.08] rounded-xl shadow-2xl overflow-hidden z-50 animate-fade-in divide-y divide-white/5">
                      <div className="px-3.5 py-2 bg-[#07080A] flex items-center justify-between text-[11px] font-bold text-neutral-400">
                        <span className="uppercase tracking-wider flex items-center gap-1.5 text-white">
                          <Search className="w-3 h-3 text-[#E50914]" />
                          Saran Hasil Cepat ({hints.length})
                        </span>
                        <span className="text-[10px] text-[#E50914] font-mono">BINUSFLIX</span>
                      </div>

                      <div className="max-h-80 overflow-y-auto no-scrollbar p-1.5 space-y-1">
                        {hints.length > 0 ? (
                          hints.map((item) => (
                            <div
                              key={item.id}
                              onClick={() => {
                                setShowHints(false);
                                setSearchOpen(false);
                                navigate(`/detail/${item.contentType}/${item.id}`);
                              }}
                              className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#181D2A] cursor-pointer transition group border border-transparent hover:border-cyan-500/20"
                            >
                              <img
                                src={item.posterUrl}
                                alt={item.title}
                                onError={(e) => {
                                  e.currentTarget.onerror = null;
                                  e.currentTarget.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=300&q=80';
                                }}
                                className="w-10 h-14 object-cover rounded shadow-md shrink-0 border border-white/10 group-hover:border-cyan-400/40"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5 mb-0.5">
                                  <span
                                    className={`px-1.5 py-0.2 rounded text-[8px] font-black uppercase tracking-wider ${
                                      item.contentType === 'movie'
                                        ? 'bg-[#E50914] text-white'
                                        : item.contentType === 'tv'
                                        ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/30'
                                        : 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                                    }`}
                                  >
                                    {item.contentType === 'movie' ? 'Film' : item.contentType === 'tv' ? 'Serial TV' : 'Musik'}
                                  </span>
                                  <span className="text-[10px] font-bold text-amber-400 flex items-center gap-0.5">
                                    ★ {item.rating ? Number(item.rating).toFixed(1) : '8.5'}
                                  </span>
                                  <span className="text-[10px] text-neutral-400">
                                    • {item.releaseDate ? item.releaseDate.substring(0, 4) : '2024'}
                                  </span>
                                </div>
                                <h4 className="text-xs font-bold text-white group-hover:text-cyan-400 transition truncate">
                                  {item.title}
                                </h4>
                                <p className="text-[11px] text-neutral-400 truncate">
                                  {item.subtitle || item.genre}
                                </p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="py-6 text-center text-xs text-neutral-400">
                            Tidak ditemukan hasil untuk "{localSearch}"
                          </div>
                        )}
                      </div>

                      <div
                        onClick={(e) => {
                          setShowHints(false);
                          handleSearchSubmit(e);
                        }}
                        className="px-3.5 py-2.5 bg-[#0A0D14] hover:bg-[#121622] text-center text-[11px] text-cyan-400 font-bold cursor-pointer transition block"
                      >
                        Lihat semua hasil di beranda &rarr;
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="text-neutral-200 hover:text-white transition p-1"
                  title="Cari konten"
                >
                  <Search className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Notification Bell */}
            <div className="hidden sm:block relative cursor-pointer text-neutral-300 hover:text-white transition">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#E50914] rounded-full" />
            </div>

            {/* User Profile / Auth */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 group"
                >
                  <img
                    src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                    alt={user?.username}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80';
                    }}
                    className="w-8 h-8 rounded object-cover border border-neutral-700 group-hover:border-white transition"
                  />
                  <ChevronDown className="w-3.5 h-3.5 text-neutral-400 group-hover:text-white transition" />
                </button>

                {/* Profile Dropdown */}
                {profileDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-[#0D1017] border border-white/[0.08] rounded-xl shadow-2xl py-2 text-xs text-neutral-200 space-y-1 z-50 animate-fade-in"
                    onMouseLeave={() => setProfileDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-white/5">
                      <p className="font-bold text-white truncate">{user?.fullName || user?.username}</p>
                      <p className="text-[10px] text-neutral-400 truncate">@{user?.username}</p>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 hover:bg-[#141824] transition text-neutral-200 hover:text-white"
                    >
                      <User className="w-4 h-4 text-neutral-400" />
                      <span>Akun & Preferensi</span>
                    </Link>

                    <Link
                      to="/favorites"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 hover:bg-[#141824] transition text-neutral-200 hover:text-white"
                    >
                      <Heart className="w-4 h-4 text-[#E50914]" />
                      <span>Daftar Saya</span>
                    </Link>

                    <div className="border-t border-white/5 pt-1">
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          logout();
                          navigate('/login');
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-[#141824] transition text-neutral-400 hover:text-[#E50914] text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Keluar dari Akun</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-4 py-1.5 text-xs font-semibold bg-[#E50914] hover:bg-[#b20710] text-white rounded transition"
                >
                  Masuk
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-neutral-300 hover:text-white p-1"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#07080A] border-t border-white/[0.08] px-6 py-4 space-y-3">
          {navLinks.map((link) => {
            if (link.requireAuth && !isAuthenticated) return null;
            return (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-medium text-neutral-300 hover:text-white py-1"
              >
                {link.name}
              </Link>
            );
          })}
          {!isAuthenticated && (
            <div className="pt-3 border-t border-neutral-800 flex gap-3">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 text-center py-2 text-xs font-bold bg-[#E50914] text-white rounded"
              >
                Masuk
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 text-center py-2 text-xs font-bold bg-neutral-800 text-white rounded"
              >
                Daftar
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
