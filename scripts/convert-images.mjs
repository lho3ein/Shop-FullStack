import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const SRC_DIR = "C:/Users/Hossein/AppData/Local/Temp/opencode/imgdl";
const OUT_DIR = path.join(process.cwd(), "public", "products");
const SIZE = 800;

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  for (const file of fs.readdirSync(SRC_DIR).filter((f) => f.endsWith(".jpg"))) {
    const id = file.replace(/\.jpg$/, "");
    const outPath = path.join(OUT_DIR, `${id}.webp`);
    if (fs.existsSync(outPath)) {
      console.log(`skip ${id}`);
      continue;
    }
    try {
      const webp = await sharp(path.join(SRC_DIR, file))
        .resize(SIZE, SIZE, { fit: "cover", position: "centre" })
        .webp({ quality: 78 })
        .toBuffer();
      fs.writeFileSync(outPath, webp);
      console.log(`done ${id} (${(webp.byteLength / 1024).toFixed(1)} KB)`);
    } catch (err) {
      console.error(`FAILED ${id}: ${err instanceof Error ? err.message : err}`);
    }
  }
  console.log("Finished.");
}

main();