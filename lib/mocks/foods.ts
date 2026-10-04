import type { Food } from "@/types";

export const mockFoods: Food[] = [
  { _id: "food_001", name: "Chicken Burger", category: "Burger", price: 320, image: "https://images.unsplash.com/photo-1568909344668-6f14a07b56a0?w=500", createdAt: new Date().toISOString() },
  { _id: "food_002", name: "Beef Cheese Burger", category: "Burger", price: 380, image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=500", createdAt: new Date().toISOString() },
  { _id: "food_003", name: "Margherita Pizza", category: "Pizza", price: 650, image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500", createdAt: new Date().toISOString() },
  { _id: "food_004", name: "Pepperoni Pizza", category: "Pizza", price: 750, image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500", createdAt: new Date().toISOString() },
  { _id: "food_005", name: "Chicken Biryani", category: "Biryani", price: 450, image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500", createdAt: new Date().toISOString() },
  { _id: "food_006", name: "Mutton Biryani", category: "Biryani", price: 550, image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=500", createdAt: new Date().toISOString() },
  { _id: "food_007", name: "Chocolate Cake", category: "Dessert", price: 220, image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500", createdAt: new Date().toISOString() },
  { _id: "food_008", name: "Chicken Shawarma", category: "Burger", price: 280, image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500", createdAt: new Date().toISOString() },
  { _id: "food_009", name: "BBQ Chicken Pizza", category: "Pizza", price: 800, image: "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=500", createdAt: new Date().toISOString() },
  { _id: "food_010", name: "Kheer", category: "Dessert", price: 150, image: "https://images.unsplash.com/photo-1488477181946-64290103bb53?w=500", createdAt: new Date().toISOString() },
  { _id: "food_011", name: "Fried Rice with Chicken", category: "Biryani", price: 380, image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=500", createdAt: new Date().toISOString() },
  { _id: "food_012", name: "Ice Cream Sundae", category: "Dessert", price: 180, image: "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=500", createdAt: new Date().toISOString() },
];
