import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { publicAssets } from "../../tooling/public-assets.mjs";

const root = fileURLToPath(new URL("../../out/", import.meta.url));
const pages = ["index", "support", "privacy-policy", "terms"];

async function walk(directory, prefix = "") {
  const files = [];
  for (const entry of await readdir(join(directory, prefix), { withFileTypes: true })) {
    const relative = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) files.push(...await walk(directory, relative));
    else files.push(relative);
  }
  return files;
}

test("homepage describes only the first iPhone release and includes the footer", async () => {
  const html = await readFile(join(root, "index.html"), "utf8");
  for (const text of ["On-chain data, made clear.", "Explore smart money activity and token data, all in one place.", "© 2026 SmartX"]) {
    assert.ok(html.includes(text), `Missing homepage content: ${text}`);
  }
  assert.match(html, /hero-brand\.mp4/);
  assert.match(html, /hero-brand-poster\.jpg/);
  assert.doesNotMatch(html, /Waitlist|Coming soon|Backed by|On-chain insights\.|Create an account and manage your profile/i);
});

test("all public pages have correct metadata and working local link targets", async () => {
  const files = new Set(await walk(root));
  for (const page of pages) {
    const html = await readFile(join(root, `${page}.html`), "utf8");
    assert.match(html, /<title>[^<]+<\/title>/);
    const canonical = html.match(/rel="canonical" href="([^"]+)"/)?.[1];
    assert.ok(canonical, `Missing canonical URL: ${page}`);
    assert.equal(new URL(canonical).href, new URL(page === "index" ? "/" : `/${page}`, "https://smartx.fun").href);
    assert.match(html, /property="og:image" content="https:\/\/smartx\.fun\/social-preview\.png/);
    for (const [, href] of html.matchAll(/(?:href|src)="(\/(?!\/)[^"?#]*)/g)) {
      const path = decodeURIComponent(href.slice(1));
      assert.ok(path === "" || files.has(path) || files.has(`${path}.html`), `${page}: missing ${href}`);
    }
  }
  assert.ok(files.has("social-preview.png"), "Social preview image is missing");
});

test("global and page-level share previews use only the current app image and copy", async () => {
  const image = await readFile(join(root, "social-preview.png"));
  assert.deepEqual(image.subarray(0, 8), Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  assert.equal(image.readUInt32BE(16), 1200);
  assert.equal(image.readUInt32BE(20), 630);

  for (const page of [...pages, "404"]) {
    const html = await readFile(join(root, `${page}.html`), "utf8");
    const head = html.match(/<head\b[^>]*>([\s\S]*?)<\/head>/)?.[1];
    assert.ok(head, `Missing document head: ${page}`);
    assert.doesNotMatch(head, /\btrad(?:e|es|ing|er|ers)\b|prediction|polymarket|smartx-social-share/i, `Obsolete share metadata: ${page}`);

    const tags = [...head.matchAll(/<meta\b[^>]*>/g)].map(match => match[0]);
    const expected = {
      "og:image": "https://smartx.fun/social-preview.png",
      "og:image:width": "1200",
      "og:image:height": "630",
      "og:image:alt": "SmartX for iPhone — On-chain data, made clear.",
      "twitter:card": "summary_large_image",
      "twitter:image": "https://smartx.fun/social-preview.png",
      "twitter:image:alt": "SmartX for iPhone — On-chain data, made clear.",
    };
    for (const [name, value] of Object.entries(expected)) {
      const matches = tags.filter(tag => tag.includes(`name="${name}"`) || tag.includes(`property="${name}"`));
      assert.equal(matches.length, 1, `${page}: missing or duplicate ${name}`);
      assert.equal(matches[0].match(/content="([^"]*)"/)?.[1], value, `${page}: incorrect ${name}`);
    }
  }
  assert.ok(!(await walk(root)).includes("smartx-social-share.png"), "Legacy fallback image must not ship");
});

test("headers are brand-only and homepage navigation appears once in the footer", async () => {
  for (const page of [...pages, "404"]) {
    const html = await readFile(join(root, `${page}.html`), "utf8");
    const header = html.match(/<header\b[^>]*>[\s\S]*?<\/header>/)?.[0];
    assert.ok(header, `Missing brand header: ${page}`);
    assert.match(header, /aria-label="SmartX home"/);
    assert.doesNotMatch(header, /<nav\b|<button\b|href="\/(?:support|privacy-policy|terms)"/);
  }
  const html = await readFile(join(root, "index.html"), "utf8");
  const footer = html.match(/<footer\b[^>]*>[\s\S]*?<\/footer>/)?.[0];
  assert.ok(footer, "Missing homepage footer");
  for (const href of ["/support", "/privacy-policy", "/terms"]) {
    assert.equal(html.split(`href="${href}"`).length - 1, 1, `Duplicate homepage link: ${href}`);
    assert.ok(footer.includes(`href="${href}"`));
  }
});

test("static output contains only approved public assets and routes", async () => {
  const assets = (await walk(join(root, "assets"))).map(file=>`assets/${file}`).sort();
  assert.deepEqual(assets, [...publicAssets].sort());
  const files = await walk(root);
  const expected = new Set([
    ...publicAssets,
    ...pages.flatMap(page => [`${page}.html`, `${page}.txt`]),
    "404.html", "robots.txt", "sitemap.xml", "social-preview.png",
  ]);
  for (const file of files) {
    assert.ok(file.startsWith("_next/") || expected.has(file), `Unexpected public file: ${file}`);
  }
  const html = files.filter(file=>file.endsWith(".html") && !file.startsWith("_next/")).sort();
  assert.deepEqual(html, ["404.html", ...pages.map(page=>`${page}.html`)].sort());
});

test("published HTML, scripts, CSS and metadata have no obsolete feature claims", async () => {
  const obsolete = /prediction markets?|polymarket|social trading|one tap to trade|trade in one tap|Trade your edge|app\.smartx\.io|ConsumerNetworkArchive|tradeQueueCard|networkGrid/i;
  for (const file of await walk(root)) {
    if (!/\.(?:html|js|css|txt|xml|json|svg)$/.test(file)) continue;
    const text = await readFile(join(root, file), "utf8");
    assert.doesNotMatch(text, obsolete, `Obsolete feature claim in ${file}`);
  }
});

test("legal scope disclosures and real support contact remain intact", async () => {
  const terms = await readFile(join(root, "terms.html"), "utf8");
  const support = await readFile(join(root, "support.html"), "utf8");
  assert.match(terms, /do not currently execute trades/);
  assert.match(support, /mailto:support@smartx\.io/);
});
