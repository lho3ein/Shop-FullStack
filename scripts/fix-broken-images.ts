import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const FIXES: Record<string, string> = {
  "photo-1615048429826-5f4849df0f7a": "photo-1583863788434-e58a36330cf0",
  "photo-1609592806703-a21f4729eaf9": "photo-1606811971618-4486d14f3f99",
};

async function main() {
  const prods = await prisma.product.findMany({ select: { id: true, image: true, images: true } });
  let updated = 0;

  for (const p of prods) {
    const replace = (src: string) => {
      const m = src.match(/\/products\/(photo-[\w-]+)\.webp$/);
      if (!m) return src;
      const fixed = FIXES[m[1]];
      return fixed ? `/products/${fixed}.webp` : src;
    };

    const image = replace(p.image);
    const images = p.images.map(replace);

    if (image !== p.image || images.some((im, i) => im !== p.images[i])) {
      await prisma.product.update({ where: { id: p.id }, data: { image, images } });
      updated++;
      console.log("fixed:", image);
    }
  }
  console.log("products fixed:", updated);
  await prisma.$disconnect();
}

main();