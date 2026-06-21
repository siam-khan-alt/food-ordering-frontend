import { Search, ShoppingCart, Truck } from "lucide-react";
import SectionHeader from "../common/SectionHeader";

export default function HowItWorks() {
  const steps = [
    {
      icon: Search,
      title: "Browse & Pick",
      desc: "Explore our mouth-watering menu and choose your favorites.",
    },
    {
      icon: ShoppingCart,
      title: "Order & Pay",
      desc: "Add to cart and checkout securely with PayHere.",
    },
    {
      icon: Truck,
      title: "Enjoy Hot Meals",
      desc: "Sit back and relax. Your food arrives fresh and fast.",
    },
  ];

  return (
    <section className="container mx-auto px-6 lg:px-16 py-16 relative">
      <div className="absolute top-[20%] right-[10%] w-[250px] h-[250px] bg-accent/10 rounded-full blur-[100px] -z-10 pointer-events-none" />

      <SectionHeader
        tag="🍴 Simple Process"
        titleNormal="How"
        titleItalic="BiteBox"
        titleEnd="Works"
        align="center"
        tagColor="bg-accent/10 text-accent border-accent/20"
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
        {steps.map((step, idx) => (
          <div
            key={step.title}
            className="relative bg-card-bg border border-card-border rounded-2xl p-6 text-center hover:shadow-xl transition-all duration-300"
          >
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-brand text-white rounded-full flex items-center justify-center font-black text-sm shadow-lg">
              {idx + 1}
            </div>
            <div className="w-16 h-16 bg-brand/10 rounded-2xl flex items-center justify-center mx-auto mb-4 mt-2">
              <step.icon className="w-7 h-7 text-brand" />
            </div>
            <h3 className="font-black text-text-main mb-2">{step.title}</h3>
            <p className="text-sm text-muted">{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
