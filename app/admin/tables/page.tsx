"use client";

import { useState, useEffect } from "react";
import { useTenant } from "@/context/TenantContext";
import { canAccess } from "@/lib/tenancy";
import { getTableSession, occupyTable, releaseTable, generateTableToken } from "@/lib/qr";
import Button from "@/components/common/Button";
import { QrCode } from "lucide-react";

export default function TablesPage() {
  const { tenant } = useTenant();
  const [refresh, setRefresh] = useState(0);

  if (!canAccess(tenant, "table")) return <div className="p-6 text-center text-muted">Table module disabled for {tenant.operationMode}</div>;

  const tables = Array.from({ length: 12 }, (_, i) => `T${i + 1}`);

  return (
    <div>
      <h2 className="text-xl font-black mb-6">Tables — {tenant.name}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {tables.map((t) => {
          const session = getTableSession(t, tenant.slug);
          const occupied = !!session;
          const qrLink = occupied ? `${window.location.origin}/t/${t}?token=${session.token}` : "";
          return (
            <div key={t} className={`border rounded-2xl p-4 ${occupied ? "bg-amber-500/10 border-amber-500/30" : "bg-card-bg border-card-border"}`}>
              <p className="font-black text-lg">{t}</p>
              <p className={`text-xs font-bold ${occupied ? "text-amber-600" : "text-accent"}`}>{occupied ? "Occupied" : "Available"}</p>
              {occupied && session && <p className="text-[10px] text-muted mt-1">Exp: {new Date(session.expiresAt).toLocaleTimeString()}</p>}
              <div className="mt-3 flex gap-2">
                {!occupied ? (
                  <Button variant="primary" className="text-xs py-2 px-3" onClick={() => { occupyTable(t, tenant.slug); setRefresh((r) => r + 1); }}>
                    Occupy
                  </Button>
                ) : (
                  <Button variant="secondary" className="text-xs py-2 px-3" onClick={() => { releaseTable(t, tenant.slug); setRefresh((r) => r + 1); }}>
                    Release
                  </Button>
                )}
              </div>
              {occupied && (
                <div className="mt-3 bg-bg-main rounded-xl p-2">
                  <div className="flex items-center gap-1 text-xs font-bold">
                    <QrCode className="w-3 h-3" /> QR Link
                  </div>
                  <p className="text-[10px] break-all text-muted">{qrLink}</p>
                  <a href={qrLink} target="_blank" className="text-xs text-brand underline">
                    Open
                  </a>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <p className="text-xs text-muted mt-4">QR valid 2h, outside scan blocked by occupancy + token.</p>
    </div>
  );
}
