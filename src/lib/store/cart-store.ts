"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@prisma/client";

export type CartProductInput = Pick<
  Product,
  "id" | "name" | "slug" | "price" | "originalPrice" | "image" | "stock"
>;

export interface CartLine {
  productId: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number | null;
  image: string;
  quantity: number;
  color?: string;
  storage?: string;
  stock: number;
}

interface CartState {
  items: CartLine[];
  isOpen: boolean;
  addItem: (product: CartProductInput, quantity?: number, color?: string, storage?: string) => void;
  removeItem: (productId: string, color?: string, storage?: string) => void;
  updateQuantity: (productId: string, quantity: number, color?: string, storage?: string) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  getTotals: () => { subtotal: number; count: number };
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      addItem: (product, quantity = 1, color, storage) => {
        set((state) => {
          const existing = state.items.find(
            (i) => i.productId === product.id && i.color === color && i.storage === storage
          );

          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === product.id && i.color === color && i.storage === storage
                  ? { ...i, quantity: Math.min(i.quantity + quantity, product.stock) }
                  : i
              ),
            };
          }

          return {
            items: [
              ...state.items,
              {
                productId: product.id,
                name: product.name,
                slug: product.slug,
                price: product.price,
                originalPrice: product.originalPrice,
                image: product.image,
                quantity: Math.min(quantity, product.stock),
                color,
                storage,
                stock: product.stock,
              },
            ],
          };
        });
      },
      removeItem: (productId, color, storage) => {
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.productId === productId && i.color === color && i.storage === storage)
          ),
        }));
      },
      updateQuantity: (productId, quantity, color, storage) => {
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId && i.color === color && i.storage === storage
              ? { ...i, quantity: Math.max(1, Math.min(quantity, i.stock)) }
              : i
          ),
        }));
      },
      clearCart: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      getTotals: () => {
        const { items } = get();
        return {
          subtotal: items.reduce((sum, i) => sum + i.price * i.quantity, 0),
          count: items.reduce((sum, i) => sum + i.quantity, 0),
        };
      },
    }),
    {
      name: "mobile-center-cart",
    }
  )
);