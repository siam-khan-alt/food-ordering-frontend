"use client";

import { useAuth } from "@/context/AuthContext";
import { useRestaurant } from "@/context/RestaurantContext";
import { canAccess } from "@/lib/restaurant";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  LayoutDashboard,
  UtensilsCrossed,
  ClipboardList,
  ShoppingCart,
  QrCode,
  ChefHat,
} from "lucide-react";
import DashboardShell from "@/components/dashboard/DashboardShell";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { config } = useRestaurant();
  const router = useRouter();

  useEffect(() => {
    if (!user) router.push("/login");
    else if (user.role !== "admin" && user.role !== "staff") router.push("/");
  }, [user, router]);

  if (!user || (user.role !== "admin" && user.role !== "staff")) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-main">
        <p className="text-muted font-bold">Checking access...</p>
      </div>
    );
  }

  const operations = [
    ...(canAccess(config, "pos")
      ? [{ href: "/admin/pos", label: "POS Terminal", icon: ShoppingCart, badge: "LIVE" }]
      : []),
    ...(canAccess(config, "table")
      ? [{ href: "/admin/tables", label: "Tables & QR", icon: QrCode }]
      : []),
    ...(canAccess(config, "kds")
      ? [{ href: "/admin/kitchen", label: "Kitchen Display", icon: ChefHat, badge: "KDS" }]
      : []),
  ];

  return (
    <DashboardShell
      eyebrow="Restaurant Admin"
      title={config.name}
      subtitle={`${config.operationMode.replace("_", " ").toUpperCase()} mode — manage your restaurant operations`}
      tenantName={config.name}
      tenantMeta={`${config.slug} • ${config.operationMode}`}
      accent="brand"
      sections={[
        {
          title: "Overview",
          items: [{ href: "/admin", label: "Dashboard", icon: LayoutDashboard }],
        },
        {
          title: "Manage",
          items: [
            { href: "/admin/foods", label: "Manage Foods", icon: UtensilsCrossed },
            { href: "/admin/orders", label: "Manage Orders", icon: ClipboardList },
          ],
        },
        ...(operations.length > 0 ? [{ title: "Operations", items: operations }] : []),
      ]}
    >
      {children}
    </DashboardShell>
  );
}
