"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { Shield, Building2, LayoutDashboard } from "lucide-react";

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) router.push("/login");
    else if (user.role !== "super_admin") router.push("/");
  }, [user, router]);

  if (!user || user.role !== "super_admin") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-muted font-bold">Checking super admin access...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 lg:px-16 py-8">
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 mb-6 text-white flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Shield className="w-8 h-8 text-brand" />
          <div>
            <h1 className="text-2xl font-black">Super Admin</h1>
            <p className="text-xs text-white/60">Platform control — tenants, modules, billing</p>
          </div>
        </div>
        <span className="text-xs bg-white/10 px-3 py-1 rounded-full">{user.email}</span>
      </div>

      <div className="flex gap-6">
        <aside className="w-60 bg-card-bg border border-card-border rounded-2xl p-4 h-fit sticky top-24 space-y-2">
          <Link href="/super-admin" className="flex items-center gap-2 px-3 py-2 rounded-xl font-bold text-sm hover:bg-bg-main">
            <LayoutDashboard className="w-4 h-4" /> Dashboard
          </Link>
          <Link href="/super-admin/tenants" className="flex items-center gap-2 px-3 py-2 rounded-xl font-bold text-sm hover:bg-bg-main">
            <Building2 className="w-4 h-4" /> Tenants
          </Link>
        </aside>
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </div>
  );
}
