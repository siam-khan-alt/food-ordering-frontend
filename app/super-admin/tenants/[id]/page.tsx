"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getTenantById, updateTenant } from "@/lib/api/tenant";
import { allOperationModes, allModules } from "@/lib/tenancy";
import type { OperationMode, ModuleKey, Tenant } from "@/types";
import CustomSelect from "@/components/common/CustomSelect";
import Button from "@/components/common/Button";
import { showSuccess, showError } from "@/components/common/Toast";

export default function EditTenantPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [mode, setMode] = useState<OperationMode>("hybrid");
  const [modules, setModules] = useState<ModuleKey[]>([]);

  useEffect(() => {
    getTenantById(id).then((t) => {
      setTenant(t);
      setMode(t.operationMode);
      setModules(t.modules);
    });
  }, [id]);

  if (!tenant) return <p className="text-muted">Loading...</p>;

  const toggle = (k: ModuleKey) => setModules((prev) => (prev.includes(k) ? prev.filter((x) => x !== k) : [...prev, k]));

  const save = async () => {
    try {
      await updateTenant(id, { operationMode: mode, modules });
      showSuccess("Tenant updated");
      router.push("/super-admin/tenants");
    } catch (e) {
      showError((e as Error).message);
    }
  };

  return (
    <div className="max-w-2xl">
      <h2 className="text-xl font-black mb-6">Edit {tenant.name}</h2>
      <div className="bg-card-bg border border-card-border rounded-2xl p-6 space-y-4">
        <p className="text-sm text-muted">
          Slug: <span className="font-bold text-text-main">{tenant.slug}</span> | Owner: {tenant.ownerEmail}
        </p>
        <div>
          <label className="text-sm font-bold block mb-1">Operation Mode</label>
          <CustomSelect value={mode} options={allOperationModes().map((m) => ({ value: m.value, label: m.label }))} onChange={(v) => setMode(v as OperationMode)} />
        </div>
        <div>
          <label className="text-sm font-bold block mb-2">Modules</label>
          <div className="grid grid-cols-2 gap-2">
            {allModules.map((m) => (
              <label key={m.key} className="flex items-center gap-2 bg-bg-main border border-card-border rounded-xl px-3 py-2 text-sm">
                <input type="checkbox" checked={modules.includes(m.key)} onChange={() => toggle(m.key)} />
                <span className="font-bold">{m.label}</span>
              </label>
            ))}
          </div>
        </div>
        <Button onClick={save} variant="primary" className="w-full justify-center">
          Save Changes
        </Button>
      </div>
    </div>
  );
}
