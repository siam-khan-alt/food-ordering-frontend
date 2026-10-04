"use client";

import { createContext, useContext, useState, useEffect } from "react";
import type { Tenant } from "@/types";
import { getCurrentTenant, setCurrentTenantSlug, getStoredTenants } from "@/lib/tenancy";

interface TenantContextType {
  tenant: Tenant;
  setTenantSlug: (slug: string) => void;
  tenants: Tenant[];
  refresh: () => void;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export function TenantProvider({ children }: { children: React.ReactNode }) {
  const [tenant, setTenant] = useState<Tenant>(() => getCurrentTenant());
  const [tenants, setTenants] = useState<Tenant[]>(() => getStoredTenants());

  const refresh = () => {
    setTenants(getStoredTenants());
    setTenant(getCurrentTenant());
  };

  const setTenantSlug = (slug: string) => {
    setCurrentTenantSlug(slug);
    setTenant(getCurrentTenant());
  };

  useEffect(() => {
    refresh();
  }, []);

  return <TenantContext.Provider value={{ tenant, setTenantSlug, tenants, refresh }}>{children}</TenantContext.Provider>;
}

export const useTenant = () => {
  const ctx = useContext(TenantContext);
  if (!ctx) throw new Error("useTenant must be used within a TenantProvider");
  return ctx;
};
