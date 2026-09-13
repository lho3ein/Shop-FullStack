"use client";

import { SessionProvider } from "next-auth/react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartSheet } from "@/components/cart/cart-sheet";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <TooltipProvider delayDuration={200}>
        {children}
        <CartSheet />
      </TooltipProvider>
    </SessionProvider>
  );
}