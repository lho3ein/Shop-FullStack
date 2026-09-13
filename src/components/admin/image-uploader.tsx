"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { UploadCloud, Loader2, ImagePlus, X } from "lucide-react";
import { cn } from "cn";

interface ImageUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  onClear?: () => void;
  className?: string;
  size?: "sm" | "md";
}

export function ImageUploader({ value, onChange, onClear, className, size = "md" }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) return;
    if (file.size > 6 * 1024 * 1024) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      setPreview(dataUrl);
      setUploading(true);
      try {
        const res = await fetch("/api/admin/products/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ dataUrl }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "خطا در آپلود");
        setPreview(null);
        onChange(data.url);
      } catch {
        setPreview(null);
      } finally {
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const show = preview ?? value;

  return (
    <div className={className}>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />

      {show ? (
        <div
          className={cn(
            "relative group rounded-xl border border-slate-200 overflow-hidden flex items-center justify-center bg-slate-50",
            size === "md" ? "aspect-square w-36" : "aspect-square w-20"
          )}
        >
          <Image src={show} alt="" fill sizes="144px" className="object-contain p-2" />
          {uploading && (
            <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          )}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 justify-center bg-slate-900/50">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="w-9 h-9 rounded-full bg-white text-slate-700 flex items-center justify-center hover:bg-slate-100 transition-colors"
              aria-label="تغییر تصویر"
            >
              <UploadCloud className="w-4 h-4" />
            </button>
            {onClear && (
              <button
                type="button"
                onClick={onClear}
                className="w-9 h-9 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
                aria-label="حذف تصویر"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className={cn(
            "rounded-xl border-2 border-dashed border-slate-200 hover:border-primary/50 hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-1.5 text-slate-400 hover:text-primary",
            size === "md" ? "aspect-square w-36" : "aspect-square w-20"
          )}
        >
          {uploading ? (
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
          ) : (
            <>
              <ImagePlus className="w-5 h-5" />
              <span className="text-[10px] font-medium px-1 text-center">آپلود عکس</span>
            </>
          )}
        </button>
      )}
    </div>
  );
}