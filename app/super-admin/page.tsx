"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Puzzle, ShoppingBag, UtensilsCrossed } from "lucide-react";
import { getAllOrders } from "@/lib/api/orders";
import { getFoods } from "@/lib/api/food";
import { useRestaurant } from "@/context/RestaurantContext";
import Button from "@/components/common/Button";

export default function SuperAdminHome() {
  const { config } = useRestaurant();
  const [ordersCount, setOrdersCount] = useState(0);
  const [foodsCount, setFoodsCount] = useState(0);

  useEffect(() => {
    getAllOrders().then((o) => setOrdersCount(o.length));
    getFoods().then((f) => setFoodsCount(f.length));
  }, []);

  return (
    <div>
      <h2 className="text-xl font-black text-text-main mb-1">Owner Overview — {config.name}</h2>
      <p className="text-sm text-muted mb-6">
        Mode: <span className="font-bold text-brand">{config.operationMode}</span> • {config.modules.length} modules on
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-card-bg border border-card-border rounded-2xl p-5">
          <Puzzle className="w-6 h-6 text-brand mb-2" />
          <p className="text-2xl font-black">{config.modules.length}</p>
          <p className="text-sm text-muted">Modules enabled</p>
        </div>
        <div className="bg-card-bg border border-card-border rounded-2xl p-5">
          <ShoppingBag className="w-6 h-6 text-accent mb-2" />
          <p className="text-2xl font-black">{ordersCount}</p>
          <p className="text-sm text-muted">Total Orders</p>
        </div>
        <div className="bg-card-bg border border-card-border rounded-2xl p-5">
          <UtensilsCrossed className="w-6 h-6 text-blue-500 mb-2" />
          <p className="text-2xl font-black">{foodsCount}</p>
          <p className="text-sm text-muted">Food Items</p>
        </div>
      </div>
      <Link href="/super-admin/settings">
        <Button variant="primary">Open Feature Settings</Button>
      </Link>
    </div>
  );
}
