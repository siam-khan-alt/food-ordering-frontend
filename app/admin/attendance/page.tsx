"use client";

import { useEffect, useState } from "react";
import { getStaff } from "@/lib/api/staff";
import { getAttendanceByDate, markAttendance, todayBD } from "@/lib/api/attendance";
import type { StaffMember, Attendance, AttendanceStatus } from "@/types";
import { showError } from "@/components/common/Toast";
import { Check, X, Minus, Palmtree } from "lucide-react";

const OPTS: { v: AttendanceStatus; label: string; icon: React.ReactNode; cls: string }[] = [
  { v: "present", label: "Uposthit", icon: <Check className="w-3.5 h-3.5" />, cls: "bg-accent text-white border-accent" },
  { v: "half", label: "Half", icon: <Minus className="w-3.5 h-3.5" />, cls: "bg-amber-500 text-white border-amber-500" },
  { v: "leave", label: "Chuti", icon: <Palmtree className="w-3.5 h-3.5" />, cls: "bg-blue-500 text-white border-blue-500" },
  { v: "absent", label: "Absent", icon: <X className="w-3.5 h-3.5" />, cls: "bg-red-500 text-white border-red-500" },
];

export default function AttendancePage() {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [date, setDate] = useState(todayBD());
  const [marks, setMarks] = useState<Record<string, AttendanceStatus>>({});
  const [saving, setSaving] = useState<string | null>(null);

  const fetchAll = async () => {
    const [s, a]: [StaffMember[], Attendance[]] = await Promise.all([getStaff(), getAttendanceByDate(date)]);
    setStaff(s.filter((x) => x.active));
    const m: Record<string, AttendanceStatus> = {};
    a.forEach((x) => { m[x.staffId] = x.status; });
    setMarks(m);
  };

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  const mark = async (id: string, status: AttendanceStatus) => {
    setSaving(id);
    try {
      await markAttendance(id, date, status);
      setMarks((p) => ({ ...p, [id]: status }));
    } catch (e) {
      showError((e as Error).message);
    } finally {
      setSaving(null);
    }
  };

  const counts = (Object.values(marks) as AttendanceStatus[]).reduce((acc: Record<string, number>, s) => {
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {});

  return (
    <div>
      <div className="flex flex-wrap gap-3 justify-between items-center mb-2">
        <h2 className="text-xl font-black">Hajira Khata</h2>
        <input type="date" value={date} max={todayBD()} onChange={(e) => setDate(e.target.value)} className="px-3 py-2 rounded-xl border border-card-border bg-bg-main text-sm" />
      </div>
      <p className="text-xs text-muted mb-6">Uposthit: {counts.present || 0} • Half: {counts.half || 0} • Chuti: {counts.leave || 0} • Absent: {counts.absent || 0} • Mark baki: {staff.length - Object.keys(marks).length}</p>

      <div className="space-y-3">
        {staff.map((s) => (
          <div key={s._id} className="bg-card-bg border border-card-border rounded-2xl p-4">
            <div className="flex justify-between items-center mb-3">
              <div>
                <p className="font-black text-sm">{s.name}</p>
                <p className="text-xs text-muted">{s.job} • ৳{s.monthlySalary}/mash</p>
              </div>
              {marks[s._id] && <span className="text-[10px] font-black px-2 py-1 rounded-full bg-accent/10 text-accent uppercase">{marks[s._id]}</span>}
            </div>
            <div className="grid grid-cols-4 gap-2">
              {OPTS.map((o) => {
                const active = marks[s._id] === o.v;
                return (
                  <button
                    key={o.v}
                    disabled={saving === s._id}
                    onClick={() => mark(s._id, o.v)}
                    className={`flex items-center justify-center gap-1 py-2.5 rounded-xl border text-xs font-black transition ${active ? o.cls : "bg-bg-main border-card-border text-muted hover:border-brand/40"}`}
                  >
                    {o.icon}{o.label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      {staff.length === 0 && <p className="text-muted text-center mt-8">Age Staff page e kormochari add korun.</p>}
      <p className="text-xs text-muted mt-4 text-center">Hajira auto beton hisabe jome — Staff page e mash seshe paoa/baki dekhun.</p>
    </div>
  );
}
