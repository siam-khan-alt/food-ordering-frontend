"use client";

import { useState } from "react";
import { useRestaurant } from "@/context/RestaurantContext";
import { allModules, allOperationModes, canAccess } from "@/lib/restaurant";
import type { ModuleKey, OperationMode } from "@/types";
import Button from "@/components/common/Button";
import { showSuccess } from "@/components/common/Toast";

/**
 * SUPER ADMIN = owner settings for THIS single restaurant.
 * Toggle operation mode + modules. Source: restaurant config (not tenants).
 * Per-client copy: edit lib/restaurant.ts RESTAURANT_DEFAULT, then fine-tune here.
 */
export default function FeatureSettingsPage() {
  const { config, updateConfig } = useRestaurant();
  const [name, setName] = useState(config.name);
  const [mode, setMode] = useState<OperationMode>(config.operationMode);
  const [modules, setModules] = useState<ModuleKey[]>([...config.modules]);

  const toggleModule = (key: ModuleKey) => {
    setModules((prev) => (prev.includes(key) ? prev.filter((m) => m !== key) : [...prev, key]));
  };

  const preview = { operationMode: mode, modules };

  const handleSave = () => {
    updateConfig({ name: name.trim() || config.name, operationMode: mode, modules });
    showSuccess("Restaurant settings saved — guards updated instantly");
  };

  return (
    <div>
      <h2 className="text-xl font-black text-text-main mb-1">Feature Settings</h2>
      <p className="text-sm text-muted mb-6">Turn modules on/off for this restaurant. No code delete — same gate as shop + admin.</p>

      <div className="bg-card-bg border border-card-border rounded-2xl p-5 mb-4">
        <label className="text-xs font-black uppercase tracking-wide text-muted">Restaurant Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-2 w-full px-4 py-3 rounded-xl bg-bg-main border border-card-border text-text-main outline-none focus:border-brand/50"
        />
      </div>

      <div className="bg-card-bg border border-card-border rounded-2xl p-5 mb-4">
        <label className="text-xs font-black uppercase tracking-wide text-muted">Operation Mode</label>
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
          {allOperationModes().map((m) => (
            <button
              key={m.value}
              onClick={() => setMode(m.value)}
              className={`px-3 py-3 rounded-xl border font-bold text-xs transition ${mode === m.value ? "bg-brand text-white border-brand" : "bg-bg-main border-card-border text-text-main hover:border-brand/40"}`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-card-bg border border-card-border rounded-2xl p-5 mb-4">
        <label className="text-xs font-black uppercase tracking-wide text-muted">Modules (client said “later” → just untick)</label>
        <div className="mt-3 space-y-2">
          {allModules.map((m) => {
            const on = modules.includes(m.key);
            const blockedByMode = !canAccess(preview, m.key);
            return (
              <button
                key={m.key}
                onClick={() => toggleModule(m.key)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition ${on ? "border-brand/40 bg-brand/5" : "border-card-border bg-bg-main opacity-70"}`}
              >
                <span className={`w-10 h-6 rounded-full relative transition ${on ? "bg-brand" : "bg-card-border"}`}>
                  <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${on ? "left-[18px]" : "left-0.5"}`} />
                </span>
                <span className="flex-1">
                  <span className="block font-black text-sm text-text-main">{m.label}</span>
                  <span className="block text-xs text-muted">{m.desc}{blockedByMode ? " • blocked by mode" : ""}</span>
                </span>
                <span className={`text-[10px] font-black px-2 py-1 rounded-full ${on ? "bg-brand/10 text-brand" : "bg-card-border text-muted"}`}>
                  {on ? "ON" : "OFF"}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <Button variant="primary" className="w-full justify-center" onClick={handleSave}>
        Save Settings
      </Button>
    </div>
  );
}
