import type { Attendance, StaffMember } from "@/types";

/** Choto hotel niyom: mash = 30 din. half = 0.5 din. leave/absent = 0. */
export function perDaySalary(monthly: number) {
  return monthly / 30;
}

export function monthPayable(staff: StaffMember, list: Attendance[]) {
  const mine = list.filter((a) => a.staffId === staff._id);
  let days = 0;
  for (const a of mine) {
    if (a.status === "present") days += 1;
    else if (a.status === "half") days += 0.5;
  }
  return Math.round(days * perDaySalary(staff.monthlySalary));
}

export function countByStatus(list: Attendance[], staffId: string) {
  const mine = list.filter((a) => a.staffId === staffId);
  return {
    present: mine.filter((a) => a.status === "present").length,
    half: mine.filter((a) => a.status === "half").length,
    absent: mine.filter((a) => a.status === "absent").length,
    leave: mine.filter((a) => a.status === "leave").length,
  };
}
