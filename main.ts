import { copyFileSync, mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const postPath = join(process.cwd(), "POST.json");
const raw = readFileSync(postPath, "utf8");
const post = JSON.parse(raw) as { url?: unknown };
if (typeof post !== "object" || post === null || typeof post.url !== "string") {
  throw new Error("POST.json must be a JSON object with a string url");
}
const statusUrl = /^https:\/\/(www\.|mobile\.)?(x\.com|twitter\.com)\/([^/]+\/status\/\d+|i\/web\/status\/\d+)$/;
if (!statusUrl.test(post.url)) {
  throw new Error("POST.json url must be an X post address (https://x.com/<handle>/status/<id>)");
}
mkdirSync(outDir, { recursive: true });
copyFileSync(postPath, join(outDir, "POST.json"));
console.log(`copied POST.json to ${outDir}`);
