import { NextResponse } from "next/server";
import path from "node:path";
import fs from "node:fs";
import crypto from "node:crypto";
import sharp from "sharp";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

const MAX_SIZE = 6 * 1024 * 1024;

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const dataUrl: string = body.dataUrl ?? "";

    const m = dataUrl.match(/^data:image\/(jpeg|png|webp);base64,(.+)$/);
    if (!m) {
      return NextResponse.json({ error: "فرمت تصویر معتبر نیست" }, { status: 400 });
    }

    const buffer = Buffer.from(m[2], "base64");
    if (buffer.byteLength > MAX_SIZE) {
      return NextResponse.json({ error: "حجم تصویر باید کمتر از ۶ مگابایت باشد" }, { status: 400 });
    }

    const webp = await sharp(buffer, { failOn: "none" })
      .rotate()
      .resize(800, 800, { fit: "cover", position: "centre" })
      .webp({ quality: 80 })
      .toBuffer();

    const relDir = path.join("products", "uploads", new Date().toISOString().slice(0, 7).replace("-", ""));
    const absDir = path.join(process.cwd(), "public", relDir);
    fs.mkdirSync(absDir, { recursive: true });

    const name = `${Date.now()}-${crypto.randomBytes(4).toString("hex")}.webp`;
    const absPath = path.join(absDir, name);
    fs.writeFileSync(absPath, webp);

    const url = `/${relDir.replace(/\\/g, "/")}/${name}`;
    return NextResponse.json({ url });
  } catch {
    return NextResponse.json({ error: "خطا در پردازش تصویر" }, { status: 500 });
  }
}