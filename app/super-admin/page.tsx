"use client";

import { useEffect, useState } from "react";
import { Building2, Users, ShoppingBag } from "lucide-react";
import { getTenants } from "@/lib/api/tenant";
import { getAllOrders } from "@/lib/api/orders";
import type { Tenant } from "@/types";

export default function SuperAdminHome() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [ordersCount, setOrdersCount] = useState(0);

  useEffect(() => {
    getTenants().then(setTenants);
    getAllOrders().then((o) => setOrdersCount(o.length));
  }, []);

  const active = tenants.filter((t) => t.status === "active").length;

  return (
    <div>
      <h2 className="text-xl font-black text-text-main mb-6">Platform Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card-bg border border-card-border rounded-2xl p-5">
          <Building2 className="w-6 h-6 text-brand mb-2" />
          <p className="text-2xl font-black">{tenants.length}</p>
          <p className="text-sm text-muted">Total Tenants ({active} active)</p>
        </div>
        <div className="bg-card-bg border border-card-border rounded-2xl p-5">
          <ShoppingBag className="w-6 h-6 text-accent mb-2" />
          <p className="text-2xl font-black">{ordersCount}</p>
          <p className="text-sm text-muted">Total Orders (mock)</p>
        </div>
        <div className="bg-card-bg border border-card-border rounded-2xl p-5">
          <Users className="w-6 h-6 text-blue-500 mb-2" />
          <p className="text-2xl font-black">3</p>
          <p className="text-sm text-muted">Operation Modes</p>
        </div>
      </div>
    </div>
  );
}
