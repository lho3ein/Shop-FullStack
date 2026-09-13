"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { MoreHorizontal, Pencil, Trash2, Eye, EyeOff, Sparkles, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

interface AdminProductActionsProps {
  productId: string;
  productName: string;
  isActive: boolean;
  isFeatured: boolean;
  editHref: string;
}

export function AdminProductActions({
  productId,
  productName,
  isActive,
  isFeatured,
  editHref,
}: AdminProductActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const toggleActive = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !isActive }),
      });
      if (res.ok) {
        toast.success(isActive ? "محصول غیرفعال شد" : "محصول فعال شد");
        router.refresh();
      } else {
        toast.error("خطا در تغییر وضعیت");
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleFeatured = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFeatured: !isFeatured }),
      });
      if (res.ok) {
        toast.success(isFeatured ? "از ویژه حذف شد" : "به عنوان ویژه تنظیم شد");
        router.refresh();
      } else {
        toast.error("خطا در تغییر وضعیت");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("محصول حذف شد");
        router.refresh();
      } else {
        toast.error("خطا در حذف محصول");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8" disabled={loading}>
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <MoreHorizontal className="w-4 h-4" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuItem asChild>
          <a href={editHref} className="cursor-pointer">
            <Pencil className="ml-2 h-4 w-4" />
            ویرایش
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={toggleActive} className="cursor-pointer">
          {isActive ? <EyeOff className="ml-2 h-4 w-4" /> : <Eye className="ml-2 h-4 w-4" />}
          {isActive ? "غیرفعال کردن" : "فعال کردن"}
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={toggleFeatured} className="cursor-pointer">
          <Sparkles className="ml-2 h-4 w-4" />
          {isFeatured ? "حذف از ویژه" : "تنظیم به عنوان ویژه"}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem
              className="text-red-600 cursor-pointer"
              onSelect={(e) => e.preventDefault()}
            >
              <Trash2 className="ml-2 h-4 w-4" />
              حذف
            </DropdownMenuItem>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>حذف محصول</AlertDialogTitle>
              <AlertDialogDescription>
                آیا از حذف <b>{productName}</b> مطمئن هستید؟ این عمل قابل بازگشت نیست.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>انصراف</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-500 hover:bg-red-600"
                onClick={handleDelete}
                disabled={loading}
              >
                {loading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                حذف محصول
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}