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
import { MoreHorizontal, Eye, EyeOff, Trash2, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

interface AdminCategoryActionsProps {
  category: {
    id: string;
    name: string;
    slug: string;
    isActive: boolean;
  };
}

export function AdminCategoryActions({ category }: AdminCategoryActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const toggleActive = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/categories/${category.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !category.isActive }),
      });
      if (res.ok) {
        toast.success(category.isActive ? "غیرفعال شد" : "فعال شد");
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
      const res = await fetch(`/api/admin/categories/${category.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("دسته‌بندی حذف شد");
        router.refresh();
      } else {
        const data = await res.json();
        toast.error(data.error || "خطا در حذف");
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
        <DropdownMenuItem onSelect={toggleActive} className="cursor-pointer">
          {category.isActive ? <EyeOff className="ml-2 h-4 w-4" /> : <Eye className="ml-2 h-4 w-4" />}
          {category.isActive ? "غیرفعال کردن" : "فعال کردن"}
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
              <AlertDialogTitle>حذف دسته‌بندی</AlertDialogTitle>
              <AlertDialogDescription>
                آیا از حذف <b>{category.name}</b> مطمئن هستید؟ این عمل قابل بازگشت نیست.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>انصراف</AlertDialogCancel>
              <AlertDialogAction className="bg-red-500 hover:bg-red-600" onClick={handleDelete} disabled={loading}>
                {loading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                حذف
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}