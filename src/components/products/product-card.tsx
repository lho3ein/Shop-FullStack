"use client";

import { Badge } from "@/components/ui/badge";
import { formatPrice, getDiscountPercent, toPersianDigits } from "@/lib/format";
import { useCartStore } from "@/lib/store/cart-store";
import { Heart, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import type { Product } from "@prisma/client";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const [wished, setWished] = useState(false);

  const discount = getDiscountPercent(product.price, product.originalPrice);
  const isOutOfStock = product.stock <= 0;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product);
    toast.success("به سبد خرید اضافه شد");
  };

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group relative block bg-white rounded-2xl border border-slate-100 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 overflow-hidden"
    >
      {/* badges */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5">
        {discount && (
          <Badge className="bg-danger text-white border-0">
            {toPersianDigits(discount)}٪
          </Badge>
        )}
        {product.isFeatured && (
          <Badge variant="secondary" className="bg-primary/90 text-white border-0">
            پیشنهاد ویژه
          </Badge>
        )}
      </div>

      {/* wishlist */}
      <button
        onClick={(e) => {
          e.preventDefault();
          setWished(!wished);
        }}
        className={`absolute top-3 left-3 z-10 w-9 h-9 rounded-full bg-white/90 shadow-sm flex items-center justify-center transition-colors ${
          wished ? "text-red-500" : "text-slate-400 hover:text-red-500"
        }`}
        aria-label="افزودن به علاقه‌مندی‌ها"
      >
        <Heart className={`w-4.5 h-4.5 ${wished ? "fill-current" : ""}`} />
      </button>

      {/* image */}
      <div className="relative aspect-square bg-gradient-to-b from-slate-50 to-white p-6">
        {isOutOfStock ? (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <span className="bg-slate-700/80 text-white text-sm font-medium px-4 py-1.5 rounded-full">
              ناموجود
            </span>
          </div>
        ) : null}
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, 25vw"
          className={`object-contain transition-transform duration-300 group-hover:scale-105 ${isOutOfStock ? "opacity-50" : ""}`}
        />
      </div>

      {/* content */}
      <div className="p-4 pt-3">
        <h3 className="font-medium text-sm text-slate-800 line-clamp-2 min-h-[2.5rem] group-hover:text-primary transition-colors">
          {product.name}
        </h3>

        {(product.storageOptions.length > 0 || product.colors.length > 0) && (
          <div className="flex items-center gap-2 mt-2">
            {product.colors.slice(0, 3).map((c) => (
              <span
                key={c}
                className="w-4 h-4 rounded-full border border-slate-200"
                style={{ backgroundColor: c.toLowerCase() }}
                title={c}
              />
            ))}
            {product.storageOptions.length > 0 && (
              <p className="text-[10px] text-slate-400 mr-auto">
                {product.storageOptions.join(" • ")}
              </p>
            )}
          </div>
        )}

        <div className="flex items-end justify-between mt-3 pt-3 border-t border-slate-50">
          <div>
            {product.originalPrice && product.originalPrice > product.price && (
              <p className="text-xs text-slate-400 line-through mb-0.5">
                {formatPrice(product.originalPrice).replace(" تومان", "")}
                <span className="text-[10px]"> تومان</span>
              </p>
            )}
            <p className="font-bold text-primary">
              {formatPrice(product.price)}
            </p>
          </div>

          <button
            onClick={handleAdd}
            disabled={isOutOfStock}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
              isOutOfStock
                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                : "bg-primary/10 text-primary hover:bg-primary hover:text-white"
            }`}
            aria-label="افزودن به سبد خرید"
          >
            <ShoppingBag className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>
    </Link>
  );
}