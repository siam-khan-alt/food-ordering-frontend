import type { User } from "@/types";
import { mockUsers } from "@/lib/mocks/users";

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

function getStoredUsers(): (User & { password: string })[] {
  if (typeof window === "undefined") return [...mockUsers];
  const saved = localStorage.getItem("mock_users");
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return [...mockUsers];
    }
  }
  localStorage.setItem("mock_users", JSON.stringify(mockUsers));
  return [...mockUsers];
}

function setStoredUsers(users: (User & { password: string })[]) {
  if (typeof window !== "undefined") localStorage.setItem("mock_users", JSON.stringify(users));
}

export async function login(data: { email: string; password: string }): Promise<{ user: User; token: string }> {
  await delay();
  const users = getStoredUsers();
  const found = users.find((u) => u.email === data.email && u.password === data.password);
  if (!found) throw new Error("Invalid email or password");
  const { password: _pw, ...user } = found;
  const token = `mock-jwt-${Date.now()}-${user._id}`;
  return { user, token };
}

export async function register(data: { name: string; email: string; password: string }): Promise<{ message: string }> {
  await delay();
  const users = getStoredUsers();
  if (users.find((u) => u.email === data.email)) throw new Error("Email already exists");
  const newUser: User & { password: string } = {
    _id: `u_${Date.now()}`,
    name: data.name,
    email: data.email,
    role: "customer",
    createdAt: new Date().toISOString(),
    password: data.password,
  };
  const updated = [...users, newUser];
  setStoredUsers(updated);
  return { message: "User created" };
}

export function getStoredAuthUser(): User | null {
  if (typeof window === "undefined") return null;
  const saved = localStorage.getItem("user");
  if (!saved) return null;
  try {
    return JSON.parse(saved);
  } catch {
    return null;
  }
}
