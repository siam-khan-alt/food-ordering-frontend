# 🍕 BiteBox — Food Ordering System

Next.js 15 + TypeScript frontend with mock data and dummy payment. Migrated from React Vite. No backend required — all flows run via local mocks, pluggable for future payment providers.

**Live Demo:** [https://bitebox-ashy.vercel.app/]

---

## 📋 Overview

BiteBox is a food delivery platform where customers can browse a dynamic menu, add items to cart, and checkout via dummy payment. Admins manage food inventory and orders. This branch (`nextjs-migration`) is a full rewrite to Next.js App Router with TypeScript, with PayHere removed.

---

## ✨ Features

### Customer
- Register and Login (mock auth, localStorage)
- Browse food with search, category filter (`?category=`), price sorting
- Add to cart (Context + localStorage)
- Checkout with **dummy payment** (paid instantly) or COD (pending)
- Order confirmation and My Orders history

### Admin
- Role-based access (admin/customer)
- Dashboard stats: totalOrders, totalRevenue (paid only), totalFoods
- Add, edit, delete foods (CategorySelector with free-text)
- View all orders, update orderStatus, view customer details modal

### General
- Responsive, Dark/Light theme, Toasts, custom UI (no browser defaults)

---

## 🛠️ Tech Stack

**Frontend (this repo)**
- Next.js 15 (App Router) + TypeScript (strict)
- Tailwind CSS v4 (`app/globals.css` @theme vars)
- Lucide React, React Hot Toast
- Mock data + API adapter: `lib/mocks/` + `lib/api/` + `lib/payment/dummy.ts`

**Backend (not required for this branch)**
- Previously Node/Express + Mongo + PayHere — removed in this branch. See `main` branch for MERN version.
- Future backend can be plugged via `lib/api` adapter.

---

## 📁 Project Structure

```
frontend/
├── app/
│   ├── layout.tsx           // Theme/Auth/Cart providers + Navbar/Footer
│   ├── page.tsx             // Home (Hero, StatsBar, CategoryShowcase...)
│   ├── menu/page.tsx
│   ├── cart/page.tsx
│   ├── checkout/page.tsx    // dummy payment only
│   ├── my-orders/page.tsx
│   ├── order-confirmation/[orderId]/page.tsx
│   ├── login/page.tsx
│   ├── register/page.tsx
│   └── admin/
│       ├── layout.tsx       // guard admin role
│       ├── page.tsx         // AdminHome stats
│       ├── foods/page.tsx
│       └── orders/page.tsx
├── components/
│   ├── layout/ (Navbar, Footer)
│   ├── common/ (Button, Input, CustomSelect, Modal, SectionHeader, Toast)
│   ├── home/ (Hero, CategoryShowcase, FeaturedFoods...)
│   ├── food/ (FoodCard)
│   ├── cart/ (CartItem, CartSummary)
│   └── admin/ (AdminSidebar, CategorySelector, CustomerDetailsModal)
├── context/ (ThemeContext, AuthContext, CartContext)
├── lib/
│   ├── mocks/ (foods, users, orders)
│   ├── api/ (food, auth, orders)
│   └── payment/dummy.ts
├── types/index.ts
├── public/ (logo, hero-*.png, stat-*.png, placeholder-food.png)
├── next.config.ts
└── tsconfig.json
```

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js v18+

### Run
```bash
git clone https://github.com/siam-khan-alt/food-ordering-frontend.git
cd food-ordering-frontend
git checkout nextjs-migration
npm install
npm run dev
```

App at `http://localhost:3000`

No `.env` required for mock mode. Optional:
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Build:
```bash
npm run build
```

---

## 🔑 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Customer | siam@test.com | 123456 |
| Admin | admin@test.com | admin123 |

Quick-login buttons on Login page.

---

## 🔌 Mock API (no backend)

| Method | Mock Function | Access | Description |
|--------|---------------|--------|-------------|
| `getFoods()` | `lib/api/food` | Public | Get all foods |
| `addFood()` / `updateFood()` / `deleteFood()` | `lib/api/food` | Admin | CRUD foods |
| `login()` / `register()` | `lib/api/auth` | Public | Mock auth |
| `createOrder()` | `lib/api/orders` | Auth | Create order (price recomputed server-side mock) |
| `getMyOrders()` | `lib/api/orders` | Auth | Current user orders |
| `getOrderById()` | `lib/api/orders` | Auth | Single order (owner/admin) |
| `getAllOrders()` | `lib/api/orders` | Admin | All orders |
| `getCustomerOrders()` | `lib/api/orders` | Admin | Customer aggregates |
| `updateOrderStatus()` | `lib/api/orders` | Admin | Update status |
| `processDummyPayment()` | `lib/payment/dummy` | — | Dummy/COD |

All data persisted in `localStorage` (`mock_foods`, `mock_orders`, `mock_users`, `cart`, `user`, `theme`).

To plug real backend, replace `lib/api/*` with fetch calls and `lib/payment/dummy.ts` with Stripe/SSLCommerz.

---

## 🔐 Notes

- Auth mocked via localStorage, no JWT — for demo only.
- Price recomputed from mock foods on order create (prevents client tampering pattern).
- `?category=` query param on `/menu` is now correctly handled (fixed bug from Vite version).

---

## 👤 Author

**Md Siam Khan** — nssiam99@gmail.com — [Portfolio](https://siamkhan-portfolio.vercel.app/) | [LinkedIn](https://www.linkedin.com/in/siam-khan-sp99/) | [GitHub](https://github.com/siam-khan-alt)
