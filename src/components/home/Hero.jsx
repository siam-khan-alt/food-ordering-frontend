import { ArrowRight, Flame } from "lucide-react";
import Button from "../common/Button";
export default function Hero() {
  return (
    <main className="container mx-auto px-6 lg:px-16 py-4 lg:py-8 relative overflow-hidden">
      <div className="absolute top-[10%] right-[10%] w-[400px] h-[400px] bg-brand/15 dark:bg-brand/10 rounded-full blur-[120px] -z-10 animate-pulse pointer-events-none" />

      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* LEFT COLUMN */}
        <div className="space-y-5 text-center lg:text-left lg:col-span-6 xl:col-span-5">
          <div className="inline-flex items-center space-x-2 bg-brand/10 text-brand text-xs font-black tracking-widest uppercase px-3 py-1.5 rounded-full border border-brand/20 shadow-sm">
            <Flame className="w-3.5 h-3.5 text-brand animate-bounce" />
            <span>⚡ Satisfy Your Cravings</span>
          </div>

          <h1 className="text-4xl sm:text-5xl xl:text-6xl font-black leading-[1.12] tracking-tight text-text-main">
            Delicious Food, <br />
            Delivered{" "}
            <span className="text-brand italic font-light block sm:inline lg:block xl:inline">
              In Minutes.
            </span>
          </h1>

          <p className="text-muted text-sm sm:text-base max-w-xl mx-auto lg:mx-0 leading-relaxed">
            Experience premium culinary delight right at your doorstep. Fresh
            ingredients, masterful chefs, and blazing fast delivery tailored to
            your tastebuds. We ensure every bite reaches you sizzling hot and
            full of flavors.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap justify-center lg:justify-start gap-3 pt-1">
            <Button
              variant="primary"
              icon={
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              }
            >
              Order Your Bite
            </Button>
            <Button variant="secondary">Explore Menu</Button>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-6 xl:col-span-7 flex flex-col items-center justify-center relative mt-6 lg:mt-0 group cursor-default">
          <div className="absolute top-4 w-[320px] h-[320px] sm:w-[420px] sm:h-[420px] border border-card-border/40 dark:border-white/5 rounded-full -z-10 flex items-center justify-center p-6 bg-card-bg/5 backdrop-blur-[1px]">
            <div className="w-full h-full border border-dashed border-brand/20 dark:border-brand/10 rounded-full animate-[spin_120s_linear_infinite]" />
          </div>

          <div className="relative w-full max-w-[500px] h-[320px] sm:h-[360px] flex items-center justify-center mx-auto select-none">
            {/* LEFT BACK LAYER */}
            <div className="absolute left-[-6%] bottom-4 z-10 scale-95 opacity-90 transform -rotate-12 transition-all duration-500 ease-out group-hover:-translate-x-6 group-hover:-translate-y-2 group-hover:scale-100 group-hover:opacity-100">
              <img
                src="/hero-pizza.png"
                alt="Spicy Gourmet Pizza"
                className="w-48 h-48 sm:w-[230px] sm:h-[230px] object-contain drop-shadow-[0_25px_35px_rgba(0,0,0,0.35)]"
              />
            </div>

            {/*BACK LAYER */}
            <div className="absolute right-[-6%] top-4 z-20 scale-90 opacity-90 transform rotate-12 transition-all duration-500 ease-out group-hover:translate-x-6 group-hover:translate-y-2 group-hover:scale-95 group-hover:opacity-100">
              <img
                src="/hero-cake.png"
                alt="Delicious Sweet Cake"
                className="w-44 h-44 sm:w-[210px] sm:h-[210px] object-contain drop-shadow-[0_25px_35px_rgba(0,0,0,0.35)]"
              />
            </div>

            {/*  HERO BURGER */}
            <div className="absolute z-30 transform transition-all duration-500 ease-out group-hover:scale-105 group-hover:-translate-y-3">
              <img
                src="/hero-burger.png"
                alt="Premium Crunchy Burger"
                className="w-60 h-60 sm:w-[290px] sm:h-[290px] object-contain drop-shadow-[0_40px_60px_rgba(239,68,68,0.35)] dark:drop-shadow-[0_45px_65px_rgba(239,68,68,0.22)]"
              />
            </div>
          </div>

          {/* PROMO CARD */}
          <div className="mt-2 w-full max-w-[380px] bg-card-bg/40 backdrop-blur-md border border-card-border p-3.5 rounded-2xl flex items-center justify-between shadow-xl transition-all duration-500 hover:border-brand/30 transform hover:-translate-y-1">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-brand flex items-center justify-center font-black text-white text-sm shadow-md shadow-brand/20">
                50%
              </div>
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-text-main">
                  Weekend Feast Offer
                </h4>
                <p className="text-[11px] text-muted">
                  On your first 3 orders today
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-black uppercase tracking-widest text-brand block bg-brand/10 px-2 py-1 rounded-md border border-brand/20">
                Code: BITE50
              </span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
