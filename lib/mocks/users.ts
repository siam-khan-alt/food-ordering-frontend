import type { User } from "@/types";

export const mockUsers: (User & { password: string })[] = [
  { _id: "u_customer", name: "Siam Khan", email: "siam@test.com", role: "customer", createdAt: new Date("2024-01-15").toISOString(), password: "123456" },
  { _id: "u_admin", name: "Admin", email: "admin@test.com", role: "admin", createdAt: new Date("2024-01-01").toISOString(), password: "admin123" },
];
