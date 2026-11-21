// Round 2 entry: the program only copies POST.json (the X post link) to
// /output. The house reads the post itself from X; nothing else is judged.
import { copyFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const botDir = process.env.MAKEFUN_BOT_DIR ?? "/bot";
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

try {
  mkdirSync(outputDir, { recursive: true });
  const source = join(botDir, "POST.json");
  const destination = join(outputDir, "POST.json");
  copyFileSync(source, destination);
  console.log(`Copied ${source} to ${destination}`);
} catch (error) {
  console.error("Failed to copy POST.json:", error);
  process.exit(1);
}
