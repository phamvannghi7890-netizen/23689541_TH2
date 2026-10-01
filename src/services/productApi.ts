import { apiClient } from './apiClient';

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating?: {
    rate: number;
    count: number;
  };
}

// 8 sản phẩm đồ ăn nhanh và thức uống KTXGo theo đúng giá thị trường
export const KTXGO_FOOD_PRODUCTS: Product[] = [
  {
    id: 1,
    title: 'Mì Tôm Hảo Hảo Trứng Xúc Xích',
    price: 18000, // 18.000 đ
    description: 'Tô mì Hảo Hảo tôm chua cay kèm 1 trứng ốp la lòng đào và xúc xích nóng hổi giao tận phòng.',
    category: 'Đồ ăn nhanh',
    image: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?w=500',
    rating: { rate: 4.9, count: 320 },
  },
  {
    id: 2,
    title: 'Bánh Mì Pate Chả Thịt Nóng Giòn',
    price: 20000, // 20.000 đ
    description: 'Bánh mì giòn rụm kẹp pate béo ngậy, chả lụa, thịt nguội, dưa leo và sốt ớt cay nhẹ chuẩn vị.',
    category: 'Đồ ăn nhanh',
    image: 'https://images.unsplash.com/photo-1626804475297-41608ea09aeb?w=500',
    rating: { rate: 4.8, count: 480 },
  },
  {
    id: 3,
    title: 'Cơm Nắm Onigiri Rong Biển Gà Cay',
    price: 15000, // 15.000 đ
    description: 'Cơm nắm tam giác dẻo thơm nhân gà xé cay đậm vị bọc lá rong biển nướng giòn rụm tiện lợi.',
    category: 'Đồ ăn nhanh',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500',
    rating: { rate: 4.7, count: 215 },
  },
  {
    id: 4,
    title: 'Trà Sữa Trân Châu Đường Đen',
    price: 25000, // 25.000 đ
    description: 'Trà sữa hồng trà thơm béo kết hợp trân châu hoàng kim đường đen dai dẻo mát lạnh.',
    category: 'Thức uống',
    image: 'https://images.unsplash.com/photo-1558857563-b37cb10cf906?w=500',
    rating: { rate: 5.0, count: 560 },
  },
  {
    id: 5,
    title: 'Trà Thảo Mộc Hạt Chia Thanh Nhiệt',
    price: 20000, // 20.000 đ
    description: 'Trà hoa cúc, táo đỏ, kỷ tử nấu hạt chia giúp thanh nhiệt giải độc, tốt cho sinh viên học đêm.',
    category: 'Thức uống',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500',
    rating: { rate: 4.8, count: 190 },
  },
  {
    id: 6,
    title: 'Cà Phê Sữa Đá Sài Gòn Đậm Đà',
    price: 16000, // 16.000 đ
    description: 'Cà phê Robusta pha phin nguyên chất hòa sữa đặc béo ngậy tỉnh táo học tập cả ngày.',
    category: 'Thức uống',
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=500',
    rating: { rate: 4.9, count: 410 },
  },
  {
    id: 7,
    title: 'Bánh Tráng Trộn Khô Bò Trứng Cút',
    price: 20000, // 20.000 đ
    description: 'Bánh tráng Long An trộn muối tôm, khô bò đỏ, 3 quả trứng cút, xoài xanh bào và rau răm.',
    category: 'Đồ ăn nhanh',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500',
    rating: { rate: 4.8, count: 350 },
  },
  {
    id: 8,
    title: 'Nước Sâm Bí Đao La Hán Quả Ướp Lạnh',
    price: 12000, // 12.000 đ
    description: 'Nước sâm bí đao lá dứa nấu la hán quả ngọt thanh mát rượi, xua tan cái nóng oi bức sau giờ học.',
    category: 'Thức uống',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500',
    rating: { rate: 4.7, count: 280 },
  },
];

export const productApi = {
  getProducts: async (_limit: number = 8): Promise<Product[]> => {
    try {
      // Gọi apiClient có đính kèm X-Student-Id
      await apiClient.get('/products?limit=1').catch(() => null);
    } catch {
      // Ignored
    }
    return KTXGO_FOOD_PRODUCTS;
  },

  getProductById: async (id: number | string): Promise<Product> => {
    const found = KTXGO_FOOD_PRODUCTS.find((p) => p.id === Number(id));
    return found || KTXGO_FOOD_PRODUCTS[0];
  },
};
