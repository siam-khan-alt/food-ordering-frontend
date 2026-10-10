"use client";

import { QRCodeSVG } from "qrcode.react";
import type { Order, RestaurantConfig } from "@/types";

/** 80mm thermal bill — sada background, kalo lekha (printer friendly) */
export default function BillReceipt({ order, shop, menuUrl }: { order: Order; shop: RestaurantConfig; menuUrl: string }) {
  const d = new Date(order.createdAt);
  const dateStr = d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  const timeStr = d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  const subtotal = order.totalAmount + (order.discount || 0);
  const typeStr = order.orderType === "both" ? "Ekhane + Parcel" : order.orderType === "parcel" ? "Parcel" : "Ekhane khabe";

  return (
    <div id="bill-print" className="w-[280px] mx-auto bg-white text-black text-xs p-4" style={{ fontFamily: "monospace" }}>
      <div className="text-center border-b border-dashed border-black pb-2 mb-2">
        <p className="font-black text-base">{shop.name}</p>
        {shop.address && <p>{shop.address}</p>}
        {shop.phone && <p>Ph: {shop.phone}</p>}
      </div>

      <div className="flex justify-between mb-1">
        <span>Bill: #{order._id.slice(-8)}</span>
        <span>{typeStr}</span>
      </div>
      <div className="flex justify-between border-b border-dashed border-black pb-2 mb-2">
        <span>{dateStr}</span>
        <span>{timeStr}</span>
      </div>

      <div className="space-y-1 border-b border-dashed border-black pb-2 mb-2">
        {order.items.map((it, idx) => (
          <div key={idx}>
            <div className="flex justify-between font-bold">
              <span>{it.foodItem.name} x{it.quantity}</span>
              <span>৳{it.price * it.quantity}</span>
            </div>
            {it.foodItem.category === "Package" && <p className="text-[10px]">(package)</p>}
          </div>
        ))}
      </div>

      <div className="flex justify-between">
        <span>Subtotal</span>
        <span>৳{subtotal}</span>
      </div>
      {(order.discount || 0) > 0 && (
        <div className="flex justify-between">
          <span>Char</span>
          <span>- ৳{order.discount}</span>
        </div>
      )}
      <div className="flex justify-between font-black text-sm border-t border-dashed border-black mt-1 pt-1">
        <span>Total</span>
        <span>৳{order.totalAmount}</span>
      </div>
      <p className="text-center mt-1">Payment: {order.paymentStatus.toUpperCase()}</p>

      <div className="text-center border-t border-dashed border-black mt-2 pt-2">
        <p className="font-bold mb-1">Scan kore menu + offer dekhun</p>
        <div className="flex justify-center">
          <QRCodeSVG value={menuUrl} size={120} />
        </div>
        <p className="mt-1 break-all">{menuUrl}</p>
        <p className="font-black mt-2">Dhonnobad, abar asben!</p>
      </div>
    </div>
  );
}
