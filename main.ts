// Round 3 entry for make.fun's GTA 6 meme bounty (gta6-meme-x-01).
// The entry is the X post itself: this program's only job is to hand the
// house the post's address by copying POST.json from the repository root
// into the output directory, where the gate reads it and fetches the post
// (its first picture and its text) from X to build the judge's dossier.
//
// Runs on Node 22 with the standard library only. No network, no clock,
// no files outside this repository, so both grading runs write the same
// bytes. Local check:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, existsSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const botDir = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const source = join(botDir, 'POST.json');
const target = join(outputDir, 'POST.json');

if (!existsSync(source)) {
  console.error(`POST.json not found in ${botDir}; nothing to hand in.`);
  process.exit(1);
}

// Fail loudly on a malformed POST.json instead of handing the gate a
// file it cannot read: it must be a JSON object with a url string.
let post: unknown;
try {
  post = JSON.parse(readFileSync(source, 'utf8'));
} catch (err) {
  console.error(`POST.json is not valid JSON: ${(err as Error).message}`);
  process.exit(1);
}
if (typeof post !== 'object' || post === null || typeof (post as { url?: unknown }).url !== 'string') {
  console.error('POST.json must be an object like {"url": "https://x.com/<handle>/status/<id>"}.');
  process.exit(1);
}

mkdirSync(outputDir, { recursive: true });
copyFileSync(source, target);
