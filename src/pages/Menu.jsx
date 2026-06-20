import { useState, useEffect } from "react";
import { Search, SlidersHorizontal, ArrowUpDown } from "lucide-react";
import API from "../api/axios";
import FoodCard from "../components/food/FoodCard";
import CustomSelect from "../components/common/CustomSelect";
import { showSuccess, showError } from "../components/common/Toast";

export default function Menu() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState("default");

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const res = await API.get("/food/all");
        setFoods(res.data);
      } catch (err) {
        showError("Failed to load menu");
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFoods();
  }, []);
console.log(foods);

  const handleAddToCart = (food) => {
    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingItem = existingCart.find((item) => item._id === food._id);

    let updatedCart;
    if (existingItem) {
      updatedCart = existingCart.map((item) =>
        item._id === food._id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      updatedCart = [...existingCart, { ...food, quantity: 1 }];
    }

    localStorage.setItem("cart", JSON.stringify(updatedCart));
    showSuccess(`${food.name} added to cart!`);
  };

  const categories = ["All", ...new Set(foods.map((food) => food.category))];
  const categoryOptions = categories.map((cat) => ({ value: cat, label: cat }));

  const sortOptions = [
    { value: "default", label: "Sort by" },
    { value: "lowToHigh", label: "Price: Low to High" },
    { value: "highToLow", label: "Price: High to Low" },
  ];

  const filteredFoods = foods
    .filter((food) =>
      food.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((food) =>
      selectedCategory === "All" ? true : food.category === selectedCategory
    )
    .sort((a, b) => {
      if (sortOrder === "lowToHigh") return a.price - b.price;
      if (sortOrder === "highToLow") return b.price - a.price;
      return 0;
    });

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-muted font-bold">Loading menu...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 lg:px-16 py-10">
      <div className="text-center mb-8">
        <span className="inline-flex items-center gap-2 bg-brand/10 text-brand text-xs font-black tracking-widest uppercase px-3 py-1.5 rounded-full border border-brand/20 mb-3">
          Fresh & Hot, Just for You
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-text-main">
          Explore Our <span className="text-brand ">Delicious</span> Menu
        </h1>
        <p className="text-muted text-sm mt-2 max-w-md mx-auto">
          Handpicked flavors crafted to satisfy every craving, delivered fresh
          and fast.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-3 mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            placeholder="Search food..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-card-bg border border-card-border text-text-main placeholder-muted focus:outline-none focus:border-brand/50 transition"
          />
        </div>

        <CustomSelect
          icon={<SlidersHorizontal className="w-4 h-4 text-brand" />}
          value={selectedCategory}
          options={categoryOptions}
          onChange={setSelectedCategory}
        />

        <CustomSelect
          icon={<ArrowUpDown className="w-4 h-4 text-brand" />}
          value={sortOrder}
          options={sortOptions}
          onChange={setSortOrder}
        />
      </div>

      {filteredFoods.length === 0 ? (
        <p className="text-center text-muted">No food items found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredFoods.map((food) => (
            <FoodCard
              key={food._id}
              food={food}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      )}
    </div>
  );
}
