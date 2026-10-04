"use client";

import { useEffect, useState } from "react";
import { getAllOrders, updateOrderStatus } from "@/lib/api/orders";
import { useTenant } from "@/context/TenantContext";
import { canAccess } from "@/lib/tenancy";
import type { Order } from "@/types";
import Button from "@/components/common/Button";

export default function KitchenPage() {
  const { tenant } = useTenant();
  const [orders, setOrders] = useState<Order[]>([]);

  const fetch = async () => setOrders(await getAllOrders());

  useEffect(() => {
    fetch();
    const id = setInterval(fetch, 3000);
    return () => clearInterval(id);
  }, []);

  if (!canAccess(tenant, "kds")) return <div className="p-6 text-center text-muted">KDS disabled for {tenant.operationMode}</div>;

  const cols: { label: string; status: Order["orderStatus"] }[] = [
    { label: "Placed", status: "placed" },
    { label: "Preparing", status: "preparing" },
    { label: "Ready", status: "delivered" },
  ];

  return (
    <div>
      <h2 className="text-xl font-black mb-6">Kitchen Display — {tenant.name}</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {cols.map((c) => (
          <div key={c.status} className="bg-card-bg border border-card-border rounded-2xl p-4">
            <h3 className="font-black text-center mb-3">
              {c.label} ({orders.filter((o) => o.orderStatus === c.status).length})
            </h3>
            <div className="space-y-3">
              {orders
                .filter((o) => o.orderStatus === c.status)
                .map((o) => (
                  <div key={o._id} className="border border-card-border rounded-xl p-3 bg-bg-main">
                    <p className="font-bold text-sm">#{o._id.slice(-8)} — {o.customer.name}</p>
                    <ul className="text-xs text-muted my-2">
                      {o.items.map((it, idx) => (
                        <li key={idx}>
                          {it.foodItem.name} x{it.quantity}
                        </li>
                      ))}
                    </ul>
                    <p className="font-black text-brand">৳{o.totalAmount}</p>
                    {c.status === "placed" && (
                      <Button variant="primary" className="w-full mt-2 py-2 text-xs" onClick={async () => { await updateOrderStatus(o._id, "preparing"); fetch(); }}>
                        Start Cooking
                      </Button>
                    )}
                    {c.status === "preparing" && (
                      <Button variant="primary" className="w-full mt-2 py-2 text-xs" onClick={async () => { await updateOrderStatus(o._id, "delivered"); fetch(); }}>
                        Mark Ready
                      </Button>
                    )}
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
