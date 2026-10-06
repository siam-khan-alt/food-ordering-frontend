export type Role = "customer" | "admin" | "super_admin" | "staff";
export type OperationMode = "online_only" | "pos_only" | "hybrid";
export type ModuleKey = "online_order" | "pos" | "table" | "kds" | "staff" | "reports" | "coupons";
export type OrderStatus = "placed" | "preparing" | "delivered" | "cancelled";
export type PaymentStatus = "pending" | "paid" | "failed";
export type OrderSource = "online" | "pos" | "qr";
export type OrderType = "delivery" | "takeaway" | "dine_in" | "walk_in";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
}

export interface Food {
  _id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  createdAt?: string;
}

export interface OrderItem {
  foodItem: Food;
  quantity: number;
  price: number;
}

export interface Order {
  _id: string;
  customer: Pick<User, "_id" | "name" | "email">;
  items: OrderItem[];
  totalAmount: number;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  createdAt: string;
}

export interface CustomerDetails {
  customer: Pick<User, "name" | "email" | "createdAt">;
  totalOrders: number;
  totalSpent: number;
  orders: Order[];
}

export interface RestaurantConfig {
  slug: string;
  name: string;
  logo?: string;
  address?: string;
  phone?: string;
  operationMode: OperationMode;
  modules: ModuleKey[];
  status: "active" | "suspended";
  ownerEmail?: string;
}

export interface TableSession {
  tableNo: string;
  token: string;
  expiresAt: string;
  occupied: boolean;
}
