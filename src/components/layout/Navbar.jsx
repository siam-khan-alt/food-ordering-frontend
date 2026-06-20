import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { Sun, Moon, ShoppingCart, LogOut, Menu, X } from "lucide-react";
import Button from "../common/Button";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinkClass = ({ isActive }) =>
    `relative text-sm font-bold transition py-1 flex items-center gap-1.5 ${
      isActive
        ? "text-brand after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-brand after:rounded-full"
        : "text-text-main hover:text-brand"
    }`;

  const renderLinkContent = (label) => ({ isActive }) => (
    <>
      {isActive && <img src="/logo.png" alt="" className="w-4 h-4 object-contain" />}
      <span>{label}</span>
    </>
  );

  return (
    <header className="sticky top-0 z-50 bg-bg-main border-b border-card-border">
      <div className="container mx-auto px-6 lg:px-16 py-4 flex justify-between items-center">

        <Link to="/" className="flex items-center space-x-3 cursor-pointer group">
          <img
            src="/logo.png"
            alt="BiteBox Icon"
            className="w-10 h-10 object-contain transform group-hover:rotate-6 transition-transform duration-300"
          />
          <span className="hidden sm:inline text-2xl font-black tracking-tight text-text-main">
            Bite<span className="text-brand">Box</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center space-x-8">
          <NavLink to="/" className={navLinkClass}>
            {renderLinkContent("Home")}
          </NavLink>
          <NavLink to="/menu" className={navLinkClass}>
            {renderLinkContent("Menu")}
          </NavLink>
          {user?.role === "customer" && (
            <NavLink to="/my-orders" className={navLinkClass}>
              {renderLinkContent("My Orders")}
            </NavLink>
          )}
          {user?.role === "admin" && (
            <NavLink to="/admin" className={navLinkClass}>
              {renderLinkContent("Admin Panel")}
            </NavLink>
          )}
        </div>

        <div className="flex items-center space-x-3">

          {user?.role === "customer" && (
            <Link to="/cart">
              <Button variant="icon" icon={<ShoppingCart className="w-5 h-5" />} />
            </Link>
          )}

          <Button
            variant="icon"
            onClick={toggleTheme}
            icon={theme === "dark" ? (
              <Sun className="w-5 h-5 text-amber-400" />
            ) : (
              <Moon className="w-5 h-5 text-slate-700" />
            )}
          />

          {user ? (
            <Button
              variant="icon"
              onClick={logout}
              icon={<LogOut className="w-5 h-5" />}
              className="hidden sm:flex"
            />
          ) : (
            <Link to="/login" className="hidden sm:block">
              <Button variant="primary" className="px-5 py-2.5">Login</Button>
            </Link>
          )}

          <button
            className="md:hidden p-2 text-text-main"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden flex flex-col space-y-4 px-6 pb-4 border-t border-card-border pt-4">
          <NavLink to="/" className={navLinkClass} onClick={() => setMobileMenuOpen(false)}>
            {renderLinkContent("Home")}
          </NavLink>
          <NavLink to="/menu" className={navLinkClass} onClick={() => setMobileMenuOpen(false)}>
            {renderLinkContent("Menu")}
          </NavLink>
          {user?.role === "customer" && (
            <NavLink to="/my-orders" className={navLinkClass} onClick={() => setMobileMenuOpen(false)}>
              {renderLinkContent("My Orders")}
            </NavLink>
          )}
          {user?.role === "admin" && (
            <NavLink to="/admin" className={navLinkClass} onClick={() => setMobileMenuOpen(false)}>
              {renderLinkContent("Admin Panel")}
            </NavLink>
          )}

          {user ? (
            <Button
              variant="secondary"
              onClick={() => { logout(); setMobileMenuOpen(false); }}
              icon={<LogOut className="w-4 h-4" />}
              className="w-full justify-start px-4 py-2.5"
            >
              Logout
            </Button>
          ) : (
            <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="primary" className="w-full justify-center px-4 py-2.5">
                Login
              </Button>
            </Link>
          )}
        </div>
      )}
    </header>
  );
}