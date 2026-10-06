import type { ModuleKey, OperationMode, RestaurantConfig } from "@/types";

/**
 * SINGLE-RESTAURANT TEMPLATE
 * 1 copy = 1 restaurant. Per-client setup = edit DEFAULT below + .env + logo.
 * Super Admin (owner) toggles modules at runtime — saved to localStorage,
 * later to Django settings table. No tenants table, no tenant_id.
 */

export const RESTAURANT_DEFAULT: RestaurantConfig = {
  name: "Hotel Ruposhi",
  slug: "ruposhi",
  logo: "/logo.png",
  address: "Dhaka, Bangladesh",
  phone: "+880 1700-000001",
  operationMode: "hybrid",
  modules: ["online_order", "pos", "table", "kds", "reports"],
  status: "active",
};

const STORAGE_KEY = "restaurant_config";

export function getRestaurantConfig(): RestaurantConfig {
  if (typeof window === "undefined") return { ...RESTAURANT_DEFAULT };
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved) as RestaurantConfig;
      // merge new default keys so old cache never misses new modules
      return { ...RESTAURANT_DEFAULT, ...parsed };
    } catch {
      return { ...RESTAURANT_DEFAULT };
    }
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(RESTAURANT_DEFAULT));
  return { ...RESTAURANT_DEFAULT };
}

export function setRestaurantConfig(config: RestaurantConfig) {
  if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
}

export function updateRestaurantConfig(patch: Partial<RestaurantConfig>): RestaurantConfig {
  const next = { ...getRestaurantConfig(), ...patch };
  setRestaurantConfig(next);
  return next;
}

/** Same gate as before, source is now single config — not tenant.modules */
export function canAccess(
  config: Pick<RestaurantConfig, "operationMode" | "modules">,
  feature: ModuleKey | "online_order" | "pos" | "table"
): boolean {
  if (config.operationMode === "online_only" && (feature === "pos" || feature === "table" || feature === "kds")) return false;
  if (config.operationMode === "pos_only" && feature === "online_order") return false;
  if (config.modules && !config.modules.includes(feature as ModuleKey)) {
    if (["online_order", "pos", "table", "kds"].includes(feature)) return false;
  }
  return true;
}

export function allOperationModes(): { value: OperationMode; label: string }[] {
  return [
    { value: "hybrid", label: "Hybrid (Restaurant + Online)" },
    { value: "online_only", label: "Online Only" },
    { value: "pos_only", label: "POS Only (Dine-In)" },
  ];
}

export const allModules: { key: ModuleKey; label: string; desc: string }[] = [
  { key: "online_order", label: "Online Ordering", desc: "Menu, Cart, Checkout" },
  { key: "pos", label: "POS Walk-in", desc: "Cashier orders" },
  { key: "table", label: "Table Management", desc: "T1-T20 + QR" },
  { key: "kds", label: "Kitchen Display", desc: "Live tickets" },
  { key: "reports", label: "Reports", desc: "Revenue & stats" },
  { key: "coupons", label: "Coupons", desc: "Promo codes" },
];
