import type { Tenant, ModuleKey, OperationMode } from "@/types";
import { mockTenants } from "./mocks/tenants";

const STORAGE_KEY = "current_tenant_slug";
const TENANTS_KEY = "mock_tenants";

export function getStoredTenants(): Tenant[] {
  if (typeof window === "undefined") return [...mockTenants];
  const saved = localStorage.getItem(TENANTS_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return [...mockTenants];
    }
  }
  localStorage.setItem(TENANTS_KEY, JSON.stringify(mockTenants));
  return [...mockTenants];
}

export function setStoredTenants(tenants: Tenant[]) {
  if (typeof window !== "undefined") localStorage.setItem(TENANTS_KEY, JSON.stringify(tenants));
}

export function getCurrentTenantSlug(): string {
  if (typeof window === "undefined") return "ruposhi";
  return localStorage.getItem(STORAGE_KEY) || "ruposhi";
}

export function setCurrentTenantSlug(slug: string) {
  if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, slug);
}

export function getTenantBySlug(slug: string): Tenant | undefined {
  return getStoredTenants().find((t) => t.slug === slug);
}

export function getCurrentTenant(): Tenant {
  const slug = getCurrentTenantSlug();
  return getTenantBySlug(slug) || getStoredTenants()[0];
}

export function canAccess(tenant: Tenant, feature: ModuleKey | "online_order" | "pos" | "table"): boolean {
  // operation_mode is primary gate
  if (tenant.operationMode === "online_only" && (feature === "pos" || feature === "table" || feature === "kds")) return false;
  if (tenant.operationMode === "pos_only" && feature === "online_order") return false;
  // module toggle secondary gate
  if (tenant.modules && !tenant.modules.includes(feature as ModuleKey)) {
    // if feature is online_order/pos/table but not in modules, block
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
