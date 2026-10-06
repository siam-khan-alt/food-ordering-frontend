"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, UtensilsCrossed, ClipboardList, ShoppingCart, QrCode, ChefHat } from "lucide-react";
import { useRestaurant } from "@/context/RestaurantContext";
import { canAccess } from "@/lib/restaurant";

export default function AdminSidebar() {
  const pathname = usePathname();
  const { config } = useRestaurant();
  const linkClass = (href: string) => {
    const isActive = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
    return `flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition ${isActive ? "bg-brand text-white" : "text-text-main hover:bg-card-bg"}`;
  };

  return (
    <aside className="w-full md:w-64 bg-card-bg border-r border-card-border p-4 space-y-2 md:sticky md:top-24 md:self-start md:h-fit">
      <Link href="/admin" className={linkClass("/admin")}>
        <LayoutDashboard className="w-4 h-4" />
        Dashboard
      </Link>
      <Link href="/admin/foods" className={linkClass("/admin/foods")}>
        <UtensilsCrossed className="w-4 h-4" />
        Manage Foods
      </Link>
      <Link href="/admin/orders" className={linkClass("/admin/orders")}>
        <ClipboardList className="w-4 h-4" />
        Manage Orders
      </Link>
      {canAccess(config, "pos") && (
        <Link href="/admin/pos" className={linkClass("/admin/pos")}>
          <ShoppingCart className="w-4 h-4" />
          POS
        </Link>
      )}
      {canAccess(config, "table") && (
        <Link href="/admin/tables" className={linkClass("/admin/tables")}>
          <QrCode className="w-4 h-4" />
          Tables
        </Link>
      )}
      {canAccess(config, "kds") && (
        <Link href="/admin/kitchen" className={linkClass("/admin/kitchen")}>
          <ChefHat className="w-4 h-4" />
          Kitchen
        </Link>
      )}
    </aside>
  );
}
