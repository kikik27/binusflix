import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, AlertCircle, ArrowRight, UserCheck } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal login, periksa kembali email & password');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('demo@binus.ac.id');
    setPassword('password123');
    setError('');
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
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">Masuk ke Akun</h1>
          <p className="text-xs text-neutral-400">
            Akses film, serial TV, trailer, dan musik studio resmi BINUSFLIX
          </p>
        </div>

        {/* Demo Account Quick Fill Button */}
        <div className="p-3 rounded-xl bg-[#E50914]/15 border border-[#E50914]/30 flex items-center justify-between gap-3 shadow-inner">
          <div className="flex items-center gap-2.5">
            <UserCheck className="w-5 h-5 text-[#E50914] shrink-0" />
            <div className="text-left">
              <p className="text-xs font-bold text-white">Akun Demo Pengujian</p>
              <p className="text-[11px] text-neutral-300">demo@binus.ac.id / password123</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleFillDemo}
            className="px-3 py-1.5 rounded-lg bg-[#E50914] hover:bg-[#b20710] text-white text-[11px] font-bold transition shrink-0 shadow"
          >
            Isi Otomatis
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/40 text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-300">Email atau Username</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com atau username"
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
              placeholder="••••••••"
              required
              className="w-full px-4 py-2.5 rounded-lg bg-[#07080A] border border-white/10 focus:border-[#E50914] text-white placeholder-neutral-500 text-xs focus:outline-none transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-[#E50914] hover:bg-[#b20710] text-white text-xs font-bold transition transform active:scale-95 disabled:opacity-50 mt-2 shadow-lg shadow-red-950/50"
          >
            {loading ? 'Memproses...' : 'Masuk ke Akun'}
          </button>
        </form>

        {/* Footer Link */}
        <div className="pt-2 text-center text-neutral-400 text-xs border-t border-white/5">
          <span>Baru di BINUSFLIX? </span>
          <Link to="/register" className="text-[#E50914] hover:underline font-bold">
            Daftar sekarang.
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
