"use client";

import { useState, useEffect } from "react";
import { getFoods } from "@/lib/api/food";
import { createOrder } from "@/lib/api/orders";
import { occupyTable } from "@/lib/qr";
import { useRestaurant } from "@/context/RestaurantContext";
import { canAccess } from "@/lib/restaurant";
import type { Food } from "@/types";
import Button from "@/components/common/Button";
import { showSuccess, showError } from "@/components/common/Toast";
import { Plus, Trash2 } from "lucide-react";

export default function POSPage() {
  const { config } = useRestaurant();
  const [foods, setFoods] = useState<Food[]>([]);
  const [cart, setCart] = useState<(Food & { quantity: number })[]>([]);
  const [tableNo, setTableNo] = useState("T1");
  const [customerPhone, setCustomerPhone] = useState("");
  const [payment, setPayment] = useState<"cash" | "card">("cash");

  useEffect(() => {
    getFoods().then(setFoods);
  }, []);

  if (!canAccess(config, "pos")) {
    return <div className="p-6 text-center text-muted">POS disabled for {config.name} ({config.operationMode})</div>;
  }

  const addToCart = (f: Food) => {
    setCart((prev) => {
      const ex = prev.find((x) => x._id === f._id);
      if (ex) return prev.map((x) => (x._id === f._id ? { ...x, quantity: x.quantity + 1 } : x));
      return [...prev, { ...f, quantity: 1 }];
    });
  };

  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);

  const handlePlace = async () => {
    if (cart.length === 0) return showError("Cart empty");
    const items = cart.map((i) => ({ foodItemId: i._id, quantity: i.quantity }));
    const customer = { _id: `pos_${Date.now()}`, name: `Walk-in ${customerPhone || tableNo}`, email: `${customerPhone || "walkin"}@pos.local` };
    try {
      const { order } = await createOrder(items, customer);
      // mark table occupied if table mode
      if (canAccess(config, "table")) occupyTable(tableNo);
      showSuccess(`Order ${order._id.slice(-8)} placed — Table ${tableNo} — ৳${total} ${payment}`);
      setCart([]);
    } catch (e) {
      showError((e as Error).message);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="flex-1">
        <h2 className="text-xl font-black mb-4">POS — Walk-in Order</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {foods.map((f) => (
            <button key={f._id} onClick={() => addToCart(f)} className="bg-card-bg border border-card-border rounded-xl p-3 text-left hover:border-brand/30">
              <img src={f.image} alt={f.name} className="w-full h-20 object-cover rounded-lg mb-2" />
              <p className="font-bold text-sm">{f.name}</p>
              <p className="text-brand font-black">৳{f.price}</p>
              <span className="text-xs bg-brand text-white px-2 py-1 rounded-full inline-flex items-center gap-1 mt-1">
                <Plus className="w-3 h-3" /> Add
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="w-full lg:w-80 bg-card-bg border border-card-border rounded-2xl p-5 h-fit sticky top-24">
        <h3 className="font-black mb-3">Cart ({cart.length})</h3>
        <div className="space-y-2 mb-4 max-h-40 overflow-y-auto">
          {cart.map((i) => (
            <div key={i._id} className="flex justify-between text-sm">
              <span>
                {i.name} x{i.quantity}
              </span>
              <span className="flex items-center gap-2">
                ৳{i.price * i.quantity}{" "}
                <button onClick={() => setCart((prev) => prev.filter((x) => x._id !== i._id))} className="text-red-500">
                  <Trash2 className="w-3 h-3" />
                </button>
              </span>
            </div>
          ))}
        </div>

        <div className="space-y-3 mb-4">
          <select value={tableNo} onChange={(e) => setTableNo(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-card-border bg-bg-main text-sm">
            {Array.from({ length: 12 }, (_, i) => `T${i + 1}`).map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <input placeholder="Customer Phone (optional)" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-card-border bg-bg-main text-sm" />
          <div className="flex gap-2">
            <button onClick={() => setPayment("cash")} className={`flex-1 py-2 rounded-xl font-bold text-xs border ${payment === "cash" ? "bg-brand text-white border-brand" : "bg-bg-main border-card-border"}`}>
              Cash
            </button>
            <button onClick={() => setPayment("card")} className={`flex-1 py-2 rounded-xl font-bold text-xs border ${payment === "card" ? "bg-brand text-white border-brand" : "bg-bg-main border-card-border"}`}>
              Card
            </button>
          </div>
        </div>

        <div className="flex justify-between font-black text-lg mb-4">
          <span>Total</span>
          <span className="text-brand">৳{total}</span>
        </div>

        <Button variant="primary" className="w-full justify-center" onClick={handlePlace}>
          Place Order — {payment === "cash" ? "Cash" : "Card"}
        </Button>
        <p className="text-xs text-muted mt-2 text-center">Bill prints after placement (mock). Future: Django + PostgreSQL + thermal printer.</p>
      </div>
    </div>
  );
}
