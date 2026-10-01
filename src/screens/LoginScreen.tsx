import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { STUDENT, VARIANT, ROOM_LABEL, examStamp } from '@constants/student';
import { theme } from '@constants/theme';
import { useAuthStore } from '@stores/authStore';
import { Watermark } from '@components/Watermark';

export const LoginScreen = () => {
  const [inputValue, setInputValue] = useState('');
  const login = useAuthStore((state) => state.login);

  const isPhone = VARIANT.authField === 'phone';
  const labelText = isPhone ? 'Số điện thoại sinh viên' : 'Email sinh viên IUH';
  const placeholderText = isPhone ? '0912 345 678' : `${STUDENT.mssv}@sv.iuh.edu.vn`;
  const keyboardType = isPhone ? 'phone-pad' : 'email-address';

  const handleLogin = () => {
    // Lưu token giả đúng định dạng: ktxgo-{mssv}-{stamp}
    const token = `ktxgo-${STUDENT.mssv}-${examStamp()}`;
    const value = inputValue.trim() || (isPhone ? '0988236895' : `${STUDENT.mssv}@sv.iuh.edu.vn`);
    login(token, value);
    Alert.alert(
      'Đăng nhập thành công',
      `Chào mừng ${STUDENT.hoTen} (${STUDENT.mssv}) đến với KTXGo!`
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {VARIANT.watermarkAtTop && <Watermark forcePosition="top" />}

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo & Header */}
          <View style={styles.header}>
            <View style={styles.logoBadge}>
              <Text style={styles.logoIcon}>🛵</Text>
            </View>
            <Text style={styles.brandTitle}>KTXGo</Text>
            <Text style={styles.brandSubtitle}>
              Dịch vụ giao đồ ăn & nhu yếu phẩm tận phòng {ROOM_LABEL}
            </Text>
          </View>

          {/* Form Card */}
          <View style={styles.card}>
            <View style={styles.variantBadge}>
              <Text style={styles.variantBadgeText}>
                Biến thể: {isPhone ? 'Phone' : 'Email'} · Số cuối {STUDENT.mssv.slice(-1)}
              </Text>
            </View>

            <Text style={styles.inputLabel}>{labelText}</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.inputIcon}>{isPhone ? '📱' : '✉️'}</Text>
              <TextInput
                style={styles.input}
                placeholder={placeholderText}
                placeholderTextColor={theme.colors.muted}
                value={inputValue}
                onChangeText={setInputValue}
                keyboardType={keyboardType}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.infoBox}>
              <Text style={styles.infoText}>
                📍 Điểm nhận mặc định: <Text style={styles.infoBold}>{ROOM_LABEL}</Text>
              </Text>
              <Text style={styles.infoText}>
                🎓 Sinh viên: <Text style={styles.infoBold}>{STUDENT.hoTen}</Text> ({STUDENT.mssv})
              </Text>
            </View>

            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleLogin}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel="Vào cửa hàng"
            >
              <Text style={styles.loginButtonText}>Vào cửa hàng</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {!VARIANT.watermarkAtTop && <Watermark forcePosition="bottom" />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: theme.spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  logoBadge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
    borderWidth: 2,
    borderColor: theme.colors.border,
  },
  logoIcon: {
    fontSize: 36,
  },
  brandTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: theme.colors.text,
    letterSpacing: 0.5,
  },
  brandSubtitle: {
    fontSize: 13,
    color: theme.colors.textLight,
    textAlign: 'center',
    marginTop: 6,
    paddingHorizontal: theme.spacing.md,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadow.card,
  },
  variantBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.md,
  },
  variantBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: theme.spacing.md,
    height: 48,
    marginBottom: theme.spacing.md,
  },
  inputIcon: {
    fontSize: 18,
    marginRight: theme.spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: theme.colors.text,
    paddingVertical: 0,
  },
  infoBox: {
    backgroundColor: '#F0F9FF',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.primary,
  },
  infoText: {
    fontSize: 12,
    color: theme.colors.textLight,
    lineHeight: 18,
  },
  infoBold: {
    fontWeight: '700',
    color: theme.colors.text,
  },
  loginButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
});
