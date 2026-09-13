"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/lib/store/cart-store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatPrice, getDiscountPercent, toPersianDigits } from "@/lib/format";
import toast from "react-hot-toast";
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  Star,
  Minus,
  Plus,
  Heart,
  Check,
  Gauge,
  Monitor,
  Share2,
  ShoppingCartPlus,
} from "lucide-react";

interface ProductDetailProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    originalPrice: number | null;
    stock: number;
    image: string;
    images: string[];
    colors: string[];
    storageOptions: string[];
    shortDescription?: string | null;
    description?: string | null;
    brand?: { name: string; slug: string } | null;
    soldCount: number;
    views: number;
  };
  specs: Record<string, string>;
}

export function ProductDetail({ product }: ProductDetailProps) {
  const addItem = useCartStore((s) => s.addItem);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string | undefined>();
  const [selectedStorage, setSelectedStorage] = useState<string | undefined>();
  const [quantity, setQuantity] = useState(1);
  const [wished, setWished] = useState(false);

  const discount = getDiscountPercent(product.price, product.originalPrice);
  const isOutOfStock = product.stock <= 0;
  const allImages =
    product.images.length > 0 ? product.images : [product.image];

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addItem(product, quantity, selectedColor, selectedStorage);
    toast.success("به سبد خرید اضافه شد");
  };

  return (
    <div className="grid lg:grid-cols-[1fr_1.2fr_1fr] gap-8">
      {/* Gallery */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4 lg:p-6 self-start">
        <div className="relative aspect-square rounded-xl bg-linear-to-b from-slate-50 to-slate-100 overflow-hidden">
          {discount && (
            <Badge className="absolute top-4 left-4 z-10 bg-danger text-white border-0 text-sm px-3 py-1">
              {toPersianDigits(discount)}٪ تخفیف
            </Badge>
          )}
          <Image
            src={allImages[activeImage]}
            alt={product.name}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 33vw"
            className="object-contain p-4"
          />
        </div>
        {allImages.length > 1 && (
          <div className="grid grid-cols-4 gap-2 mt-3">
            {allImages.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                  activeImage === i
                    ? "border-primary"
                    : "border-transparent hover:border-slate-300 bg-slate-50"
                }`}
              >
                <Image
                  src={img}
                  alt=""
                  fill
                  sizes="80px"
                  className="object-contain p-1.5"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 lg:p-8">
        {product.brand && (
          <Link
            href={`/products?brand=${product.brand.slug}`}
            className="text-sm font-semibold text-primary hover:text-primary/80"
          >
            {product.brand.name}
          </Link>
        )}
        <h1 className="text-xl lg:text-2xl font-black text-slate-900 mt-1 mb-3 leading-relaxed">
          {product.name}
        </h1>

        {product.shortDescription && (
          <p className="text-sm text-muted-foreground mb-4">
            {product.shortDescription}
          </p>
        )}

        <div className="flex items-center gap-4 mb-5">
          <div className="flex items-center gap-1 bg-amber-50 border border-amber-100 rounded-full px-3 py-1">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="text-sm font-bold text-amber-700">۴.۸</span>
          </div>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Gauge className="w-3.5 h-3.5" />
            فروش: {toPersianDigits(product.soldCount)}
          </span>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Monitor className="w-3.5 h-3.5" />
            بازدید: {toPersianDigits(product.views)}
          </span>
          <button className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 mr-auto">
            <Share2 className="w-3.5 h-3.5" />
            اشتراک‌گذاری
          </button>
        </div>

        <Separator />

        {/* Colors */}
        {product.colors.length > 0 && (
          <div className="mt-5">
            <p className="text-sm font-medium text-slate-700 mb-2.5">
              رنگ:{" "}
              <span className="text-primary">
                {selectedColor || "انتخاب کنید"}
              </span>
            </p>
            <div className="flex items-center gap-2.5 flex-wrap">
              {product.colors.map((color) => {
                const isSelected = selectedColor === color;
                return (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-9 h-9 rounded-full border-2 flex items-center justify-center transition-transform ${
                      isSelected
                        ? "border-primary scale-110"
                        : "border-slate-200 hover:scale-105"
                    }`}
                    style={{ backgroundColor: color }}
                    title={color}
                  >
                    {isSelected && (
                      <Check className="w-4 h-4 text-white drop-shadow" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Storage */}
        {product.storageOptions.length > 0 && (
          <div className="mt-5">
            <p className="text-sm font-medium text-slate-700 mb-2.5">
              حافظه:{" "}
              <span className="text-primary">
                {selectedStorage || "انتخاب کنید"}
              </span>
            </p>
            <div className="flex items-center gap-3 flex-wrap">
              {product.storageOptions.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedStorage(s)}
                  className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                    selectedStorage === s
                      ? "border-primary bg-primary text-white"
                      : "border-slate-200 text-slate-600 hover:border-primary/50"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Description */}
        {product.description && (
          <p className="text-sm text-slate-600 leading-7 mt-5 line-clamp-4">
            {product.description}
          </p>
        )}
      </div>

      {/* Purchase box */}
      <div className="self-start">
        <div className="bg-white rounded-2xl border border-slate-100 p-6 sticky top-28">
          <div className="pb-4 border-b border-slate-100">
            {product.originalPrice && product.originalPrice > product.price && (
              <p className="text-sm text-muted-foreground line-through mb-1">
                {formatPrice(product.originalPrice)}
              </p>
            )}
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-2xl lg:text-3xl font-black text-primary">
                {formatPrice(product.price)}
              </p>
              {discount && (
                <Badge
                  variant="secondary"
                  className="bg-green-50 text-green-700 border-green-200"
                >
                  {toPersianDigits(discount)}٪ سود شما
                </Badge>
              )}
            </div>
            {discount && (
              <p className="text-xs text-muted-foreground mt-2">
                سود شما:{" "}
                <span className="text-green-600 font-bold">
                  {formatPrice(product.originalPrice! - product.price)}
                </span>
              </p>
            )}
          </div>

          {/* Quantity */}
          <div className="py-5 border-b border-slate-100">
            <p className="text-sm font-medium text-slate-700 mb-2.5">تعداد</p>
            <div className="flex items-center gap-3">
              <div className="flex items-center border rounded-xl">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-10 h-10 flex items-center justify-center hover:bg-slate-50 text-slate-500"
                  disabled={isOutOfStock}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center font-bold text-slate-800">
                  {toPersianDigits(quantity)}
                </span>
                <button
                  onClick={() =>
                    setQuantity((q) => Math.min(product.stock, q + 1))
                  }
                  className="w-10 h-10 flex items-center justify-center hover:bg-slate-50 text-slate-500"
                  disabled={isOutOfStock}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="text-sm">
                {isOutOfStock ? (
                  <span className="text-red-500 font-medium">ناموجود</span>
                ) : (
                  <>
                    <span className="text-green-600 font-bold flex items-center gap-1">
                      <Check className="w-4 h-4" />
                      موجود در انبار
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {toPersianDigits(product.stock)} عدد موجود است
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-5 space-y-3">
            <Button
              className="w-full h-12 text-base"
              size="lg"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
            >
              <ShoppingCartPlus className="ml-2 h-5 w-5" />
              {isOutOfStock ? "ناموجود" : "افزودن به سبد خرید"}
            </Button>
            <Button
              variant="outline"
              className="w-full h-12 text-base border-2"
              size="lg"
              onClick={() => {
                setWished(!wished);
                if (!wished) toast.success("به علاقه‌مندی‌ها اضافه شد");
              }}
            >
              <Heart
                className={`ml-2 h-5 w-5 ${wished ? "fill-red-500 text-red-500" : ""}`}
              />
              {wished ? "در لیست علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"}
            </Button>
          </div>

          {/* Guarantees */}
          <div className="mt-5 bg-slate-50 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-primary" />
              </div>
              <span>ضمانت اصالت و سلامت فیزیکی کالا</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
                <RotateCcw className="w-4 h-4 text-primary" />
              </div>
              <span>۷ روز ضمانت بازگشت وجه</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
                <Truck className="w-4 h-4 text-primary" />
              </div>
              <span>ارسال سریع به سراسر کشور</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
