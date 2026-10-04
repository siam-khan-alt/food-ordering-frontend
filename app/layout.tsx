import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "BiteBox — Food Ordering",
  description: "Delicious food, delivered in minutes",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-bg-main text-text-main font-sans antialiased transition-colors duration-300">
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
