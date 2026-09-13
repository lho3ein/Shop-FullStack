export function toPersianDigits(input: string | number): string {
  const persianDigits = "۰۱۲۳۴۵۶۷۸۹";
  return String(input).replace(/\d/g, (d) => persianDigits[+d]);
}

export function formatPrice(price: number): string {
  return toPersianDigits(price.toLocaleString("en-US")) + " تومان";
}

export function formatNumber(input: string | number): string {
  return toPersianDigits(Number(input).toLocaleString("en-US"));
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/ä/g, "a")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function generateOrderNumber(): string {
  const now = new Date();
  const y = now.getFullYear().toString().slice(-2);
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const rand = Math.floor(100000 + Math.random() * 900000);
  return `${y}${m}${d}-${rand}`;
}

export function getDiscountPercent(price: number, originalPrice?: number | null): number | null {
  if (!originalPrice || originalPrice <= price) return null;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}

export function formatSlug(slug: string): string {
  const wordMap: Record<string, string> = {
    iphone: "آیفون",
    "apple-iphone": "آیفون اپل",
    samsung: "سامسونگ",
    xiaomi: "شیائومی",
    "google-pixel": "پیکسل گوگل",
    nokia: "نوکیا",
    huawei: "هواوی",
    honor: "آنر",
    oneplus: "وان‌پلاس",
    tablets: "تبلت",
    accessories: "لوازم جانبی",
  };
  return wordMap[slug] || slug;
}