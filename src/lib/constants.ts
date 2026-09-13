export const SHIPPING_COST = 45000;
export const FREE_SHIPPING_THRESHOLD = 500000;
export const SITE_NAME = "موبایل‌سنتر";
export const SITE_DESCRIPTION =
  "فروشگاه اینترنتی موبایل‌سنتر - خرید انواع گوشی موبایل، تبلت و لوازم جانبی";

export const PROVINCES = [
  "آذربایجان شرقی",
  "آذربایجان غربی",
  "اردبیل",
  "اصفهان",
  "البرز",
  "ایلام",
  "بوشهر",
  "تهران",
  "خراسان جنوبی",
  "خراسان رضوی",
  "خراسان شمالی",
  "خوزستان",
  "زنجان",
  "سمنان",
  "سیستان و بلوچستان",
  "فارس",
  "قزوین",
  "قم",
  "کردستان",
  "کرمان",
  "کرمانشاه",
  "کهگیلویه و بویراحمد",
  "گلستان",
  "گیلان",
  "لرستان",
  "مازندران",
  "مرکزی",
  "هرمزگان",
  "همدان",
  "چهارمحال و بختیاری",
  "یزد",
];

export const ORDER_STATUS_MAP: Record<
  string,
  { label: string; color: string }
> = {
  PENDING: { label: "در انتظار پرداخت", color: "bg-amber-500" },
  PAID: { label: "پرداخت شده", color: "bg-blue-500" },
  PROCESSING: { label: "در حال پردازش", color: "bg-indigo-500" },
  SHIPPED: { label: "ارسال شده", color: "bg-cyan-500" },
  DELIVERED: { label: "تحویل شده", color: "bg-green-500" },
  CANCELLED: { label: "لغو شده", color: "bg-red-500" },
};

export const PAYMENT_STATUS_MAP: Record<
  string,
  { label: string; color: string }
> = {
  PENDING: { label: "در انتظار", color: "bg-amber-500" },
  SUCCESS: { label: "موفق", color: "bg-green-500" },
  FAILED: { label: "ناموفق", color: "bg-red-500" },
  REFUNDED: { label: "بازگشت وجه", color: "bg-gray-500" },
};