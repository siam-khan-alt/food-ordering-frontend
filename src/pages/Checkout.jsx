import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";
import Button from "../components/common/Button";
import { showError } from "../components/common/Toast";
import { CreditCard } from "lucide-react";
import { loadPayHereScript, buildCustomerDetails } from "../utils/payhere";

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
      const payhere = await loadPayHereScript();

      const orderItems = cartItems.map((item) => ({
        foodItemId: item._id,
        quantity: item.quantity,
      }));

      const orderRes = await API.post("/order/create", { items: orderItems });
      const order = orderRes.data.order;

      const hashRes = await API.post("/payment/generate-hash", {
        orderId: String(order._id),
        amount: order.totalAmount,
        currency: "LKR",
      });

      const { merchantId, hash, orderId, amount, currency } = hashRes.data;
      const customer = buildCustomerDetails(user);

      const payment = {
        sandbox: true,
        merchant_id: String(merchantId),
        return_url: undefined,
        cancel_url: undefined,
        notify_url: `${import.meta.env.VITE_BACKEND_URL}/payment/notify`,
        order_id: String(orderId),
        items: "Food Order - BiteBox",
        amount: String(amount),
        currency: String(currency).toUpperCase(),
        hash: String(hash),
        first_name: customer.first_name,
        last_name: customer.last_name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
        city: customer.city,
        country: customer.country,
      };

      payhere.onCompleted = function () {
        clearCart();
        navigate(`/order-confirmation/${order._id}`);
      };

      payhere.onDismissed = function () {
        showError("Payment was cancelled");
        setLoading(false);
      };

      payhere.onError = function (error) {
        console.error("PayHere error:", error);
        showError(
          typeof error === "string"
            ? error
            : "Payment failed. Please try again."
        );
        setLoading(false);
      };

      payhere.startPayment(payment);
    } catch (err) {
      console.error("Checkout error:", err);
      showError(
        err.response?.data?.message || err.message || "Checkout failed"
      );
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
