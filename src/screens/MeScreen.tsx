import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { STUDENT, ROOM_LABEL, VARIANT, BASE_SHIP_FEE, examStamp } from '@constants/student';
import { theme } from '@constants/theme';
import { useAuthStore } from '@stores/authStore';
import { useCampusLocation } from '@hooks/useCampusLocation';
import { Watermark } from '@components/Watermark';

export const MeScreen = () => {
  const logout = useAuthStore((state) => state.logout);
  const phoneOrEmail = useAuthStore((state) => state.phoneOrEmail);
  const {
    status,
    coords,
    distanceKm,
    shipFee,
    isLoading,
    errorMsg,
    requestLocation,
    openSettings,
    setMockLocation,
    ktxGate,
  } = useCampusLocation();

  const handleLogout = () => {
    Alert.alert(
      'Đăng xuất KTXGo',
      'Bạn có chắc chắn muốn đăng xuất tài khoản?',
      [
        { text: 'Huỷ', style: 'cancel' },
        {
          text: 'Đăng xuất',
          style: 'destructive',
          onPress: () => logout(),
        },
      ]
    );
  };

  const getStatusBadge = () => {
    switch (status) {
      case 'granted':
        return {
          text: 'Đã cấp quyền (Granted)',
          bg: '#DCFCE7',
          color: theme.colors.success,
          icon: '✅',
        };
      case 'blocked':
        return {
          text: 'Bị chặn vĩnh viễn (Blocked)',
          bg: '#FEE2E2',
          color: theme.colors.error,
          icon: '🚫',
        };
      case 'denied':
        return {
          text: 'Bị từ chối (Denied)',
          bg: '#FEF3C7',
          color: '#D97706',
          icon: '⚠️',
        };
      default:
        return {
          text: 'Chưa xác định (Undetermined)',
          bg: '#F1F5F9',
          color: theme.colors.textLight,
          icon: '❓',
        };
    }
  };

  const statusBadge = getStatusBadge();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {VARIANT.watermarkAtTop && <Watermark forcePosition="top" />}

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header Profile */}
        <View style={styles.profileCard}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>👨‍🎓</Text>
          </View>
          <Text style={styles.studentName}>{STUDENT.hoTen}</Text>
          <Text style={styles.studentMssv}>MSSV: {STUDENT.mssv}</Text>
          <View style={styles.stampBadge}>
            <Text style={styles.stampText}>Stamp: #{examStamp()}</Text>
          </View>
          <Text style={styles.contactText}>
            {phoneOrEmail ? `Đăng nhập: ${phoneOrEmail}` : `Phòng mặc định: ${ROOM_LABEL}`}
          </Text>
        </View>

        {/* Thông tin bài thi & Biến thể */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Cấu hình biến thể (Số cuối: {STUDENT.mssv.slice(-1)})</Text>
          <View style={styles.gridInfo}>
            <View style={styles.gridItem}>
              <Text style={styles.gridLabel}>Watermark</Text>
              <Text style={styles.gridValue}>
                {VARIANT.watermarkAtTop ? 'Phía trên' : 'Phía dưới'}
              </Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.gridLabel}>Ô Login</Text>
              <Text style={styles.gridValue}>
                {VARIANT.authField === 'phone' ? 'Phone' : 'Email'}
              </Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.gridLabel}>Thứ tự Tab</Text>
              <Text style={styles.gridValue}>
                {VARIANT.tabOrder === 'shopFirst' ? 'Shop → Giỏ → Tôi' : 'Giỏ → Shop → Tôi'}
              </Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.gridLabel}>Haptic Add</Text>
              <Text style={styles.gridValue}>{VARIANT.hapticOnAdd}</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.gridLabel}>Công thức ship</Text>
              <Text style={styles.gridValue}>Công thức {VARIANT.shipFormula}</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.gridLabel}>Detail Style</Text>
              <Text style={styles.gridValue}>{VARIANT.detailPresentation}</Text>
            </View>
          </View>
        </View>

        {/* GPS Location & Quản lý Quyền */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardTitle}>Vị trí GPS & Phí ship</Text>
            <View style={[styles.statusTag, { backgroundColor: statusBadge.bg }]}>
              <Text style={[styles.statusTagText, { color: statusBadge.color }]}>
                {statusBadge.icon} {statusBadge.text}
              </Text>
            </View>
          </View>

          {/* Điểm mốc KTX */}
          <View style={styles.locationRow}>
            <Text style={styles.locLabel}>Điểm mốc (Cổng KTX):</Text>
            <Text style={styles.locValue}>
              {ktxGate.latitude.toFixed(5)}, {ktxGate.longitude.toFixed(5)} ({ktxGate.name})
            </Text>
          </View>

          {/* Toạ độ của sinh viên */}
          <View style={styles.locationRow}>
            <Text style={styles.locLabel}>Toạ độ sinh viên:</Text>
            <Text style={styles.locValue}>
              {coords
                ? `${coords.latitude.toFixed(5)}, ${coords.longitude.toFixed(5)}`
                : 'Chưa có toạ độ'}
            </Text>
          </View>

          {/* Khoảng cách Haversine */}
          <View style={styles.locationRow}>
            <Text style={styles.locLabel}>Khoảng cách Haversine:</Text>
            <Text style={[styles.locValue, styles.highlightValue]}>
              {distanceKm !== null ? `${distanceKm} km` : 'Chưa tính'}
            </Text>
          </View>

          {/* Phí ship tính toán */}
          <View style={styles.locationRow}>
            <Text style={styles.locLabel}>Phí ship ước tính:</Text>
            <Text style={[styles.locValue, styles.shipPrice]}>
              {shipFee.toLocaleString('vi-VN')} đ
            </Text>
          </View>

          <View style={styles.formulaDescBox}>
            <Text style={styles.formulaDesc}>
              Công thức {VARIANT.shipFormula}: BASE ({BASE_SHIP_FEE.toLocaleString('vi-VN')}đ)
              {VARIANT.shipFormula === 'B' ? ' + round(km * 1.500) + 2.000' : ' + round(km * 2.000)'}
            </Text>
          </View>

          {errorMsg && (
            <View style={styles.errorBox}>
              <Text style={styles.errorBoxText}>{errorMsg}</Text>
            </View>
          )}

          {/* Các nút hành động theo 3 trạng thái quyền */}
          <View style={styles.actionButtonsGroup}>
            {status === 'blocked' ? (
              // Nhánh 3: Bị chặn vĩnh viễn (Blocked) -> openSettings()
              <TouchableOpacity
                style={styles.settingsButton}
                onPress={openSettings}
                activeOpacity={0.85}
              >
                <Text style={styles.settingsButtonText}>⚙️ Mở Cài Đặt Hệ Thống (openSettings)</Text>
              </TouchableOpacity>
            ) : (
              // Nhánh 1 & 2: Xin quyền / Cập nhật vị trí
              <TouchableOpacity
                style={styles.requestButton}
                onPress={requestLocation}
                disabled={isLoading}
                activeOpacity={0.85}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.requestButtonText}>
                    📍 {status === 'granted' ? 'Cập nhật toạ độ GPS' : 'Yêu cầu cấp quyền Location'}
                  </Text>
                )}
              </TouchableOpacity>
            )}

            {/* Nút hỗ trợ máy ảo giả lập nhanh toạ độ */}
            <View style={styles.mockButtonsRow}>
              <TouchableOpacity
                style={styles.mockBtn}
                onPress={() => setMockLocation(10.8250, 106.6890)}
              >
                <Text style={styles.mockBtnText}>Simulate 0.4km</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.mockBtn}
                onPress={() => setMockLocation(10.8350, 106.6980)}
              >
                <Text style={styles.mockBtnText}>Simulate 1.8km</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Nút Đăng xuất */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.85}
        >
          <Text style={styles.logoutButtonText}>Đăng xuất tài khoản</Text>
        </TouchableOpacity>
      </ScrollView>

      {!VARIANT.watermarkAtTop && <Watermark forcePosition="bottom" />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    padding: theme.spacing.lg,
    paddingBottom: 24,
  },
  profileCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.xl,
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadow.card,
  },
  avatarCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.sm,
    borderWidth: 2,
    borderColor: theme.colors.border,
  },
  avatarText: {
    fontSize: 34,
  },
  studentName: {
    fontSize: 20,
    fontWeight: '800',
    color: theme.colors.text,
  },
  studentMssv: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textLight,
    marginTop: 2,
  },
  stampBadge: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.full,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#93C5FD',
  },
  stampText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  contactText: {
    fontSize: 12,
    color: theme.colors.textLight,
    marginTop: 6,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadow.card,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    flexWrap: 'wrap',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  statusTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  statusTagText: {
    fontSize: 11,
    fontWeight: '700',
  },
  gridInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
    marginTop: theme.spacing.xs,
  },
  gridItem: {
    width: '50%',
    padding: 6,
  },
  gridLabel: {
    fontSize: 11,
    color: theme.colors.textLight,
  },
  gridValue: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.text,
    marginTop: 2,
  },
  locationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: '#F1F5F9',
  },
  locLabel: {
    fontSize: 12,
    color: theme.colors.textLight,
  },
  locValue: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.text,
  },
  highlightValue: {
    color: theme.colors.secondary,
    fontWeight: '700',
  },
  shipPrice: {
    color: theme.colors.primary,
    fontWeight: '800',
    fontSize: 14,
  },
  formulaDescBox: {
    marginTop: 8,
    padding: 6,
    backgroundColor: '#EFF6FF',
    borderRadius: 6,
  },
  formulaDesc: {
    fontSize: 10,
    color: theme.colors.primary,
    fontStyle: 'italic',
  },
  errorBox: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#FEF2F2',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  errorBoxText: {
    fontSize: 11,
    color: theme.colors.error,
  },
  actionButtonsGroup: {
    marginTop: theme.spacing.md,
  },
  requestButton: {
    backgroundColor: theme.colors.primary,
    height: 44,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  requestButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  settingsButton: {
    backgroundColor: theme.colors.error,
    height: 44,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  settingsButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  mockButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  mockBtn: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
  },
  mockBtnText: {
    fontSize: 11,
    color: theme.colors.textLight,
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    height: 46,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.lg,
  },
  logoutButtonText: {
    color: theme.colors.error,
    fontSize: 15,
    fontWeight: '700',
  },
});
