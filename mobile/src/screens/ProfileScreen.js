import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';

const ProfileScreen = ({ navigation }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [stats, setStats] = useState({ totalFavorites: 0, totalReviews: 0 });

  useEffect(() => {
    if (isAuthenticated) {
      const fetchStats = async () => {
        try {
          const res = await api.get('/auth/me');
          setStats(res.data.stats || { totalFavorites: 0, totalReviews: 0 });
        } catch (err) {
          console.warn('Failed to fetch stats:', err.message);
        }
      };
      fetchStats();
    }
  }, [isAuthenticated]);

  const handleLogout = async () => {
    Alert.alert('Konfirmasi Keluar', 'Apakah Anda yakin ingin keluar dari akun BINUSFLIX?', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Keluar',
        style: 'destructive',
        onPress: async () => {
          await logout();
          navigation.navigate('Login');
        },
      },
    ]);
  };

  if (!isAuthenticated) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="person-circle-outline" size={60} color={COLORS.primary} />
        <Text style={styles.centerTitle}>Belum Masuk ke Akun</Text>
        <Text style={styles.centerSub}>
          Masuk untuk melihat profil dan statistik aktivitas hiburan Anda di BINUSFLIX.
        </Text>
        <TouchableOpacity style={styles.loginBtn} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginBtnText}>Masuk Sekarang</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* 1. Profile Header Card */}
      <View style={styles.profileCard}>
        <Image
          source={{
            uri:
              user?.avatar ||
              'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
          }}
          style={styles.avatar}
        />
        <View style={styles.vipBadge}>
          <Text style={styles.vipBadgeText}>BINUSFLIX VIP MEMBER</Text>
        </View>
        <Text style={styles.fullName}>{user?.fullName || user?.username}</Text>
        <Text style={styles.username}>@{user?.username} • {user?.email}</Text>
        <Text style={styles.bio}>{user?.bio || 'Menikmati film, serial TV, dan musik berkualitas studio di BINUSFLIX.'}</Text>
      </View>

      {/* 2. Stats Counter Row */}
      <View style={styles.statsRow}>
        <TouchableOpacity
          style={styles.statBox}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('Favorit')}
        >
          <Ionicons name="heart" size={24} color={COLORS.primary} />
          <Text style={styles.statNumber}>{stats.totalFavorites}</Text>
          <Text style={styles.statLabel}>Konten Favorit</Text>
        </TouchableOpacity>

        <View style={styles.statBox}>
          <Ionicons name="star" size={24} color={COLORS.gold} />
          <Text style={styles.statNumber}>{stats.totalReviews}</Text>
          <Text style={styles.statLabel}>Ulasan Dikirim</Text>
        </View>
      </View>

      {/* 3. Account & Platform Specifications Card */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Detail Akun & Personalisasi</Text>

        <View style={styles.infoRow}>
          <View style={styles.infoLeft}>
            <Ionicons name="shield-checkmark" size={18} color={COLORS.primary} />
            <Text style={styles.infoLabel}>Tipe Keanggotaan</Text>
          </View>
          <Text style={styles.infoValueHighlight}>BINUS Student Pro</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.infoRow}>
          <View style={styles.infoLeft}>
            <Ionicons name="cloud-done" size={18} color={COLORS.emerald} />
            <Text style={styles.infoLabel}>Penyimpanan Cloud</Text>
          </View>
          <Text style={styles.infoValue}>MongoDB Atlas (Real-Time)</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.infoRow}>
          <View style={styles.infoLeft}>
            <Ionicons name="tv-outline" size={18} color={COLORS.cyan} />
            <Text style={styles.infoLabel}>Kualitas Streaming</Text>
          </View>
          <Text style={styles.infoValue}>Ultra HD 4K & Lossless</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.infoRow}>
          <View style={styles.infoLeft}>
            <Ionicons name="lock-closed-outline" size={18} color={COLORS.gold} />
            <Text style={styles.infoLabel}>Keamanan Sandi</Text>
          </View>
          <Text style={styles.infoValue}>Bcrypt Salted Hash</Text>
        </View>
      </View>

      {/* 4. Quick Navigation Link to Favorites */}
      <TouchableOpacity
        style={styles.quickFavoritesBtn}
        activeOpacity={0.8}
        onPress={() => navigation.navigate('Favorit')}
      >
        <View style={styles.quickFavoritesLeft}>
          <View style={styles.favIconCircle}>
            <Ionicons name="heart" size={18} color="#FFFFFF" />
          </View>
          <View>
            <Text style={styles.quickFavTitle}>Daftar Saya (Watchlist)</Text>
            <Text style={styles.quickFavSub}>Lihat seluruh koleksi film, serial, dan musik tersimpan</Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
      </TouchableOpacity>

      {/* 5. Project Footer Banner */}
      <View style={styles.creditsCard}>
        <Text style={styles.creditsTitle}>BINUSFLIX Mobile App</Text>
        <Text style={styles.creditsText}>BINUS University Project • LO 3 Assessment</Text>
        <Text style={styles.creditsText}>Expo • React Native • Node.js • MongoDB Atlas</Text>
      </View>

      {/* 6. Logout Button */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={18} color="#EF4444" />
        <Text style={styles.logoutText}>Keluar dari Akun</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 52 : 46,
    paddingBottom: 40,
    gap: 14,
  },
  profileCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  vipBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 8,
  },
  vipBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  fullName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  username: {
    color: COLORS.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  bio: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    gap: 4,
  },
  statNumber: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
  statLabel: {
    color: COLORS.textMuted,
    fontSize: 11,
  },
  sectionCard: {
    backgroundColor: COLORS.card,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  infoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoLabel: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  infoValue: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  infoValueHighlight: {
    color: COLORS.cyan,
    fontSize: 12,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginVertical: 4,
  },
  quickFavoritesBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  quickFavoritesLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  favIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickFavTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  quickFavSub: {
    color: COLORS.textMuted,
    fontSize: 10,
    marginTop: 1,
  },
  creditsCard: {
    padding: 14,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.03)',
    alignItems: 'center',
    gap: 3,
  },
  creditsTitle: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  creditsText: {
    color: COLORS.textMuted,
    fontSize: 10,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    paddingVertical: 12,
    borderRadius: 14,
    gap: 8,
  },
  logoutText: {
    color: '#EF4444',
    fontSize: 13,
    fontWeight: 'bold',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    gap: 8,
  },
  centerTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  centerSub: {
    color: COLORS.textMuted,
    fontSize: 12,
    textAlign: 'center',
    maxWidth: 240,
  },
  loginBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 12,
  },
  loginBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
