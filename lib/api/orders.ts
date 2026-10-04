import type { Order, OrderStatus, CustomerDetails, User } from "@/types";
import { seedOrders } from "@/lib/mocks/orders";
import { getFoodById } from "./food";
import { mockUsers } from "@/lib/mocks/users";

const STORAGE_KEY = "mock_orders";
const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

function getStoredOrders(): Order[] {
  if (typeof window === "undefined") return [...seedOrders];
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return [...seedOrders];
    }
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(seedOrders));
  return [...seedOrders];
}

function setStoredOrders(orders: Order[]) {
  if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
}

export async function createOrder(items: { foodItemId: string; quantity: number }[], customer: Pick<User, "_id" | "name" | "email">): Promise<{ order: Order }> {
  await delay();
  const orders = getStoredOrders();
  let total = 0;
  const orderItems = items.map((it) => {
    const food = getFoodById(it.foodItemId);
    if (!food) throw new Error(`Food ${it.foodItemId} not found`);
    total += food.price * it.quantity;
    return { foodItem: food, quantity: it.quantity, price: food.price };
  });

  const order: Order = {
    _id: `order_${Date.now()}`,
    customer,
    items: orderItems,
    totalAmount: total,
    orderStatus: "placed",
    paymentStatus: "paid",
    createdAt: new Date().toISOString(),
  };
  const updated = [...orders, order];
  setStoredOrders(updated);
  return { order };
}

export async function getMyOrders(userId: string): Promise<Order[]> {
  await delay();
  return getStoredOrders().filter((o) => o.customer._id === userId);
}

export async function getOrderById(orderId: string, requesterId?: string, requesterRole?: string): Promise<Order> {
  await delay();
  const order = getStoredOrders().find((o) => o._id === orderId);
  if (!order) throw new Error("Order not found");
  if (requesterRole !== "admin" && requesterId && order.customer._id !== requesterId) {
    throw new Error("Order not found");
  }
  return order;
}

export async function getAllOrders(): Promise<Order[]> {
  await delay();
  return getStoredOrders();
}

export async function getCustomerOrders(customerId: string): Promise<CustomerDetails> {
  await delay();
  const orders = getStoredOrders().filter((o) => o.customer._id === customerId);
  const users = (() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("mock_users");
      if (saved) {
        try {
          return JSON.parse(saved) as (User & { password: string })[];
        } catch {}
      }
    }
    return mockUsers;
  })();
  const user = users.find((u) => u._id === customerId);
  if (!user) throw new Error("Customer not found");
  const totalOrders = orders.length;
  const totalSpent = orders.filter((o) => o.paymentStatus === "paid").reduce((s, o) => s + o.totalAmount, 0);
  return {
    customer: { name: user.name, email: user.email, createdAt: user.createdAt },
    totalOrders,
    totalSpent,
    orders,
  };
}

export async function updateOrderStatus(orderId: string, orderStatus: OrderStatus): Promise<Order> {
  await delay();
  const allowed: OrderStatus[] = ["placed", "preparing", "delivered", "cancelled"];
  if (!allowed.includes(orderStatus)) throw new Error("Invalid order status");
  const orders = getStoredOrders();
  const idx = orders.findIndex((o) => o._id === orderId);
  if (idx === -1) throw new Error("Order not found");
  orders[idx] = { ...orders[idx], orderStatus };
  setStoredOrders(orders);
  return orders[idx];
}
