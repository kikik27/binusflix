import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';

const ContentCard = ({
  item,
  navigation,
  isFavorited: initialFavorited = false,
  onFavoriteToggle,
  width = 135,
  style,
}) => {
  const { isAuthenticated } = useAuth();
  const [isFav, setIsFav] = useState(initialFavorited);
  const [favLoading, setFavLoading] = useState(false);

  const isMusic = item.contentType === 'music';

  const defaultFallback = isMusic
    ? 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80'
    : item.contentType === 'tv'
    ? 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?auto=format&fit=crop&w=600&q=80'
    : 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80';

  const [imgUri, setImgUri] = useState(item.posterUrl || defaultFallback);

  const matchPercentage = Math.min(99, Math.max(92, Math.round((item.rating || 8.5) * 10) + 5));

  const handleFavoritePress = async () => {
    if (!isAuthenticated) {
      navigation.navigate('Login');
      return;
    }

    try {
      setFavLoading(true);
      if (isFav) {
        await api.delete(`/favorites/${item.id}`);
        setIsFav(false);
        if (onFavoriteToggle) onFavoriteToggle(item.id, false);
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
        setIsFav(true);
        if (onFavoriteToggle) onFavoriteToggle(item.id, true);
      }
    } catch (err) {
      console.warn('Favorite toggle error:', err.message);
    } finally {
      setFavLoading(false);
    }
  };

  const categoryLabel = isMusic ? 'AUDIO' : item.contentType === 'tv' ? 'SERIAL' : 'FILM';

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => navigation.navigate('Detail', { type: item.contentType, id: item.id })}
      style={[styles.card, { width }, style]}
    >
      <View style={[styles.imageContainer, { height: width * 1.5 }]}>
        <Image
          source={{ uri: imgUri }}
          onError={() => setImgUri(defaultFallback)}
          style={styles.poster}
          resizeMode="cover"
        />

        {/* Top Category Badge */}
        <View style={[styles.ribbon, isMusic && styles.ribbonMusic]}>
          <Text style={styles.ribbonText}>{categoryLabel}</Text>
        </View>

        {/* Favorite Plus/Check Button */}
        <TouchableOpacity
          onPress={handleFavoritePress}
          disabled={favLoading}
          style={styles.favButton}
        >
          {favLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Ionicons
              name={isFav ? 'checkmark-circle' : 'add-circle-outline'}
              size={20}
              color={isFav ? COLORS.primary : '#FFFFFF'}
            />
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.matchRow}>
          <Text style={styles.matchText}>{matchPercentage}% Cocok</Text>
          <Text style={styles.qualityText}>
            {isMusic ? 'LOSSLESS' : 'HD'}
          </Text>
        </View>
        <Text numberOfLines={1} style={styles.title}>
          {item.title}
        </Text>
        <Text numberOfLines={1} style={styles.subtitle}>
          {item.subtitle || item.genre || 'Entertainment'}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  imageContainer: {
    width: '100%',
    backgroundColor: COLORS.background,
    position: 'relative',
  },
  poster: {
    width: '100%',
    height: '100%',
  },
  ribbon: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  ribbonMusic: {
    backgroundColor: '#059669', // Emerald for music
  },
  ribbonText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  favButton: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(7, 8, 10, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  infoContainer: {
    padding: 8,
    backgroundColor: COLORS.card,
  },
  matchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 3,
  },
  matchText: {
    color: COLORS.matchGreen,
    fontSize: 10,
    fontWeight: 'bold',
  },
  qualityText: {
    color: COLORS.textMuted,
    fontSize: 9,
    fontWeight: '700',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 4,
    borderRadius: 3,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  subtitle: {
    color: COLORS.textMuted,
    fontSize: 9,
    marginTop: 1,
  },
});

export default ContentCard;
