// Replaces the installed @xterm/xterm ESM bundle with the build that contains
// the IME composition fix (vendor/xterm/README.md). Runs after npm ci/install.
import { copyFileSync, existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const target = join(root, "node_modules/@xterm/xterm/lib/xterm.mjs");
const source = join(root, "vendor/xterm/xterm-6.0.0-ime.mjs");
const marker = "_pendingComposition";

if (!existsSync(target)) {
  console.log("xterm IME patch: @xterm/xterm is not installed, nothing to patch");
} else if (!existsSync(source)) {
  throw new Error("xterm IME patch: vendor/xterm/xterm-6.0.0-ime.mjs is missing");
} else {
  copyFileSync(source, target);
  if (!readFileSync(target, "utf8").includes(marker)) {
    throw new Error("xterm IME patch: the copied bundle does not contain the fix");
  }
  console.log("xterm IME patch: applied");
}
