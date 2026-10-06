import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { RestaurantProvider } from "@/context/RestaurantContext";
import AppChrome from "@/components/layout/AppChrome";

export const metadata: Metadata = {
  title: "BiteBox — Food Ordering",
  description: "Delicious food, delivered in minutes",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-bg-main text-text-main font-sans antialiased transition-colors duration-300">
        <ThemeProvider>
          <RestaurantProvider>
            <AuthProvider>
              <CartProvider>
                <AppChrome>{children}</AppChrome>
                <Toaster position="top-right" />
              </CartProvider>
            </AuthProvider>
          </RestaurantProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
