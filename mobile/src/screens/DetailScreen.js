import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  Alert,
  Dimensions,
} from 'react-native';
import * as Linking from 'expo-linking';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { useAuth } from '../context/AuthContext';
import { getActorDetails } from '../utils/castHelper';
import api from '../api/client';

const { width } = Dimensions.get('window');

const DetailScreen = ({ route, navigation }) => {
  const { type, id } = route.params;
  const { isAuthenticated } = useAuth();

  const [item, setItem] = useState(null);
  const [posterUri, setPosterUri] = useState('');
  const [backdropUri, setBackdropUri] = useState('');
  const [reviews, setReviews] = useState([]);
  const [isFavorited, setIsFavorited] = useState(false);
  const [loading, setLoading] = useState(true);
  const [favLoading, setFavLoading] = useState(false);

  // Review Input State
  const [userRating, setUserRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchDetail = async () => {
    try {
      const [detailRes, reviewsRes] = await Promise.all([
        api.get(`/content/detail/${type}/${id}`),
        api.get(`/reviews/${id}`),
      ]);
      setItem(detailRes.data.data);
      setPosterUri(detailRes.data.data.posterUrl);
      setBackdropUri(detailRes.data.data.backdropUrl || detailRes.data.data.posterUrl);
      setIsFavorited(detailRes.data.data.isFavorited || false);
      setReviews(reviewsRes.data.data || []);
    } catch (err) {
      console.warn('Error fetching detail:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [type, id]);

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      navigation.navigate('Login');
      return;
    }

    try {
      setFavLoading(true);
      if (isFavorited) {
        await api.delete(`/favorites/${item.id}`);
        setIsFavorited(false);
      } else {
        await api.post('/favorites', {
          contentId: item.id,
          contentType: item.contentType,
          title: item.title,
          subtitle: item.subtitle,
          posterUrl: item.posterUrl,
          backdropUrl: item.backdropUrl,
          releaseDate: item.releaseDate,
          rating: item.rating,
          genre: item.genre,
          durationOrAlbum: item.durationOrAlbum,
        });
        setIsFavorited(true);
      }
    } catch (err) {
      Alert.alert('Gagal', err.response?.data?.message || 'Gagal mengubah favorit.');
    } finally {
      setFavLoading(false);
    }
  };

  const handlePlayMedia = async () => {
    if (!item) return;

    if (item.contentType === 'music' && item.previewUrl) {
      Linking.openURL(item.previewUrl);
    } else if (item.trailerUrl) {
      Linking.openURL(item.trailerUrl);
    } else if (item.trailerKey) {
      Linking.openURL(`https://www.youtube.com/watch?v=${item.trailerKey}`);
    } else {
      Alert.alert('Info', 'Pratinjau media tidak tersedia.');
    }
  };

  const handleSubmitReview = async () => {
    if (!isAuthenticated) {
      navigation.navigate('Login');
      return;
    }

    if (!reviewText.trim()) {
      Alert.alert('Peringatan', 'Tuliskan ulasan Anda terlebih dahulu.');
      return;
    }

    try {
      setSubmittingReview(true);
      const res = await api.post(`/reviews/${item.id}`, {
        contentType: item.contentType,
        contentTitle: item.title,
        rating: userRating,
        reviewText: reviewText.trim(),
      });

      setReviews([res.data.data, ...reviews]);
      setReviewText('');
      Alert.alert('Sukses', 'Ulasan Anda berhasil dikirim!');
    } catch (err) {
      Alert.alert('Error', err.response?.data?.message || 'Gagal mengirim ulasan.');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Memuat detail konten BINUSFLIX...</Text>
      </View>
    );
  }

  if (!item) {
    return (
      <View style={styles.centerContainer}>
        <Text style={{ color: '#fff' }}>Konten tidak ditemukan.</Text>
      </View>
    );
  }

  const isMusic = item.contentType === 'music';

  const defaultPoster = isMusic
    ? 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80'
    : 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80';
  const defaultBackdrop = 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1200&q=80';

  const matchPercentage = Math.min(99, Math.max(92, Math.round((item.rating || 8.5) * 10) + 5));

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* 1. Backdrop Image Header Banner */}
      <View style={styles.backdropContainer}>
        <Image
          source={{ uri: backdropUri || item.backdropUrl || item.posterUrl || defaultBackdrop }}
          onError={() => setBackdropUri(defaultBackdrop)}
          style={styles.backdropImage}
          resizeMode="cover"
        />
        <View style={styles.backdropGradient} />

        {/* Sticky Easy-Back Button */}
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Favorite Button */}
        <TouchableOpacity
          style={styles.topFavBtn}
          onPress={handleToggleFavorite}
          disabled={favLoading}
        >
          {favLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Ionicons
              name={isFavorited ? 'heart' : 'heart-outline'}
              size={22}
              color={isFavorited ? COLORS.primary : '#FFFFFF'}
            />
          )}
        </TouchableOpacity>
      </View>

      {/* 2. Main Content Area */}
      <View style={styles.contentArea}>
        {/* Poster & Main Badges */}
        <View style={styles.topRow}>
          <Image
            source={{ uri: posterUri || item.posterUrl || defaultPoster }}
            onError={() => setPosterUri(defaultPoster)}
            style={styles.posterThumb}
            resizeMode="cover"
          />

          <View style={styles.topDetails}>
            <View style={styles.badgeRow}>
              <View style={[styles.typeBadge, isMusic && styles.typeBadgeMusic]}>
                <Text style={styles.typeBadgeText}>
                  {isMusic ? 'Musik' : item.contentType === 'tv' ? 'Serial TV' : 'Film'}
                </Text>
              </View>
              <View style={styles.proBadge}>
                <Text style={styles.proBadgeText}>BINUSFLIX</Text>
              </View>
            </View>

            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subtitle}>{item.subtitle}</Text>

            <View style={styles.ratingRow}>
              <Ionicons name="star" size={14} color={COLORS.gold} />
              <Text style={styles.ratingNumber}>
                {typeof item.rating === 'number' ? item.rating.toFixed(1) : item.rating} / 10
              </Text>
              <Text style={styles.matchBadge}>{matchPercentage}% Cocok</Text>
            </View>
          </View>
        </View>

        {/* Action Button: Play Trailer or Audio */}
        <TouchableOpacity style={styles.playBtn} onPress={handlePlayMedia}>
          <Ionicons name="play" size={18} color="#000000" />
          <Text style={styles.playBtnText}>
            {isMusic ? 'Putar Audio Studio' : 'Putar Trailer Resmi'}
          </Text>
        </TouchableOpacity>

        {/* Metadata Badges */}
        <View style={styles.metaRow}>
          {item.releaseDate ? (
            <View style={styles.metaPill}>
              <Ionicons name="calendar-outline" size={12} color={COLORS.textMuted} />
              <Text style={styles.metaText}>{item.releaseDate}</Text>
            </View>
          ) : null}

          {item.durationOrAlbum ? (
            <View style={styles.metaPill}>
              <Ionicons name="time-outline" size={12} color={COLORS.textMuted} />
              <Text style={styles.metaText}>{item.durationOrAlbum}</Text>
            </View>
          ) : null}

          <View style={[styles.metaPill, isMusic && { borderColor: 'rgba(16, 185, 129, 0.3)' }]}>
            <Text style={[styles.metaText, { color: isMusic ? COLORS.emerald : COLORS.cyan, fontWeight: 'bold' }]}>
              {isMusic ? 'LOSSLESS AUDIO' : 'SUB INDO'}
            </Text>
          </View>

          {item.genre ? (
            <View style={styles.metaPill}>
              <Ionicons name="pricetag-outline" size={12} color={COLORS.textMuted} />
              <Text style={styles.metaText}>{item.genre}</Text>
            </View>
          ) : null}
        </View>

        {/* Synopsis Section */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeading}>Ringkasan Cerita & Deskripsi</Text>
          <Text style={styles.synopsisText}>
            {item.overview || 'Informasi ringkasan cerita resmi BINUSFLIX.'}
          </Text>
        </View>

        {/* Cast & Character Profiles (Enhanced Photo Cards) */}
        {item.cast && item.cast.length > 0 && (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionHeading}>
              {isMusic ? 'Musisi & Tim Produksi' : 'Pemeran & Karakter Utama'}
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.castScroll}>
              {item.cast.map((c, i) => {
                const actor = getActorDetails(c, i);
                return (
                  <View key={i} style={styles.castCard}>
                    <Image
                      source={{ uri: actor.photo }}
                      style={styles.actorPhoto}
                      resizeMode="cover"
                    />
                    <Text numberOfLines={1} style={styles.actorName}>{actor.name}</Text>
                    <Text numberOfLines={1} style={styles.actorChar}>{actor.character}</Text>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        )}

        {/* Reviews & Ratings Section */}
        <View style={styles.sectionCard}>
          <View style={styles.reviewHeaderRow}>
            <Text style={styles.sectionHeading}>Ulasan Komunitas ({reviews.length})</Text>
            <Text style={styles.reviewCount}>Skor Pengguna</Text>
          </View>

          {/* Review Input Box */}
          <View style={styles.reviewFormBox}>
            <Text style={styles.formTitle}>Berikan Nilai Anda:</Text>

            {/* Star Selector */}
            <View style={styles.starRow}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} onPress={() => setUserRating(star)} style={styles.starBtn}>
                  <Ionicons
                    name={star <= userRating ? 'star' : 'star-outline'}
                    size={22}
                    color={COLORS.gold}
                  />
                </TouchableOpacity>
              ))}
              <Text style={styles.starLabel}>{userRating} / 5 Bintang</Text>
            </View>

            <TextInput
              style={styles.reviewInput}
              placeholder="Bagikan opini Anda tentang alur, akting, atau melodi..."
              placeholderTextColor={COLORS.textMuted}
              multiline
              numberOfLines={3}
              value={reviewText}
              onChangeText={setReviewText}
            />

            <TouchableOpacity
              style={styles.submitReviewBtn}
              onPress={handleSubmitReview}
              disabled={submittingReview}
            >
              {submittingReview ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.submitReviewText}>Kirim Ulasan</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Reviews List */}
          {reviews.length > 0 ? (
            reviews.map((rev) => (
              <View key={rev._id} style={styles.reviewCard}>
                <View style={styles.reviewCardHeader}>
                  <Image
                    source={{
                      uri:
                        rev.userAvatar ||
                        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
                    }}
                    style={styles.reviewerAvatar}
                  />
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={styles.reviewerName}>{rev.username}</Text>
                    <View style={styles.reviewStarRow}>
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <Ionicons
                          key={idx}
                          name={idx < rev.rating ? 'star' : 'star-outline'}
                          size={12}
                          color={COLORS.gold}
                        />
                      ))}
                    </View>
                  </View>
                </View>
                <Text style={styles.reviewBody}>{rev.reviewText}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.noReviewsText}>Belum ada ulasan untuk konten ini. Jadilah yang pertama!</Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  centerContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: COLORS.textMuted,
    fontSize: 12,
    marginTop: 8,
  },
  backdropContainer: {
    width: '100%',
    height: 240,
    position: 'relative',
    backgroundColor: COLORS.background,
  },
  backdropImage: {
    width: '100%',
    height: '100%',
  },
  backdropGradient: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(7, 8, 10, 0.65)',
  },
  backBtn: {
    position: 'absolute',
    top: 44,
    left: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(7, 8, 10, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  topFavBtn: {
    position: 'absolute',
    top: 44,
    right: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(7, 8, 10, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  contentArea: {
    paddingHorizontal: 16,
    marginTop: -40,
  },
  topRow: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'flex-end',
  },
  posterThumb: {
    width: 100,
    height: 150,
    borderRadius: 10,
    backgroundColor: COLORS.card,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  topDetails: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 4,
  },
  typeBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  typeBadgeMusic: {
    backgroundColor: '#059669',
  },
  typeBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  proBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  proBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  ratingNumber: {
    color: COLORS.gold,
    fontSize: 12,
    fontWeight: 'bold',
  },
  matchBadge: {
    color: COLORS.matchGreen,
    fontSize: 10,
    fontWeight: 'bold',
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  playBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 18,
    gap: 8,
  },
  playBtnText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: 'bold',
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 14,
  },
  metaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  metaText: {
    color: COLORS.textMuted,
    fontSize: 11,
  },
  sectionCard: {
    marginTop: 18,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  sectionHeading: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  synopsisText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    lineHeight: 18,
  },
  castScroll: {
    paddingVertical: 6,
    gap: 10,
  },
  castCard: {
    width: 80,
    alignItems: 'center',
    marginRight: 10,
  },
  actorPhoto: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: 4,
    backgroundColor: COLORS.background,
  },
  actorName: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  actorChar: {
    color: COLORS.cyan,
    fontSize: 9,
    textAlign: 'center',
  },
  reviewHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reviewCount: {
    color: COLORS.textMuted,
    fontSize: 11,
  },
  reviewFormBox: {
    backgroundColor: COLORS.background,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    marginTop: 8,
    marginBottom: 14,
  },
  formTitle: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  starRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  starBtn: {
    padding: 3,
  },
  starLabel: {
    color: COLORS.gold,
    fontSize: 11,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  reviewInput: {
    backgroundColor: COLORS.card,
    borderRadius: 8,
    padding: 8,
    color: '#FFFFFF',
    fontSize: 11,
    textAlignVertical: 'top',
    minHeight: 50,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  submitReviewBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  submitReviewText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  reviewCard: {
    backgroundColor: COLORS.background,
    padding: 10,
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  reviewCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  reviewerAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  reviewerName: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  reviewStarRow: {
    flexDirection: 'row',
    gap: 2,
    marginTop: 1,
  },
  reviewBody: {
    color: COLORS.textSecondary,
    fontSize: 11,
    lineHeight: 16,
  },
  noReviewsText: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontStyle: 'italic',
    marginTop: 4,
  },
});

export default DetailScreen;
