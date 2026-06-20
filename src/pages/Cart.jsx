import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {  Sparkles } from "lucide-react";
import API from "../api/axios";
import FoodCard from "../components/food/FoodCard";
import CartItem from "../components/cart/CartItem";
import CartSummary from "../components/cart/CartSummary";
import Button from "../components/common/Button";
import { showSuccess, showError } from "../components/common/Toast";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [suggestedFoods, setSuggestedFoods] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadCart = () => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      setCartItems(cart);
    };

    const fetchSuggestions = async () => {
      try {
        const res = await API.get("/food/all");
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        const cartIds = cart.map((item) => item._id);
        setSuggestedFoods(res.data.filter((food) => !cartIds.includes(food._id)).slice(0, 4));
      } catch (err) {
        console.error(err.message);
      }
    };

    loadCart();
    fetchSuggestions();
  }, []);

  const updateQuantity = (foodId, change) => {
    const updatedCart = cartItems
      .map((item) => (item._id === foodId ? { ...item, quantity: item.quantity + change } : item))
      .filter((item) => item.quantity > 0);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const removeItem = (foodId) => {
    const updatedCart = cartItems.filter((item) => item._id !== foodId);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    showSuccess("Item removed from cart");
  };

  const handleAddSuggested = (food) => {
    const updatedCart = [...cartItems, { ...food, quantity: 1 }];
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setSuggestedFoods(suggestedFoods.filter((f) => f._id !== food._id));
    showSuccess(`${food.name} added to cart!`);
  };

  const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      showError("Your cart is empty");
      return;
    }
    navigate("/checkout");
  };

  if (cartItems.length === 0) {
    return (
      
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6 py-10 relative overflow-hidden">
        <div className="absolute top-[5%] left-[8%] w-[250px] h-[250px] bg-brand/10 rounded-full blur-[100px] -z-10 pointer-events-none" />
        <div className="absolute bottom-[10%] right-[8%] w-[300px] h-[300px] bg-accent/10 rounded-full blur-[100px] -z-10 pointer-events-none" />

        <div className="relative w-full max-w-[400px] h-[180px] flex items-center justify-center mb-2 select-none">
          <img src="/hero-pizza.png" alt="" className="absolute left-4 w-28 h-28 object-contain opacity-80 -rotate-12 drop-shadow-xl" />
          <img src="/hero-burger.png" alt="" className="absolute z-10 w-36 h-36 object-contain drop-shadow-2xl" />
          <img src="/hero-cake.png" alt="" className="absolute right-4 w-28 h-28 object-contain opacity-80 rotate-12 drop-shadow-xl" />
        </div>

        <h2 className="text-2xl font-black text-text-main mb-2">Your cart is empty</h2>
        <p className="text-muted mb-6">Looks like you haven't added anything yet.</p>
        <Button variant="primary" onClick={() => navigate("/menu")}>Browse Menu</Button>

        {suggestedFoods.length > 0 && (
          <div className="mt-14 container mx-auto px-6 lg:px-16">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Sparkles className="w-5 h-5 text-brand" />
              <h3 className="text-xl font-black text-text-main">
                Popular <span className="text-brand">Picks Just For You</span>
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {suggestedFoods.map((food) => (
                <FoodCard key={food._id} food={food} onAddToCart={handleAddSuggested} />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 lg:px-16 py-10 relative">
      <div className="absolute top-[5%] right-[5%] w-[350px] h-[350px] bg-brand/8 rounded-full blur-[120px] -z-10 pointer-events-none" />

      <div className="flex items-center gap-3 mb-8">
        <h1 className="text-3xl font-black text-text-main">
          Your <span className="text-brand">Cart</span>
        </h1>
        <span className="bg-brand/10 text-brand text-xs font-black px-3 py-1 rounded-full border border-brand/20">
          {totalItems} {totalItems === 1 ? "item" : "items"}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <CartItem
              key={item._id}
              item={item}
              onUpdateQuantity={updateQuantity}
              onRemove={removeItem}
            />
          ))}

          {suggestedFoods.length > 0 && (
            <div className="mt-10 bg-gradient-to-br from-brand/5 to-transparent border border-dashed border-brand/30 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-4 h-4 text-brand" />
                <h3 className="text-sm font-black text-text-main uppercase tracking-wide">
                  Hungry for more? <span className="text-brand">Add these too!</span>
                </h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {suggestedFoods.map((food) => (
                  <FoodCard key={food._id} food={food} onAddToCart={handleAddSuggested} />
                ))}
              </div>
            </div>
          )}
        </div>

        <CartSummary cartItems={cartItems} totalAmount={totalAmount} onCheckout={handleCheckout} />

      </div>
    </div>
  );
}