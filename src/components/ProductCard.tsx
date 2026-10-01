import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Product } from '@services/productApi';
import { PRICE_MULTIPLIER, VARIANT } from '@constants/student';
import { theme } from '@constants/theme';
import { useCartStore } from '@stores/cartStore';

interface ProductCardProps {
  product: Product;
  onPress: () => void;
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 36) / 2; // 2 cột với padding đều đặn

export const ProductCard: React.FC<ProductCardProps> = ({ product, onPress }) => {
  const addItem = useCartStore((state) => state.addItem);

  const priceVnd = Math.round(product.price * PRICE_MULTIPLIER);
  const formattedPrice = priceVnd.toLocaleString('vi-VN') + ' đ';

  const handleAddToCart = async () => {
    // Kích hoạt Haptic theo đúng biến thể
    try {
      if (VARIANT.hapticOnAdd === 'impact') {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } else {
        await Haptics.selectionAsync();
      }
    } catch {
      // Bỏ qua lỗi nếu môi trường không hỗ trợ haptic
    }

    addItem(product);
  };

  const [imgLoaded, setImgLoaded] = React.useState(false);

  const getCategoryIcon = (category: string) => {
    const c = (category || '').toLowerCase();
    if (c.includes('văn phòng') || c.includes('pack') || c.includes('balo')) return '🎒';
    if (c.includes('thời trang') || c.includes('clothing') || c.includes('fit') || c.includes('áo')) return '👕';
    if (c.includes('phụ kiện') || c.includes('jewelery') || c.includes('vòng') || c.includes('nhẫn') || c.includes('tai')) return '💍';
    if (c.includes('điện tử') || c.includes('electronic') || c.includes('ssd') || c.includes('cứng') || c.includes('drive')) return '💻';
    return '🛍️';
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.85}
      accessibilityRole="button"
      accessibilityLabel={`Sản phẩm ${product.title}`}
    >
      <View style={styles.imageContainer}>
        {!imgLoaded && (
          <View style={styles.fallbackContainer}>
            <Text style={styles.fallbackEmoji}>{getCategoryIcon(product.category)}</Text>
          </View>
        )}
        <Image
          source={{ uri: product.image }}
          style={[styles.image, !imgLoaded && styles.hiddenImage]}
          resizeMode="contain"
          onLoad={() => setImgLoaded(true)}
          onError={() => setImgLoaded(false)}
        />
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText} numberOfLines={1}>
            {product.category}
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {product.title}
        </Text>

        <View style={styles.footer}>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>{formattedPrice}</Text>
          </View>

          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddToCart}
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessibilityLabel="Thêm vào giỏ"
          >
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.md,
    overflow: 'hidden',
    ...theme.shadow.card,
  },
  imageContainer: {
    width: '100%',
    height: 140,
    backgroundColor: '#FFFFFF',
    padding: theme.spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  image: {
    width: '90%',
    height: '90%',
  },
  categoryBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: 'rgba(239, 246, 255, 0.92)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 0.5,
    borderColor: theme.colors.border,
  },
  categoryText: {
    fontSize: 9,
    fontWeight: '600',
    color: theme.colors.primary,
    textTransform: 'uppercase',
  },
  content: {
    padding: theme.spacing.sm,
    justifyContent: 'space-between',
    flex: 1,
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.text,
    lineHeight: 18,
    marginBottom: theme.spacing.xs,
    minHeight: 36,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: theme.spacing.xs,
  },
  priceContainer: {
    flex: 1,
    marginRight: 4,
  },
  price: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  addButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  addButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 20,
    textAlign: 'center',
  },
  fallbackContainer: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
  },
  fallbackEmoji: {
    fontSize: 44,
  },
  hiddenImage: {
    width: 0,
    height: 0,
    opacity: 0,
  },
});
