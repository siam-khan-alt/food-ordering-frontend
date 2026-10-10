import type { User } from "@/types";

export const mockUsers: (User & { password: string })[] = [
  { _id: "u_admin", name: "Admin", email: "admin@test.com", role: "admin", createdAt: new Date("2024-01-01").toISOString(), password: "admin123" },
  { _id: "u_cashier", name: "Cashier", email: "cashier@test.com", role: "cashier", createdAt: new Date("2024-02-01").toISOString(), password: "cashier123" },
];
