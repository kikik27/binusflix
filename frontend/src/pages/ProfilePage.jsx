import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import {
  User,
  Heart,
  MessageSquare,
  LogOut,
  CheckCircle,
  AlertCircle,
  Save,
  Shield,
  Star,
  Film,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

const ProfilePage = () => {
  const { user, isAuthenticated, loading: authLoading, logout, updateProfile } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState('');
  const [stats, setStats] = useState({ totalFavorites: 0, totalReviews: 0 });
  const [recentFavorites, setRecentFavorites] = useState([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [authLoading, isAuthenticated, navigate]);

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || '');
      setBio(user.bio || '');
      setAvatar(user.avatar || '');

      const fetchProfileData = async () => {
        try {
          const [meRes, favRes] = await Promise.all([
            api.get('/auth/me'),
            api.get('/favorites'),
          ]);
          setStats(meRes.data.stats || { totalFavorites: 0, totalReviews: 0 });
          setRecentFavorites((favRes.data.data || []).slice(0, 4));
        } catch (err) {
          console.error('Failed to fetch profile stats/favorites:', err);
        }
      };

      fetchProfileData();
    }
  }, [user]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      await updateProfile({ fullName, bio, avatar });
      setMessage({ type: 'success', text: 'Profil Anda berhasil diperbarui!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Gagal memperbarui profil' });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-[#07080A] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#E50914] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07080A] text-white pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* 1. Header Profile Banner */}
        <div className="relative rounded-2xl bg-gradient-to-r from-[#0D1017] via-[#0D1017] to-[#07080A] border border-white/[0.08] p-6 sm:p-8 shadow-2xl overflow-hidden">
          {/* Subtle decorative glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#E50914]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
              <div className="relative">
                <img
                  src={avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80'}
                  alt={user.username}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80';
                  }}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-white/20 shadow-2xl ring-4 ring-[#E50914]/30"
                />
                <span className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 border-2 border-[#0D1017] rounded-full" title="Online" />
              </div>

              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[10px] font-extrabold bg-[#E50914] text-white uppercase tracking-wider shadow">
                    <Shield className="w-3 h-3" />
                    BINUSFLIX VIP MEMBER
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
                    BINUSIAN VERIFIED
                  </span>
                </div>

                <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                  {user.fullName || user.username}
                </h1>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-neutral-400">
                  <span className="text-neutral-300 font-mono">@{user.username}</span>
                  <span>•</span>
                  <span>{user.email}</span>
                  <span>•</span>
                  <span className="text-emerald-400">Akun Aktif</span>
                </div>

                <p className="text-xs sm:text-sm text-neutral-300 italic pt-1 max-w-lg">
                  "{user.bio || 'Menikmati kurasi film blockbuster, serial TV, dan audio berkualitas studio di BINUSFLIX.'}"
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/favorites"
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#07080A] hover:bg-[#141824] text-white text-xs font-bold border border-white/[0.08] transition shadow"
              >
                <Heart className="w-4 h-4 text-[#E50914] fill-current" />
                <span>Daftar Saya</span>
              </Link>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-red-950/40 hover:bg-[#E50914] text-red-200 hover:text-white text-xs font-bold border border-red-500/30 transition shadow"
              >
                <LogOut className="w-4 h-4" />
                <span>Keluar</span>
              </button>
            </div>
          </div>
        </div>

        {/* 2. Main 2-Column Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column (4 cols): Stats & Summary */}
          <div className="lg:col-span-4 space-y-6">
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
              <Link
                to="/favorites"
                className="p-5 rounded-xl bg-[#0D1017] hover:bg-[#141824] border border-white/[0.08] hover:border-[#E50914]/40 flex items-center gap-4 transition group shadow-lg"
              >
                <div className="w-12 h-12 rounded-xl bg-[#E50914]/15 text-[#E50914] flex items-center justify-center shrink-0 border border-[#E50914]/30 group-hover:scale-110 transition-transform">
                  <Heart className="w-6 h-6 fill-current" />
                </div>
                <div>
                  <p className="text-2xl font-black text-white group-hover:text-[#E50914] transition">
                    {stats.totalFavorites}
                  </p>
                  <p className="text-xs text-neutral-400 font-medium">Daftar Konten Favorit</p>
                </div>
              </Link>

              <div className="p-5 rounded-xl bg-[#0D1017] border border-white/[0.08] flex items-center gap-4 shadow-lg">
                <div className="w-12 h-12 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-2xl font-black text-white">{stats.totalReviews}</p>
                  <p className="text-xs text-neutral-400 font-medium">Ulasan & Rating Diberikan</p>
                </div>
              </div>
            </div>

            {/* Account Detail Specifications Card */}
            <div className="p-6 rounded-xl bg-[#0D1017] border border-white/[0.08] space-y-4 shadow-lg">
              <h3 className="text-xs font-black text-neutral-300 uppercase tracking-wider flex items-center gap-2 border-b border-white/5 pb-3">
                <Shield className="w-4 h-4 text-cyan-400" />
                <span>Detail Akun Platform</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-neutral-400">Tipe Keanggotaan</span>
                  <span className="text-cyan-400 font-bold">BINUS Student Pro</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-neutral-400">Database Storage</span>
                  <span className="text-emerald-400 font-bold">MongoDB Atlas Cloud</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-neutral-400">Sinkronisasi</span>
                  <span className="text-neutral-200 font-semibold">Web & Mobile (Real-Time)</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-neutral-400">Keamanan Sandi</span>
                  <span className="text-neutral-200 font-mono text-[11px]">Bcrypt Salted Hash</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (8 cols): Form & Favorites Preview */}
          <div className="lg:col-span-8 space-y-8">
            {/* Edit Profile Form */}
            <div className="p-6 sm:p-8 rounded-xl bg-[#0D1017] border border-white/[0.08] space-y-6 shadow-xl">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <User className="w-4 h-4 text-[#E50914]" />
                  <span>Pengaturan Profil & Personalisasi</span>
                </h2>
                <span className="text-[11px] text-neutral-400 font-mono">BINUSFLIX</span>
              </div>

              {message && (
                <div
                  className={`p-3.5 rounded-lg text-xs flex items-center gap-2 ${
                    message.type === 'success'
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      : 'bg-red-500/15 text-red-400 border border-red-500/30'
                  }`}
                >
                  {message.type === 'success' ? (
                    <CheckCircle className="w-4 h-4 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0" />
                  )}
                  <span>{message.text}</span>
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-neutral-300">Nama Lengkap</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg bg-[#07080A] border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400 transition"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-neutral-300">URL Gambar Avatar</label>
                    <input
                      type="url"
                      value={avatar}
                      onChange={(e) => setAvatar(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-4 py-2.5 rounded-lg bg-[#07080A] border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400 transition"
                    />
                  </div>
                </div>

                {/* Preset Avatar Fast Chooser */}
                <div className="space-y-2">
                  <label className="text-[11px] text-neutral-400">Atau pilih avatar siap pakai:</label>
                  <div className="flex items-center gap-3">
                    {[
                      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
                      'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
                      'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80',
                      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
                    ].map((presetUrl, idx) => (
                      <img
                        key={idx}
                        src={presetUrl}
                        alt="Preset"
                        onClick={() => setAvatar(presetUrl)}
                        className={`w-9 h-9 rounded-lg object-cover cursor-pointer border-2 transition hover:scale-110 ${
                          avatar === presetUrl ? 'border-[#E50914] ring-2 ring-red-500/40' : 'border-white/10'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-300">Bio & Preferensi Hiburan</label>
                  <textarea
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tuliskan film favorit, serial kesukaan, atau musisi andalan Anda..."
                    className="w-full p-3.5 rounded-lg bg-[#07080A] border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400 transition"
                  />
                </div>

                <div className="flex items-center justify-end pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#E50914] hover:bg-[#b20710] text-white text-xs font-bold transition shadow-lg shadow-red-950/50 disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>{saving ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Recent Favorites Preview Section */}
            <div className="p-6 sm:p-8 rounded-xl bg-[#0D1017] border border-white/[0.08] space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Heart className="w-4 h-4 text-[#E50914] fill-current" />
                  <span>Koleksi Favorit Terbaru</span>
                </h3>
                <Link to="/favorites" className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold">
                  Lihat Semua ({stats.totalFavorites}) &rarr;
                </Link>
              </div>

              {recentFavorites.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {recentFavorites.map((fav) => (
                    <Link
                      key={fav.id || fav.contentId}
                      to={`/detail/${fav.contentType}/${fav.contentId}`}
                      className="group relative rounded-lg overflow-hidden bg-[#07080A] border border-white/10 aspect-[2/3] hover:border-[#E50914]/50 transition shadow"
                    >
                      <img
                        src={fav.posterUrl}
                        alt={fav.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-2.5">
                        <span className="text-[8px] font-black uppercase text-cyan-400 tracking-wider">
                          {fav.contentType}
                        </span>
                        <h5 className="text-[11px] font-bold text-white truncate">{fav.title}</h5>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center space-y-2">
                  <Heart className="w-8 h-8 text-neutral-600 mx-auto" />
                  <p className="text-xs text-neutral-400">Belum ada konten yang ditambahkan ke favorit.</p>
                  <Link to="/" className="inline-block text-xs font-bold text-[#E50914] hover:underline">
                    Jelajahi Konten &rarr;
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
