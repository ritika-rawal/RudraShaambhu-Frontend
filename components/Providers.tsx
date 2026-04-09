"use client";

import { SessionProvider } from "next-auth/react";
import CartDrawer from "@/components/cart/CartDrawer";
import { CartProvider } from "@/components/cart/CartProvider";
import { CurrencyProvider } from "@/components/common/CurrencyProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <CurrencyProvider>
        <CartProvider>
          {children}
          <CartDrawer />
        </CartProvider>
      </CurrencyProvider>
    </SessionProvider>
  );
}
