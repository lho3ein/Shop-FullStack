"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Loader2 } from "lucide-react";
import { slugify } from "@/lib/format";
import toast from "react-hot-toast";

interface NewCategoryFormProps {
  parentCategories?: { id: string; name: string }[];
}

export function NewCategoryForm({ parentCategories = [] }: NewCategoryFormProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [autoSlug, setAutoSlug] = useState(true);
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("smartphone");
  const [parentId, setParentId] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          slug: autoSlug ? slugify(name) : slug,
          description: description || null,
          icon,
          parentId: parentId || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "خطا در ایجاد دسته‌بندی");
        return;
      }
      toast.success("دسته‌بندی ایجاد شد");
      setOpen(false);
      setName("");
      setSlug("");
      setDescription("");
      router.refresh();
    } catch {
      toast.error("خطایی رخ داد");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="ml-2 h-4 w-4" />
          دسته‌بندی جدید
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>ایجاد دسته‌بندی جدید</DialogTitle>
          <DialogDescription>اطلاعات دسته‌بندی جدید را وارد کنید</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>نام دسته‌بندی</Label>
            <Input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (autoSlug) setSlug(slugify(e.target.value));
              }}
              required
            />
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 space-y-2">
              <Label>اسلاگ</Label>
              <Input dir="ltr" className="text-left" value={slug} onChange={(e) => { setSlug(e.target.value); setAutoSlug(false); }} required />
            </div>
            <button type="button" onClick={() => { setSlug(slugify(name)); setAutoSlug(true); }} className="mt-7 text-xs text-primary hover:underline whitespace-nowrap">
              خودکار
            </button>
          </div>
          <div className="space-y-2">
            <Label>توضیحات</Label>
            <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="اختیاری" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>آیکون</Label>
              <Select value={icon} onValueChange={setIcon}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="smartphone">گوشی</SelectItem>
                  <SelectItem value="tablet">تبلت</SelectItem>
                  <SelectItem value="accessory">لوازم جانبی</SelectItem>
                  <SelectItem value="tags">عمومی</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {parentCategories.length > 0 && (
              <div className="space-y-2">
                <Label>دسته والد</Label>
                <Select value={parentId || undefined} onValueChange={setParentId}>
                  <SelectTrigger><SelectValue placeholder="بدون والد" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">بدون والد</SelectItem>
                    {parentCategories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>انصراف</Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
              ایجاد دسته‌بندی
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}