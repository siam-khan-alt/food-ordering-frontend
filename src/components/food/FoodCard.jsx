import { ShoppingCart } from "lucide-react";
import Button from "../common/Button";

export default function FoodCard({ food, onAddToCart }) {
  return (
    <div className="bg-card-bg border border-card-border rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
      <div className="h-48 overflow-hidden bg-bg-main flex items-center justify-center">
        <img
          src={food.image || "/placeholder-food.png"}
          alt={food.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
      </div>
      <div className="p-4 space-y-2">
        <div className="flex justify-between items-start">
          <h3 className="font-black text-text-main text-lg">{food.name}</h3>
          <span className="text-xs font-bold text-muted bg-bg-main px-2 py-1 rounded-md">
            {food.category}
          </span>
        </div>
        <p className="text-brand font-black text-xl">৳{food.price}</p>

        <Button
          variant="primary"
          className="w-full justify-center mt-2"
          icon={<ShoppingCart className="w-4 h-4" />}
          onClick={() => onAddToCart(food)}
        >
          Add to Cart
        </Button>
      </div>
    </div>
  );
}