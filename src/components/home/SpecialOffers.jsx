import { Link } from "react-router-dom";
import { Percent, Clock, ArrowRight } from "lucide-react";
import SectionHeader from "../common/SectionHeader";

export default function SpecialOffers() {
  const offers = [
    {
      title: "Weekend Combo",
      desc: "1 Pizza + 1 Drink + Free Dessert",
      discount: "30% OFF",
      image: "/hero-pizza.png",
      bg: "from-brand/15 to-brand/5",
    },
    {
      title: "Family Feast",
      desc: "2 Burgers + Fries + 2 Drinks",
      discount: "25% OFF",
      image: "/hero-burger.png",
      bg: "from-accent/15 to-accent/5",
    },
  ];

  return (
    <section className="container mx-auto px-6 lg:px-16 py-16">
      <SectionHeader
        tag="Limited Time"
        icon={Clock}
        titleNormal="Today's"
        titleItalic="Special"
        titleEnd="Offers"
        align="center"
        tagColor="bg-amber-500/10 text-amber-500 border-amber-500/20"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {offers.map((offer) => (
          <div
            key={offer.title}
            className={`relative bg-gradient-to-br ${offer.bg} border border-card-border rounded-3xl p-8 overflow-hidden flex items-center justify-between gap-4`}
          >
            <div className="relative z-10">
              <span className="inline-flex items-center gap-1.5 bg-brand text-white text-xs font-black px-3 py-1.5 rounded-full mb-4">
                <Percent className="w-3 h-3" />
                {offer.discount}
              </span>
              <h3 className="text-2xl font-black text-text-main mb-2">
                {offer.title}
              </h3>
              <p className="text-sm text-muted mb-5">{offer.desc}</p>
              <Link
                to="/menu"
                className="inline-flex items-center gap-1.5 text-sm font-black text-brand hover:gap-3 transition-all"
              >
                Order Now <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <img
              src={offer.image}
              alt=""
              className="w-32 h-32 object-contain drop-shadow-2xl flex-shrink-0 transform rotate-6"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
