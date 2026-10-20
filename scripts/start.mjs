// Serves the production build the way the Docker image does. With
// `output: "standalone"`, `next start` can't serve the build, and
// .next/standalone leaves out public/ and .next/static; this copies them in
// and runs its server.js, which reads PORT and HOSTNAME.
// Usage: npm run build && npm start
import { cpSync, existsSync, rmSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const out = ".next/standalone";
const server = resolve(out, "server.js");
if (!existsSync(server)) {
  console.error(`No standalone build at ${out}: run \`npm run build\` first.`);
  process.exit(1);
}

for (const [from, to] of [
  ["public", `${out}/public`],
  [".next/static", `${out}/.next/static`],
]) {
  rmSync(to, { recursive: true, force: true });
  cpSync(from, to, { recursive: true });
}

await import(pathToFileURL(server).href);
