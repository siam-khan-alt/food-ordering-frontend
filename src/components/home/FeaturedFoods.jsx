import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Flame } from "lucide-react";
import API from "../../api/axios";
import SectionHeader from "../common/SectionHeader";

export default function FeaturedFoods() {
  const [foods, setFoods] = useState([]);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await API.get("/food/all");
        setFoods(res.data.slice(0, 4));
      } catch (err) {
        console.error(err.message);
      }
    };
    fetchFeatured();
  }, []);

  if (foods.length === 0) return null;

  return (
    <section className="container mx-auto px-6 lg:px-16 py-16 relative">
      <div className="absolute top-[10%] left-[5%] w-[300px] h-[300px] bg-brand/8 rounded-full blur-[100px] -z-10 pointer-events-none" />

      <div className="flex justify-between items-end mb-10">
        <SectionHeader
          tag="Chef's Picks"
          icon={Flame}
          titleNormal="Today's"
          titleItalic="Featured"
          titleEnd="Bites"
          align="left"
        />
        <Link
          to="/menu"
          className="hidden sm:flex items-center gap-1.5 text-sm font-bold text-brand hover:gap-3 transition-all"
        >
          View All <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {foods.map((food, idx) => (
          <Link
            to="/menu"
            key={food._id}
            className={`group relative rounded-2xl overflow-hidden bg-card-bg border border-card-border hover:border-brand/40 transition-all duration-300 hover:-translate-y-2 ${
              idx === 0 ? "sm:row-span-2 sm:col-span-1" : ""
            }`}
          >
            <div className={`overflow-hidden ${idx === 0 ? "h-64" : "h-44"}`}>
              <img
                src={food.image || "/placeholder-food.png"}
                alt={food.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                onError={(e) => {
                  e.target.src = "/placeholder-food.png";
                }}
              />
            </div>
            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-4">
              <p className="text-white font-black">{food.name}</p>
              <p className="text-brand font-bold text-sm">৳{food.price}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
