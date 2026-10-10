import type { RestaurantConfig } from "@/types";

/**
 * SINGLE SMALL HOTEL — no super admin, no online ordering, no table/QR.
 * 1 copy = 1 dokan. Name/address/phone change kore deploy.
 */

export const RESTAURANT_DEFAULT: RestaurantConfig = {
  name: "Hotel Ruposhi",
  slug: "ruposhi",
  logo: "/logo.png",
  address: "Dhaka, Bangladesh",
  phone: "+880 1700-000001",
};

const STORAGE_KEY = "restaurant_config";

export function getRestaurantConfig(): RestaurantConfig {
  if (typeof window === "undefined") return { ...RESTAURANT_DEFAULT };
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved) as RestaurantConfig;
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
