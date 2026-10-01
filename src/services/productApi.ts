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

export const FALLBACK_PRODUCTS: Product[] = [
  {
    id: 1,
    title: 'Balo KTXGo Fjallraven Laptop 15"',
    price: 109.95,
    description: 'Balo chống nước, ngăn đựng laptop 15 inch cho sinh viên nội trú ký túc xá',
    category: 'Văn phòng phẩm',
    image: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg',
    rating: { rate: 4.5, count: 120 },
  },
  {
    id: 2,
    title: 'Áo Thun Sinh Viên KTX Slim Fit',
    price: 22.3,
    description: 'Chất liệu thun cotton 100% thoáng mát mùa hè trong khuôn viên KTX',
    category: 'Thời trang',
    image: 'https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg',
    rating: { rate: 4.1, count: 259 },
  },
  {
    id: 3,
    title: 'Áo Khoác Gió Nam KTXGo 2 Lớp',
    price: 55.99,
    description: 'Áo khoác dù 2 lớp chống gió, giữ ấm cho sinh viên đi học ca tối',
    category: 'Thời trang',
    image: 'https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg',
    rating: { rate: 4.7, count: 500 },
  },
  {
    id: 4,
    title: 'Áo Thể Thao Nam Tay Dài KTX',
    price: 15.99,
    description: 'Áo ôm body co giãn 4 chiều cho sinh viên tập gym, đá bóng KTX',
    category: 'Thời trang',
    image: 'https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_.jpg',
    rating: { rate: 3.9, count: 430 },
  },
  {
    id: 5,
    title: 'Vòng Tay Bạc Naga Dragon Chain',
    price: 695.0,
    description: 'Trang sức phong cách sang trọng nổi bật cho sinh viên thanh lịch',
    category: 'Phụ kiện',
    image: 'https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_.jpg',
    rating: { rate: 4.6, count: 400 },
  },
  {
    id: 6,
    title: 'Nhẫn Micropave Mạ Vàng Cao Cấp',
    price: 168.0,
    description: 'Chất liệu hợp kim cao cấp đính đá lấp lánh thời trang',
    category: 'Phụ kiện',
    image: 'https://fakestoreapi.com/img/61sbMiUnoGL._AC_UL640_QL65_ML3_.jpg',
    rating: { rate: 3.9, count: 70 },
  },
  {
    id: 7,
    title: 'Nhẫn Đính Đá Trắng White Gold Princess',
    price: 9.99,
    description: 'Món quà tặng ý nghĩa dịp sinh nhật bạn bè cùng phòng ký túc xá',
    category: 'Phụ kiện',
    image: 'https://fakestoreapi.com/img/71YAIFU48IL._AC_UL640_QL65_ML3_.jpg',
    rating: { rate: 3.0, count: 400 },
  },
  {
    id: 8,
    title: 'Bông Tai Thép Không Gỉ Pierced Owl',
    price: 10.99,
    description: 'Bông tai kiểu dáng cá tính, bền màu không kích ứng da',
    category: 'Phụ kiện',
    image: 'https://fakestoreapi.com/img/51UDEzMJVpL._AC_UL640_QL65_ML3_.jpg',
    rating: { rate: 1.9, count: 100 },
  },
  {
    id: 9,
    title: 'Ổ Cứng Di Động WD Elements 2TB USB 3.0',
    price: 64.0,
    description: 'Lưu trữ tài liệu học tập, đồ án tốt nghiệp công nghệ thông tin',
    category: 'Điện tử',
    image: 'https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_.jpg',
    rating: { rate: 3.3, count: 203 },
  },
  {
    id: 10,
    title: 'Ổ Cứng SSD SanDisk PLUS 1TB SATA III',
    price: 109.0,
    description: 'Tăng tốc khởi động và xử lý tác vụ cho laptop sinh viên',
    category: 'Điện tử',
    image: 'https://fakestoreapi.com/img/61U7T1koQqL._AC_SX679_.jpg',
    rating: { rate: 2.9, count: 470 },
  },
  {
    id: 11,
    title: 'Ổ SSD Silicon Power 256GB 3D NAND',
    price: 109.0,
    description: 'Tốc độ đọc ghi ổn định, giá thành tiết kiệm cho học sinh sinh viên',
    category: 'Điện tử',
    image: 'https://fakestoreapi.com/img/71kWymZ+c+L._AC_SX679_.jpg',
    rating: { rate: 4.8, count: 319 },
  },
  {
    id: 12,
    title: 'Ổ Cứng Gaming WD 4TB Chơi Game PS4',
    price: 114.0,
    description: 'Dung lượng cực lớn giải trí game và phim ảnh sau giờ học',
    category: 'Điện tử',
    image: 'https://fakestoreapi.com/img/61mtL65D4cL._AC_SX679_.jpg',
    rating: { rate: 4.8, count: 400 },
  },
];

export const productApi = {
  getProducts: async (limit: number = 12): Promise<Product[]> => {
    try {
      const response = await apiClient.get<Product[]>(`/products?limit=${limit}`);
      if (Array.isArray(response.data) && response.data.length > 0) {
        return response.data;
      }
      return FALLBACK_PRODUCTS.slice(0, limit);
    } catch {
      return FALLBACK_PRODUCTS.slice(0, limit);
    }
  },

  getProductById: async (id: number | string): Promise<Product> => {
    try {
      const response = await apiClient.get<Product>(`/products/${id}`);
      if (response.data) {
        return response.data;
      }
    } catch {
      // fallback
    }
    const found = FALLBACK_PRODUCTS.find((p) => p.id === Number(id));
    if (found) return found;
    return FALLBACK_PRODUCTS[0];
  },
};
