import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AlertCircle } from 'lucide-react';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password minimal harus 6 karakter');
      return;
    }

    setLoading(true);
    try {
      await register(username, email, password, fullName);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal mendaftar akun, silakan periksa data Anda');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-20 relative bg-cover bg-center"
      style={{
        backgroundImage: `linear-gradient(to top, rgba(7, 8, 10, 0.95) 0%, rgba(7, 8, 10, 0.8) 50%, rgba(7, 8, 10, 0.95) 100%), url('https://image.tmdb.org/t/p/original/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg')`,
      }}
    >
      <div className="w-full max-w-md bg-[#0D1017]/90 border border-white/[0.08] p-8 sm:p-10 rounded-2xl shadow-2xl space-y-6 backdrop-blur-md">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 pb-1">
            <span className="text-2xl font-black tracking-tighter text-white">BINUS</span>
            <span className="text-2xl font-black tracking-tighter text-[#E50914]">FLIX</span>
            <span className="ml-1 px-1.5 py-0.5 rounded text-[9px] font-black bg-[#E50914] text-white tracking-widest uppercase">
              PRO
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">Daftar Akun Baru</h1>
          <p className="text-xs text-neutral-400">
            Mulai tonton trailer, dengarkan musik, dan simpan daftar favorit Anda
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/40 text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-300">Nama Lengkap</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Contoh: Budi Santoso"
              required
              className="w-full px-4 py-2.5 rounded-lg bg-[#07080A] border border-white/10 focus:border-[#E50914] text-white placeholder-neutral-500 text-xs focus:outline-none transition"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-300">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, ''))}
              placeholder="budisantoso"
              required
              className="w-full px-4 py-2.5 rounded-lg bg-[#07080A] border border-white/10 focus:border-[#E50914] text-white placeholder-neutral-500 text-xs focus:outline-none transition"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-300">Alamat Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="budi@example.com"
              required
              className="w-full px-4 py-2.5 rounded-lg bg-[#07080A] border border-white/10 focus:border-[#E50914] text-white placeholder-neutral-500 text-xs focus:outline-none transition"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-300">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimal 6 karakter"
              required
              className="w-full px-4 py-2.5 rounded-lg bg-[#07080A] border border-white/10 focus:border-[#E50914] text-white placeholder-neutral-500 text-xs focus:outline-none transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-[#E50914] hover:bg-[#b20710] text-white text-xs font-bold transition transform active:scale-95 disabled:opacity-50 mt-2 shadow-lg shadow-red-950/50"
          >
            {loading ? 'Mendaftarkan...' : 'Daftar Sekarang'}
          </button>
        </form>

        {/* Footer Link */}
        <div className="pt-2 text-center text-neutral-400 text-xs border-t border-white/5">
          <span>Sudah memiliki akun? </span>
          <Link to="/login" className="text-[#E50914] hover:underline font-bold">
            Masuk di sini.
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
