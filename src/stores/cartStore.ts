import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { safeStorage } from '../utils/safeStorage';
import { STUDENT, PRICE_MULTIPLIER } from '@constants/student';
import { Product } from '@services/productApi';

export interface CartItem {
  id: number;
  title: string;
  price: number; // Converted price in VND
  originalPrice: number; // Raw USD price from FakeStore
  image: string;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: number) => void;
  changeQty: (productId: number, delta: number) => void;
  clearCart: () => void;
  totalQuantity: () => number;
  totalAmount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product: Product) => {
        const convertedPrice =
          product.price > 1000
            ? Math.round(product.price)
            : Math.round(product.price * PRICE_MULTIPLIER);
        set((state) => {
          const existingIndex = state.items.findIndex((i) => i.id === product.id);
          if (existingIndex > -1) {
            const updated = [...state.items];
            updated[existingIndex].quantity += 1;
            return { items: updated };
          }
          return {
            items: [
              ...state.items,
              {
                id: product.id,
                title: product.title,
                price: convertedPrice,
                originalPrice: product.price,
                image: product.image,
                quantity: 1,
              },
            ],
          };
        });
      },

      removeItem: (productId: number) => {
        set((state) => ({
          items: state.items.filter((i) => i.id !== productId),
        }));
      },

      changeQty: (productId: number, delta: number) => {
        set((state) => {
          const updated = state.items
            .map((item) => {
              if (item.id === productId) {
                const newQty = item.quantity + delta;
                return newQty > 0 ? { ...item, quantity: newQty } : null;
              }
              return item;
            })
            .filter((item): item is CartItem => item !== null);

          return { items: updated };
        });
      },

      clearCart: () => {
        set({ items: [] });
      },

      totalQuantity: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      totalAmount: () => {
        return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },
    }),
    {
      name: `ktxgo-cart-${STUDENT.mssv}`,
      storage: createJSONStorage(() => safeStorage),
    }
  )
);
