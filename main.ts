// Round 7 entry for gta6-meme-x-01 (Node 22, standard library only).
// The post is the entry: this program's only job is to hand POST.json
// (the address of the X post carrying the meme) to the gate by copying
// it into the output directory. The house reads the post itself from X,
// so nothing written here is judged.
//
// The grader starts this file as `node /bot/main.ts` from a working
// directory that is not /bot, so every path comes from the environment:
// MAKEFUN_BOT_DIR is where the repository is mounted, and
// MAKEFUN_OUTPUT_DIR is where the gate looks. Both fall back to the
// grader's defaults when the variables are absent.

import { copyFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const botDir = process.env.MAKEFUN_BOT_DIR ?? "/bot";
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

function main(): void {
  mkdirSync(outputDir, { recursive: true });
  const source = join(botDir, "POST.json");
  const target = join(outputDir, "POST.json");
  try {
    copyFileSync(source, target);
  } catch (error) {
    console.error(`could not copy POST.json out of ${botDir}: ${(error as Error).message}`);
    process.exit(1);
  }
}

main();
