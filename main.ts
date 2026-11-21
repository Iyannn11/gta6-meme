// Round 6 entry for gta6-meme-x-01 (Node 22, standard library only).
// The entry is the X post itself: this program hands in the post's address by
// copying POST.json from the repository root to MAKEFUN_OUTPUT_DIR/POST.json,
// where the gate reads it. Nothing this program writes about the post is judged.
//
// The grader runs `node /bot/main.ts` from a working directory that is NOT /bot,
// with MAKEFUN_BOT_DIR=/bot and MAKEFUN_OUTPUT_DIR=/output, and /bot read-only.
// So POST.json is located via MAKEFUN_BOT_DIR (never process.cwd()), the output
// directory is created recursively, and the written file is verified round-trip.
// The url/text are also checked for leading/trailing whitespace: the gate reads
// POST.json as written, so a padded value must fail loudly here, not at the gate.
//
// Outside the grader's container, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR stand
// in for /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// An X post address: https://x.com/<handle>/status/<digits>, with optional
// www./mobile. prefix, twitter.com host, and trailing slash.
const POST_URL_RE =
  /^https:\/\/(www\.|mobile\.)?(x\.com|twitter\.com)\/[^/\s]+\/status\/\d+\/?$/;

function fail(message: string): never {
  console.error(`main.ts: ${message}`);
  process.exit(1);
}

const sourcePath = join(BOT_DIR, 'POST.json');
let raw: string;
try {
  raw = readFileSync(sourcePath, 'utf8');
} catch (err) {
  fail(`cannot read POST.json at ${sourcePath}: ${(err as Error).message}`);
}

let post: unknown;
try {
  post = JSON.parse(raw);
} catch (err) {
  fail(`POST.json at ${sourcePath} is not valid JSON: ${(err as Error).message}`);
}

if (typeof post !== 'object' || post === null || Array.isArray(post)) {
  fail(`POST.json at ${sourcePath} must be a JSON object with url and text`);
}
const { url, text } = post as { url?: unknown; text?: unknown };
if (typeof url !== 'string' || url === '') {
  fail(`POST.json at ${sourcePath} must have a non-empty string "url"`);
}
if (url !== url.trim()) {
  fail(`POST.json "url" has leading or trailing whitespace: ${JSON.stringify(url)}`);
}
if (typeof text !== 'string' || text === '') {
  fail(`POST.json at ${sourcePath} must have a non-empty string "text"`);
}
if (text !== text.trim()) {
  fail(`POST.json "text" has leading or trailing whitespace`);
}
if (!POST_URL_RE.test(url)) {
  fail(`POST.json "url" is not an X post address: ${url}`);
}

try {
  mkdirSync(OUTPUT_DIR, { recursive: true });
} catch (err) {
  fail(`cannot create output directory ${OUTPUT_DIR}: ${(err as Error).message}`);
}

const outPath = join(OUTPUT_DIR, 'POST.json');
try {
  writeFileSync(outPath, raw, 'utf8');
} catch (err) {
  fail(`cannot write ${outPath}: ${(err as Error).message}`);
}

// Round-trip check: what the gate reads must be exactly what was handed in.
let written: string;
try {
  written = readFileSync(outPath, 'utf8');
} catch (err) {
  fail(`cannot read back ${outPath}: ${(err as Error).message}`);
}
if (written !== raw) {
  fail(`${outPath} does not match ${sourcePath} after writing`);
}

console.log(`copied POST.json to ${outPath}`);
