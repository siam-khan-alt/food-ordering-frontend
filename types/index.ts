export type Role = "customer" | "admin";
export type OrderStatus = "placed" | "preparing" | "delivered" | "cancelled";
export type PaymentStatus = "pending" | "paid" | "failed";

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
