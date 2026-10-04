"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { createOrder } from "@/lib/api/orders";
import { processDummyPayment } from "@/lib/payment/dummy";
import Button from "@/components/common/Button";
import { showError, showSuccess } from "@/components/common/Toast";
import { CreditCard } from "lucide-react";

export default function Checkout() {
  const { cartItems, totalAmount, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [method, setMethod] = useState<"dummy" | "cod">("dummy");

  const handlePayment = async () => {
    if (!user) {
      showError("Please login to checkout");
      router.push("/login");
      return;
    }
    if (cartItems.length === 0) {
      showError("Your cart is empty");
      return;
    }

    setLoading(true);
    try {
      const orderItems = cartItems.map((item) => ({
        foodItemId: item._id,
        quantity: item.quantity,
      }));

      const { order } = await createOrder(orderItems, { _id: user._id, name: user.name, email: user.email });

      await processDummyPayment({ orderId: order._id, amount: order.totalAmount, method });

      showSuccess(method === "cod" ? "Order placed! Pay on delivery." : "Payment successful! Order confirmed.");
      clearCart();
      router.push(`/order-confirmation/${order._id}`);
    } catch (err) {
      showError((err as Error).message || "Checkout failed");
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-10 max-w-2xl">
      <h1 className="text-3xl font-black text-text-main mb-8 text-center">
        Complete Your <span className="text-brand">Order</span>
      </h1>

      <div className="bg-card-bg border border-card-border rounded-2xl p-6 mb-6">
        <h3 className="font-black text-text-main mb-4">Order Summary</h3>
        {cartItems.map((item) => (
          <div key={item._id} className="flex justify-between text-sm py-1.5 text-muted">
            <span>{item.name} x{item.quantity}</span>
            <span className="font-bold text-text-main">৳{item.price * item.quantity}</span>
          </div>
        ))}
        <div className="border-t border-card-border mt-4 pt-4 flex justify-between font-black text-xl text-text-main">
          <span>Total</span>
          <span className="text-brand">৳{totalAmount}</span>
        </div>
      </div>

      <div className="bg-card-bg border border-card-border rounded-2xl p-6 mb-6">
        <h3 className="font-black text-text-main mb-3">Payment Method (Dummy)</h3>
        <div className="flex gap-3">
          <button
            onClick={() => setMethod("dummy")}
            className={`flex-1 py-3 rounded-xl font-bold border text-sm ${method === "dummy" ? "bg-brand text-white border-brand" : "bg-bg-main border-card-border text-text-main"}`}
          >
            Dummy Paid
          </button>
          <button
            onClick={() => setMethod("cod")}
            className={`flex-1 py-3 rounded-xl font-bold border text-sm ${method === "cod" ? "bg-brand text-white border-brand" : "bg-bg-main border-card-border text-text-main"}`}
          >
            Cash on Delivery
          </button>
        </div>
        <p className="text-xs text-muted mt-3">No real payment — order will be marked as {method === "cod" ? "pending" : "paid"} instantly. Future payment providers (Stripe, SSLCommerz) can be swapped in lib/payment/.</p>
      </div>

      <Button variant="primary" className="w-full justify-center" icon={<CreditCard className="w-4 h-4" />} onClick={handlePayment} disabled={loading}>
        {loading ? "Processing..." : method === "cod" ? "Place Order (COD)" : "Pay Now (Dummy)"}
      </Button>
    </div>
  );
}
