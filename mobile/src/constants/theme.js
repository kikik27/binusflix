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

// Terintegrasi langsung dengan Live Backend API di Vercel
export const DEFAULT_API_URL = 'https://binusflix-api.vercel.app/api';
