"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingBag, DollarSign, UtensilsCrossed, Wallet, Calculator } from "lucide-react";
import { getAllOrders } from "@/lib/api/orders";
import { getExpenses } from "@/lib/api/expenses";
import Button from "@/components/common/Button";

export default function AdminHome() {
  const [stats, setStats] = useState({ totalOrders: 0, totalRevenue: 0, totalFoods: 0, todayRevenue: 0, todayExpense: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [orders, foods, expenses] = await Promise.all([
          getAllOrders(),
          (await import("@/lib/api/food")).getFoods(),
          getExpenses(),
        ]);
        const today = new Date().toISOString().slice(0, 10);
        const totalRevenue = orders.filter((o) => o.paymentStatus === "paid").reduce((sum, o) => sum + o.totalAmount, 0);
        const todayRevenue = orders.filter((o) => o.paymentStatus === "paid" && o.createdAt.slice(0, 10) === today).reduce((s, o) => s + o.totalAmount, 0);
        const todayExpense = expenses.filter((e) => e.date === today).reduce((s, e) => s + e.amount, 0);
        setStats({ totalOrders: orders.length, totalRevenue, totalFoods: foods.length, todayRevenue, todayExpense });
      } catch (err) {
        console.error((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    { label: "Ajker sale", value: `৳${stats.todayRevenue}`, icon: DollarSign, color: "text-brand bg-brand/10" },
    { label: "Ajker khoroc", value: `৳${stats.todayExpense}`, icon: Wallet, color: "text-red-500 bg-red-500/10" },
    { label: "Ajker cash", value: `৳${stats.todayRevenue - stats.todayExpense}`, icon: Calculator, color: "text-accent bg-accent/10" },
    { label: "Total Orders", value: stats.totalOrders, icon: ShoppingBag, color: "text-brand bg-brand/10" },
    { label: "Total Revenue", value: `৳${stats.totalRevenue}`, icon: DollarSign, color: "text-accent bg-accent/10" },
    { label: "Food Items", value: stats.totalFoods, icon: UtensilsCrossed, color: "text-blue-500 bg-blue-500/10" },
  ];

  if (loading) return <p className="text-muted font-bold">Loading stats...</p>;

  return (
    <div>
      <div className="flex flex-wrap gap-3 justify-between items-center mb-6">
        <h2 className="text-xl font-black text-text-main">Admin Overview</h2>
        <Link href="/admin/hisab">
          <Button variant="primary" className="text-xs">Full Hisab dekhun</Button>
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {cards.map((card) => (
          <div key={card.label} className="bg-card-bg border border-card-border rounded-2xl p-5 hover:border-brand/30 hover:-translate-y-1 transition-all duration-300">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3 ${card.color}`}>
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
