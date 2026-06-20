import { Outlet } from "react-router-dom";
import AdminSidebar from "../../components/admin/AdminSidebar";

export default function AdminDashboard() {
  const formattedDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="container mx-auto px-6 lg:px-16 py-8">
      <div className="relative overflow-hidden rounded-2xl border border-card-border bg-gradient-to-r from-bg-main via-card-bg/50 to-bg-main p-6 md:p-8 mb-8 shadow-sm group cursor-default">
        
        <div className="absolute top-0 right-[20%] w-48 h-48 bg-brand/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-10 right-0 w-36 h-36 bg-amber-500/5 rounded-full blur-[80px] pointer-events-none" />

        <div className="hidden md:block absolute right-4 lg:right-12 top-1/2 -translate-y-1/2 w-[280px] lg:w-[350px] h-[120px] pointer-events-none select-none">
          <img
            src="/hero-pizza.png"
            alt=""
            className="absolute left-0 top-2 w-20 lg:w-28 h-20 lg:h-28 object-contain transform -rotate-12 transition-all duration-500 group-hover:-translate-x-3 group-hover:scale-105"
          />
          <img
            src="/hero-cake.png"
            alt=""
            className="absolute right-0 bottom-2 w-18 lg:w-24 h-18 lg:h-24 object-contain transform rotate-12 transition-all duration-500 group-hover:translate-x-3 group-hover:scale-105"
          />
          <img
            src="/hero-burger.png"
            alt=""
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-24 lg:w-32 h-24 lg:h-32 object-contain drop-shadow-[0_15px_25px_rgba(239,68,68,0.25)] dark:drop-shadow-[0_20px_30px_rgba(239,68,68,0.15)] transition-all duration-500 group-hover:-translate-y-2/3 group-hover:scale-110"
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 max-w-full md:max-w-[55%] lg:max-w-[60%] relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-brand bg-brand/10 px-2.5 py-1 rounded-md border border-brand/20">
                Control Center
              </span>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </div>
            
            <h1 className="text-3xl lg:text-4xl font-black text-text-main tracking-tight">
              Admin <span className="text-brand">Panel</span>
            </h1>
            <p className="text-xs lg:text-sm text-text-muted mt-1.5 leading-relaxed font-medium">
              Welcome back, Boss! You have full access to manage food items, monitor real-time orders, and control operations.
            </p>
          </div>
          
          <div className="sm:border-l sm:border-card-border/60 sm:pl-6 min-w-[140px]">
            <span className="text-[11px] font-bold text-text-muted block uppercase tracking-wider">System Date</span>
            <span className="text-xs lg:text-sm font-black text-text-main mt-0.5 block">{formattedDate}</span>
          </div>
        </div>

      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <AdminSidebar />
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
}