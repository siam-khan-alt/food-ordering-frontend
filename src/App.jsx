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
import MyOrders from "./pages/MyOrders";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminHome from "./pages/admin/AdminHome";
import ManageFoods from "./pages/admin/ManageFoods";
import ManageOrders from "./pages/admin/ManageOrders";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen transition-colors duration-300 bg-bg-main text-text-main font-sans relative">
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />,
          <Route path="/menu" element={<Menu />} />,
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-orders"
            element={
              <ProtectedRoute>
                <MyOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/order-confirmation/:orderId"
            element={<OrderConfirmation />}
          />
          <Route path="/login" element={<Login />} />,
          <Route path="/register" element={<Register />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminHome />} />
            <Route path="foods" element={<ManageFoods />} />
            <Route path="orders" element={<ManageOrders />} />
          </Route>
        </Routes>
      </div>
      <Toaster position="top-right" />
    </BrowserRouter>
  );
}

export default App;
