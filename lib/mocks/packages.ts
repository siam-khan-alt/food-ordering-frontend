import type { Package } from "@/types";

export const mockPackages: Package[] = [
  {
    _id: "pkg_001",
    name: "Lunch Package",
    items: [
      { foodId: "food_005", qty: 1 },
      { foodId: "food_010", qty: 1 },
    ],
    price: 550,
    offerPrice: 499,
    offerNote: "Dupur Offer",
    active: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: "pkg_002",
    name: "Burger Combo",
    items: [
      { foodId: "food_001", qty: 1 },
      { foodId: "food_012", qty: 1 },
    ],
    price: 450,
    active: true,
    createdAt: new Date().toISOString(),
  },
];
