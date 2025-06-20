"use client";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { MainNav } from "@/components/layout/main-nav";
import { CookNav } from "@/components/layout/cook-nav";
import { MobileNav } from "@/components/layout/mobile-nav";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { AuthProvider, useAuth } from "@/components/providers/auth-provider";
import { CartProvider } from "@/components/providers/cart-provider";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { user, userRole, isCook, loading } = useAuth();

  // Show loading spinner while auth is being determined
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          {isCook ? <CookNav /> : <MainNav />}
          <MobileNav />
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <CartProvider>
              <LayoutContent>{children}</LayoutContent>
              <Toaster />
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
