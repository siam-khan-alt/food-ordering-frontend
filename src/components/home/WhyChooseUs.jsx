import { Zap, Leaf, ShieldCheck, Headphones } from "lucide-react";
import SectionHeader from "../common/SectionHeader";

export default function WhyChooseUs() {
  const features = [
    {
      icon: Zap,
      title: "Lightning Fast",
      desc: "Hot food delivered in record time, every time.",
    },
    {
      icon: Leaf,
      title: "Fresh Ingredients",
      desc: "Only the finest, freshest ingredients in every bite.",
    },
    {
      icon: ShieldCheck,
      title: "Secure Payment",
      desc: "Pay safely with PayHere's trusted gateway.",
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      desc: "We're always here whenever you need us.",
    },
  ];

  return (
    <section className="container mx-auto px-6 lg:px-16 py-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        <div className="lg:col-span-5 relative h-[480px] flex items-center justify-center group select-none">
          <div className="absolute w-[350px] h-[350px] bg-brand/15 dark:bg-brand/10 rounded-full blur-[100px] pointer-events-none animate-pulse" />

          <img
            src="/hero-pizza.png"
            alt=""
            className="absolute top-12 left-8 w-44 h-44 object-contain -rotate-[20deg] drop-shadow-[0_20px_35px_rgba(0,0,0,0.25)] z-10 transition-all duration-700 group-hover:-translate-y-4 group-hover:-translate-x-2 group-hover:scale-105"
          />

          <img
            src="/hero-cake.png"
            alt=""
            className="absolute top-6 right-10 w-40 h-40 object-contain rotate-[15deg] drop-shadow-[0_20px_35px_rgba(0,0,0,0.25)] z-20 transition-all duration-700 group-hover:-translate-y-3 group-hover:translate-x-2 group-hover:scale-105"
          />

          <img
            src="/hero-burger.png"
            alt=""
            className="absolute bottom-8 left-1/2 -translate-x-1/2 w-56 h-56 object-contain rotate-[-5deg] drop-shadow-[0_35px_50px_rgba(239,68,68,0.3)] z-30 transition-all duration-700 group-hover:translate-y-2 group-hover:scale-105"
          />
        </div>

        <div className="lg:col-span-7 lg:pl-6">
          <SectionHeader
            tag="Why BiteBox"
            titleNormal="We Make Every"
            titleItalic="Craving"
            titleEnd="Count"
            align="left"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="flex gap-4 p-5 rounded-2xl border border-card-border/60 bg-card-bg/30 backdrop-blur-sm transition-all duration-300 hover:border-brand/30 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/5"
              >
                <div className="w-11 h-11 rounded-xl bg-brand/10 flex items-center justify-center flex-shrink-0 border border-brand/10">
                  <feature.icon className="w-5 h-5 text-brand" />
                </div>
                <div>
                  <h4 className="font-black text-text-main text-sm mb-1.5 tracking-wide">
                    {feature.title}
                  </h4>
                  <p className="text-xs text-muted leading-relaxed font-medium">
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
