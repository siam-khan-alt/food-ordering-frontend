import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Button from "../common/Button";

export default function CTABanner() {
  const navigate = useNavigate();

  return (
    <section className="container mx-auto px-6 lg:px-16 py-8">
      <div className="relative bg-brand rounded-3xl p-8 lg:p-12 overflow-hidden text-center group cursor-default">
        
        <div className="absolute top-[-30%] right-[-10%] w-[300px] h-[300px] bg-white/20 rounded-full blur-[80px]" />
        <div className="absolute bottom-[-30%] left-[-10%] w-[250px] h-[250px] bg-white/10 rounded-full blur-[80px]" />

        <div className="hidden md:block absolute left-[4%] lg:left-[8%] top-1/2 -translate-y-1/2 w-28 lg:w-36 h-28 lg:h-36 pointer-events-none select-none z-10">
          <img
            src="/hero-pizza.png"
            alt=""
            className="w-full h-full object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.3)] transform -rotate-12 transition-all duration-500 group-hover:scale-105 group-hover:rotate-0"
          />
        </div>

        <div className="hidden md:block absolute right-[4%] lg:right-[8%] top-1/2 -translate-y-1/2 w-28 lg:w-36 h-28 lg:h-36 pointer-events-none select-none z-10">
          <img
            src="/hero-burger.png"
            alt=""
            className="w-full h-full object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.3)] transform rotate-12 transition-all duration-500 group-hover:scale-105 group-hover:rotate-0"
          />
        </div>

        <div className="max-w-xl mx-auto relative z-20 flex flex-col items-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white mb-3 tracking-tight leading-tight">
            Cravings Don't Wait. <br className="hidden sm:block" />Neither Should You.
          </h2>
          <p className="text-white/90 mb-6 text-xs sm:text-sm font-medium leading-relaxed max-w-md">
            Order now and get your favorite meal delivered hot, fresh, and bursting with flavors right to your doorstep.
          </p>
          
          <Button
            variant="primary"
            onClick={() => navigate("/menu")}
            className="bg-white !text-brand hover:bg-neutral-50 shadow-xl shadow-black/10 hover:shadow-black/15 font-black"
            icon={
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            }
          >
            Order Your Bite
          </Button>
        </div>
        
      </div>
    </section>
  );
}