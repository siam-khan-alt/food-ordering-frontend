# BiteBox — Restaurant OS + Super Admin (SaaS) Plan

> Goal: BiteBox ke **portfolio + real restaurant demo** er jonno **Restaurant Software** banano. Ek code-base diye jekono restaurant ke module-base software dewa jabe. Super Admin control korbe kon tenant (restaurant) kon module pabe. Prothom 3 ta operation mode diye start.
> **Mock-first:** Ekhn sob `lib/mocks` + `localStorage` — pore Django + PostgreSQL hands-on backend e replace hobe (adapter pattern).

## Progress (10/10 to Standard)

- [x] M1: Tenant core — types, mock tenants, TenantContext, canAccess — `2026-10-04` mock
- [x] M2: Super Admin panel — tenants CRUD (mock) — `2026-10-04` mock
- [x] M3: Operation mode guard — Navbar, AdminSidebar, menu/cart/checkout hidden by mode — `2026-10-04` mock
- [x] M4: Module toggles per tenant (Super Admin control) — `2026-10-04` mock
- [x] M5: Guest checkout (no login) + phone tracking — `2026-10-04` mock
- [x] M6: QR Table Session — token 2h, occupancy, rate limit, /t/[tableId] — `2026-10-04` mock
- [ ] M7: POS Walk-in
- [ ] M8: Table Grid + KDS
- [ ] M9: Polish & demo

> Each M -> 1 commit `[Setup]/[Feature]:` + MD update + `npm run build` green before next.

---

## 1. Vision

**Product:** `BiteBox OS` — ekta single Next.js codebase diye multiple restaurant ke serve kora (multi-tenant SaaS).
**Buyer:** Single hotel/resturant owner je online + dokane asa customer ek sathe handle korte chay.
**Super Admin:** Tumi (BiteBox owner) — tenant create, module on/off, billing control.
**Demo:** Portfolio te live demo + restaurant visit e tablet e `demo.bitebox.com` dekhanor moto polished.

---

## 2. Roles (4 ta)

| Role | Access | Example |
|------|--------|---------|
| **Super Admin** | Sob tenant, sob module, billing, platform settings | Tumi — `superadmin@bitebox.com` |
| **Tenant Admin** | Nijer restaurant er sob order, menu, staff, report | `admin@hotel-ruposhi.com` |
| **Staff** | POS, Kitchen Display, Order update (limited) | Cashier / Chef |
| **Customer** | Browse, cart, checkout (online only) | `siam@test.com` |

RBAC: `types/index.ts` e `Role = "super_admin" | "tenant_admin" | "staff" | "customer"`

---

## 3. Multi-Tenancy Model (Recommended: Row-level)

**Option A (v1 recommended):** Single DB, shob table e `tenant_id` (restaurant_id).

```
tenants { id, slug, name, logo, address, phone, operation_mode, modules: JSONB, subscription_status }
users { id, tenant_id (nullable for super_admin), role, name, email }
food_items { id, tenant_id, category_id, name, price, image }
orders { id, tenant_id, customer_id, source: "online"|"pos", order_type, table_no, status }
```

*   Pros: Simple, 1 deploy, Super Admin query easy, mock e `localStorage tenant_id` diye simulate kora jabe.
*   Cons: Data isolation logic code e maintain korte hoy (every query `where tenant_id = X`).

**Option B (later):** DB per tenant — scale er jonno, ekhon lagbe na.

Slug routing: `ruposhi.bitebox.com` or `bitebox.com/r/ruposhi` or `bitebox.com?tenant=ruposhi` — v1 e `localStorage tenant_slug`.

---

## 4. The 3 Operation Modes (Tenant er Control System)

Super Admin tenant create er somoy ei 3 tar 1 ta select korbe — module auto on/off.

| Mode | Value | Ki cholbe | Example Hotel |
|------|-------|-----------|---------------|
| **A. Online Only** | `online_only` | Customer website + delivery/takeaway + dummy/bKash payment. POS/Table off. | Cloud kitchen, delivery-only |
| **B. Restaurant Only (Direct/POS)** | `pos_only` | POS walk-in + dine-in table + KDS (Kitchen Display). Online menu/cart off. | Traditional hotel, online ney na |
| **C. Hybrid (Restaurant + Online)** | `hybrid` | Sob cholbe — online + POS + table | Full restaurant (tomar target 80% customer) |

`tenants.operation_mode` enum. Frontend e guard:

```ts
// lib/tenancy.ts
export function canAccess(tenant: Tenant, feature: "online_order" | "pos" | "table") {
  if (tenant.operation_mode === "online_only") return feature === "online_order";
  if (tenant.operation_mode === "pos_only") return feature !== "online_order";
  return true; // hybrid sob
}
```

Navbar, AdminSidebar, Checkout conditionally hide.

---

## 5. Module System (Super Admin theke On/Off)

**Core (always on):** Auth, Menu CRUD, Orders (basic), Dashboard stats

**Add-on Modules (Super Admin toggle per tenant):**

| Module | Key | Ki dey | Mode dependency |
|--------|-----|--------|-----------------|
| Online Ordering | `online_order` | Menu, Cart, Checkout, My Orders | A, C |
| POS (Walk-in) | `pos` | `+ New Walk-in Order` in `app/admin/orders`, cash payment, print bill | B, C |
| Table Management | `table` | Table list (T1-T20), QR per table, `tableNo` on order, status `occupied` | B, C |
| Kitchen Display (KDS) | `kds` | `app/admin/kitchen` — live tickets `preparing` auto | B, C |
| Staff Roles | `staff` | Cashier/Chef invite | B, C |
| Reports | `reports` | Revenue by source, daily close | All |
| Coupons | `coupons` | `BITE50` logic | A, C |

DB: `tenants.modules: string[]` e.g. `["online_order","pos","table"]`

Super Admin UI: `app/super-admin/tenants/[id]` e checkbox list.

---

## 6. Super Admin Panel (new app route)

```
app/super-admin/
├── layout.tsx (guard super_admin)
├── page.tsx (tenant list, stats: total tenants, revenue)
├── tenants/page.tsx (table: name, slug, mode, modules, status, actions)
├── tenants/new/page.tsx (form: name, slug, owner email/pw, mode, modules)
└── tenants/[id]/page.tsx (edit mode/modules, suspend, view orders)
```

*   Mock e: `lib/mocks/tenants.ts` seed 3 tenant (demo hotel A online_only, B pos_only, C hybrid).
*   Auth: `superadmin@bitebox.com / super123` hardcoded mock.

**Flow:** Super Admin -> Create Tenant `Hotel Ruposhi` -> mode `hybrid` -> modules tick -> Create -> Tenant Admin auto-created (`admin@hotel-ruposhi.com`).

---

## 7. Tenant Admin / Staff Panel (existing `app/admin` upgrade)

`app/admin/*` ke tenant-aware koro:

*   `app/admin/layout.tsx` already guard `tenant_admin` — add `tenant_id` check + mode guard.
*   `app/admin/pos/page.tsx` (new) — POS UI: left category, middle food grid, right cart + customer phone + Table select + Cash/bKash.
*   `app/admin/kitchen/page.tsx` — KDS: columns `Placed | Preparing | Ready`.
*   `app/admin/tables/page.tsx` — grid T1-T20.

If `mode === "online_only"` -> hide POS/Table/KDS links in `AdminSidebar.tsx`.

---

## 8. Customer Frontend (existing `app/*` tweak)

Mode guard:

```ts
// app/menu/page.tsx, app/cart/page.tsx, app/checkout/page.tsx
const tenant = useTenant(); // from context
if (!canAccess(tenant, "online_order")) return <div>Online ordering disabled for this restaurant</div>;
```

Demo e: `?tenant=ruposhi&type=hybrid` diye switch kore dekhan jabe 3 mode.

---

## 9. Folder Structure (v2 target)

```
BiteBox/frontend/
├── app/
│   ├── (customer)/ (existing)
│   ├── admin/ (tenant admin)
│   └── super-admin/ (new)
├── components/
│   ├── pos/ (PosCart, TableGrid)
│   └── kds/ (TicketCard)
├── context/TenantContext.tsx (current tenant slug, mode, modules)
├── lib/
│   ├── mocks/tenants.ts
│   ├── tenancy.ts (canAccess, getTenant)
│   └── api/tenant.ts
├── types/index.ts (Tenant, OperationMode)
```

---

## 10. Build Order (Module-base, Super Admin first)

| # | Task | Commit prefix |
|---|------|---------------|
| 1 | Tenant types + mock tenants (3 tenants) + `TenantContext` | `[Setup]: add tenancy core` |
| 2 | Super Admin layout + tenants CRUD (mock) | `[Feature]: add super admin tenants` |
| 3 | Mode guard (`online_only`/`pos_only`/`hybrid`) + `canAccess` + hide nav | `[Feature]: add operation mode control` |
| 4 | Module toggles per tenant (Super Admin checkbox) | `[Feature]: add module toggles` |
| 5 | POS Walk-in page (`app/admin/pos`) | `[Feature]: add POS walk-in` |
| 6 | Table + KDS (optional demo polish) | `[Feature]: add table and KDS` |

Each module ek branch commit, `main` e merge — tomar existing `nextjs-migration` er moto.

---

## 11. Demo Story for Portfolio / Restaurant Visit

**Pitch 1 min:**

> "Eta BiteBox OS — 3 mode. Apnar hotel jodi sudhu dokane customer hoy, POS mode. Online delivery chaile Online mode. Dui tai chaile Hybrid. Ami Super Admin theke apnar hotel ke Hybrid diye dilam — ekhon apnar staff POS e walk-in order nibe, customer online order korbe, kitchen ek screen e sob dekhbe."

Tablet e 3 tab open: `ruposhi (hybrid)`, `cloud (online_only)`, `deshi (pos_only)` — mode change live dekhano.

---

## 12. Decision Locked

*   Start with **Single DB row-level tenancy**, `operation_mode` 3 ta.
*   Super Admin theke module on/off — same codebase, feature flag.
*   First demo tenants: 3 ta ready rakhbo.

Ready hole M1 `TenantContext` theke start korbo — `ok` dile branch `feature/super-admin` khule kaj shuru korbo.
