import { execSync } from "child_process";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
process.chdir(__dirname);

const { createServer } = await import("next/dist/server/lib/start-server.js").catch(() => null);

// Fallback: just use CLI
import("next/dist/bin/next.js");
