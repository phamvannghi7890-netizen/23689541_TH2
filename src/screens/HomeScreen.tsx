import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { FlashList } from '@shopify/flash-list';
import { STUDENT, ROOM_LABEL, DEBOUNCE_MS, STALE_TIME_MS, VARIANT } from '@constants/student';
import { theme } from '@constants/theme';
import { productApi, Product } from '@services/productApi';
import { useDebouncedValue } from '@hooks/useDebouncedValue';
import { ProductCard } from '@components/ProductCard';
import { Watermark } from '@components/Watermark';

export const HomeScreen = () => {
  const navigation = useNavigation<any>();
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebouncedValue(searchTerm, DEBOUNCE_MS);

  // TanStack Query lấy danh sách món
  const {
    data: products = [],
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ['products'],
    queryFn: () => productApi.getProducts(12),
    staleTime: STALE_TIME_MS,
  });

  // Lọc sản phẩm theo chuỗi đã debounce
  const filteredProducts = useMemo(() => {
    if (!debouncedSearch.trim()) return products;
    const query = debouncedSearch.toLowerCase().trim();
    return products.filter(
      (item) =>
        item.title.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query)
    );
  }, [products, debouncedSearch]);

  const handleCardPress = (id: number) => {
    navigation.navigate('Detail', { id });
  };

  const renderProductItem = ({ item }: { item: Product }) => (
    <ProductCard product={item} onPress={() => handleCardPress(item.id)} />
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {VARIANT.watermarkAtTop && <Watermark forcePosition="top" />}

      {/* Header KTXGo */}
      <View style={styles.header}>
        <View style={styles.headerTextGroup}>
          <Text style={styles.headerTitle}>KTXGO</Text>
          <View style={styles.roomBadge}>
            <Text style={styles.roomBadgeIcon}>📍</Text>
            <Text style={styles.roomBadgeText}>Giao tận {ROOM_LABEL}</Text>
          </View>
        </View>
        <View style={styles.studentBadge}>
          <Text style={styles.studentBadgeText}>{STUDENT.mssv}</Text>
        </View>
      </View>

      {/* Ô tìm kiếm có debounce */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm món ăn, trà sữa, đồ dùng..."
          placeholderTextColor={theme.colors.muted}
          value={searchTerm}
          onChangeText={setSearchTerm}
          clearButtonMode="while-editing"
          autoCapitalize="none"
        />
        {searchTerm.length > 0 && (
          <TouchableOpacity onPress={() => setSearchTerm('')} style={styles.clearBtn}>
            <Text style={styles.clearBtnText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Dải trạng thái thông tin debounce */}
      <View style={styles.metaBar}>
        <Text style={styles.metaText}>
          {debouncedSearch
            ? `Kết quả cho "${debouncedSearch}" (${filteredProducts.length} món)`
            : `Đang xem ${products.length} món nổi bật`}
        </Text>
        <Text style={styles.debounceTag}>Debounce: {DEBOUNCE_MS}ms</Text>
      </View>

      {/* 3 Cảnh mạng */}
      <View style={styles.listContainer}>
        {isLoading ? (
          // Cảnh 1: Đang tải
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={styles.loadingText}>Đang tải thực đơn KTXGo...</Text>
            <Text style={styles.subText}>MSSV: {STUDENT.mssv} · Stale: {STALE_TIME_MS}ms</Text>
          </View>
        ) : isError ? (
          // Cảnh 2: Lỗi mạng
          <View style={styles.centerContainer}>
            <View style={styles.errorIconCircle}>
              <Text style={styles.errorIcon}>⚠️</Text>
            </View>
            <Text style={styles.errorTitle}>Lỗi kết nối mạng</Text>
            <Text style={styles.errorMessage}>
              {(error as any)?.message || 'Không thể tải danh sách sản phẩm'}
            </Text>
            <View style={styles.studentErrorTag}>
              <Text style={styles.studentErrorText}>Xác thực sinh viên: {STUDENT.mssv}</Text>
            </View>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => refetch()}
              activeOpacity={0.8}
            >
              <Text style={styles.retryButtonText}>Thử lại ngay</Text>
            </TouchableOpacity>
          </View>
        ) : filteredProducts.length === 0 ? (
          // Không tìm thấy sản phẩm
          <View style={styles.centerContainer}>
            <Text style={styles.emptyIcon}>📦</Text>
            <Text style={styles.emptyTitle}>Không tìm thấy món phù hợp</Text>
            <Text style={styles.emptySubtitle}>
              Hãy thử tìm kiếm với từ khoá khác hoặc xoá bộ lọc
            </Text>
            <TouchableOpacity
              style={styles.resetButton}
              onPress={() => setSearchTerm('')}
            >
              <Text style={styles.resetButtonText}>Xem tất cả món</Text>
            </TouchableOpacity>
          </View>
        ) : (
          // Cảnh 3: Có dữ liệu lưới FlashList 2 cột (KHÔNG bọc trong ScrollView dọc)
          <FlashList
            data={filteredProducts}
            renderItem={renderProductItem}
            numColumns={2}
            keyExtractor={(item) => `${STUDENT.mssv}-${item.id}`}
            contentContainerStyle={styles.flashListContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={isRefetching}
                onRefresh={() => {
                  refetch();
                }}
                colors={[theme.colors.primary]}
                tintColor={theme.colors.primary}
              />
            }
          />
        )}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.xs,
  },
  headerTextGroup: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: theme.colors.primary,
    letterSpacing: 1,
  },
  roomBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  roomBadgeIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  roomBadgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.secondary,
  },
  studentBadge: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: theme.borderRadius.full,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  studentBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    marginHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    height: 44,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadow.card,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: theme.colors.text,
    paddingVertical: 0,
  },
  clearBtn: {
    padding: 4,
  },
  clearBtnText: {
    fontSize: 14,
    color: theme.colors.textLight,
  },
  metaBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.xs,
    marginBottom: theme.spacing.xs,
  },
  metaText: {
    fontSize: 12,
    color: theme.colors.textLight,
  },
  debounceTag: {
    fontSize: 10,
    color: theme.colors.primary,
    fontWeight: '600',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
  },
  flashListContent: {
    paddingTop: theme.spacing.xs,
    paddingBottom: theme.spacing.lg,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.text,
  },
  subText: {
    marginTop: 4,
    fontSize: 12,
    color: theme.colors.textLight,
  },
  errorIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
  },
  errorIcon: {
    fontSize: 32,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.error,
    marginBottom: 4,
  },
  errorMessage: {
    fontSize: 13,
    color: theme.colors.textLight,
    textAlign: 'center',
    marginBottom: 12,
  },
  studentErrorTag: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  studentErrorText: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  retryButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: theme.borderRadius.md,
    elevation: 2,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    color: theme.colors.textLight,
    textAlign: 'center',
    marginBottom: 16,
  },
  resetButton: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  resetButtonText: {
    color: theme.colors.primary,
    fontWeight: '600',
    fontSize: 13,
  },
});
