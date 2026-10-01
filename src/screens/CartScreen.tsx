import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { STUDENT, ROOM_LABEL, VARIANT } from '@constants/student';
import { theme } from '@constants/theme';
import { useCartStore, CartItem } from '@stores/cartStore';
import { useCampusLocation } from '@hooks/useCampusLocation';
import { Watermark } from '@components/Watermark';

export const CartScreen = () => {
  const navigation = useNavigation<any>();
  const { items, changeQty, removeItem, clearCart, totalAmount } = useCartStore();
  const { shipFee, distanceKm, status } = useCampusLocation();

  const subTotal = totalAmount();
  const currentShipFee = items.length > 0 ? shipFee : 0;
  const grandTotal = subTotal + currentShipFee;

  const triggerHaptic = async () => {
    try {
      if (VARIANT.hapticOnAdd === 'impact') {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } else {
        await Haptics.selectionAsync();
      }
    } catch {
      // Ignored
    }
  };

  const handleQtyChange = (id: number, delta: number) => {
    triggerHaptic();
    changeQty(id, delta);
  };

  const handleRemove = (id: number, title: string) => {
    Alert.alert(
      'Xoá sản phẩm',
      `Bạn có muốn bỏ "${title}" khỏi giỏ hàng?`,
      [
        { text: 'Huỷ', style: 'cancel' },
        {
          text: 'Xoá',
          style: 'destructive',
          onPress: () => removeItem(id),
        },
      ]
    );
  };

  const handleCheckout = () => {
    if (items.length === 0) return;
    Alert.alert(
      'Đặt đơn KTXGo thành công!',
      `Đơn hàng giao đến phòng: ${ROOM_LABEL}\nTổng tiền: ${grandTotal.toLocaleString('vi-VN')} đ\nShipper nội khu sẽ liên hệ bạn ngay.\n[MSSV: ${STUDENT.mssv} - ${STUDENT.hoTen}]`,
      [
        {
          text: 'Đồng ý',
          onPress: () => clearCart(),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {VARIANT.watermarkAtTop && <Watermark forcePosition="top" />}

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Giỏ hàng KTXGo</Text>
          <Text style={styles.roomSubtitle}>Giao tận {ROOM_LABEL}</Text>
        </View>
        {items.length > 0 && (
          <TouchableOpacity onPress={() => clearCart()} style={styles.clearAllBtn}>
            <Text style={styles.clearAllText}>Xoá tất cả</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Delivery Destination Card */}
      <View style={styles.destinationCard}>
        <Text style={styles.destIcon}>📍</Text>
        <View style={styles.destInfo}>
          <Text style={styles.destTitle}>Địa chỉ phòng ký túc xá</Text>
          <Text style={styles.destRoom}>{ROOM_LABEL} · KTX Đại học Công nghiệp IUH</Text>
        </View>
      </View>

      {items.length === 0 ? (
        // Giỏ trống
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🛒</Text>
          <Text style={styles.emptyTitle}>Giỏ hàng đang trống</Text>
          <Text style={styles.emptySubtitle}>
            Bạn chưa chọn món nào. Hãy dạo quanh thực đơn KTXGo nhé!
          </Text>
          <TouchableOpacity
            style={styles.shopNowBtn}
            onPress={() => navigation.navigate('Shop')}
            activeOpacity={0.85}
          >
            <Text style={styles.shopNowBtnText}>Xem thực đơn ngay</Text>
          </TouchableOpacity>
        </View>
      ) : (
        // Danh sách giỏ hàng
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.itemsList}>
            {items.map((item: CartItem) => (
              <View key={`${STUDENT.mssv}-${item.id}`} style={styles.itemRow}>
                <View style={styles.itemImageWrapper}>
                  <Text style={styles.itemEmoji}>
                    {item.title.toLowerCase().includes('balo') || item.title.toLowerCase().includes('pack')
                      ? '🎒'
                      : item.title.toLowerCase().includes('áo') || item.title.toLowerCase().includes('thun')
                      ? '👕'
                      : item.title.toLowerCase().includes('vòng') || item.title.toLowerCase().includes('nhẫn')
                      ? '💍'
                      : item.title.toLowerCase().includes('ssd') || item.title.toLowerCase().includes('cứng')
                      ? '💻'
                      : '🛍️'}
                  </Text>
                  <Image source={{ uri: item.image }} style={styles.itemImage} resizeMode="contain" />
                </View>

                <View style={styles.itemDetails}>
                  <Text style={styles.itemTitle} numberOfLines={2}>
                    {item.title}
                  </Text>
                  <Text style={styles.itemPrice}>
                    {item.price.toLocaleString('vi-VN')} đ
                  </Text>
                </View>

                {/* Điều khiển số lượng */}
                <View style={styles.qtyControl}>
                  <TouchableOpacity
                    style={styles.qtyBtn}
                    onPress={() => handleQtyChange(item.id, -1)}
                    hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                  >
                    <Text style={styles.qtyBtnText}>−</Text>
                  </TouchableOpacity>

                  <Text style={styles.qtyCount}>{item.quantity}</Text>

                  <TouchableOpacity
                    style={styles.qtyBtn}
                    onPress={() => handleQtyChange(item.id, 1)}
                    hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                  >
                    <Text style={styles.qtyBtnText}>+</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={() => handleRemove(item.id, item.title)}
                    hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                  >
                    <Text style={styles.deleteIcon}>🗑️</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>

          {/* Chi tiết tính tiền */}
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Tóm tắt đơn hàng</Text>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tạm tính hàng ({items.length} món):</Text>
              <Text style={styles.summaryValue}>{subTotal.toLocaleString('vi-VN')} đ</Text>
            </View>

            <View style={styles.summaryRow}>
              <View style={styles.shipFeeLabelGroup}>
                <Text style={styles.summaryLabel}>Phí ship KTXGo ({VARIANT.shipFormula}):</Text>
                {distanceKm !== null && (
                  <Text style={styles.shipKmTag}>~{distanceKm} km</Text>
                )}
              </View>
              <Text style={styles.shipFeeValue}>
                {currentShipFee.toLocaleString('vi-VN')} đ
              </Text>
            </View>

            <View style={styles.formulaNote}>
              <Text style={styles.formulaNoteText}>
                {VARIANT.shipFormula === 'B'
                  ? `Công thức B: Base (${currentShipFee > 0 ? '9.000' : '0'}đ) + km*1.500đ + 2.000đ`
                  : `Công thức A: Base + km*2.000đ`}
                {status !== 'granted' ? ' (Đang dùng phí mặc định)' : ' (Từ GPS vị trí)'}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Tổng thanh toán:</Text>
              <Text style={styles.totalValue}>{grandTotal.toLocaleString('vi-VN')} đ</Text>
            </View>

            <TouchableOpacity
              style={styles.checkoutBtn}
              onPress={handleCheckout}
              activeOpacity={0.85}
            >
              <Text style={styles.checkoutBtnText}>Xác nhận đặt đơn KTXGo</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}

      {!VARIANT.watermarkAtTop && <Watermark forcePosition="bottom" />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.xs,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: theme.colors.text,
  },
  roomSubtitle: {
    fontSize: 13,
    color: theme.colors.secondary,
    fontWeight: '600',
  },
  clearAllBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  clearAllText: {
    fontSize: 12,
    color: theme.colors.error,
    fontWeight: '600',
  },
  destinationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    marginHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.xs,
    marginBottom: theme.spacing.sm,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadow.card,
  },
  destIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  destInfo: {
    flex: 1,
  },
  destTitle: {
    fontSize: 11,
    color: theme.colors.textLight,
  },
  destRoom: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.text,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: 20,
  },
  itemsList: {
    marginBottom: theme.spacing.md,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadow.card,
  },
  itemImageWrapper: {
    width: 50,
    height: 50,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: '#F1F5F9',
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  itemEmoji: {
    fontSize: 24,
  },
  itemImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  itemDetails: {
    flex: 1,
    marginRight: 8,
  },
  itemTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.text,
    lineHeight: 16,
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  qtyControl: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  qtyBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.primary,
    lineHeight: 18,
  },
  qtyCount: {
    marginHorizontal: 8,
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.text,
    minWidth: 16,
    textAlign: 'center',
  },
  deleteBtn: {
    marginLeft: 10,
    padding: 2,
  },
  deleteIcon: {
    fontSize: 14,
  },
  summaryCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadow.card,
  },
  summaryTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  summaryLabel: {
    fontSize: 13,
    color: theme.colors.textLight,
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.text,
  },
  shipFeeLabelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shipKmTag: {
    fontSize: 10,
    color: theme.colors.secondary,
    backgroundColor: '#FFF7ED',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
    marginLeft: 6,
    fontWeight: '600',
  },
  shipFeeValue: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.secondary,
  },
  formulaNote: {
    marginTop: 2,
    marginBottom: 6,
  },
  formulaNoteText: {
    fontSize: 10,
    color: theme.colors.textLight,
    fontStyle: 'italic',
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.md,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.text,
  },
  totalValue: {
    fontSize: 19,
    fontWeight: '800',
    color: theme.colors.primary,
  },
  checkoutBtn: {
    backgroundColor: theme.colors.primary,
    height: 48,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  checkoutBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 13,
    color: theme.colors.textLight,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 18,
  },
  shopNowBtn: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: theme.borderRadius.md,
    elevation: 2,
  },
  shopNowBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
});
