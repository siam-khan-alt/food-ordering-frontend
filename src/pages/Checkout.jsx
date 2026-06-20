import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";
import Button from "../components/common/Button";
import { showError } from "../components/common/Toast";
import { CreditCard } from "lucide-react";

export default function Checkout() {
  const { cartItems, totalAmount, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
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

      const orderRes = await API.post("/order/create", { items: orderItems });
      const order = orderRes.data.order;

      const hashRes = await API.post("/payment/generate-hash", {
        orderId: order._id,
        amount: totalAmount,
        currency: "LKR",
      });

      const { merchantId, hash, amount, currency } = hashRes.data;

      const payment = {
        sandbox: true,
        merchant_id: merchantId,
        return_url: `${window.location.origin}/order-confirmation/${order._id}`,
        cancel_url: `${window.location.origin}/checkout`,

        notify_url: `${import.meta.env.VITE_BACKEND_URL}/api/payment/notify`,
        order_id: order._id,
        items: "Food Order - BiteBox",
        amount: amount,
        currency: currency,
        hash: hash,
        first_name: user?.name?.split(" ")[0] || "Customer",
        last_name: user?.name?.split(" ")[1] || "Customer",
        email: user?.email || "customer@example.com",
        phone: "0770000000",
        address: "Dhaka",
        city: "Dhaka",
        country: "Bangladesh",
      };

      window.payhere.onCompleted = function () {
        clearCart();
        navigate(`/order-confirmation/${order._id}`);
      };

      window.payhere.onDismissed = function () {
        showError("Payment was cancelled");
        setLoading(false);
      };

      window.payhere.onError = function () {
        showError("Payment failed. Please try again.");
        setLoading(false);
      };

      window.payhere.startPayment(payment);
    } catch (err) {
      showError(err.response?.data?.message || "Checkout failed");
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-10 max-w-2xl">
      <h1 className="text-3xl font-black text-text-main mb-8 text-center">
        Complete Your <span className="text-brand">Payment</span>
      </h1>

      <div className="bg-card-bg border border-card-border rounded-2xl p-6 mb-6">
        <h3 className="font-black text-text-main mb-4">Order Summary</h3>
        {cartItems.map((item) => (
          <div
            key={item._id}
            className="flex justify-between text-sm py-1.5 text-muted"
          >
            <span>
              {item.name} x{item.quantity}
            </span>
            <span className="font-bold text-text-main">
              ৳{item.price * item.quantity}
            </span>
          </div>
        ))}
        <div className="border-t border-card-border mt-4 pt-4 flex justify-between font-black text-xl text-text-main">
          <span>Total</span>
          <span className="text-brand">৳{totalAmount}</span>
        </div>
      </div>

      <Button
        variant="primary"
        className="w-full justify-center"
        icon={<CreditCard className="w-4 h-4" />}
        onClick={handlePayment}
        disabled={loading}
      >
        {loading ? "Processing..." : "Pay with PayHere"}
      </Button>
    </div>
  );
}
