import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { Toaster } from "react-hot-toast";
import Menu from "./pages/Menu";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen transition-colors duration-300 bg-bg-main text-text-main font-sans relative">
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />,
          <Route path="/menu" element={<Menu />} />,
          <Route path="/cart" element={<Cart />} />,
          <Route path="/checkout" element={<Checkout />} />,
          <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
          <Route path="/login" element={<Login />} />,
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
      <Toaster position="top-right" />
    </BrowserRouter>
  );
}

export default App;
