import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Layers } from "lucide-react";
import API from "../../api/axios";
import SectionHeader from "../common/SectionHeader";

export default function CategoryShowcase() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await API.get("/food/all");
        const unique = [...new Set(res.data.map((f) => f.category))];
        const withImages = unique.map((cat) => {
          const food = res.data.find((f) => f.category === cat);
          return { name: cat, image: food?.image };
        });
        setCategories(withImages.slice(0, 5));
      } catch (err) {
        console.error(err.message);
      }
    };
    fetchCategories();
  }, []);

  if (categories.length === 0) return null;

  return (
    <section className="container mx-auto px-6 lg:px-16 py-16">
      <SectionHeader 
        tag="Explore Menu"
        icon={Layers}
        titleNormal="Explore by" 
        titleItalic="Category" 
        align="center"
      />

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {categories.map((cat, idx) => (
          <Link
            to={`/menu?category=${cat.name}`}
            key={cat.name}
            className={`group relative rounded-3xl overflow-hidden bg-card-bg border border-card-border/50 transition-all duration-500 hover:border-brand/50 ${
              idx === 0 ? "col-span-2 row-span-2" : "col-span-1 row-span-1"
            }`}
          >
            <div className="w-full h-full relative">
              <img
                src={cat.image || "/placeholder-food.png"}
                alt={cat.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                onError={(e) => { e.target.src = "/placeholder-food.png"; }}
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
            </div>
            
            <div className="absolute bottom-0 left-0 p-6 z-10 w-full">
              <h3 className="text-white font-black text-xl mb-1">{cat.name}</h3>
              <div className="flex items-center text-white/80 text-xs font-bold gap-1">
                Explore <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        ))}

        <Link
          to="/menu"
          className="col-span-1 row-span-1 rounded-3xl bg-brand flex flex-col items-center justify-center text-white p-6 transition-transform hover:scale-[1.02]"
        >
          <Layers className="w-8 h-8 mb-3" />
          <span className="font-black text-center text-sm">View All</span>
        </Link>
      </div>
    </section>
  );
}