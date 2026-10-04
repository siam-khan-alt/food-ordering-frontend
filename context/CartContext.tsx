"use client";

import { createContext, useContext, useState, useEffect } from "react";
import type { Food } from "@/types";

export type CartItem = Food & { quantity: number };

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (food: Food) => void;
  updateQuantity: (foodId: string, change: number) => void;
  removeFromCart: (foodId: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalAmount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("cart");
    if (saved) {
      try {
        setCartItems(JSON.parse(saved));
      } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (food: Food) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item._id === food._id);
      if (existing) return prev.map((item) => (item._id === food._id ? { ...item, quantity: item.quantity + 1 } : item));
      return [...prev, { ...food, quantity: 1 }];
    });
  };

  const updateQuantity = (foodId: string, change: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => (item._id === foodId ? { ...item, quantity: item.quantity + change } : item))
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (foodId: string) => {
    setCartItems((prev) => prev.filter((item) => item._id !== foodId));
  };

  const clearCart = () => setCartItems([]);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, updateQuantity, removeFromCart, clearCart, totalItems, totalAmount }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
};
