"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) router.push("/login");
    else if (user.role !== "admin") router.push("/");
  }, [user, router]);

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-muted font-bold">Checking access...</p>
      </div>
    );
  }

  const formattedDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="container mx-auto px-6 lg:px-16 py-8">
      <div className="relative overflow-hidden rounded-2xl border border-card-border bg-gradient-to-r from-bg-main via-card-bg/50 to-bg-main p-6 md:p-8 mb-8 shadow-sm group cursor-default">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand/5 rounded-full blur-[80px] -z-0 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-[80px] -z-0 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-2 bg-brand/10 text-brand text-[10px] font-black tracking-widest uppercase px-3 py-1 rounded-full border border-brand/20 mb-2">
              <span className="w-2 h-2 bg-brand rounded-full animate-ping" /> Control Center
            </span>
            <h1 className="text-2xl md:text-3xl font-black text-text-main">Admin Panel</h1>
            <p className="text-sm text-muted mt-1">Manage your restaurant operations</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold text-muted uppercase tracking-wide">System Date</p>
            <p className="text-sm font-black text-text-main">{formattedDate}</p>
          </div>
        </div>
        <img src="/hero-pizza.png" alt="" className="absolute right-6 top-1/2 -translate-y-1/2 w-24 h-24 object-contain opacity-10 hidden md:block" />
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <AdminSidebar />
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </div>
  );
}
