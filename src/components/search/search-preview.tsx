"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Search, Loader2, TrendingUp, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/format";

interface SearchResult {
  id: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  originalPrice: number | null;
}

interface Props {
  defaultValue?: string;
  className?: string;
  size?: "md" | "lg";
  placeholder?: string;
  autoFocus?: boolean;
  onNavigate?: () => void;
}

const POPULAR = ["آیفون", "سامسونگ", "شیائومی", "هدفون بی‌سیم", "پاوربانک", "شارژر"];

export function SearchPreview({ defaultValue = "", className, size = "md", placeholder = "جستجو در فروشگاه…", autoFocus, onNavigate }: Props) {
  const router = useRouter();
  const [value, setValue] = useState(defaultValue);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value.trim().length < 2) {
      setResults([]);
      setSuggestions([]);
      setOpen(false);
      return;
    }
    setOpen(true);
    setLoading(true);

    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(value.trim())}`);
        const data = await res.json();
        setResults(data?.products ?? []);
        setSuggestions(data?.suggestions ?? []);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 280);

    return () => clearTimeout(t);
  }, [value]);

  const submit = useCallback(
    (qv?: string) => {
      const q = (qv ?? value).trim();
      if (!q) return;
      setOpen(false);
      onNavigate?.();
      router.push(`/products?q=${encodeURIComponent(q)}`);
    },
    [value, router, onNavigate]
  );

  const goProduct = (slug: string) => {
    setOpen(false);
    onNavigate?.();
    router.push(`/product/${slug}`);
  };

  return (
    <div ref={wrapRef} className={cn("relative", className)}>
      <div className="relative flex items-center">
        {loading ? (
          <Loader2 className={cn("absolute right-3.5 animate-spin text-primary", size === "lg" ? "w-5 h-5" : "w-4 h-4")} />
        ) : (
          <Search className={cn("absolute right-3.5 text-slate-400", size === "lg" ? "w-5 h-5" : "w-4 h-4")} />
        )}
        <input
          value={value}
          autoFocus={autoFocus}
          dir="rtl"
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => value.trim().length >= 2 && setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          onKeyDown={(e) => {
            if (e.key === "Enter") submit();
            if (e.key === "Escape") {
              setOpen(false);
              (e.target as HTMLInputElement).blur();
            }
          }}
          placeholder={placeholder}
          className={cn(
            "w-full rounded-2xl bg-white border border-slate-200 pr-10 pl-4 text-sm text-slate-800 shadow-sm outline-none transition-all focus:border-primary/50 focus:ring-2 focus:ring-primary/15 placeholder:text-slate-400",
            size === "lg" ? "py-3" : "py-2.5"
          )}
        />
      </div>

      {open && (
        <div className="absolute z-50 top-full mt-2 w-full rounded-2xl border border-slate-100 bg-white shadow-2xl shadow-slate-900/10 overflow-hidden">
          {loading ? (
            <div className="p-3 space-y-2">
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex items-center gap-3 px-2 py-2 animate-pulse">
                  <div className="w-11 h-11 rounded-xl bg-slate-100" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3 rounded bg-slate-100 w-2/3" />
                    <div className="h-3 rounded bg-slate-100 w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : results.length > 0 ? (
            <>
              <ul className="max-h-[340px] overflow-auto divide-y divide-slate-50">
                {results.map((p) => (
                  <li key={p.id}>
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => goProduct(p.slug)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-primary/[0.04] transition-colors text-right"
                    >
                      <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-slate-50 shrink-0">
                        <Image src={p.image} alt={p.name} fill sizes="44px" className="object-cover" unoptimized />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-800 truncate">{p.name}</p>
                        <div className="mt-0.5 flex items-center gap-2">
                          <span className="text-sm font-black text-primary">{formatPrice(p.price)}</span>
                          {p.originalPrice && p.originalPrice > p.price && (
                            <span className="text-xs line-through text-slate-300">{formatPrice(p.originalPrice)}</span>
                          )}
                        </div>
                      </div>
                      <ArrowLeft className="w-4 h-4 text-slate-300 shrink-0" />
                    </button>
                  </li>
                ))}
              </ul>
              <div className="border-t border-slate-100 p-2">
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => submit()}
                  className="w-full text-center py-2 rounded-xl text-sm font-bold text-primary hover:bg-primary/[0.05] transition-colors"
                >
                  مشاهده همه نتایج «{value.trim()}»
                </button>
              </div>
            </>
          ) : suggestions.length > 0 ? (
            <div className="p-4">
              <p className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 mb-3">
                <TrendingUp className="w-3.5 h-3.5" />
                جستجوهای پرطرفدار
              </p>
              <div className="flex flex-wrap gap-1.5">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => submit(s)}
                    className="px-3 py-1.5 rounded-full bg-slate-50 text-xs text-slate-600 hover:bg-primary/10 hover:text-primary transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-6 text-center">
              <p className="font-bold text-slate-500 text-sm">محصولی یافت نشد</p>
              <p className="text-xs text-slate-400 mt-1">کلمه دیگری را امتحان کنید</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}