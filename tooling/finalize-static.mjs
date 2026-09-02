import { lstat, readdir, unlink } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { publicAssets } from "./public-assets.mjs";

const publicRoot = fileURLToPath(new URL("../public/", import.meta.url));
const outputRoot = fileURLToPath(new URL("../out/", import.meta.url));
const allowed = new Set(publicAssets);

async function listFiles(root, prefix = "") {
  const result = [];
  for (const entry of await readdir(join(root, prefix), { withFileTypes: true })) {
    const relative = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isSymbolicLink()) throw new Error(`Unexpected symlink: ${relative}`);
    if (entry.isDirectory()) result.push(...await listFiles(root, relative));
    else if (entry.isFile()) result.push(relative);
  }
  return result;
}

// Never touch public originals. Only remove their copies from the generated export.
let excluded = 0;
for (const relative of await listFiles(publicRoot)) {
  if (allowed.has(relative)) continue;
  const target = join(outputRoot, relative);
  const stat = await lstat(target).catch(error => {
    if (error.code === "ENOENT") return null;
    throw error;
  });
  if (!stat) continue;
  if (!stat.isFile()) throw new Error(`Unexpected export entry: ${relative}`);
  await unlink(target);
  excluded++;
}

for (const relative of allowed) {
  if (!(await lstat(join(outputRoot, relative))).isFile()) {
    throw new Error(`Missing shipping asset: ${relative}`);
  }
}

for (const relative of await listFiles(outputRoot)) {
  if (relative.split("/").at(-1) === ".DS_Store") {
    await unlink(join(outputRoot, relative));
  }
}

console.log(`Static export ready: ${allowed.size} public assets; ${excluded} local-only files excluded.`);
