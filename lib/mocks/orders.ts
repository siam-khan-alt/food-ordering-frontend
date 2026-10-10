import type { Order } from "@/types";
import { mockFoods } from "./foods";

const foodMap = new Map(mockFoods.map((f) => [f._id, f]));

export const seedOrders: Order[] = [
  {
    _id: "order_001",
    customer: { _id: "u_customer", name: "Siam Khan", email: "siam@test.com" },
    items: [
      { foodItem: foodMap.get("food_001")!, quantity: 2, price: 320 },
      { foodItem: foodMap.get("food_007")!, quantity: 1, price: 220 },
    ],
    totalAmount: 860,
    discount: 0,
    orderStatus: "delivered",
    paymentStatus: "paid",
    orderType: "dine_in",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: "order_002",
    customer: { _id: "u_customer", name: "Siam Khan", email: "siam@test.com" },
    items: [{ foodItem: foodMap.get("food_003")!, quantity: 1, price: 650 }],
    totalAmount: 600,
    discount: 50,
    orderStatus: "preparing",
    paymentStatus: "paid",
    orderType: "parcel",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: "order_003",
    customer: { _id: "u_customer", name: "Siam Khan", email: "siam@test.com" },
    items: [{ foodItem: foodMap.get("food_005")!, quantity: 3, price: 450 }],
    totalAmount: 1350,
    discount: 0,
    orderStatus: "placed",
    paymentStatus: "pending",
    orderType: "dine_in",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
];
