import { PrismaClient } from "@prisma/client";
import fs from "node:fs";
import path from "node:path";

const prisma = new PrismaClient();

async function main() {
  const prods = await prisma.product.findMany({ select: { id: true, name: true, image: true } });
  const pubDir = path.join(process.cwd(), "public");
  for (const x of prods) {
    const local = x.image.replace(/^\//, "");
    const exists = fs.existsSync(path.join(pubDir, local));
    const isRemote = x.image.startsWith("http");
    console.log(`${exists ? "OK " : "MISSING"} | ${isRemote ? "REMOTE" : "local "} | ${x.image} | ${x.name}`);
  }
  await prisma.$disconnect();
}

main();