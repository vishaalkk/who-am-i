// Fetches each project's Open Graph image (saved to public/og/) and description,
// and records them in src/data/og-images.json as { [link]: { image?, description? } }. Runs before dev/build; never fails the build.
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

const decode = (v) =>
  v
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");

// First matching <meta> whose property/name is in `keys`, in priority order.
function findMeta(html, keys) {
  const tags = html.match(/<meta\b[^>]*>/gi) ?? [];
  for (const key of keys) {
    for (const tag of tags) {
      const name = tag.match(/(?:property|name)\s*=\s*["']([^"']+)["']/i);
      if (name?.[1].toLowerCase() !== key) continue;
      const content = tag.match(/content\s*=\s*(?:"([^"]*)"|'([^']*)')/i);
      const value = (content?.[1] ?? content?.[2] ?? "").trim();
      if (value) return decode(value);
    }
  }
  return null;
}

for (const link of links) {
  const slug = new URL(link).hostname.replace(/^www\./, "").replace(/\W+/g, "-");
  try {
    const page = await get(link);
    if (!page.ok) throw new Error(`page HTTP ${page.status}`);
    const html = await page.text();
    const description = findMeta(html, ["og:description", "twitter:description", "description"]);
    const found = findMeta(html, ["og:image", "twitter:image"]);
    const entry = {};
    if (description) entry.description = description;
    if (found) {
      const res = await get(new URL(found, page.url));
      if (!res.ok) throw new Error(`image HTTP ${res.status}`);
      const type = (res.headers.get("content-type") ?? "").split(";")[0].trim();
      const ext = EXT_BY_TYPE[type];
      if (!ext) throw new Error(`unsupported image type "${type}"`);
      writeFileSync(`${OUT_DIR}/${slug}.${ext}`, Buffer.from(await res.arrayBuffer()));
      entry.image = `/og/${slug}.${ext}`;
    }
    if (Object.keys(entry).length) map[link] = entry;
    else delete map[link];
    console.log(`[og] ${link}: ${JSON.stringify(entry)}`);
  } catch (err) {
    console.warn(`[og] ${link}: ${err.message} (keeping previous: ${map[link] ? JSON.stringify(map[link]) : "none"})`);
  }
}

writeFileSync(MAP_FILE, JSON.stringify(map, null, 2) + "\n");
