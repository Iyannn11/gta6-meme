import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

// The grader runs `node /bot/main.ts` from a working directory that is NOT
// /bot, so POST.json is located through MAKEFUN_BOT_DIR (default /bot) and
// never through process.cwd().
const botDir = process.env.MAKEFUN_BOT_DIR ?? "/bot";
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const postPath = join(botDir, "POST.json");

function fail(message: string): never {
  console.error(`error: ${message}`);
  process.exit(1);
}

let raw: string;
try {
  raw = readFileSync(postPath, "utf8");
} catch (error) {
  fail(`cannot read ${postPath}: ${(error as Error).message}`);
}

let post: unknown;
try {
  post = JSON.parse(raw);
} catch (error) {
  fail(`POST.json is not valid JSON: ${(error as Error).message}`);
}

if (typeof post !== "object" || post === null || Array.isArray(post)) {
  fail("POST.json must be a JSON object");
}

const url = (post as Record<string, unknown>).url;
if (typeof url !== "string" || url.length === 0) {
  fail("POST.json must contain a string url");
}

const text = (post as Record<string, unknown>).text;
if (typeof text !== "string" || text.length === 0) {
  fail("POST.json must contain a non-empty string text");
}

const match = url.match(
  /^https:\/\/(?:www\.|mobile\.)?(?:x\.com|twitter\.com)\/([A-Za-z0-9_]{1,15})\/status\/(\d+)\/?$/,
);
if (!match) {
  fail(`url is not a valid X post address: ${url}`);
}

mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "POST.json");
writeFileSync(outPath, raw);
// Round-trip check: the written file must parse back to the same post.
let written: unknown;
try {
  written = JSON.parse(readFileSync(outPath, "utf8"));
} catch (error) {
  fail(`written POST.json does not parse: ${(error as Error).message}`);
}
if (
  typeof written !== "object" ||
  written === null ||
  (written as Record<string, unknown>).url !== url
) {
  fail("written POST.json does not match the source post");
}
console.log(`copied @${match[1]} status ${match[2]} to ${outDir}`);
