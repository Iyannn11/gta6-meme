import { copyFileSync, mkdirSync, statSync } from "node:fs";
import { join } from "node:path";

const botDir = process.env.MAKEFUN_BOT_DIR ?? process.cwd();
const src = join(botDir, "meme-r8.png");
const outDir = "/output";

mkdirSync(outDir, { recursive: true });
copyFileSync(src, join(outDir, "meme-r8.png"));
// Verify the copy landed byte-identical before reporting success.
const outPath = join(outDir, "meme-r8.png");
const inSize = statSync(src).size;
const outSize = statSync(outPath).size;
if (inSize !== outSize) {
  throw new Error(`copy size mismatch: ${src} (${inSize} bytes) vs ${outPath} (${outSize} bytes)`);
}
console.log(`copied ${src} -> ${outPath} (${outSize} bytes, verified)`);
