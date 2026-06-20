import { useState, useEffect } from "react";
import { CartContext } from "./CartContext";

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (food) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item._id === food._id);
      if (existing) {
        return prev.map((item) =>
          item._id === food._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...food, quantity: 1 }];
    });
  };

  const updateQuantity = (foodId, change) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item._id === foodId ? { ...item, quantity: item.quantity + change } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (foodId) => {
    setCartItems((prev) => prev.filter((item) => item._id !== foodId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, updateQuantity, removeFromCart, clearCart, totalItems, totalAmount }}
    >
      {children}
    </CartContext.Provider>
  );
};