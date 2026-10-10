import type { Attendance, AttendanceStatus } from "@/types";

const KEY = "mock_attendance";
const delay = (ms = 200) => new Promise((r) => setTimeout(r, ms));

export const todayBD = () => new Date().toISOString().slice(0, 10);

function getStored(): Attendance[] {
  if (typeof window === "undefined") return [];
  const saved = localStorage.getItem(KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return [];
    }
  }
  return [];
}

function setStored(list: Attendance[]) {
  if (typeof window !== "undefined") localStorage.setItem(KEY, JSON.stringify(list));
}

export async function getAttendanceByDate(date: string): Promise<Attendance[]> {
  await delay();
  return getStored().filter((a) => a.date === date);
}

export async function getAttendanceByMonth(month: string): Promise<Attendance[]> {
  await delay();
  return getStored().filter((a) => a.date.startsWith(month));
}

export async function markAttendance(staffId: string, date: string, status: AttendanceStatus): Promise<Attendance> {
  await delay();
  const list = getStored();
  const idx = list.findIndex((a) => a.staffId === staffId && a.date === date);
  if (idx >= 0) {
    list[idx] = { ...list[idx], status };
    setStored(list);
    return list[idx];
  }
  const item: Attendance = { _id: `att_${Date.now()}_${staffId}`, staffId, date, status, createdAt: new Date().toISOString() };
  setStored([...list, item]);
  return item;
}
