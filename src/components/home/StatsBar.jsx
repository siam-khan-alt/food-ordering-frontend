import { Users, UtensilsCrossed, Clock, Star } from "lucide-react";
import SectionHeader from "../common/SectionHeader";

export default function StatsBar() {
  const stats = [
    {
      icon: Users,
      value: "500+",
      label: "Happy Customers",
      img: "/stat-chef.png",
      imgStyle: "group-hover:-translate-y-4 group-hover:-rotate-6",
    },
    {
      icon: UtensilsCrossed,
      value: "50+",
      label: "Menu Items",
      img: "/stat-burger.png",
      imgStyle: "group-hover:-translate-y-4 group-hover:scale-110",
    },
    {
      icon: Clock,
      value: "30 Min",
      label: "Avg. Delivery",
      img: "/stat-delivery.png",
      imgStyle: "group-hover:translate-x-4 group-hover:-translate-y-2",
    },
    {
      icon: Star,
      value: "4.8",
      label: "Customer Rating",
      img: "/stat-rating.png",
      imgStyle: "group-hover:-translate-y-4 group-hover:rotate-12",
    },
  ];

  return (
    <section className="container mx-auto px-6 lg:px-16 py-16 relative overflow-hidden">
      <div className="absolute top-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-card-border to-transparent" />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[50%] bg-brand/5 dark:bg-brand/5 rounded-full blur-[130px] pointer-events-none" />

      <SectionHeader
        tag="Our Track Record"
        titleNormal="BiteBox By The"
        titleItalic="Numbers"
        align="center"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 relative z-10">
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className="group flex flex-col items-center text-center relative cursor-default"
          >
            <div
              className={`w-36 h-36 sm:w-40 sm:h-40 mb-4 pointer-events-none select-none transition-all duration-700 ease-out ${stat.imgStyle}`}
            >
              <img
                src={stat.img}
                alt=""
                className="w-full h-full object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.12)] dark:drop-shadow-[0_25px_40px_rgba(0,0,0,0.55)]"
              />
            </div>

            {/* কন্টেন্ট লেয়ার */}
            <div className="space-y-1 relative">
              <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-5xl font-black text-brand/[0.04] dark:text-white/[0.02] select-none tracking-widest">
                0{index + 1}
              </span>

              <div className="flex items-center justify-center gap-2">
                <stat.icon className="w-4 h-4 text-brand/70" />
                <h3 className="font-black text-3xl sm:text-4xl tracking-tight text-text-main leading-none">
                  {stat.value}
                </h3>
              </div>

              <p className="text-xs font-black text-muted uppercase tracking-widest pt-0.5">
                {stat.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute bottom-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-card-border to-transparent" />
    </section>
  );
}
