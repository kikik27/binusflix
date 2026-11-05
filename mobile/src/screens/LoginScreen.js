import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { useAuth } from '../context/AuthContext';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showServerConfig, setShowServerConfig] = useState(false);
  const [customIp, setCustomIp] = useState('');

  const { login, apiUrl, saveCustomApiUrl } = useAuth();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Mohon isi email dan password');
      return;
    }

    setError('');
    setLoading(true);
    try {
      await login(email.trim(), password);
      navigation.navigate('MainTabs');
    } catch (err) {
      setError(err.response?.data?.message || 'Login gagal, periksa email & password atau koneksi server.');
    } finally {
      setLoading(false);
    }
  };

  const handleAutoFillDemo = () => {
    setEmail('demo@binus.ac.id');
    setPassword('password123');
    setError('');
  };

  const handleSaveIp = async () => {
    if (customIp.trim()) {
      await saveCustomApiUrl(customIp.trim());
      Alert.alert('Sukses', `Server API diubah ke: ${customIp.trim()}`);
      setShowServerConfig(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Header Logo & Title */}
        <View style={styles.header}>
          <View style={styles.logoRow}>
            <Text style={styles.logoWhite}>
              BINUS<Text style={styles.logoRed}>FLIX</Text>
            </Text>
            <View style={styles.proBadge}>
              <Text style={styles.proBadgeText}>PRO</Text>
            </View>
          </View>
          <Text style={styles.brandTitle}>Masuk ke Akun</Text>
          <Text style={styles.subTitle}>Platform Streaming Film, Serial TV & Musik</Text>
        </View>

        {/* Demo Auto-Fill Banner */}
        <View style={styles.demoBanner}>
          <View style={{ flex: 1 }}>
            <Text style={styles.demoTitle}>Akun Demo Pengujian</Text>
            <Text style={styles.demoSubtitle}>demo@binus.ac.id / password123</Text>
          </View>
          <TouchableOpacity onPress={handleAutoFillDemo} style={styles.autoFillBtn}>
            <Text style={styles.autoFillBtnText}>Isi Otomatis</Text>
          </TouchableOpacity>
        </View>

        {/* Error Alert */}
        {error ? (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle" size={18} color="#EF4444" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {/* Form Inputs */}
        <View style={styles.form}>
          <Text style={styles.label}>Email atau Username</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="mail-outline" size={18} color={COLORS.textMuted} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="nama@email.com atau username"
              placeholderTextColor={COLORS.textMuted}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <Text style={styles.label}>Password</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="lock-closed-outline" size={18} color={COLORS.textMuted} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor={COLORS.textMuted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            style={styles.loginBtn}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.loginBtnText}>Masuk ke Akun</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Register Link */}
        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Belum memiliki akun? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.linkText}>Daftar di sini</Text>
          </TouchableOpacity>
        </View>

        {/* Server IP Config Toggle */}
        <View style={styles.serverConfigSection}>
          <TouchableOpacity
            onPress={() => setShowServerConfig(!showServerConfig)}
            style={styles.serverToggle}
          >
            <Ionicons name="settings-outline" size={14} color={COLORS.textMuted} />
            <Text style={styles.serverToggleText}>
              Host API: {apiUrl}
            </Text>
          </TouchableOpacity>

          {showServerConfig && (
            <View style={styles.ipBox}>
              <Text style={styles.ipLabel}>Ganti URL Backend (contoh: http://192.168.1.66:5000/api):</Text>
              <TextInput
                style={styles.ipInput}
                placeholder={apiUrl}
                placeholderTextColor={COLORS.textMuted}
                value={customIp}
                onChangeText={setCustomIp}
                autoCapitalize="none"
              />
              <TouchableOpacity onPress={handleSaveIp} style={styles.ipSaveBtn}>
                <Text style={styles.ipSaveText}>Simpan Host</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingVertical: 40,
    justifyContent: 'center',
    minHeight: '100%',
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  logoWhite: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  logoRed: {
    color: COLORS.primary,
  },
  proBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  proBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  brandTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  subTitle: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  demoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(229, 9, 20, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(229, 9, 20, 0.3)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
  },
  demoTitle: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  demoSubtitle: {
    color: COLORS.textSecondary,
    fontSize: 11,
    marginTop: 2,
  },
  autoFillBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  autoFillBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    borderRadius: 10,
    padding: 10,
    marginBottom: 16,
    gap: 8,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    flex: 1,
  },
  form: {
    gap: 12,
  },
  label: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 13,
    paddingVertical: 12,
  },
  loginBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  loginBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    color: COLORS.textMuted,
    fontSize: 12,
  },
  linkText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: 'bold',
  },
  serverConfigSection: {
    marginTop: 30,
    alignItems: 'center',
  },
  serverToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 8,
  },
  serverToggleText: {
    color: COLORS.textMuted,
    fontSize: 11,
  },
  ipBox: {
    width: '100%',
    backgroundColor: COLORS.card,
    padding: 12,
    borderRadius: 10,
    marginTop: 8,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  ipLabel: {
    color: COLORS.textSecondary,
    fontSize: 11,
    marginBottom: 6,
  },
  ipInput: {
    backgroundColor: COLORS.background,
    borderRadius: 6,
    padding: 8,
    color: '#FFFFFF',
    fontSize: 12,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  ipSaveBtn: {
    backgroundColor: COLORS.primary,
    padding: 8,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 8,
  },
  ipSaveText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
