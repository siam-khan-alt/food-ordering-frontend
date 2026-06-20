import { Trash2, Plus, Minus } from "lucide-react";
import { showConfirm } from "../common/Toast";

export default function CartItem({ item, onUpdateQuantity, onRemove }) {
  return (
    <div className="flex items-center gap-4 bg-card-bg border border-card-border rounded-2xl p-4 hover:border-brand/30 transition group">
      <div className="w-20 h-20 rounded-xl bg-bg-main flex items-center justify-center overflow-hidden flex-shrink-0">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          onError={(e) => { e.target.src = "/placeholder-food.png"; }}
        />
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-black text-text-main truncate">{item.name}</h3>
        <p className="text-brand font-bold text-sm">৳{item.price}</p>
      </div>

      <div className="flex items-center gap-2 bg-bg-main rounded-xl p-1">
        <button
          onClick={() => onUpdateQuantity(item._id, -1)}
          className="p-1.5 rounded-lg hover:bg-card-bg text-text-main transition"
        >
          <Minus className="w-4 h-4" />
        </button>
        <span className="w-8 text-center font-bold text-text-main">{item.quantity}</span>
        <button
          onClick={() => onUpdateQuantity(item._id, 1)}
          className="p-1.5 rounded-lg hover:bg-card-bg text-text-main transition"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <p className="font-black text-text-main w-20 text-right hidden sm:block">
        ৳{item.price * item.quantity}
      </p>

      <button
        onClick={() => showConfirm(`Remove ${item.name} from cart?`, () => onRemove(item._id))}
        className="p-2 text-muted hover:text-brand transition"
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </div>
  );
}