import type { User } from "@/types";

export const mockUsers: (User & { password: string })[] = [
  { _id: "u_customer", name: "Siam Khan", email: "siam@test.com", role: "customer", createdAt: new Date("2024-01-15").toISOString(), password: "123456" },
  { _id: "u_admin", name: "Admin", email: "admin@test.com", role: "admin", createdAt: new Date("2024-01-01").toISOString(), password: "admin123" },
  { _id: "u_super", name: "Super Admin", email: "superadmin@bitebox.com", role: "super_admin", createdAt: new Date("2024-01-01").toISOString(), password: "super123" },
  { _id: "u_staff", name: "Cashier Staff", email: "staff@test.com", role: "staff", createdAt: new Date("2024-02-01").toISOString(), password: "staff123" },
];
