import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { useAuth } from '../context/AuthContext';
import ContentCard from '../components/ContentCard';
import api from '../api/client';

const { width } = Dimensions.get('window');
const CARD_GAP = 12;
const HORIZONTAL_PADDING = 16;
const CARD_WIDTH = Math.floor((width - (HORIZONTAL_PADDING * 2) - CARD_GAP) / 2);

const FavoritesScreen = ({ navigation }) => {
  const { isAuthenticated } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchFavorites = async () => {
    if (!isAuthenticated) {
      setLoading(false);
      setRefreshing(false);
      return;
    }
    try {
      const res = await api.get('/favorites', {
        params: { type: activeFilter },
      });
      setFavorites(res.data.data || []);
    } catch (err) {
      console.warn('Error fetching favorites:', err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchFavorites();
  }, [isAuthenticated, activeFilter]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchFavorites();
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

  if (!isAuthenticated) {
    return (
      <View style={styles.centerBox}>
        <Ionicons name="lock-closed-outline" size={48} color={COLORS.primary} />
        <Text style={styles.centerTitle}>Autentikasi Diperlukan</Text>
        <Text style={styles.centerSub}>
          Masuk ke akun BINUSFLIX Anda untuk melihat dan mengelola daftar konten favorit.
        </Text>
        <TouchableOpacity
          style={styles.loginBtn}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.loginBtnText}>Masuk ke Akun</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Top Header - Safe Padding Top to avoid notch clipping */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <View style={styles.redPillIndicator} />
          <Text style={styles.title}>Daftar Favorit Saya</Text>
        </View>
        <Text style={styles.subtitle}>
          Koleksi film, serial TV, dan musik tersimpan di cloud MongoDB Atlas
        </Text>

        {/* Filter Tabs */}
        <View style={styles.filterRow}>
          {filters.map((f) => {
            const isActive = activeFilter === f.id;
            return (
              <TouchableOpacity
                key={f.id}
                onPress={() => setActiveFilter(f.id)}
                style={[styles.filterPill, isActive && styles.filterPillActive]}
              >
                <Text style={[styles.filterText, isActive && styles.filterTextActive]}>
                  {f.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Grid List - Balanced 2 Columns with no awkward gaps */}
      {loading ? (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item._id}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={COLORS.primary}
            />
          }
          renderItem={({ item }) => {
            const mappedItem = {
              id: item.contentId,
              contentType: item.contentType,
              title: item.title,
              subtitle: item.subtitle,
              posterUrl: item.posterUrl,
              backdropUrl: item.backdropUrl,
              releaseDate: item.releaseDate,
              rating: item.rating,
              genre: item.genre,
              durationOrAlbum: item.durationOrAlbum,
            };
            return (
              <ContentCard
                item={mappedItem}
                navigation={navigation}
                isFavorited={true}
                width={CARD_WIDTH}
                style={{ marginRight: 0, marginBottom: CARD_GAP }}
                onFavoriteToggle={(id, isFav) => {
                  if (!isFav) handleFavoriteRemoved(id);
                }}
              />
            );
          }}
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Ionicons name="heart-dislike-outline" size={48} color={COLORS.textMuted} />
              <Text style={styles.emptyTitle}>Daftar Favorit Masih Kosong</Text>
              <Text style={styles.emptySub}>
                Tekan tombol tambah (+) pada film, serial, atau musik di beranda untuk menyimpannya di sini.
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 52 : 46,
    paddingBottom: 14,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.cardBorder,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  redPillIndicator: {
    width: 3.5,
    height: 18,
    borderRadius: 2,
    backgroundColor: COLORS.primary,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  subtitle: {
    color: COLORS.textMuted,
    fontSize: 12,
    marginTop: 4,
    paddingLeft: 11.5,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  filterPill: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  filterPillActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterText: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontWeight: '700',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  centerBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    gap: 8,
  },
  centerTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
  },
  centerSub: {
    color: COLORS.textMuted,
    fontSize: 12,
    textAlign: 'center',
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
  emptyBox: {
    alignItems: 'center',
    paddingVertical: 60,
    gap: 8,
  },
  emptyTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  emptySub: {
    color: COLORS.textMuted,
    fontSize: 12,
    textAlign: 'center',
    maxWidth: 260,
    lineHeight: 18,
  },
});

export default FavoritesScreen;
