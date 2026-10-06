"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LayoutDashboard, Settings } from "lucide-react";
import DashboardShell from "@/components/dashboard/DashboardShell";

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) router.push("/login");
    else if (user.role !== "super_admin") router.push("/");
  }, [user, router]);

  if (!user || user.role !== "super_admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-main">
        <p className="text-muted font-bold">Checking super admin access...</p>
      </div>
    );
  }

  return (
    <DashboardShell
      eyebrow="Super Admin"
      title="Owner Control"
      subtitle="This restaurant's features — modules on/off from here"
      tenantName="Owner Panel"
      tenantMeta={user.email}
      accent="violet"
      sections={[
        {
          title: "Control",
          items: [{ href: "/super-admin", label: "Dashboard", icon: LayoutDashboard }],
        },
        {
          title: "Restaurant",
          items: [{ href: "/super-admin/settings", label: "Feature Settings", icon: Settings }],
        },
      ]}
    >
      {children}
    </DashboardShell>
  );
}
