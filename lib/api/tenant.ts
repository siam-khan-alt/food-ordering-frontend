import type { Tenant, OperationMode, ModuleKey } from "@/types";
import { getStoredTenants, setStoredTenants } from "@/lib/tenancy";

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

export async function getTenants(): Promise<Tenant[]> {
  await delay();
  return getStoredTenants();
}

export async function getTenantById(id: string): Promise<Tenant> {
  await delay();
  const t = getStoredTenants().find((x) => x._id === id || x.slug === id);
  if (!t) throw new Error("Tenant not found");
  return t;
}

export async function createTenant(data: { name: string; slug: string; ownerEmail: string; operationMode: OperationMode; modules: ModuleKey[] }): Promise<Tenant> {
  await delay();
  const tenants = getStoredTenants();
  if (tenants.find((t) => t.slug === data.slug)) throw new Error("Slug already exists");
  const tenant: Tenant = {
    _id: `tenant_${Date.now()}`,
    slug: data.slug,
    name: data.name,
    ownerEmail: data.ownerEmail,
    operationMode: data.operationMode,
    modules: data.modules,
    status: "active",
    createdAt: new Date().toISOString(),
  };
  const updated = [...tenants, tenant];
  setStoredTenants(updated);
  return tenant;
}

export async function updateTenant(id: string, data: Partial<Pick<Tenant, "name" | "operationMode" | "modules" | "status">>): Promise<Tenant> {
  await delay();
  const tenants = getStoredTenants();
  const idx = tenants.findIndex((t) => t._id === id);
  if (idx === -1) throw new Error("Tenant not found");
  tenants[idx] = { ...tenants[idx], ...data };
  setStoredTenants(tenants);
  return tenants[idx];
}

export async function deleteTenant(id: string): Promise<void> {
  await delay();
  const tenants = getStoredTenants();
  const filtered = tenants.filter((t) => t._id !== id);
  if (filtered.length === tenants.length) throw new Error("Tenant not found");
  setStoredTenants(filtered);
}
