import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Clean up (in order due to FK constraints)
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.address.deleteMany();
  await prisma.product.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // Admin & test user
  const adminPassword = await bcrypt.hash("Admin@12345", 10);
  const userPassword = await bcrypt.hash("Test@12345", 10);

  await prisma.user.createMany({
    data: [
      {
        name: "مدیر سایت",
        email: "admin@mobilecenter.ir",
        passwordHash: adminPassword,
        role: "ADMIN",
        phone: "09120000001",
      },
      {
        name: "کاربر آزمایشی",
        email: "user@mobilecenter.ir",
        passwordHash: userPassword,
        role: "USER",
        phone: "09120000002",
      },
    ],
  });

  // Brands
  const brands = [
    { name: "اپل", slug: "apple", logo: "" },
    { name: "سامسونگ", slug: "samsung", logo: "" },
    { name: "شیائومی", slug: "xiaomi", logo: "" },
    { name: "هواوی", slug: "huawei", logo: "" },
    { name: "گلکسی", slug: "galaxy", logo: "" },
    { name: "آنر", slug: "honor", logo: "" },
    { name: "نوکیا", slug: "nokia", logo: "" },
    { name: "گوگل", slug: "google", logo: "" },
    { name: "وان‌پلاس", slug: "oneplus", logo: "" },
  ];

  for (const b of brands) {
    await prisma.brand.create({ data: b });
  }

  const brandMap = new Map<string, string>();
  const allBrands = await prisma.brand.findMany();
  allBrands.forEach((b) => brandMap.set(b.slug, b.id));

  // Categories
  const categories = [
    { name: "گوشی موبایل", slug: "phones", description: "انواع گوشی موبایل از برندهای معتبر", icon: "smartphone" },
    { name: "تبلت", slug: "tablets", description: "تبلت‌های اندرویدی و iPad", icon: "tablet" },
    { name: "لوازم جانبی", slug: "accessories", description: "قاب، گلس، هدفون و سایر لوازم جانبی", icon: "accessory" },
  ];

  for (const c of categories) {
    await prisma.category.create({ data: c });
  }

  const catMap = new Map<string, string>();
  const allCats = await prisma.category.findMany();
  allCats.forEach((c) => catMap.set(c.slug, c.id));

  // Sub categories
  const subCategories = [
    { name: "گوشی آیفون", slug: "iphones", parentSlug: "phones" },
    { name: "گوشی سامسونگ", slug: "samsung-phones", parentSlug: "phones" },
    { name: "گوشی شیائومی", slug: "xiaomi-phones", parentSlug: "phones" },
    { name: "مک بوک", slug: "tablets-apple", parentSlug: "tablets" },
  ];

  for (const sc of subCategories) {
    await prisma.category.create({
      data: {
        name: sc.name,
        slug: sc.slug,
        parentId: catMap.get(sc.parentSlug),
      },
    });
  }

  const subCatMap = new Map<string, string>();
  const allSubCats = await prisma.category.findMany();
  allSubCats.forEach((c) => subCatMap.set(c.slug, c.id));

  // Products
  const baseImg = (id: string) => `/products/${id}.webp`;

  const productsData = [
    // ===== اپل =====
    {
      name: "گوشی موبایل اپل آیفون 15 پرو مکس 256 گیگابایت",
      slug: "apple-iphone-15-pro-max-256",
      description:
        "آیفون 15 پرو مکس با جدیدترین تراشه A17 Pro، دوربین فوق‌حرفه‌ای 48 مگاپیکسلی و نمایشگر 6.7 اینچی Super Retina XDR. عمر باتری فوق‌العاده، بدنه تیتانیومی فوق‌سبک و عملکرد گرافیکی بی‌همتا.",
      shortDescription: "تراشه A17 Pro • دوربین 48MP • نمایشگر 6.7 اینچ",
      price: 98900000,
      originalPrice: 104900000,
      stock: 8,
      image: baseImg("photo-1592750475338-74b7b21085ab"),
      images: [
        baseImg("photo-1592750475338-74b7b21085ab"),
        baseImg("photo-1591337676887-a217a6970a8a"),
        baseImg("photo-1574944985070-8f3ebc6b79d2"),
      ],
      colors: ["#1e3a5f", "#4b5563", "#e5e7eb", "#7c3aed"],
      storageOptions: ["256GB", "512GB", "1TB"],
      brandSlug: "apple",
      categorySlug: "phones",
      isFeatured: true,
      specifications: JSON.stringify({
        "ساختار بدنه": "تیتانیوم درجه ۵",
        "ابعاد": "۱۵۹٫۹ × ۷۶٫۷ × ۸٫۲۵ میلی‌متر",
        "وزن": "۲۲۱ گرم",
        "صفحه‌نمایش": "6.7 اینچ Super Retina XDR",
        "تراشه": "Apple A17 Pro",
        "دوربین اصلی": "۴۸ مگاپیکسل + ۱۲ مگاپیکسل + ۱۲ مگاپیکسل",
        "دوربین سلفی": "۱۲ مگاپیکسل",
        "باتری": "۴,۴۴۱ میلی‌آمپر",
        "سیستم‌عامل": "iOS 17",
      }),
    },
    {
      name: "گوشی موبایل اپل آیفون 14 128 گیگابایت",
      slug: "apple-iphone-14-128",
      description:
        "آیفون 14 با تراشه قدرتمند A15 Bionic، دوربین دوگانه 12 مگاپیکسلی و نمایشگر 6.1 اینچی. عملکرد عالی، دوربین فوق‌العاده در نور کم و پشتیبانی طولانی‌مدت.",
      shortDescription: "تراشه A15 Bionic • دوربین دوگانه 12MP",
      price: 71900000,
      originalPrice: null,
      stock: 15,
      image: baseImg("photo-1511707171634-5f897ff02aa9"),
      images: [
        baseImg("photo-1511707171634-5f897ff02aa9"),
        baseImg("photo-1592750475338-74b7b21085ab"),
      ],
      colors: ["#111827", "#1d4ed8", "#dc2626", "#facc15"],
      storageOptions: ["128GB", "256GB", "512GB"],
      brandSlug: "apple",
      categorySlug: "phones",
      specifications: JSON.stringify({
        "ساختار بدنه": "شیشه و آلومینیوم",
        "صفحه‌نمایش": "6.1 اینچ Super Retina XDR",
        "تراشه": "Apple A15 Bionic",
        "دوربین": "۱۲ مگاپیکسل + ۱۲ مگاپیکسل",
        "سیستم‌عامل": "iOS 16",
      }),
    },
    {
      name: "گوشی موبایل اپل آیفون 13 128 گیگابایت",
      slug: "apple-iphone-13-128",
      description:
        "آیفون 13 با نمایشگر 6.1 اینچی Super Retina XDR، تراشه A15 Bionic و دوربین دوگانه 12 مگاپیکسلی. ترکیبی عالی از عملکرد و قیمت.",
      shortDescription: "تراشه A15 • دوربین دوگانه 12MP",
      price: 59800000,
      originalPrice: 64900000,
      stock: 20,
      image: baseImg("photo-1601784551446-20c9e07cdbdb"),
      images: [baseImg("photo-1601784551446-20c9e07cdbdb")],
      colors: ["#111827", "#e5e7eb", "#dc2626", "#3b82f6"],
      storageOptions: ["128GB", "256GB"],
      brandSlug: "apple",
      categorySlug: "phones",
      specifications: JSON.stringify({
        "صفحه‌نمایش": "6.1 اینچ Super Retina XDR",
        "تراشه": "Apple A15 Bionic",
        "دوربین": "۱۲ مگاپیکسل + ۱۲ مگاپیکسل",
        "سیستم‌عامل": "iOS 15",
      }),
    },
    // ===== سامسونگ =====
    {
      name: "گوشی موبایل سامسونگ گلکسی S24 Ultra 512 گیگابایت",
      slug: "samsung-galaxy-s24-ultra-512",
      description:
        "گلکسی S24 Ultra با Galaxy AI، نمایشگر 6.8 اینچی Dynamic AMOLED، دوربین 200 مگاپیکسلی و باتری 5000 میلی‌آمپری. پرچمدار بی‌رقیب سامسونگ.",
      shortDescription: "Galaxy AI • دوربین 200MP • باتری 5000mAh",
      price: 84900000,
      originalPrice: 89900000,
      stock: 5,
      image: baseImg("photo-1610945264803-c22b62d2a7b3"),
      images: [
        baseImg("photo-1610945264803-c22b62d2a7b3"),
        baseImg("photo-1610945265064-0e34e5519bbf"),
      ],
      colors: ["#1e293b", "#f8fafc", "#facc15", "#94a3b8"],
      storageOptions: ["256GB", "512GB", "1TB"],
      brandSlug: "samsung",
      categorySlug: "phones",
      isFeatured: true,
      specifications: JSON.stringify({
        "ساختار بدنه": "تیتانیوم",
        "صفحه‌نمایش": "6.8 اینچ Dynamic AMOLED 2X",
        "تراشه": "Qualcomm Snapdragon 8 Gen 3",
        "دوربین اصلی": "۲۰۰ مگاپیکسل + ۵۰ + ۱۲ + ۱۰ مگاپیکسل",
        "دوربین سلفی": "۱۲ مگاپیکسل",
        "باتری": "۵,۰۰۰ میلی‌آمپر",
        "قلم S-Pen": "دارد",
      }),
    },
    {
      name: "گوشی موبایل سامسونگ گلکسی S23 Ultra 256 گیگابایت",
      slug: "samsung-galaxy-s23-ultra-256",
      description:
        "گلکسی S23 Ultra با دوربین 200 مگاپیکسلی و تراشه Snapdragon 8 Gen 2، بهترین دوربین در بین گوشی‌های اندرویدی.",
      shortDescription: "دوربین 200MP • تراشه Snapdragon 8 Gen 2",
      price: 74900000,
      originalPrice: 79500000,
      stock: 12,
      image: baseImg("photo-1610945265064-0e34e5519bbf"),
      images: [baseImg("photo-1610945265064-0e34e5519bbf")],
      colors: ["#0f172a", "#e2e8f0", "#94a3b8"],
      storageOptions: ["256GB", "512GB"],
      brandSlug: "samsung",
      categorySlug: "phones",
      specifications: JSON.stringify({
        "صفحه‌نمایش": "6.8 اینچ Dynamic AMOLED 2X",
        "تراشه": "Snapdragon 8 Gen 2 for Galaxy",
        "دوربین": "۲۰۰ مگاپیکسل + ۱۲ + ۱۰ + ۱۰",
        "باتری": "۵,۰۰۰ میلی‌آمپر",
      }),
    },
    {
      name: "گوشی موبایل سامسونگ گلکسی A54 5G 256 گیگابایت",
      slug: "samsung-galaxy-a54-5g-256",
      description:
        "گلکسی A54 با نمایشگر 6.4 اینچی AMOLED 120Hz و دوربین 50 مگاپیکسلی، بهترین گزینه در رنج قیمت متوسط.",
      shortDescription: "AMOLED 120Hz • دوربین 50MP",
      price: 23900000,
      originalPrice: null,
      stock: 25,
      image: baseImg("photo-1598327105666-5b89351aff97"),
      images: [baseImg("photo-1598327105666-5b89351aff97")],
      colors: ["#111827", "#6b7280", "#2563eb", "#e11d48"],
      storageOptions: ["128GB", "256GB"],
      brandSlug: "samsung",
      categorySlug: "phones",
      isFeatured: true,
      specifications: JSON.stringify({
        "صفحه‌نمایش": "6.4 اینچ Super AMOLED 120Hz",
        "تراشه": "Exynos 1380",
        "دوربین": "۵۰ مگاپیکسل + ۱۲ + ۵",
        "باتری": "۵,۰۰۰ میلی‌آمپر",
      }),
    },
    // ===== شیائومی =====
    {
      name: "گوشی موبایل شیائومی 14 512 گیگابایت",
      slug: "xiaomi-14-512",
      description:
        "شیائومی 14 با پردازنده Snapdragon 8 Gen 3، همکاری با Leica در دوربین و نمایشگر 6.36 اینچی. عملکرد برتر با قیمتی مقرون‌به‌صرفه.",
      shortDescription: "دوربین Leica • Snapdragon 8 Gen 3",
      price: 57900000,
      originalPrice: 61900000,
      stock: 10,
      image: baseImg("photo-1607936854279-55e8a4c64888"),
      images: [baseImg("photo-1607936854279-55e8a4c64888")],
      colors: ["#111827", "#e5e7eb", "#f97316"],
      storageOptions: ["256GB", "512GB"],
      brandSlug: "xiaomi",
      categorySlug: "phones",
      isFeatured: true,
      specifications: JSON.stringify({
        "صفحه‌نمایش": "6.36 اینچ LTPO AMOLED 120Hz",
        "تراشه": "Snapdragon 8 Gen 3",
        "دوربین": "۵۰ مگاپیکسل + ۵۰ + ۳۲ (لایکا)",
        "باتری": "۴,۶۱۰ میلی‌آمپر",
      }),
    },
    {
      name: "گوشی موبایل شیائومی Redmi Note 13 Pro 256 گیگابایت",
      slug: "xiaomi-redmi-note-13-pro-256",
      description:
        "Redmi Note 13 Pro با دوربین 200 مگاپیکسلی و نمایشگر AMOLED 120Hz، یکی از محبوب‌ترین گوشی‌های میان‌رده.",
      shortDescription: "دوربین 200MP • AMOLED 120Hz",
      price: 16900000,
      originalPrice: 18700000,
      stock: 30,
      image: baseImg("photo-1512941937669-90a1b58e7e9c"),
      images: [baseImg("photo-1512941937669-90a1b58e7e9c")],
      colors: ["#0f172a", "#ffffff", "#047857", "#b91c1c"],
      storageOptions: ["128GB", "256GB", "512GB"],
      brandSlug: "xiaomi",
      categorySlug: "phones",
      specifications: JSON.stringify({
        "صفحه‌نمایش": "6.67 اینچ AMOLED 120Hz",
        "تراشه": "Snapdragon 7s Gen 2",
        "دوربین": "۲۰۰ مگاپیکسل",
        "باتری": "۵,۱۰۰ میلی‌آمپر",
      }),
    },
    // ===== گوگل =====
    {
      name: "گوشی موبایل گوگل پیکسل 8 پرو 128 گیگابایت",
      slug: "google-pixel-8-pro-128",
      description:
        "پیکسل 8 پرو با Tensor G3، عکاسی محاسباتی بی‌نظیر و گوگل AI. تجربه‌ای خالص از اندروید.",
      shortDescription: "Tensor G3 • دوربین محاسباتی",
      price: 69900000,
      originalPrice: null,
      stock: 6,
      image: baseImg("photo-1574944985070-8f3ebc6b79d2"),
      images: [baseImg("photo-1574944985070-8f3ebc6b79d2")],
      colors: ["#f8fafc", "#1e293b", "#16a34a"],
      storageOptions: ["128GB", "256GB"],
      brandSlug: "google",
      categorySlug: "phones",
      specifications: JSON.stringify({
        "صفحه‌نمایش": "6.7 اینچ LTPO OLED 120Hz",
        "تراشه": "Google Tensor G3",
        "دوربین": "۵۰ مگاپیکسل + ۴۸ (ترموسنسور)",
        "باتری": "۵,۰۵۰ میلی‌آمپر",
      }),
    },
    // ===== تبلت ها =====
    {
      name: "تبلت اپل آیپد پرو 12.9 اینچ 256 گیگابایت",
      slug: "apple-ipad-pro-129-256",
      description:
        "آیپد پرو 12.9 با تراشه M2، نمایشگر Liquid Retina XDR و عملکرد فوق‌العاده برای کارهای حرفه‌ای.",
      shortDescription: "تراشه M2 • نمایشگر XDR",
      price: 79900000,
      originalPrice: 84900000,
      stock: 4,
      image: baseImg("photo-1544244015-0df4b3ffc6b0"),
      images: [baseImg("photo-1544244015-0df4b3ffc6b0")],
      colors: ["#e5e7eb", "#111827"],
      storageOptions: ["256GB", "512GB", "1TB"],
      brandSlug: "apple",
      categorySlug: "tablets",
      isFeatured: true,
      specifications: JSON.stringify({
        "صفحه‌نمایش": "12.9 اینچ Liquid Retina XDR",
        "تراشه": "Apple M2",
        "دوربین": "۱۲ مگاپیکسل",
        "سیستم‌عامل": "iPadOS",
      }),
    },
    {
      name: "تبلت اپل آیپد ایر 10.9 اینچ 128 گیگابایت",
      slug: "apple-ipad-air-109-128",
      description:
        "آیپد ایر با تراشه M1، نمایشگر 10.9 اینچی Liquid Retina و پشتیبانی از Apple Pencil 2.",
      shortDescription: "تراشه M1 • پشتیبانی از Apple Pencil",
      price: 44900000,
      originalPrice: null,
      stock: 7,
      image: baseImg("photo-1561154464-82e9adf32764"),
      images: [baseImg("photo-1561154464-82e9adf32764")],
      colors: ["#f8fafc", "#94a3b8", "#d946ef"],
      storageOptions: ["128GB", "256GB"],
      brandSlug: "apple",
      categorySlug: "tablets",
      specifications: JSON.stringify({
        "صفحه‌نمایش": "10.9 اینچ Liquid Retina",
        "تراشه": "Apple M1",
        "دوربین": "۱۲ مگاپیکسل",
      }),
    },
    // ===== لوازم جانبی =====
    {
      name: "هدفون بی‌سیم انکر مدل Soundcore Life Q30",
      slug: "anker-soundcore-life-q30",
      description:
        "هدفون بی‌سیم انکر با نویزکنسلینگ فعال، باتری 40 ساعته و صدای Hi-Res با درایور 40 میلی‌متری.",
      shortDescription: "نویزکنسلینگ فعال • باتری 40 ساعت",
      price: 3950000,
      originalPrice: 4490000,
      stock: 40,
      image: baseImg("photo-1484704849700-f032a568e944"),
      images: [baseImg("photo-1484704849700-f032a568e944")],
      colors: ["#111827", "#f97316"],
      storageOptions: [],
      brandSlug: "huawei",
      categorySlug: "accessories",
      isFeatured: true,
      specifications: JSON.stringify({
        "نویزکنسلینگ": "فعال (ANC)",
        "باتری": "۴۰ ساعت",
        "اتصال": "بلوتوث 5.0",
        "وزن": "۲۶۳ گرم",
      }),
    },
    {
      name: "شارژر 65 واتی انکر مدل GaNPrime",
      slug: "anker-ganprime-65w-charger",
      description:
        "شارژر فوق‌سریع 65 واتی انکر با فناوری GaNPrime و دو پورت USB-C، مناسب شارژ همزمان چند دستگاه.",
      shortDescription: "65W GaN • دو پورت USB-C",
      price: 1890000,
      originalPrice: 2100000,
      stock: 60,
      image: baseImg("photo-1583863788434-e58a36330cf0"),
      images: [baseImg("photo-1583863788434-e58a36330cf0")],
      colors: [],
      storageOptions: [],
      brandSlug: "huawei",
      categorySlug: "accessories",
      specifications: JSON.stringify({
        "توان": "۶۵ وات",
        "پورت‌ها": "۲× USB-C + 1× USB-A",
        "فناوری": "GaNPrime",
        "وزن": "۱۰۵ گرم",
      }),
    },
    {
      name: "قاب محافظ سیلیکونی آیفون 15",
      slug: "silicone-case-iphone-15",
      description:
        "قاب سیلیکونی اورجینال مخصوص آیفون 15 با بافت نرم، محافظت کامل از گوشی و پشتیبانی از شارژ بی‌سیم.",
      shortDescription: "سیلیکونی • پشتیبانی از MagSafe",
      price: 590000,
      originalPrice: null,
      stock: 100,
      image: baseImg("photo-1505740420928-5e560c06d30e"),
      images: [baseImg("photo-1505740420928-5e560c06d30e")],
      colors: ["#dc2626", "#2563eb", "#16a34a", "#111827"],
      storageOptions: [],
      brandSlug: "apple",
      categorySlug: "accessories",
      specifications: JSON.stringify({
        "جنس": "سیلیکون",
        "سازگاری": "آیفون 15",
        "مگ‌سیف": "دارد",
      }),
    },
    {
      name: "هدفون بی‌سیم اپل ایرپادز پرو 2",
      slug: "apple-airpods-pro-2",
      description:
        "ایرپادز پرو 2 با نویزکنسلینگ فعال 2x قوی‌تر، تراشه H2 و کیفیت صدای بی‌نظیر.",
      shortDescription: "تراشه H2 • نویزکنسلینگ فعال",
      price: 14500000,
      originalPrice: 15900000,
      stock: 18,
      image: baseImg("photo-1572569511254-d8f925fe2cbb"),
      images: [baseImg("photo-1572569511254-d8f925fe2cbb")],
      colors: [],
      storageOptions: [],
      brandSlug: "apple",
      categorySlug: "accessories",
      isFeatured: true,
      specifications: JSON.stringify({
        "تراشه": "Apple H2",
        "نویزکنسلینگ": "فعال (ANC)",
        "باتری": "۳۰ ساعت با کیس",
        "مقاومت": "IPX4",
      }),
    },
    {
      name: "اسپیکر بلوتوثی شیائومی مدل Sound Pro",
      slug: "xiaomi-sound-pro-speaker",
      description:
        "اسپیکر بلوتوثی شیائومی با صدای 360 درجه و 20 وات، کاملاً ضدآب با گواهی IP67.",
      shortDescription: "۲۰ وات • ضدآب IP67",
      price: 2990000,
      originalPrice: 3490000,
      stock: 35,
      image: baseImg("photo-1608043152269-423dbba4e7e1"),
      images: [baseImg("photo-1608043152269-423dbba4e7e1")],
      colors: ["#111827", "#2563eb"],
      storageOptions: [],
      brandSlug: "xiaomi",
      categorySlug: "accessories",
      specifications: JSON.stringify({
        "توان": "۲۰ وات",
        "بلوتوث": "5.0",
        "مقاومت": "IP67",
        "باتری": "۴۶۰۰ میلی‌آمپر",
      }),
    },
    {
      name: "گلس محافظ سامسونگ گلکسی S24 Ultra",
      slug: "samsung-s24-ultra-glass-guard",
      description:
        "گلس ضدضربه و ضدخش از جنس شیشه مقاوم با قابلیت تشخیص اثر انگشت، مخصوص گلکسی S24 Ultra.",
      shortDescription: "شیشه مقاوم • ضد ضربه",
      price: 450000,
      originalPrice: null,
      stock: 80,
      image: baseImg("photo-1526738549149-8e07eca6c147"),
      images: [baseImg("photo-1526738549149-8e07eca6c147")],
      colors: [],
      storageOptions: [],
      brandSlug: "samsung",
      categorySlug: "accessories",
      specifications: JSON.stringify({
        "جنس": "شیشه مقاوم",
        "سازگاری": "گلکسی S24 Ultra",
        "تشخیص اثر انگشت": "دارد",
      }),
    },
    {
      name: "تاچ پد شیائومی مدل Wireless Bluetooth",
      slug: "xiaomi-wireless-pad-10000mah",
      description:
        "پاوربانک 10000 میلی‌آمپری شیائومی با پشتیبانی از شارژ سریع و طراحی باریک و سبک.",
      shortDescription: "۱۰۰۰۰mAh • شارژ سریع 22.5W",
      price: 890000,
      originalPrice: 1100000,
      stock: 45,
      image: baseImg("photo-1606811971618-4486d14f3f99"),
      images: [baseImg("photo-1606811971618-4486d14f3f99")],
      colors: [],
      storageOptions: [],
      brandSlug: "xiaomi",
      categorySlug: "accessories",
      specifications: JSON.stringify({
        "ظرفیت": "۱۰,۰۰۰ میلی‌آمپر",
        "شارژ سریع": "22.5W",
        "پورت": "USB-C + Micro USB",
        "وزن": "۲۲۳ گرم",
      }),
    },
  ];

  for (const p of productsData) {
    const { brandSlug, categorySlug, ...rest } = p;

    const existingBrand = allBrands.find((b) => b.slug === brandSlug);
    const category = allCats.find((c) => c.slug === categorySlug);

    await prisma.product.create({
      data: {
        ...rest,
        soldCount: Math.floor(Math.random() * 100),
        views: Math.floor(Math.random() * 500),
        brandId: existingBrand?.id ?? allBrands[0].id,
        categoryId: category?.id ?? "",
      },
    });
  }

  console.log("✅ Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });