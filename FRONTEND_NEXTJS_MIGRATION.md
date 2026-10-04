# BiteBox — Frontend Next.js + TypeScript Conversion Plan

> **Scope:** `frontend/` ke `React (Vite + JS)` theke `Next.js 15 (App Router) + TypeScript` e full convert. Backend er kono kaj hobe na. PayHere payment gateway frontend theke total remove — apatoto `dummy payment` + `mock data` diye full flow cholbe. Pore onno payment provider pluggable hobe.
> 
> **Decisions locked:**
> - Backend Django/Node konotai touch hobe na
> - PayHere SDK, script, hash flow, `payhere.js`, COOP headers — sob delete
> - Sob API call mock layer e intercept hobe — kono real backend lagbe na
> - Dummy payment = Order Create korlei `paymentStatus: "paid"` (or COD toggle), 1-2 sec fake processing

---

## 1. Current Frontend Audit (as-is: `frontend/`)

### 1.1 Stack & Toolchain

| Item | Current |
|------|---------|
| Framework | React 19 + Vite 8 (`frontend/package.json:1`) |
| Routing | `react-router-dom` 7 — `BrowserRouter` (`src/App.jsx:21`) |
| Styling | Tailwind CSS v4 (`@import "tailwindcss"` + `@theme` in `src/index.css:1`) |
| HTTP | `axios` custom instance (`src/api/axios.js:3` `baseURL=VITE_BACKEND_URL`) |
| State | 3 Contexts: `AuthProvider.jsx:4`, `CartProvider.jsx:4`, `ThemeProvider.jsx` |
| Icons/Toast | `lucide-react` + `react-hot-toast` |
| Env | `VITE_BACKEND_URL` only — no fallback, `src/api/axios.js:4` |

### 1.2 Routes (`src/App.jsx:25`)

```
public:   /               -> Home
          /menu           -> Menu (search + category filter + sort)
          /login          -> Login (quickLogin admin/customer)
          /register       -> Register
          /order-confirmation/:orderId -> OrderConfirmation
guarded:  /cart           -> Cart (ProtectedRoute)
          /checkout       -> Checkout (ProtectedRoute)  [CONTAINS PAYHERE - DELETE]
          /my-orders      -> MyOrders (ProtectedRoute)
admin:    /admin          -> AdminDashboard layout + Outlet
          /admin (index)  -> AdminHome (stats: totalOrders/revenue/foods)
          /admin/foods    -> ManageFoods (CRUD + CategorySelector)
          /admin/orders   -> ManageOrders (allOrder + status PATCH + CustomerDetailsModal)
```

`src/routes/ProtectedRoute.jsx:1` — checks `user` + `allowedRole`, redirects `/login` or `/`.

### 1.3 Contexts

*   **Auth** (`AuthProvider.jsx:10` `login(userData, token)` / `logout()` ) — localStorage `token` + `user`, shape `{_id, name, email, role: "customer"|"admin", createdAt}`. Consumers: Navbar, Checkout, Login.
*   **Cart** (`CartProvider.jsx:14` `addToCart`, `updateQuantity`, `removeFromCart`, `clearCart`, `totalItems`, `totalAmount`) — localStorage `cart`, item shape `{_id, name, category, price, image, quantity}`.
*   **Theme** (`ThemeProvider.jsx`) — `theme: "dark"|"light"` toggle, `document.documentElement.classList: dark`, localStorage `theme`.

### 1.4 API Contract Hit by Frontend (13 endpoints via `src/api/axios.js`)

```
GET    /food/all
POST   /food/add                (admin) {name, category, price, image}
PATCH  /food/update/:id         (admin)
DELETE /food/delete/:id         (admin)
POST   /auth/register           {name,email,password,role:"customer"}
POST   /auth/login              {email,password} -> {user, token}
POST   /order/create            {items:[{foodItemId, quantity}]} -> {order}
GET    /order/myOrder           -> Order[]
GET    /order/single/:orderId   -> Order
GET    /order/allOrder          (admin) -> Order[]
GET    /order/customer/:customerId (admin) -> {customer, totalOrders, totalSpent, orders}
PATCH  /order/status/:orderId   (admin) {orderStatus}
POST   /payment/generate-hash   {orderId, amount, currency:"LKR"} -> {merchantId, hash, ...}
```

> Sob endpoint Next.js e `mock` diye replace hobe. `axios` baseURL concept thakbe na — `lib/mocks` / `lib/api` direct import.

### 1.5 Data Models (inferred from usage)

```ts
// frontend/src/pages/Menu.jsx + components/food/FoodCard.jsx
Food { _id: string; name: string; category: string; price: number; image: string }

// frontend/src/pages/MyOrders.jsx:7 + Checkout.jsx:28
Order {
  _id: string; customer: {_id, name, email} | string;
  items: { foodItem: Food; quantity: number; price: number }[];
  totalAmount: number; paymentStatus: "pending"|"paid"|"failed";
  orderStatus: "placed"|"preparing"|"delivered"|"cancelled"; createdAt: string;
}
User { _id: string; name: string; email: string; role: "customer"|"admin"; createdAt: string }
CustomerDetails { customer:{name,email,createdAt}, totalOrders:number, totalSpent:number, orders:Order[] }
```

### 1.6 Payment Flow — FULL DELETE TARGET

Files to delete/purge:
*   `src/utils/payhere.js:1` — `PAYHERE_SDK_URL`, `waitForPayHere`, `injectPayHereScript`, `loadPayHereScript`, `buildCustomerDetails` (hardcoded `phone:0771234567`, `Colombo` `LKR`)
*   `src/pages/Checkout.jsx:26` — full `loadPayHereScript` + `POST /order/create` + `POST /payment/generate-hash` + `payhere.startPayment` with `onCompleted/onDismissed/onError`
*   `index.html` — `<script src="https://www.payhere.lk/lib/payhere.js">`
*   `vite.config.js:7` — `Cross-Origin-Opener-Policy: same-origin-allow-popups`
*   Text refs in `components/home/WhyChooseUs.jsx` + `HowItWorks.jsx` ("PayHere")
*   Hardcoded `currency:"LKR"`, `sandbox:true`, `notify_url`

UI uses `৳` (BDT) but PayHere sends `LKR` — mismatch o remove hoye jabe.

### 1.7 Known Issues to Fix During Migration

*   `Menu.jsx` ignores `?category=` query param set by `CategoryShowcase.jsx` link
*   `Hero.jsx` CTAs have no `onClick`/`Link`
*   `CartSummary`/`FoodCard` fallback `/placeholder-food.png` missing in `public/` (add asset)
*   `src/assets/` (react.svg etc.) dead weight
*   `text-text-muted` class mismatch vs `--color-muted`

---

## 2. Target Architecture — Next.js 15 + TypeScript

### 2.1 Stack Decisions

| Choice | Value | Reason |
|--------|-------|--------|
| Next.js | 15 + App Router + `app/` | SSR/SSG, `loading.tsx`, `error.tsx`, image optimization |
| Language | TypeScript `strict:true` | Typed Food/Order/User, API contracts |
| Styling | Tailwind CSS v4 (keep `@theme` vars from `src/index.css`) | Exact visual parity, dark mode via `class` |
| State | React Context (Auth/Cart/Theme) migrated to `context/` (no Redux) | LocalStorage parity, minimal churn |
| Data | `lib/mocks/` JSON + in-memory mock service (`lib/api/*`) | No backend, instant demo, later swap to real API via `lib/api/client.ts` adapter |
| Payment | `lib/payment/dummy.ts` — `processMockPayment(orderId, amount)` returns `paid` after delay | Pluggable: future `stripe.ts`/`sslcommerz.ts` same interface |
| Toast | `react-hot-toast` (keep) | Or migrate to `sonner` |
| Icons | `lucide-react` (keep) | |
| Env | `NEXT_PUBLIC_APP_URL`, no `VITE_*` | |

### 2.2 Target Folder Structure (new `frontend-next/` or `frontend/` overwritten)

```
BiteBox/
├── FRONTEND_NEXTJS_MIGRATION.md   <- this file
├── backend/                       <- untouched
└── frontend/                      (migrated — overwrite or new folder `frontend-next/`)
    ├── app/
    │   ├── layout.tsx             // html lang, ThemeProvider, AuthProvider, CartProvider, Navbar, Footer, Toaster
    │   ├── page.tsx               // Home (compose all home sections)
    │   ├── globals.css            // migrated from src/index.css + @theme vars
    │   ├── loading.tsx            // skeleton
    │   ├── error.tsx
    │   ├── not-found.tsx
    │   ├── menu/
    │   │   └── page.tsx           // Menu (search/filter/sort) + query param ?category handling FIXED
    │   ├── cart/
    │   │   └── page.tsx
    │   ├── checkout/
    │   │   └── page.tsx           // Dummy payment only
    │   ├── my-orders/
    │   │   └── page.tsx
    │   ├── order-confirmation/
    │   │   └── [orderId]/
    │   │       └── page.tsx       // dynamic route, replace :orderId param
    │   ├── login/
    │   │   └── page.tsx
    │   ├── register/
    │   │   └── page.tsx
    │   └── admin/
    │       ├── layout.tsx         // AdminDashboard + AdminSidebar + Protected (admin only)
    │       ├── page.tsx           // AdminHome stats
    │       ├── foods/
    │       │   └── page.tsx       // ManageFoods
    │       └── orders/
    │           └── page.tsx       // ManageOrders
    ├── components/
    │   ├── layout/Navbar.tsx
    │   ├── layout/Footer.tsx
    │   ├── common/{Button,Input,CustomSelect,Modal,SectionHeader,Toast}.tsx
    │   ├── home/{Hero,StatsBar,CategoryShowcase,FeaturedFoods,SpecialOffers,HowItWorks,WhyChooseUs,Testimonials,CTABanner}.tsx
    │   ├── food/FoodCard.tsx
    │   ├── cart/{CartItem,CartSummary}.tsx
    │   └── admin/{AdminSidebar,CategorySelector,CustomerDetailsModal}.tsx
    ├── context/
    │   ├── AuthContext.tsx
    │   ├── CartContext.tsx
    │   └── ThemeContext.tsx
    ├── lib/
    │   ├── mocks/
    │   │   ├── foods.ts           // Food[] seed (8+ items, 3-4 categories)
    │   │   ├── users.ts           // demo users: siam@test.com / admin@test.com
    │   │   ├── orders.ts          // Order[] seed + helpers
    │   │   └── index.ts
    │   ├── api/
    │   │   ├── client.ts          // mock adapter — same method names as old axios endpoints
    │   │   ├── food.ts            // getFoods, addFood, updateFood, deleteFood
    │   │   ├── auth.ts            // login, register, me()
    │   │   ├── orders.ts          // createOrder, getMyOrders, getOrderById, getAllOrders, getCustomerOrders, updateOrderStatus
    │   │   └── types.ts           // shared types
    │   ├── payment/
    │   │   └── dummy.ts           // processDummyPayment, DummyPaymentResult
    │   ├── utils/
    │   │   └── format.ts          // price, date formatters
    │   └── hooks/
    │       └── useLocalStorage.ts
    ├── types/
    │   └── index.ts               // Food, Order, OrderItem, User, CustomerDetails, ApiError
    ├── public/
    │   ├── favicon.svg, logo.png, hero-*.png, stat-*.png, placeholder-food.png (NEW)
    │   └── icons.svg
    ├── next.config.ts
    ├── tsconfig.json              // strict
    ├── tailwind.config.ts (or keep v4 @theme)
    ├── eslint.config.mjs
    └── .env.example
```

### 2.3 Type Definitions (`types/index.ts`)

```ts
export type Role = "customer" | "admin";
export type OrderStatus = "placed" | "preparing" | "delivered" | "cancelled";
export type PaymentStatus = "pending" | "paid" | "failed"; // dummy: always "paid" after checkout

export interface User {
  _id: string; name: string; email: string; role: Role; createdAt: string; // ISO
}
export interface Food {
  _id: string; name: string; category: string; price: number; image: string; createdAt?: string;
}
export interface OrderItem {
  foodItem: Food; quantity: number; price: number; // price snapshot
}
export interface Order {
  _id: string; customer: Pick<User,"_id"|"name"|"email">;
  items: OrderItem[]; totalAmount: number;
  orderStatus: OrderStatus; paymentStatus: PaymentStatus; createdAt: string;
}
export interface CustomerDetails {
  customer: Pick<User,"name"|"email"|"createdAt">;
  totalOrders: number; totalSpent: number; orders: Order[];
}
```

---

## 3. Module-Based Conversion Plan (8 Modules)

### MODULE 1 — Project Bootstrap & Toolchain

**Goal:** `frontend/` ke Next.js + TS e initialize, Vite artifacts remove.

| Task | Detail |
|------|--------|
| 1.1 | `npx create-next-app@latest frontend --typescript --tailwind --eslint --app --src-dir false --import-alias "@/*"` (or reuse existing `frontend/` by replacing) |
| 1.2 | Copy `public/*` from old frontend, **add** `public/placeholder-food.png` |
| 1.3 | Migrate `src/index.css` -> `app/globals.css` preserving `@theme` vars (`--color-bg-main` etc.) + `.dark` overrides + `glass-effect` |
| 1.4 | `next.config.ts`: `images.remotePatterns` allow food image URLs (if external), keep `eslint` |
| 1.5 | `tsconfig.json` `strict:true`, `baseUrl:.`, `paths:@/*` |
| 1.6 | Delete old: `vite.config.js`, `index.html`, `src/main.jsx`, `src/App.jsx`, `src/App.css`, `src/utils/payhere.js`, `vite` deps |

**Verify:** `npm run dev` -> Next.js boots on `3000`, `/` renders empty layout, no Vite.

### MODULE 2 — Layout, Theme, Routing Shell

**Goal:** Global layout + navigation parity with `src/App.jsx:19`.

| Task | Detail |
|------|--------|
| 2.1 | `app/layout.tsx` — `html lang="en"`, `ThemeProvider` + `AuthProvider` + `CartProvider` wrappers (same order as `src/main.jsx`), `Navbar`, `Footer`, `<Toaster />`, `next/font` if needed |
| 2.2 | Migrate `components/layout/Navbar.tsx` — replace `react-router-dom NavLink` with `next/link` + `usePathname()` for active state (`src/components/layout/Navbar.jsx:16` logic). `useRouter()` for mobile menu close. Keep `useTheme`, `useAuth`, `useCart`, `showConfirm`. |
| 2.3 | `components/layout/Footer.tsx` — direct port, use `Link` from `next/link`. |
| 2.4 | `context/ThemeContext.tsx` — port `ThemeProvider.jsx`, add `"use client"` directive, `useEffect` for `document.documentElement` dark class. |
| 2.5 | `app/not-found.tsx`, `app/loading.tsx` |

**Verify:** Dark/Light toggle works, Navbar active indicator, cart badge, mobile drawer — visual 1:1 with old.

### MODULE 3 — Auth & Cart Contexts + Common UI

**Goal:** Auth/Cart parity, typed, client-only.

| Task | Detail |
|------|--------|
| 3.1 | `context/AuthContext.tsx` — `"use client"`, `User | null`, `login(user, token)`/`logout()` with localStorage `token`/`user`, `useAuth()` hook. Add `useEffect` to rehydrate. Type `Role`. |
| 3.2 | `context/CartContext.tsx` — `"use client"`, `Food & {quantity}` array, `addToCart`/`updateQuantity`/`removeFromCart`/`clearCart` + `totalItems`/`totalAmount` (same reducer logic as `CartProvider.jsx:14`). Guard `window` for SSR. |
| 3.3 | `components/common/*.tsx` — Port `Button.tsx`, `Input.tsx` (with Eye toggle), `CustomSelect.tsx` (dropdown + outside click + `useRef`), `Modal.tsx` (backdrop + scroll lock + `createPortal` if needed), `SectionHeader.tsx`, `Toast.tsx` (`react-hot-toast` wrappers `showSuccess/Error/Confirm`). All typed props. |
| 3.4 | `lib/hooks/useLocalStorage.ts` generic hook (optional DRY). |

**Verify:** Login saves user, refresh persists, cart persists, add/increment works.

### MODULE 4 — Mock Data & API Layer (Replaces all `axios` endpoints)

**Goal:** No backend — `lib/mocks` + `lib/api` intercepts all calls.

| Task | Detail |
|------|--------|
| 4.1 | `lib/mocks/foods.ts` — 10-12 foods, 4 categories (`Burger`, `Pizza`, `Biryani`, `Dessert`), `image` uses `public/*` or unsplash URLs, `price` in BDT numbers. Export `mockFoods: Food[]`. |
| 4.2 | `lib/mocks/users.ts` — `mockUsers: User[]` with `_id: "u1"`, `siam@test.com/123456` (customer), `admin@test.com/admin123` (admin), `createdAt: new Date().toISOString()`. Include password field only in mock (never expose). |
| 4.3 | `lib/mocks/orders.ts` — `mockOrders: Order[]` seeded (3-4 orders mixed customer), helpers `generateOrderId()`. Stored in localStorage `mock_orders` for persistence across reloads. |
| 4.4 | `lib/api/food.ts` — `getFoods(): Promise<Food[]>`, `addFood(data)`, `updateFood(id, data)`, `deleteFood(id)` — mutate in-memory + localStorage. Simulate 300ms delay. `category` string handling via plain string (no Category table needed). |
| 4.5 | `lib/api/auth.ts` — `login({email,password})` checks `mockUsers`, returns `{user, token: "mock-jwt-"+Date.now()}`, `register({name,email,password})` creates customer, error if email exists. `getCurrentUser()` from localStorage. |
| 4.6 | `lib/api/orders.ts` — `createOrder({items:[{foodItemId,quantity}]})` recomputes `price` from `mockFoods`, `totalAmount`, creates `Order` with `paymentStatus:"paid"` (dummy), `orderStatus:"placed"`, `customer` from auth, pushes to mockOrders. `getMyOrders(userId)`, `getOrderById(id)` (owner/admin check -> 404 if unauthorized), `getAllOrders()` (admin), `getCustomerOrders(customerId)` aggregates `totalOrders` + `totalSpent` (paid only) + `orders`. `updateOrderStatus(id, status)` validates `OrderStatus` enum. |
| 4.7 | `lib/api/client.ts` — barrel export, optional `ApiError {message}` class to keep `err.message` contract (`frontend/src/pages/Login.jsx:46` reads `err.response?.data?.message`). |

**Key Contract Preservation:** All former `API.get/post/patch/delete` call-sites change to `import { getFoods } from "@/lib/api/food"` etc. — field names `_id`, `createdAt` (ISO), `totalAmount` stay camelCase string IDs.

**Verify:** `getFoods()` returns mock array, `createOrder` recomputes total (send wrong price -> assert correct total).

### MODULE 5 — Public Pages (Home, Menu, Login, Register)

**Goal:** Port read-heavy + auth pages, fix known bugs.

| Task | Detail |
|------|--------|
| 5.1 | `app/page.tsx` (Home) — compose `Hero`, `StatsBar`, `CategoryShowcase`, `FeaturedFoods`, `SpecialOffers`, `HowItWorks`, `WhyChooseUs`, `Testimonials`, `CTABanner` (all as Client or Server components). Keep exact order `src/pages/Home.jsx:12`. Fix `Hero` CTA buttons: add `Link href="/menu"` or `router.push`. Remove PayHere text from `WhyChooseUs`/`HowItWorks` -> replace "Secure Payment" with "Fast Checkout" / "Dummy Payment". |
| 5.2 | `components/home/*.tsx` — Port each. `CategoryShowcase` + `FeaturedFoods` now call `getFoods()` not `API.get`. `CategoryShowcase` links `href="/menu?category=${encodeURIComponent(cat)}"` kept. Images via `next/image` (or keep `<img>` for external URLs). |
| 5.3 | `app/menu/page.tsx` — Port `Menu.jsx:10` logic (search, category filter, sort). **FIX**: read `searchParams.category` via `useSearchParams()` and set `selectedCategory` initial value. Use `FoodCard` grid. `handleAddToCart` -> `addToCart` + `showSuccess`. |
| 5.4 | `app/login/page.tsx` — Port `Login.jsx:20` quickLogin buttons, `login()` from `lib/api/auth`, `router.push("/admin")` if admin else `/`. |
| 5.5 | `app/register/page.tsx` — Port `Register.jsx:22` password >=6 validation, `register()` then `router.push("/login")`. |
| 5.6 | `components/food/FoodCard.tsx` — direct typed port, `onAddToCart: (food: Food) => void`. |

**Verify:** `/menu?category=Pizza` preselects filter, search/sort work, login with demo creds redirects correctly.

### MODULE 6 — Cart, Checkout (Dummy Payment), MyOrders, OrderConfirmation

**Goal:** Full ordering flow with dummy payment, PayHere fully gone.

| Task | Detail |
|------|--------|
| 6.1 | `app/cart/page.tsx` — Port `Cart.jsx` suggestions (`getFoods` filtered `!cartIds`), `CartItem` + `CartSummary`. `handleCheckout` -> `router.push("/checkout")`. Empty state + popular picks. |
| 6.2 | `lib/payment/dummy.ts` — `export async function processDummyPayment({orderId, amount}: {orderId:string; amount:number}): Promise<{success:true; transactionId:string}>` — `await delay(1200)`, return `txn_mock_${Date.now()}`. Future payment providers implement same `processPayment` signature. |
| 6.3 | `app/checkout/page.tsx` — **Rewritten** (`src/pages/Checkout.jsx:11` replaced): Remove `loadPayHereScript`, `PAYHERE_SDK_URL`, `buildCustomerDetails`, `hash`, `merchantId`. New flow: `const orderItems = cartItems.map(...)`, `const order = await createOrder({items: orderItems})`, `await processDummyPayment({orderId: order._id, amount: order.totalAmount})`, `clearCart()`, `router.push(/order-confirmation/${order._id})`. Show Order Summary + `Button` "Place Order (Dummy Payment)" with `CreditCard` icon. Optional COD toggle (radio: `Dummy Paid` vs `Cash on Delivery` with `paymentStatus: "pending"`).  |
| 6.4 | `app/my-orders/page.tsx` — Port `MyOrders.jsx:25` `getMyOrders(user._id)`, `statusColors`/`paymentColors`, `ShoppingBag` cards, `slice(-8)` id display, `toLocaleDateString`. Requires auth guard (redirect `/login` if no user). |
| 6.5 | `app/order-confirmation/[orderId]/page.tsx` — dynamic route, `useParams` or `params` prop, fetch `getOrderById(orderId)`, `CheckCircle` success card, `order._id.slice(-8)`, `paymentStatus` (dummy -> `PAID`), `orderStatus`. Links to `/` + `/my-orders`. |
| 6.6 | Update `components/cart/*` — Type props `Food & {quantity:number}`. |

**Verify:** Cart -> Checkout -> dummy processing -> OrderConfirmation shows `PAID`, My Orders lists new order on top (`.reverse()` equivalent).

### MODULE 7 — Admin Panel (ManageFoods, ManageOrders, Stats)

**Goal:** Admin CRUD + order management via mocks.

| Task | Detail |
|------|--------|
| 7.1 | `app/admin/layout.tsx` — Port `AdminDashboard.jsx` header (date `toLocaleDateString`), `AdminSidebar` + `children` (Outlet replacement). Guard: if `!user` -> `/login`, if `user.role !== "admin"` -> `/`. Add `"use client"` . |
| 7.2 | `app/admin/page.tsx` (AdminHome) — Port `AdminHome.jsx:19` `getAllOrders` + `getFoods`, compute `totalRevenue` where `paymentStatus==="paid"` (`reduce totalAmount`), cards `ShoppingBag/DollarSign/UtensilsCrossed`. |
| 7.3 | `app/admin/foods/page.tsx` — Port `ManageFoods.jsx:20` `getFoods`/`addFood`/`updateFood`/`deleteFood`, `CategorySelector` (free-text), table with `next/image` + fallback `placeholder-food.png`, `Pencil/Trash2` actions, `showConfirm` for delete. Form validation (category required). |
| 7.4 | `app/admin/orders/page.tsx` — Port `ManageOrders.jsx:19` `getAllOrders` reverse, table Order ID / Customer (Eye button) / Total ৳ / Payment pill / `CustomSelect` status (`statusOptions` array) -> `updateOrderStatus`. |
| 7.5 | `components/admin/CustomerDetailsModal.tsx` — Port `CustomerDetailsModal.jsx:15` `getCustomerOrders(customerId)` -> `{customer, totalOrders, totalSpent, orders}`, `Modal` display joined date `createdAt`, 2 stat cards, scrollable history. |
| 7.6 | `components/admin/CategorySelector.tsx` + `AdminSidebar.tsx` — typed ports. |

**Verify:** Admin login -> add food -> appears in `/menu`, change order status -> badge updates, customer modal aggregates correct.

### MODULE 8 — Polish, Types, Cleanup & Handover

**Goal:** Production polish, remove dead code, docs.

| Task | Detail |
|------|--------|
| 8.1 | Global `types/index.ts` re-export, `lib/api/types.ts` align. `strict` fixes for `any`. |
| 8.2 | `app/globals.css` — verify dark mode `.dark` overrides from `src/index.css:12` copied, `glass-effect`, `float` keyframes preserved. |
| 8.3 | Replace all `VITE_BACKEND_URL` refs — none remain. `.env.example` with `NEXT_PUBLIC_APP_URL=http://localhost:3000`. |
| 8.4 | Delete dead: `src/assets/` (react.svg), `index.html` PayHere script, `vite.config.js` COOP, `payhere.js`, `axios.js`. |
| 8.5 | `next.config.ts` — `images: { remotePatterns: [{hostname:"**"}] }` or allowlist. `eslint` config. |
| 8.6 | Add `public/placeholder-food.png` (copy from `frontend/public/` or generate). |
| 8.7 | Update root `README.md` + `frontend/README.md` — replace MERN stack table with `Next.js 15, TypeScript, Tailwind v4, Mock API, Dummy Payment`. Document mock data + pluggable payment (`lib/payment/dummy.ts` -> `stripe.ts`). |
| 8.8 | Run `npm run lint`, `npm run build` — fix all `any`, `useEffect` deps, `next/image` warnings. Test full flow: Register -> Login -> Menu -> Add Cart -> Checkout (dummy) -> Confirmation -> My Orders -> Admin Foods/Orders. |
| 8.9 | Git: `frontend/.gitignore` + `node_modules` cleanup, commit with message `feat: migrate frontend to Next.js 15 + TS, mock data + dummy payment, remove PayHere`. |

---

## 4. Dummy Payment & Mock Strategy (No Backend)

### Dummy Payment Interface (`lib/payment/dummy.ts`)

```ts
// lib/payment/dummy.ts
export interface DummyPaymentInput { orderId: string; amount: number; method?: "dummy" | "cod" }
export interface DummyPaymentResult { success: boolean; transactionId: string; status: PaymentStatus }

export async function processDummyPayment(input: DummyPaymentInput): Promise<DummyPaymentResult> {
  await new Promise(r => setTimeout(r, 1200)); // fake processing
  return { success: true, transactionId: `txn_mock_${input.orderId.slice(-8)}_${Date.now()}`, status: "paid" };
}
// Future: lib/payment/stripe.ts — same function signature, swap in checkout
```

*   Checkout ke kono `generate-hash` / `notify_url` call nai. `createOrder` e direct `paymentStatus: "paid"` set hoy dummy er por, or `cod` select korle `pending`.
*   `OrderConfirmation` e `paymentStatus` badge `paid` dekha jabe.

### Mock Persistence

*   `localStorage` keys: `mock_foods`, `mock_orders`, `mock_users`, plus existing `token`, `user`, `cart`, `theme`.
*   On first load, if `mock_foods` empty -> seed from `lib/mocks/foods.ts`. Same for orders/users.
*   Admin CRUD directly mutates `localStorage` so refresh persists.

### PayHere Removal Checklist (must verify via `grep -r payhere`)

- [ ] `grep -ri "payhere" frontend/` returns 0 results
- [ ] `grep -ri "LKR\|merchantId\|generate-hash\|notify" frontend/` returns 0 (except types if commented)
- [ ] `vite.config.js` deleted, `index.html` script gone
- [ ] `WhyChooseUs` / `HowItWorks` copy updated (no PayHere mention)

---

## 5. Migration Execution Order (One Module Per Day Recommended)

| Day | Module | Verify In Browser |
|-----|--------|-------------------|
| 1 | M1 Bootstrap | `localhost:3000` loads |
| 2 | M2 Layout/Theme | Navbar, dark toggle, mobile menu |
| 3 | M3 Auth/Cart | Register/Login persistance, cart add |
| 4 | M4 Mocks/API | Menu shows mock foods without backend |
| 5 | M5 Public Pages | Home + Menu filter + Login/Register |
| 6 | M6 Cart/Checkout/Dummy | Full checkout -> confirmation |
| 7 | M7 Admin | Foods CRUD + orders status + customer modal |
| 8 | M8 Polish/Build | `npm run build` green, no payhere refs |

---

## 6. Appendix — Current vs Target Route Mapping

| Old (Vite) | New (Next.js App) | Change |
|------------|-------------------|--------|
| `/` | `app/page.tsx` | same |
| `/menu` | `app/menu/page.tsx` | fix `?category` query |
| `/cart` | `app/cart/page.tsx` | same |
| `/checkout` | `app/checkout/page.tsx` | dummy payment only |
| `/my-orders` | `app/my-orders/page.tsx` | kebab-case |
| `/order-confirmation/:orderId` | `app/order-confirmation/[orderId]/page.tsx` | dynamic segment |
| `/login` | `app/login/page.tsx` | same |
| `/register` | `app/register/page.tsx` | same |
| `/admin` | `app/admin/layout.tsx` | layout + guard |
| `/admin/foods` | `app/admin/foods/page.tsx` | same |
| `/admin/orders` | `app/admin/orders/page.tsx` | same |

---

## 7. Handover Notes

*   Backend folder (`backend/`) untouched — future e jodi real API lage, `lib/api/client.ts` adapter replace kore `fetch` to `VITE_BACKEND_URL` e point korlei hobe, kono page/component change lagbe na.
*   Payment provider swap: `app/checkout/page.tsx` e `import { processDummyPayment } from "@/lib/payment/dummy"` -> `import { processStripePayment }` e change, interface same.
*   Demo creds `admin@test.com / admin123` + `siam@test.com / 123456` mock e hardcode thakbe — quick-login buttons preserve korte hobe.
*   Ei `.md` root e rakha holo (`/FRONTEND_NEXTJS_MIGRATION.md`) — proti module sesh e `Verify` step browser e test kore tick dite hobe.

> Ready to build — "build mode" e achi, M1 theke start korbo tumi confirm dile.
