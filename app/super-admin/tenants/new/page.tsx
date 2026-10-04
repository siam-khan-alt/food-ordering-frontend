"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createTenant } from "@/lib/api/tenant";
import { allOperationModes, allModules } from "@/lib/tenancy";
import type { OperationMode, ModuleKey } from "@/types";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import CustomSelect from "@/components/common/CustomSelect";
import { showSuccess, showError } from "@/components/common/Toast";

export default function NewTenantPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", slug: "", ownerEmail: "", operationMode: "hybrid" as OperationMode });
  const [modules, setModules] = useState<ModuleKey[]>(["online_order", "pos", "table"]);

  const toggleModule = (k: ModuleKey) => {
    setModules((prev) => (prev.includes(k) ? prev.filter((x) => x !== k) : [...prev, k]));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createTenant({ name: form.name, slug: form.slug.toLowerCase().trim(), ownerEmail: form.ownerEmail, operationMode: form.operationMode, modules });
      showSuccess("Tenant created");
      router.push("/super-admin/tenants");
    } catch (err) {
      showError((err as Error).message);
    }
  };

  return (
    <div className="max-w-2xl">
      <h2 className="text-xl font-black mb-6">New Tenant</h2>
      <form onSubmit={handleSubmit} className="bg-card-bg border border-card-border rounded-2xl p-6 space-y-4">
        <Input label="Restaurant Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <Input label="Slug (unique)" placeholder="ruposhi" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} required />
        <Input label="Owner Email" type="email" value={form.ownerEmail} onChange={(e) => setForm({ ...form, ownerEmail: e.target.value })} required />
        <div>
          <label className="text-sm font-bold block mb-1">Operation Mode</label>
          <CustomSelect value={form.operationMode} options={allOperationModes().map((m) => ({ value: m.value, label: m.label }))} onChange={(v) => setForm({ ...form, operationMode: v as OperationMode })} />
        </div>
        <div>
          <label className="text-sm font-bold block mb-2">Modules</label>
          <div className="grid grid-cols-2 gap-2">
            {allModules.map((m) => (
              <label key={m.key} className="flex items-center gap-2 bg-bg-main border border-card-border rounded-xl px-3 py-2 text-sm">
                <input type="checkbox" checked={modules.includes(m.key)} onChange={() => toggleModule(m.key)} />
                <span className="font-bold">{m.label}</span>
              </label>
            ))}
          </div>
        </div>
        <Button type="submit" variant="primary" className="w-full justify-center">
          Create Tenant
        </Button>
      </form>
    </div>
  );
}
