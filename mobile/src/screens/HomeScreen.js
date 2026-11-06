import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  RefreshControl,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { useAuth } from '../context/AuthContext';
import ContentCard from '../components/ContentCard';
import api from '../api/client';

const { width } = Dimensions.get('window');
const CARD_GAP = 12;
const HORIZONTAL_PADDING = 16;
const GRID_CARD_WIDTH = Math.floor((width - (HORIZONTAL_PADDING * 2) - CARD_GAP) / 2);

const HomeScreen = ({ navigation }) => {
  const { user, isAuthenticated } = useAuth();
  const [activeType, setActiveType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [items, setItems] = useState([]);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setError(null);
    try {
      const [exploreRes, bannersRes] = await Promise.all([
        api.get('/content/explore', {
          params: {
            type: activeType,
            search: searchQuery,
            limit: 40,
          },
        }),
        api.get('/content/featured'),
      ]);

      setItems(exploreRes.data.data || []);
      setBanners(bannersRes.data.data || []);
    } catch (err) {
      console.warn('Error loading home data:', err.message);
      setError(err.response?.data?.message || err.message || 'Koneksi ke server gagal. Pastikan internet aktif.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchData();
  }, [activeType, searchQuery]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, [activeType, searchQuery]);

  // Featured Hero Item (first banner)
  const heroItem = banners[0] || items[0];

  const movies = items.filter((i) => i.contentType === 'movie');
  const tvShows = items.filter((i) => i.contentType === 'tv');
  const musicList = items.filter((i) => i.contentType === 'music');
  const trendingList = [...items].sort((a, b) => (b.rating || 0) - (a.rating || 0));

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
      }
    >
      {/* 1. BINUSFLIX Mobile Header Bar */}
      <View style={styles.topBar}>
        <View style={styles.logoRow}>
          <Text style={styles.logoWhite}>
            BINUS<Text style={styles.logoRed}>FLIX</Text>
          </Text>
          <View style={styles.proBadge}>
            <Text style={styles.proBadgeText}>PRO</Text>
          </View>
        </View>

        <View style={styles.topRightIcons}>
          <TouchableOpacity onPress={() => (isAuthenticated ? navigation.navigate('Profil') : navigation.navigate('Login'))}>
            <Image
              source={{
                uri: user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
              }}
              style={styles.avatar}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* 2. Category Filter Tabs */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          onPress={() => setActiveType('all')}
          style={[styles.categoryTab, activeType === 'all' && styles.categoryTabActive]}
        >
          <Text style={[styles.tabText, activeType === 'all' && styles.tabTextActive]}>Semua</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveType('movie')}
          style={[styles.categoryTab, activeType === 'movie' && styles.categoryTabActive]}
        >
          <Text style={[styles.tabText, activeType === 'movie' && styles.tabTextActive]}>Film</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveType('tv')}
          style={[styles.categoryTab, activeType === 'tv' && styles.categoryTabActive]}
        >
          <Text style={[styles.tabText, activeType === 'tv' && styles.tabTextActive]}>Serial TV</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveType('music')}
          style={[styles.categoryTab, activeType === 'music' && styles.categoryTabActive]}
        >
          <Text style={[styles.tabText, activeType === 'music' && styles.tabTextActive]}>Musik</Text>
        </TouchableOpacity>
      </View>

      {/* 3. Search Input */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={16} color={COLORS.textMuted} style={{ marginRight: 8 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="Cari film, serial TV, musik..."
          placeholderTextColor={COLORS.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={16} color={COLORS.textMuted} />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Error Message & Retry Banner */}
      {error && (
        <View style={styles.errorBox}>
          <Ionicons name="alert-circle-outline" size={20} color="#EF4444" style={{ marginRight: 8 }} />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={fetchData}>
            <Text style={styles.retryBtnText}>Coba Lagi</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* 4. Billboard Hero (when not searching) */}
      {!searchQuery && heroItem && (
        <View style={styles.heroPosterContainer}>
          <Image
            source={{ uri: heroItem.posterUrl || heroItem.backdropUrl }}
            style={styles.heroPoster}
            resizeMode="cover"
          />
          <View style={styles.heroGradient} />

          {/* Hero Action Overlay */}
          <View style={styles.heroActions}>
            <Text style={styles.heroGenreText}>{heroItem.genre || 'Trending • Pilihan Hari Ini'}</Text>

            <View style={styles.heroButtonRow}>
              {/* My List */}
              <TouchableOpacity
                style={styles.heroIconBtn}
                onPress={() => navigation.navigate('Favorit')}
              >
                <Ionicons name="add" size={24} color="#FFFFFF" />
                <Text style={styles.heroBtnSubtext}>Daftar Saya</Text>
              </TouchableOpacity>

              {/* Play White Button */}
              <TouchableOpacity
                style={styles.heroPlayBtn}
                onPress={() => navigation.navigate('Detail', { type: heroItem.contentType, id: heroItem.id })}
              >
                <Ionicons name="play" size={18} color="#000000" />
                <Text style={styles.heroPlayText}>
                  {heroItem.contentType === 'music' ? 'Putar Musik' : 'Putar Trailer'}
                </Text>
              </TouchableOpacity>

              {/* Info Button */}
              <TouchableOpacity
                style={styles.heroIconBtn}
                onPress={() => navigation.navigate('Detail', { type: heroItem.contentType, id: heroItem.id })}
              >
                <Ionicons name="information-circle-outline" size={24} color="#FFFFFF" />
                <Text style={styles.heroBtnSubtext}>Info Detail</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* 5. Horizontal Rails */}
      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : searchQuery ? (
        /* Search Grid (2 Symmetrical Columns) */
        <View style={styles.searchGrid}>
          <Text style={styles.searchHeading}>Hasil Pencarian ({items.length})</Text>
          <View style={styles.gridContainer}>
            {items.map((item) => (
              <ContentCard
                key={item.id}
                item={item}
                navigation={navigation}
                width={GRID_CARD_WIDTH}
                style={{ marginRight: 0, marginBottom: CARD_GAP }}
              />
            ))}
          </View>
        </View>
      ) : (
        <View style={styles.railsContainer}>
          {/* Row 1: Sedang Tren */}
          <View style={styles.rail}>
            <Text style={styles.rowTitle}>Sedang Tren Sekarang</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.railScroll}>
              {trendingList.map((item) => (
                <ContentCard key={item.id} item={item} navigation={navigation} width={130} />
              ))}
            </ScrollView>
          </View>

          {/* Row 2: Film Pilihan */}
          {(activeType === 'all' || activeType === 'movie') && movies.length > 0 && (
            <View style={styles.rail}>
              <Text style={styles.rowTitle}>Film Layar Lebar & Box Office</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.railScroll}>
                {movies.map((item) => (
                  <ContentCard key={item.id} item={item} navigation={navigation} width={130} />
                ))}
              </ScrollView>
            </View>
          )}

          {/* Row 3: Serial TV Populer */}
          {(activeType === 'all' || activeType === 'tv') && tvShows.length > 0 && (
            <View style={styles.rail}>
              <Text style={styles.rowTitle}>Serial TV & Drama Wajib Tonton</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.railScroll}>
                {tvShows.map((item) => (
                  <ContentCard key={item.id} item={item} navigation={navigation} width={130} />
                ))}
              </ScrollView>
            </View>
          )}

          {/* Row 4: Musik & Audio */}
          {(activeType === 'all' || activeType === 'music') && musicList.length > 0 && (
            <View style={styles.rail}>
              <Text style={styles.rowTitle}>Hits Musik & Pratinjau Audio</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.railScroll}>
                {musicList.map((item) => (
                  <ContentCard key={item.id} item={item} navigation={navigation} width={130} />
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 44,
    paddingBottom: 10,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.cardBorder,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  logoWhite: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  logoRed: {
    color: COLORS.primary,
  },
  proBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 3,
  },
  proBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  tabRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 10,
    backgroundColor: COLORS.background,
  },
  categoryTab: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  categoryTabActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  tabText: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontWeight: '700',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    marginHorizontal: 16,
    marginTop: 4,
    marginBottom: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 12,
    paddingVertical: 9,
  },
  heroPosterContainer: {
    width: width - 32,
    height: 420,
    alignSelf: 'center',
    borderRadius: 14,
    overflow: 'hidden',
    position: 'relative',
    marginTop: 4,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    backgroundColor: COLORS.card,
  },
  heroPoster: {
    width: '100%',
    height: '100%',
  },
  heroGradient: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(7, 8, 10, 0.4)',
  },
  heroActions: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    alignItems: 'center',
    gap: 12,
  },
  heroGenreText: {
    color: '#E5E5E5',
    fontSize: 11,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.9)',
    textShadowRadius: 6,
  },
  heroButtonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 28,
  },
  heroIconBtn: {
    alignItems: 'center',
    gap: 2,
  },
  heroBtnSubtext: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  heroPlayBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 22,
    paddingVertical: 9,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  heroPlayText: {
    color: '#000000',
    fontSize: 13,
    fontWeight: '800',
  },
  railsContainer: {
    gap: 20,
  },
  rail: {
    gap: 8,
  },
  rowTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    paddingHorizontal: 16,
    letterSpacing: -0.2,
  },
  railScroll: {
    paddingHorizontal: 16,
  },
  searchGrid: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  searchHeading: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 12,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  loadingBox: {
    paddingVertical: 50,
    alignItems: 'center',
  },
  errorBox: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 12,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    flexDirection: 'row',
    alignItems: 'center',
  },
  errorText: {
    flex: 1,
    color: '#FCA5A5',
    fontSize: 12,
    fontWeight: '500',
  },
  retryBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: COLORS.primary,
    borderRadius: 6,
    marginLeft: 8,
  },
  retryBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
});

export default HomeScreen;
