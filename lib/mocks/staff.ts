import type { StaffMember, Expense } from "@/types";

export const mockStaff: StaffMember[] = [
  { _id: "staff_001", name: "Karim Baburchi", job: "baburchi", phone: "01700-111111", monthlySalary: 15000, active: true, createdAt: new Date("2024-01-10").toISOString() },
  { _id: "staff_002", name: "Rahim Helper", job: "helper", phone: "01700-222222", monthlySalary: 8000, active: true, createdAt: new Date("2024-03-05").toISOString() },
];

const today = new Date().toISOString().slice(0, 10);

export const mockExpenses: Expense[] = [
  { _id: "exp_001", date: today, category: "bazar", note: "Murgi 5kg + sobji", amount: 1850, by: "admin", createdAt: new Date().toISOString() },
  { _id: "exp_002", date: today, category: "utility", note: "Gas bill", amount: 1200, by: "admin", createdAt: new Date().toISOString() },
];
