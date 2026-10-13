import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { join } from "node:path";

const SOURCE = /\.(ts|tsx|mdx|css)$/;

/** Every source file under the given project-relative directories. */
export function listSourceFiles(dirs: string[]): string[] {
  const out: string[] = [];
  const walk = (dir: string) => {
    if (!existsSync(dir)) return;
    for (const name of readdirSync(dir)) {
      const path = join(dir, name);
      if (statSync(path).isDirectory()) walk(path);
      else if (SOURCE.test(name)) out.push(path);
    }
  };
  dirs.forEach(walk);
  return out;
}

export function readSource(path: string): string {
  return readFileSync(path, "utf8");
}
