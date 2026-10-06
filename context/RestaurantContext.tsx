"use client";

import { createContext, useContext, useState, useEffect } from "react";
import type { RestaurantConfig } from "@/types";
import { getRestaurantConfig, setRestaurantConfig } from "@/lib/restaurant";

interface RestaurantContextType {
  config: RestaurantConfig;
  updateConfig: (patch: Partial<RestaurantConfig>) => void;
  refresh: () => void;
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

export function RestaurantProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<RestaurantConfig>(() => getRestaurantConfig());

  const refresh = () => setConfig(getRestaurantConfig());

  const updateConfig = (patch: Partial<RestaurantConfig>) => {
    const next = { ...config, ...patch };
    setRestaurantConfig(next);
    setConfig(next);
  };

  useEffect(() => {
    refresh();
  }, []);

  return <RestaurantContext.Provider value={{ config, updateConfig, refresh }}>{children}</RestaurantContext.Provider>;
}

export const useRestaurant = () => {
  const ctx = useContext(RestaurantContext);
  if (!ctx) throw new Error("useRestaurant must be used within a RestaurantProvider");
  return ctx;
};
