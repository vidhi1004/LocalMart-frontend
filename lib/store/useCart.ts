import { CartItem } from "@/app/user/components/cartComponent/CartComponent";
import { create } from "zustand";

export const useCartStore = create((set) => ({
  cart:
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("cart") || "[]")
      : [],

  addToCart: (item: CartItem) =>
    set((state: any) => {
      const exists = state.cart.find(
        (i: any) => i.productVariantId === item.productVariantId,
      );
      let updatedCart;

      if (exists) {
        updatedCart = state.cart.map((i) =>
          i.productVariantId === item.productVariantId
            ? { ...i, quantity: i.quantity + 1 }
            : i,
        );
      } else {
        updatedCart = [...state.cart, item];
      }

      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return { cart: updatedCart };
    }),

  removeFromCart: (productVariantId: any) =>
    set((state: any) => {
      const updatedCart = state.cart.filter(
        (item: any) => item.productVariantId !== productVariantId,
      );
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return { cart: updatedCart };
    }),

  increaseQuantity: (id: any) =>
    set((state: any) => {
      const updated = state.cart.map((i) =>
        i.productVariantId === id ? { ...i, quantity: i.quantity + 1 } : i,
      );
      localStorage.setItem("cart", JSON.stringify(updated));
      return { cart: updated };
    }),

  decreaseQuantity: (id: any) =>
    set((state: any) => {
      const updated = state.cart
        .map((i: any) =>
          i.productVariantId === id ? { ...i, quantity: i.quantity - 1 } : i,
        )
        .filter((i: any) => i.quantity > 0);
      localStorage.setItem("cart", JSON.stringify(updated));
      return { cart: updated };
    }),
}));
