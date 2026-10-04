"use client";

import { useTenant } from "@/context/TenantContext";
import CustomSelect from "./CustomSelect";

export default function TenantSwitcher() {
  const { tenant, setTenantSlug, tenants } = useTenant();
  const options = tenants.map((t) => ({ value: t.slug, label: `${t.name} (${t.operationMode})` }));
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-bold text-muted hidden sm:inline">Tenant:</span>
      <CustomSelect value={tenant.slug} options={options} onChange={setTenantSlug} className="min-w-[180px] py-2 text-xs" />
    </div>
  );
}
