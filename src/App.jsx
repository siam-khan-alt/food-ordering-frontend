import { useTheme } from "./context/ThemeContext";
import { Sun, Moon } from "lucide-react";
import Hero from "./components/home/Hero"; 

function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen transition-colors duration-300 bg-bg-main text-text-main font-sans overflow-hidden relative">
      
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-brand/10 dark:bg-brand/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-brand/5 rounded-full blur-[100px] -z-10 pointer-events-none" />

      <header className="sticky top-0 z-50 bg-bg-main/70 backdrop-blur-md border-b border-card-border container mx-auto px-6 lg:px-16 py-4">
        <div className="flex justify-between items-center">
          
          {/* Logo Name & Icon */}
          <div className="flex items-center space-x-3 cursor-pointer group">
            <img
              src="/logo.png"
              alt="BiteBox Icon"
              className="w-10 h-10 object-contain transform group-hover:rotate-6 transition-transform duration-300"
            />
            <span className="text-2xl font-black tracking-tight text-text-main">
              Bite<span className="text-brand">Box</span>
            </span>
          </div>

          {/* Theme Switche */}
          <div className="flex items-center">
            <button
              onClick={toggleTheme}
              className="p-3 rounded-xl bg-card-bg border border-card-border shadow-sm text-brand transition-all active:scale-95 hover:border-brand/30 cursor-pointer"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5 text-amber-400" />
              ) : (
                <Moon className="w-5 h-5 text-slate-700" />
              )}
            </button>
          </div>

        </div>
      </header>

      <Hero />

    </div>
  );
}

export default App;