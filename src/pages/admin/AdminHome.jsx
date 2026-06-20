import { useState, useEffect } from "react";
import {
  ShoppingBag,
  DollarSign,
  UtensilsCrossed,
  LayoutDashboard,
} from "lucide-react";
import API from "../../api/axios";

export default function AdminHome() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalFoods: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const ordersRes = await API.get("/order/allOrder");
        const foodsRes = await API.get("/food/all");

        const orders = ordersRes.data;
        const totalRevenue = orders
          .filter((o) => o.paymentStatus === "paid")
          .reduce((sum, o) => sum + o.totalAmount, 0);

        setStats({
          totalOrders: orders.length,
          totalRevenue,
          totalFoods: foodsRes.data.length,
        });
      } catch (err) {
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const cards = [
    {
      label: "Total Orders",
      value: stats.totalOrders,
      icon: ShoppingBag,
      color: "text-brand bg-brand/10",
    },
    {
      label: "Total Revenue",
      value: `৳${stats.totalRevenue}`,
      icon: DollarSign,
      color: "text-accent bg-accent/10",
    },
    {
      label: "Food Items",
      value: stats.totalFoods,
      icon: UtensilsCrossed,
      color: "text-blue-500 bg-blue-500/10",
    },
  ];

  if (loading) {
    return <p className="text-muted font-bold">Loading stats...</p>;
  }

  return (
    <div>
     
      <h2 className="text-xl font-black text-text-main mb-6">Admin Overview</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="bg-card-bg border border-card-border rounded-2xl p-5 hover:border-brand/30 hover:-translate-y-1 transition-all duration-300"
          >
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3 ${card.color}`}
            >
              <card.icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-black text-text-main">{card.value}</p>
            <p className="text-sm text-muted">{card.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
