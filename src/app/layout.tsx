import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { Providers } from "@/components/providers";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { GoogleTagManager } from "@/components/analytics/google-tag-manager";
import { GoogleTagManagerScript } from "@/components/analytics/google-tag-manager";

const vazirmatn = Vazirmatn({
  variable: "--font-vazirmatn",
  subsets: ["arabic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "موبایل‌سنتر | فروشگاه اینترنتی موبایل",
    template: "%s | موبایل‌سنتر",
  },
  description:
    "فروشگاه اینترنتی موبایل‌سنتر - خرید انواع گوشی موبایل، تبلت و لوازم جانبی با ضمانت اصالت کالا و گارانتی معتبر",
  keywords: [
    "فروشگاه موبایل",
    "خرید گوشی",
    "گوشی موبایل",
    "لوازم جانبی موبایل",
    "فروشگاه اینترنتی",
    "موبایل‌سنتر",
  ],
  authors: [{ name: "موبایل‌سنتر" }],
  creator: "موبایل‌سنتر",
  openGraph: {
    type: "website",
    locale: "fa_IR",
    title: "موبایل‌سنتر | فروشگاه اینترنتی موبایل",
    description:
      "خرید انواع گوشی موبایل، تبلت و لوازم جانبی با ضمانت اصالت کالا",
    siteName: "موبایل‌سنتر",
  },
  robots: {
    index: true,
    follow: true,
  },
  
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" className={`${vazirmatn.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#f5f7fa]">
        <Providers>
          <GoogleTagManager />
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                fontFamily: "var(--font-vazirmatn)",
                direction: "rtl",
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}