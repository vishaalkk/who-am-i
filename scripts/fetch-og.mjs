// Fetches each project's Open Graph image into public/og/ and records the
// mapping in src/data/og-images.json. Runs before dev/build; never fails the build.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";

const PROJECTS_FILE = "src/data/projects.ts";
const MAP_FILE = "src/data/og-images.json";
const OUT_DIR = "public/og";
const TIMEOUT_MS = 10000;
const EXT_BY_TYPE = { "image/png": "png", "image/jpeg": "jpg", "image/webp": "webp", "image/gif": "gif" };

const links = [...readFileSync(PROJECTS_FILE, "utf8").matchAll(/link:\s*"([^"]+)"/g)].map((m) => m[1]);
const map = existsSync(MAP_FILE) ? JSON.parse(readFileSync(MAP_FILE, "utf8")) : {};
mkdirSync(OUT_DIR, { recursive: true });

const get = (url) => fetch(url, { redirect: "follow", signal: AbortSignal.timeout(TIMEOUT_MS) });

function findOgImage(html) {
  for (const tag of html.match(/<meta\b[^>]*>/gi) ?? []) {
    if (!/(property|name)\s*=\s*["'](og:image|twitter:image)["']/i.test(tag)) continue;
    const content = tag.match(/content\s*=\s*["']([^"']+)["']/i);
    if (content) return content[1].replace(/&amp;/g, "&");
  }
  return null;
}

for (const link of links) {
  const slug = new URL(link).hostname.replace(/^www\./, "").replace(/\W+/g, "-");
  try {
    const page = await get(link);
    if (!page.ok) throw new Error(`page HTTP ${page.status}`);
    const found = findOgImage(await page.text());
    if (!found) {
      delete map[link];
      console.log(`[og] ${link}: no og:image`);
      continue;
    }
    const res = await get(new URL(found, page.url));
    if (!res.ok) throw new Error(`image HTTP ${res.status}`);
    const type = (res.headers.get("content-type") ?? "").split(";")[0].trim();
    const ext = EXT_BY_TYPE[type];
    if (!ext) throw new Error(`unsupported image type "${type}"`);
    writeFileSync(`${OUT_DIR}/${slug}.${ext}`, Buffer.from(await res.arrayBuffer()));
    map[link] = `/og/${slug}.${ext}`;
    console.log(`[og] ${link}: ${map[link]}`);
  } catch (err) {
    console.warn(`[og] ${link}: ${err.message} (keeping previous: ${map[link] ?? "none"})`);
  }
}

writeFileSync(MAP_FILE, JSON.stringify(map, null, 2) + "\n");
