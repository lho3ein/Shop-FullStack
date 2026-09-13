"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageUploader } from "@/components/admin/image-uploader";
import { Loader2, Plus, X } from "lucide-react";
import { slugify } from "@/lib/format";
import toast from "react-hot-toast";

interface Category {
  id: string;
  name: string;
}

interface Brand {
  id: string;
  name: string;
}

interface ProductFormInitial {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  shortDescription: string | null;
  price: number;
  originalPrice: number | null;
  stock: number;
  image: string;
  brandId: string | null;
  categoryId: string;
  isFeatured: boolean;
  isActive: boolean;
  colors: string[];
  storageOptions: string[];
  images: string[];
  specifications: string;
}

interface ProductFormProps {
  categories: Category[];
  brands: Brand[];
  initial?: ProductFormInitial;
  isEdit?: boolean;
}

export function ProductForm({ categories, brands, initial, isEdit }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [colors, setColors] = useState<string[]>(initial?.colors ?? []);
  const [colorInput, setColorInput] = useState("");
  const [storages, setStorages] = useState<string[]>(initial?.storageOptions ?? []);
  const [storageInput, setStorageInput] = useState("");
  const [images, setImages] = useState<string[]>(initial?.images ?? []);
  const [specs, setSpecs] = useState<Record<string, string>>(
    initial?.specifications ? JSON.parse(initial.specifications) : {}
  );
  const [specKey, setSpecKey] = useState("");
  const [specValue, setSpecValue] = useState("");

  const [form, setForm] = useState({
    name: initial?.name ?? "",
    slug: initial?.slug ?? "",
    description: initial?.description ?? "",
    shortDescription: initial?.shortDescription ?? "",
    price: initial?.price?.toString() ?? "",
    originalPrice: initial?.originalPrice?.toString() ?? "",
    stock: initial?.stock?.toString() ?? "0",
    image: initial?.image ?? "",
    brandId: initial?.brandId ?? "",
    categoryId: initial?.categoryId ?? "",
    isFeatured: initial?.isFeatured ?? false,
    isActive: initial?.isActive ?? true,
    autoSlug: !initial,
  });

  const update = (key: string, value: string | boolean) => setForm((f) => ({ ...f, [key]: value }));

  const handleNameChange = (value: string) => {
    update("name", value);
    if (form.autoSlug) {
      update("slug", slugify(value));
    }
  };

  const addColor = () => {
    if (colorInput.trim()) {
      setColors((c) => [...c, colorInput.trim()]);
      setColorInput("");
    }
  };

  const addStorage = () => {
    if (storageInput.trim()) {
      setStorages((s) => [...s, storageInput.trim()]);
      setStorageInput("");
    }
  };

  const addSpec = () => {
    if (specKey.trim() && specValue.trim()) {
      setSpecs((s) => ({ ...s, [specKey.trim()]: specValue.trim() }));
      setSpecKey("");
      setSpecValue("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...form,
      price: Number(form.price),
      originalPrice: form.originalPrice ? Number(form.originalPrice) : null,
      stock: Number(form.stock),
      colors,
      storageOptions: storages,
      images,
      specifications: JSON.stringify(specs),
    };

    try {
      const url = isEdit && initial ? `/api/admin/products/${initial.id}` : "/api/admin/products";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "خطا در ذخیره محصول");
        return;
      }

      toast.success(isEdit ? "محصول به‌روزرسانی شد" : "محصول جدید ایجاد شد");
      router.push("/admin/products");
      router.refresh();
    } catch {
      toast.error("خطایی رخ داد");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic info */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4">
        <h2 className="font-bold text-slate-900 text-lg">اطلاعات اصلی</h2>

        <div className="space-y-2">
          <Label htmlFor="name">نام محصول</Label>
          <Input
            id="name"
            value={form.name}
            onChange={(e) => handleNameChange(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug">اسلاگ (آدرس)</Label>
          <div className="flex gap-2 items-center">
            <Input
              id="slug"
              dir="ltr"
              value={form.slug}
              onChange={(e) => {
                update("slug", e.target.value);
                update("autoSlug", false);
              }}
              required
              className="text-left"
            />
            <Checkbox
              checked={form.autoSlug}
              onCheckedChange={(v) => update("autoSlug", !!v)}
              id="auto-slug"
            />
            <Label htmlFor="auto-slug" className="text-xs whitespace-nowrap">
              خودکار
            </Label>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="shortDescription">توضیح کوتاه</Label>
          <Input
            id="shortDescription"
            value={form.shortDescription}
            onChange={(e) => update("shortDescription", e.target.value)}
            placeholder="مثال: تراشه A17 Pro • دوربین 48MP"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">توضیحات کامل</Label>
          <Textarea
            id="description"
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            className="min-h-[140px]"
            placeholder="توضیحات کامل محصول..."
          />
        </div>
      </div>

      {/* Pricing & stock */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4">
        <h2 className="font-bold text-slate-900 text-lg">قیمت و موجودی</h2>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="price">قیمت (تومان) *</Label>
            <Input
              id="price"
              type="number"
              value={form.price}
              onChange={(e) => update("price", e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="originalPrice">قیمت قبل از تخفیف</Label>
            <Input
              id="originalPrice"
              type="number"
              value={form.originalPrice}
              onChange={(e) => update("originalPrice", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="stock">موجودی *</Label>
            <Input
              id="stock"
              type="number"
              value={form.stock}
              onChange={(e) => update("stock", e.target.value)}
              required
            />
          </div>
        </div>
      </div>

      {/* Category & brand */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4">
        <h2 className="font-bold text-slate-900 text-lg">دسته‌بندی و برند</h2>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>دسته‌بندی *</Label>
            <Select value={form.categoryId || undefined} onValueChange={(v) => update("categoryId", v)}>
              <SelectTrigger><SelectValue placeholder="انتخاب دسته‌بندی" /></SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>برند</Label>
            <Select value={form.brandId || undefined} onValueChange={(v) => update("brandId", v)}>
              <SelectTrigger><SelectValue placeholder="انتخاب برند" /></SelectTrigger>
              <SelectContent>
                {brands.map((b) => (
                  <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-6">
          <div className="flex items-center gap-2">
            <Checkbox
              id="isFeatured"
              checked={form.isFeatured}
              onCheckedChange={(v) => update("isFeatured", !!v)}
            />
            <Label htmlFor="isFeatured" className="text-sm">پیشنهاد ویژه</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="isActive"
              checked={form.isActive}
              onCheckedChange={(v) => update("isActive", !!v)}
            />
            <Label htmlFor="isActive" className="text-sm">فعال</Label>
          </div>
        </div>
      </div>

      {/* Images */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4">
        <h2 className="font-bold text-slate-900 text-lg">تصاویر</h2>
        <p className="text-xs text-muted-foreground">
          از سیستم خود عکس آپلود کنید یا آدرس تصویر را وارد نمایید
        </p>

        <div className="flex gap-4 items-start">
          <ImageUploader
            value={form.image}
            onChange={(url) => update("image", url)}
            onClear={() => update("image", "")}
          />
          <div className="flex-1 space-y-2 min-w-[200px]">
            <Label htmlFor="image">تصویر اصلی (آدرس)</Label>
            <Input
              id="image"
              dir="ltr"
              value={form.image}
              onChange={(e) => update("image", e.target.value)}
              className="text-left"
              placeholder="/products/... یا https://..."
              required
            />
            <p className="text-xs text-muted-foreground">یا از باکس کناری عکس آپلود کنید</p>
          </div>
        </div>

        <div className="space-y-2">
          <Label>تصاویر گالری</Label>
          <div className="flex flex-wrap gap-3">
            {images.map((img, i) => (
              <ImageUploader
                key={i}
                size="sm"
                value={img}
                onChange={(url) =>
                  setImages((im) => im.map((x, idx) => (idx === i ? url : x)))
                }
                onClear={() => setImages((im) => im.filter((_, idx) => idx !== i))}
              />
            ))}
            {images.length < 8 && (
              <ImageUploader
                size="sm"
                onChange={(url) => setImages((im) => [...im, url])}
              />
            )}
          </div>
          {images.length === 0 && (
            <p className="text-xs text-muted-foreground">هنوز تصویری در گالری نیست؛ روی آیکون + کلیک کنید</p>
          )}
        </div>
      </div>

      {/* Colors & storage */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4">
        <h2 className="font-bold text-slate-900 text-lg">رنگ‌ها و حافظه</h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>رنگ‌ها (کد هگز)</Label>
            <div className="flex gap-2">
              <Input
                dir="ltr"
                value={colorInput}
                onChange={(e) => setColorInput(e.target.value)}
                placeholder="#000000"
                className="text-left"
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addColor(); } }}
              />
              <Button type="button" variant="outline" onClick={addColor}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {colors.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                {colors.map((c, i) => (
                  <span key={i} className="flex items-center gap-1.5 bg-slate-50 border rounded-lg px-2 py-1.5">
                    <span className="w-4 h-4 rounded-full border" style={{ backgroundColor: c }} />
                    <span className="text-xs text-slate-600" dir="ltr">{c}</span>
                    <button type="button" onClick={() => setColors((cs) => cs.filter((_, idx) => idx !== i))}>
                      <X className="w-3 h-3 text-red-500" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>گزینه‌های حافظه</Label>
            <div className="flex gap-2">
              <Input
                dir="ltr"
                value={storageInput}
                onChange={(e) => setStorageInput(e.target.value)}
                placeholder="256GB"
                className="text-left"
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addStorage(); } }}
              />
              <Button type="button" variant="outline" onClick={addStorage}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {storages.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {storages.map((s, i) => (
                  <span key={i} className="flex items-center gap-1.5 bg-slate-50 border rounded-lg px-2 py-1.5">
                    <span className="text-xs text-slate-600" dir="ltr">{s}</span>
                    <button type="button" onClick={() => setStorages((ss) => ss.filter((_, idx) => idx !== i))}>
                      <X className="w-3 h-3 text-red-500" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Specifications */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4">
        <h2 className="font-bold text-slate-900 text-lg">مشخصات فنی</h2>

        <div className="grid grid-cols-2 gap-2">
          <Input
            value={specKey}
            onChange={(e) => setSpecKey(e.target.value)}
            placeholder="مثال: صفحه‌نمایش"
          />
          <div className="flex gap-2">
            <Input
              value={specValue}
              onChange={(e) => setSpecValue(e.target.value)}
              placeholder="مثال: 6.7 اینچ"
            />
            <Button type="button" variant="outline" onClick={addSpec}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {Object.entries(specs).length > 0 && (
          <div className="divide-y divide-slate-50 border rounded-xl">
            {Object.entries(specs).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between px-4 py-2.5">
                <span className="text-sm font-medium text-slate-700">{key}</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-slate-600">{value}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const next = { ...specs };
                      delete next[key];
                      setSpecs(next);
                    }}
                  >
                    <X className="w-3.5 h-3.5 text-red-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={loading} className="h-12 px-8 min-w-[150px]">
          {loading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
          {isEdit ? "ذخیره تغییرات" : "ایجاد محصول"}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="h-12 px-8"
          onClick={() => router.push("/admin/products")}
        >
          انصراف
        </Button>
      </div>
    </form>
  );
}