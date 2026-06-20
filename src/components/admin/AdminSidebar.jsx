import { NavLink } from "react-router-dom";
import { LayoutDashboard, UtensilsCrossed, ClipboardList } from "lucide-react";

export default function AdminSidebar() {
  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition ${
      isActive
        ? "bg-brand text-white"
        : "text-text-main hover:bg-card-bg"
    }`;

  return (
    <aside className="w-full md:w-64 bg-card-bg border-r border-card-border p-4 space-y-2 md:sticky md:top-24 md:self-start md:h-fit">
      <NavLink to="/admin" end className={linkClass}>
        <LayoutDashboard className="w-4 h-4" />
        Dashboard
      </NavLink>
      <NavLink to="/admin/foods" className={linkClass}>
        <UtensilsCrossed className="w-4 h-4" />
        Manage Foods
      </NavLink>
      <NavLink to="/admin/orders" className={linkClass}>
        <ClipboardList className="w-4 h-4" />
        Manage Orders
      </NavLink>
    </aside>
  );
}