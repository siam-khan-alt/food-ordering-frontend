import type { TableSession } from "@/types";

const SESSIONS_KEY = "qr_sessions";
const RATE_KEY = "qr_rate";

function getSessions(): Record<string, TableSession> {
  if (typeof window === "undefined") return {};
  const s = localStorage.getItem(SESSIONS_KEY);
  return s ? JSON.parse(s) : {};
}

function setSessions(s: Record<string, TableSession>) {
  if (typeof window !== "undefined") localStorage.setItem(SESSIONS_KEY, JSON.stringify(s));
}

export function generateTableToken(tableNo: string, tenantSlug: string): TableSession {
  const token = Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
  const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(); // 2h
  const session: TableSession = { tableNo, token, expiresAt, occupied: true, tenantSlug };
  const sessions = getSessions();
  sessions[`${tenantSlug}:${tableNo}`] = session;
  setSessions(sessions);
  return session;
}

export function getTableSession(tableNo: string, tenantSlug: string): TableSession | null {
  const sessions = getSessions();
  const key = `${tenantSlug}:${tableNo}`;
  const s = sessions[key];
  if (!s) return null;
  if (new Date(s.expiresAt).getTime() < Date.now()) {
    // expired
    delete sessions[key];
    setSessions(sessions);
    return null;
  }
  return s;
}

export function validateTableToken(tableNo: string, token: string, tenantSlug: string): boolean {
  const s = getTableSession(tableNo, tenantSlug);
  if (!s) return false;
  if (s.token !== token) return false;
  if (!s.occupied) return false;
  // rate limit: max 3 validates per minute
  const rateKey = `rate:${tenantSlug}:${tableNo}`;
  const raw = localStorage.getItem(RATE_KEY);
  const rates: Record<string, number[]> = raw ? JSON.parse(raw) : {};
  const now = Date.now();
  const arr = (rates[rateKey] || []).filter((t) => now - t < 60_000);
  if (arr.length >= 5) return false; // block spam
  arr.push(now);
  rates[rateKey] = arr;
  localStorage.setItem(RATE_KEY, JSON.stringify(rates));
  return true;
}

export function releaseTable(tableNo: string, tenantSlug: string) {
  const sessions = getSessions();
  delete sessions[`${tenantSlug}:${tableNo}`];
  setSessions(sessions);
}

export function occupyTable(tableNo: string, tenantSlug: string): TableSession {
  return generateTableToken(tableNo, tenantSlug);
}
