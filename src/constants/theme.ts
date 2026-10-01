export const theme = {
  colors: {
    primary: '#1D4ED8',      // Nút, tab chọn, giá
    secondary: '#F97316',    // Badge giỏ, phí ship
    background: '#EFF6FF',   // Nền sáng
    surface: '#FFFFFF',      // Card
    text: '#1E3A8A',         // Chữ tiêu đề / chính
    textLight: '#64748B',    // Chữ phụ / mô tả
    border: '#BFDBFE',       // Viền thẻ
    error: '#DC2626',        // Lỗi
    success: '#16A34A',      // Thành công
    surfaceAlt: '#F1F5F9',
    muted: '#94A3B8',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
  },
  borderRadius: {
    sm: 6,
    md: 10,
    lg: 14,
    xl: 18,
    full: 9999,
  },
  typography: {
    title: {
      fontSize: 20,
      fontWeight: '700' as const,
      color: '#1E3A8A',
    },
    subtitle: {
      fontSize: 14,
      fontWeight: '500' as const,
      color: '#64748B',
    },
    body: {
      fontSize: 14,
      color: '#1E3A8A',
    },
    caption: {
      fontSize: 12,
      color: '#64748B',
    },
    price: {
      fontSize: 16,
      fontWeight: '700' as const,
      color: '#1D4ED8',
    },
  },
  shadow: {
    card: {
      shadowColor: '#1D4ED8',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 6,
      elevation: 3,
    },
  },
} as const;
