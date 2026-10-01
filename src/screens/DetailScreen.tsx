import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import * as Haptics from 'expo-haptics';
import { STUDENT, PRICE_MULTIPLIER, ROOM_LABEL, VARIANT } from '@constants/student';
import { theme } from '@constants/theme';
import { productApi } from '@services/productApi';
import { useCartStore } from '@stores/cartStore';
import { Watermark } from '@components/Watermark';

export const DetailScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const productId = route.params?.id;

  const addItem = useCartStore((state) => state.addItem);

  const {
    data: product,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => productApi.getProductById(productId),
    enabled: !!productId,
  });

  const handleAddToCart = async () => {
    if (!product) return;

    // Haptic theo biến thể
    try {
      if (VARIANT.hapticOnAdd === 'impact') {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } else {
        await Haptics.selectionAsync();
      }
    } catch {
      // Ignored
    }

    addItem(product);

    // Bắt buộc Alert có MSSV
    Alert.alert(
      'Thêm vào giỏ thành công!',
      `Đã thêm "${product.title}" vào giỏ hàng giao tận ${ROOM_LABEL}.\n[Xác nhận MSSV: ${STUDENT.mssv}]`,
      [
        {
          text: 'Tiếp tục xem',
          style: 'cancel',
        },
        {
          text: 'Vào Giỏ hàng',
          onPress: () => {
            navigation.navigate('MainTabs', { screen: 'Cart' });
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Đang tải chi tiết món...</Text>
      </SafeAreaView>
    );
  }

  if (isError || !product) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <Text style={styles.errorText}>Không thể tải thông tin món ăn</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backBtnText}>Quay lại</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const priceVnd = Math.round(product.price * PRICE_MULTIPLIER);
  const formattedPrice = priceVnd.toLocaleString('vi-VN') + ' đ';

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
      {VARIANT.watermarkAtTop && <Watermark forcePosition="top" />}

      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.topBarTitle} numberOfLines={1}>
          Chi tiết món KTXGo
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Product Image */}
        <View style={styles.imageCard}>
          <Image source={{ uri: product.image }} style={styles.image} resizeMode="contain" />
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{product.category}</Text>
          </View>
        </View>

        {/* Product Info */}
        <View style={styles.detailsCard}>
          <View style={styles.priceRow}>
            <Text style={styles.price}>{formattedPrice}</Text>
            {product.rating && (
              <View style={styles.ratingBadge}>
                <Text style={styles.starIcon}>⭐</Text>
                <Text style={styles.ratingText}>
                  {product.rating.rate} ({product.rating.count})
                </Text>
              </View>
            )}
          </View>

          <Text style={styles.title}>{product.title}</Text>

          <View style={styles.deliveryBadge}>
            <Text style={styles.deliveryIcon}>🛵</Text>
            <Text style={styles.deliveryText}>
              Giao tận <Text style={styles.deliveryBold}>{ROOM_LABEL}</Text> trong 15-20 phút
            </Text>
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Mô tả món</Text>
          <Text style={styles.description}>{product.description}</Text>

          {/* Student Tag */}
          <View style={styles.studentInfoBox}>
            <Text style={styles.studentInfoText}>
              Phiên bản bài thi TH2 · MSSV: {STUDENT.mssv} · {STUDENT.hoTen}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Sticky Action Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomPriceGroup}>
          <Text style={styles.bottomPriceLabel}>Đơn giá:</Text>
          <Text style={styles.bottomPriceValue}>{formattedPrice}</Text>
        </View>

        <TouchableOpacity
          style={styles.addToCartButton}
          onPress={handleAddToCart}
          activeOpacity={0.85}
        >
          <Text style={styles.addToCartButtonText}>+ Thêm vào giỏ</Text>
        </TouchableOpacity>
      </View>

      {!VARIANT.watermarkAtTop && <Watermark forcePosition="bottom" />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: theme.colors.textLight,
  },
  errorText: {
    fontSize: 15,
    color: theme.colors.error,
    marginBottom: 16,
  },
  backBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
  },
  backBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  topBarTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text,
  },
  placeholder: {
    width: 36,
  },
  scrollContent: {
    padding: theme.spacing.lg,
    paddingBottom: 24,
  },
  imageCard: {
    width: '100%',
    height: 260,
    backgroundColor: '#FFFFFF',
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    position: 'relative',
    ...theme.shadow.card,
  },
  image: {
    width: '85%',
    height: '85%',
  },
  categoryBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.primary,
    textTransform: 'uppercase',
  },
  detailsCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    marginTop: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadow.card,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  price: {
    fontSize: 22,
    fontWeight: '800',
    color: theme.colors.primary,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.full,
  },
  starIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#D97706',
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: theme.colors.text,
    lineHeight: 24,
    marginBottom: theme.spacing.md,
  },
  deliveryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7ED',
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.secondary,
  },
  deliveryIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  deliveryText: {
    fontSize: 13,
    color: '#C2410C',
  },
  deliveryBold: {
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 6,
  },
  description: {
    fontSize: 13,
    color: theme.colors.textLight,
    lineHeight: 20,
  },
  studentInfoBox: {
    marginTop: theme.spacing.lg,
    padding: theme.spacing.sm,
    backgroundColor: '#EFF6FF',
    borderRadius: theme.borderRadius.sm,
    alignItems: 'center',
  },
  studentInfoText: {
    fontSize: 11,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    ...theme.shadow.card,
  },
  bottomPriceGroup: {
    flex: 1,
  },
  bottomPriceLabel: {
    fontSize: 11,
    color: theme.colors.textLight,
  },
  bottomPriceValue: {
    fontSize: 17,
    fontWeight: '800',
    color: theme.colors.primary,
  },
  addToCartButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: theme.borderRadius.md,
    elevation: 3,
  },
  addToCartButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
