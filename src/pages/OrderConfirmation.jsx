import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { CheckCircle, Home, FileText } from "lucide-react";
import API from "../api/axios";
import Button from "../components/common/Button";

export default function OrderConfirmation() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await API.get(`/order/single/${orderId}`);
        setOrder(res.data);
      } catch (err) {
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-muted font-bold">Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-muted font-bold">Order not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-lg bg-card-bg border border-card-border rounded-2xl p-8 text-center shadow-xl">

        <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-5">
          <CheckCircle className="w-10 h-10 text-accent" />
        </div>

        <h2 className="text-2xl font-black text-text-main mb-2">Order Confirmed!</h2>
        <p className="text-muted mb-6">
          Thank you for your order. Your delicious food is on its way!
        </p>

        <div className="bg-bg-main rounded-xl p-4 text-left space-y-2 mb-6">
          <div className="flex justify-between text-sm">
            <span className="text-muted">Order ID</span>
            <span className="font-bold text-text-main">#{order._id.slice(-8)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted">Payment Status</span>
            <span className={`font-bold ${order.paymentStatus === "paid" ? "text-accent" : "text-amber-500"}`}>
              {order.paymentStatus.toUpperCase()}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted">Order Status</span>
            <span className="font-bold text-brand">{order.orderStatus.toUpperCase()}</span>
          </div>
          <div className="border-t border-card-border pt-2 flex justify-between font-black text-text-main">
            <span>Total</span>
            <span className="text-brand">৳{order.totalAmount}</span>
          </div>
        </div>

        <div className="flex gap-3">
          <Link to="/" className="flex-1">
            <Button variant="secondary" className="w-full justify-center" icon={<Home className="w-4 h-4" />}>
              Home
            </Button>
          </Link>
          <Link to="/my-orders" className="flex-1">
            <Button variant="primary" className="w-full justify-center" icon={<FileText className="w-4 h-4" />}>
              My Orders
            </Button>
          </Link>
        </div>

      </div>
    </div>
  );
}