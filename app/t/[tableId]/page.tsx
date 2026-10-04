"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useTenant } from "@/context/TenantContext";
import { getTableSession, validateTableToken } from "@/lib/qr";
import { useCart } from "@/context/CartContext";
import { getFoods } from "@/lib/api/food";
import { createOrder } from "@/lib/api/orders";
import { useState, useEffect } from "react";
import FoodCard from "@/components/food/FoodCard";
import Button from "@/components/common/Button";
import { showSuccess, showError } from "@/components/common/Toast";
import { useRouter } from "next/navigation";
import type { Food } from "@/types";

export default function QRTablePage() {
  const { tableId } = useParams() as { tableId: string };
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { tenant } = useTenant();
  const { addToCart, cartItems, clearCart } = useCart();
  const router = useRouter();
  const [foods, setFoods] = useState<Food[]>([]);
  const [valid, setValid] = useState<boolean | null>(null);

  useEffect(() => {
    if (!token) {
      setValid(false);
      return;
    }
    const ok = validateTableToken(tableId, token, tenant.slug);
    setValid(ok);
    if (ok) getFoods().then(setFoods);
  }, [tableId, token, tenant.slug]);

  const handleAdd = (f: Food) => {
    addToCart(f);
    showSuccess(`${f.name} added`);
  };

  const handleOrder = async () => {
    if (cartItems.length === 0) return showError("Cart empty");
    const items = cartItems.map((i) => ({ foodItemId: i._id, quantity: i.quantity }));
    const customer = { _id: `qr_${tableId}_${Date.now()}`, name: `Table ${tableId}`, email: `table${tableId}@qr.local` };
    // attach table info via localStorage? For mock we just create order
    const { order } = await createOrder(items, customer);
    showSuccess(`Order placed for Table ${tableId}!`);
    clearCart();
    router.push(`/order-confirmation/${order._id}`);
  };

  if (valid === null) return <div className="min-h-[60vh] flex items-center justify-center"><p className="text-muted">Validating QR...</p></div>;

  if (!valid) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
        <h2 className="text-2xl font-black text-red-500 mb-2">Invalid or Expired QR</h2>
        <p className="text-sm text-muted max-w-md">This QR is expired (2h limit), table not occupied, or scanned outside restaurant. Please ask waiter to reactivate Table {tableId}.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 lg:px-16 py-8">
      <div className="bg-brand/10 border border-brand/20 rounded-2xl p-4 mb-6 text-center">
        <h1 className="text-2xl font-black text-text-main">Table {tableId}</h1>
        <p className="text-xs text-muted">Tenant: {tenant.name} ({tenant.slug}) — QR valid 2h • One order per session • Outside scan blocked</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {foods.slice(0, 8).map((f) => (
          <FoodCard key={f._id} food={f} onAddToCart={handleAdd} />
        ))}
      </div>

      {cartItems.length > 0 && (
        <div className="bg-card-bg border border-card-border rounded-2xl p-5 sticky bottom-4 shadow-xl">
          <p className="font-bold mb-2">Cart ({cartItems.length}) — Table {tableId}</p>
          <Button variant="primary" className="w-full justify-center" onClick={handleOrder}>
            Send to Kitchen (Table {tableId})
          </Button>
        </div>
      )}
    </div>
  );
}
