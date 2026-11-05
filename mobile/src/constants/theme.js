import { Platform } from 'react-native';

export const COLORS = {
  // Global Obsidian Cinema Tokens (Aligned 1:1 with Web Tailwind Config)
  background: '#07080A',
  surface: '#0D1017',
  card: '#0D1017',
  cardHover: '#141824',
  cardBorder: 'rgba(255, 255, 255, 0.08)',
  
  // Brand Identity (BINUS Crimson Red)
  primary: '#E50914',
  primaryDark: '#B91C1C',
  secondary: '#00D2FF',
  cyan: '#00D2FF',
  
  // Accent & Status
  emerald: '#10B981',
  matchGreen: '#22C55E',
  gold: '#FFB800',
  
  // Typography & Neutrals
  text: '#FFFFFF',
  textSecondary: '#D1D5DB',
  textMuted: '#9CA3AF',
  
  // Input Controls
  inputBg: '#07080A',
  inputBorder: 'rgba(255, 255, 255, 0.1)',
};

// Otomatis arahkan ke IP LAN aktif komputer (192.168.1.66) agar Expo Go di HP fisik langsung terhubung
export const DEFAULT_API_URL = Platform.select({
  web: 'http://localhost:5000/api',
  default: 'http://192.168.1.66:5000/api',
});
