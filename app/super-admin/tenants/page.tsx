"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getTenants, deleteTenant } from "@/lib/api/tenant";
import type { Tenant } from "@/types";
import Button from "@/components/common/Button";
import { showSuccess, showConfirm } from "@/components/common/Toast";
import { Plus, Trash2, Pencil } from "lucide-react";

export default function TenantsPage() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    setLoading(true);
    const data = await getTenants();
    setTenants(data);
    setLoading(false);
  };

  useEffect(() => {
    fetch();
  }, []);

  const handleDelete = (t: Tenant) => {
    showConfirm(`Delete ${t.name}?`, async () => {
      await deleteTenant(t._id);
      showSuccess("Tenant deleted");
      fetch();
    });
  };

  if (loading) return <p className="text-muted font-bold">Loading...</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-black">Tenants</h2>
        <Link href="/super-admin/tenants/new">
          <Button variant="primary" icon={<Plus className="w-4 h-4" />}>
            New Tenant
          </Button>
        </Link>
      </div>

      <div className="bg-card-bg border border-card-border rounded-2xl overflow-hidden overflow-x-auto">
        <table className="w-full text-sm min-w-[700px]">
          <thead className="bg-bg-main text-muted text-left">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Slug</th>
              <th className="p-3">Mode</th>
              <th className="p-3">Modules</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tenants.map((t) => (
              <tr key={t._id} className="border-t border-card-border">
                <td className="p-3 font-bold">{t.name}</td>
                <td className="p-3 text-muted">{t.slug}</td>
                <td className="p-3">
                  <span className="text-xs bg-brand/10 text-brand px-2 py-1 rounded-full font-bold">{t.operationMode}</span>
                </td>
                <td className="p-3 text-xs text-muted">{t.modules.join(", ")}</td>
                <td className="p-3">
                  <span className={`text-xs px-2 py-1 rounded-full font-bold ${t.status === "active" ? "bg-accent/10 text-accent" : "bg-red-500/10 text-red-500"}`}>{t.status}</span>
                </td>
                <td className="p-3 flex gap-2">
                  <Link href={`/super-admin/tenants/${t._id}`} className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg">
                    <Pencil className="w-4 h-4" />
                  </Link>
                  <button onClick={() => handleDelete(t)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
