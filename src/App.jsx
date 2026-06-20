import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen transition-colors duration-300 bg-bg-main text-text-main font-sans relative">
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />,
          <Route path="/login" element={<Login />} />,
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
      <Toaster position="top-right" />
    </BrowserRouter>
  );
}

export default App;
