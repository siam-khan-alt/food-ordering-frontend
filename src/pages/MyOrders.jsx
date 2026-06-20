import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Package, ShoppingBag } from "lucide-react";
import API from "../api/axios";
import Button from "../components/common/Button";

const statusColors = {
  placed: "bg-amber-500/10 text-amber-500 border-amber-500/30",
  preparing: "bg-blue-500/10 text-blue-500 border-blue-500/30",
  delivered: "bg-accent/10 text-accent border-accent/30",
  cancelled: "bg-red-500/10 text-red-500 border-red-500/30"
};

const paymentColors = {
  pending: "text-amber-500",
  paid: "text-accent",
  failed: "text-red-500"
};

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await API.get("/order/myOrder");
        setOrders(res.data.reverse());
      } catch (err) {
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-muted font-bold">Loading your orders...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
        <Package className="w-16 h-16 text-muted mb-4" />
        <h2 className="text-2xl font-black text-text-main mb-2">No orders yet</h2>
        <p className="text-muted mb-6">Your order history will show up here.</p>
        <Link to="/menu">
          <Button variant="primary">Browse Menu</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 lg:px-16 py-10">
      <h1 className="text-3xl font-black text-text-main mb-8">
        My <span className="text-brand">Orders</span>
      </h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-card-bg border border-card-border rounded-2xl p-5"
          >
            <div className="flex flex-wrap justify-between items-start gap-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand/10 rounded-xl flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-brand" />
                </div>
                <div>
                  <p className="font-black text-text-main">#{order._id.slice(-8)}</p>
                  <p className="text-xs text-muted">
                    {new Date(order.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric"
                    })}
                  </p>
                </div>
              </div>

              <span
                className={`text-xs font-black px-3 py-1.5 rounded-full border ${statusColors[order.orderStatus]}`}
              >
                {order.orderStatus.toUpperCase()}
              </span>
            </div>

            <div className="space-y-1.5 mb-4 pb-4 border-b border-card-border">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm text-muted">
                  <span>{item.foodItem?.name || "Item"} x{item.quantity}</span>
                  <span>৳{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center">
              <span className={`text-xs font-bold ${paymentColors[order.paymentStatus]}`}>
                Payment: {order.paymentStatus.toUpperCase()}
              </span>
              <span className="font-black text-text-main">
                Total: <span className="text-brand">৳{order.totalAmount}</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}