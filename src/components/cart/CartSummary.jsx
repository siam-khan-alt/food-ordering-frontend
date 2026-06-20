import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Button from "../common/Button";

export default function CartSummary({ cartItems, totalAmount, onCheckout }) {
  return (
    <div className="bg-card-bg border border-card-border rounded-2xl overflow-hidden h-fit sticky top-24 shadow-xl">

      <div className="p-6 border-b border-card-border">
        <div className="flex items-center gap-2 mb-4">
          <img src="/logo.png" alt="" className="w-6 h-6 object-contain" />
          <h3 className="font-black text-text-main text-lg">Order Details</h3>
        </div>

        <div className="space-y-2.5 mb-4 max-h-40 overflow-y-auto pr-1">
          {cartItems.map((item) => (
            <div key={item._id} className="flex justify-between text-sm">
              <span className="text-muted">
                {item.name} <span className="text-brand">x{item.quantity}</span>
              </span>
              <span className="text-text-main font-bold">৳{item.price * item.quantity}</span>
            </div>
          ))}
        </div>

        <div className="border-t border-card-border pt-4 flex justify-between font-black text-text-main text-xl mb-5">
          <span>Total</span>
          <span className="text-brand">৳{totalAmount}</span>
        </div>

        <Button variant="primary" className="w-full justify-center" onClick={onCheckout}>
          Proceed to Checkout
        </Button>
      </div>

      <div className="relative bg-gradient-to-br from-brand/10 to-accent/5 p-6 text-center overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-[150px] h-[150px] bg-brand/20 rounded-full blur-[60px] pointer-events-none" />

        <img
          src="/hero-pizza.png"
          alt=""
          className="w-24 h-24 object-contain mx-auto mb-2 drop-shadow-xl relative z-10"
        />
        <p className="text-sm font-bold text-text-main mb-1">Still hungry?</p>
        <p className="text-xs text-muted mb-4">Explore more delicious items on our menu</p>

        <Link to="/menu">
          <Button variant="secondary" className="w-full justify-center" icon={<ArrowRight className="w-4 h-4" />}>
            Add More Items
          </Button>
        </Link>
      </div>

    </div>
  );
}