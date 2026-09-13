import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const REMOTE = /^https:\/\/images\.unsplash\.com\/(photo-[a-z0-9-]+)/;

async function main() {
  const products = await prisma.product.findMany();
  let updated = 0;

  for (const p of products) {
    const mx = p.image?.match(REMOTE);
    let needsUpdate = false;
    const next: Record<string, string | string[] | undefined> = {};

    if (mx) {
      next.image = `/products/${mx[1]}.webp`;
      needsUpdate = true;
    }

    if (p.images.some((img) => REMOTE.test(img))) {
      next.images = p.images.map((img) => {
        const m = img.match(REMOTE);
        return m ? `/products/${m[1]}.webp` : img;
      });
      needsUpdate = true;
    }

    if (needsUpdate) {
      await prisma.product.update({
        where: { id: p.id },
        data: next,
      });
      updated++;
    }
  }

  const orderItems = await prisma.orderItem.findMany();
  let oiUpdated = 0;
  for (const oi of orderItems) {
    const m = oi.image?.match(REMOTE);
    if (m) {
      await prisma.orderItem.update({
        where: { id: oi.id },
        data: { image: `/products/${m[1]}.webp` },
      });
      oiUpdated++;
    }
  }

  console.log(`products updated: ${updated}`);
  console.log(`orderItems updated: ${oiUpdated}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());