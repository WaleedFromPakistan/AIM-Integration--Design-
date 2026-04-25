/**
 * Upload local media under `public/` to Vercel Blob, preserving
 * the folder structure as blob pathnames (virtual folders).
 *
 * Usage:
 *   node --env-file=.env.local scripts/upload-to-blob.mjs
 *   node --env-file=.env.local scripts/upload-to-blob.mjs --dry
 *   node --env-file=.env.local scripts/upload-to-blob.mjs --dir=public/images
 *
 * Flags:
 *   --dry                 Show what would be uploaded, don't call the API.
 *   --dir=<path>          Limit upload to a subdirectory (default: public).
 *   --only=<glob>         Regex (not glob) filter applied to the relative path.
 *   --overwrite           Replace an existing blob at the same pathname.
 *
 * Output:
 *   Writes a JSON summary to scripts/.blob-uploads.json — mapping each
 *   uploaded pathname to its public URL. Use that to update media.json.
 */
import { readdir, readFile, stat, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { put, head } from "@vercel/blob";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");

/* ---------- arg parsing ---------- */
const argv = process.argv.slice(2);
const flag = (name) => argv.find((a) => a === `--${name}`);
const value = (name) => {
  const match = argv.find((a) => a.startsWith(`--${name}=`));
  return match ? match.slice(name.length + 3) : null;
};

const DRY = !!flag("dry");
const OVERWRITE = !!flag("overwrite");
const DIR = value("dir") ?? "public";
const ONLY = value("only") ? new RegExp(value("only")) : null;

const ALLOWED_EXT = new Set([
  ".png", ".jpg", ".jpeg", ".webp", ".avif", ".gif", ".svg",
  ".mp4", ".webm", ".mov",
  ".pdf",
]);

/* ---------- sanity checks ---------- */
const token = process.env.BLOB_READ_WRITE_TOKEN;
if (!DRY && !token) {
  console.error(
    "ERROR: BLOB_READ_WRITE_TOKEN is not set.\n" +
      "Run:  node --env-file=.env.local scripts/upload-to-blob.mjs\n" +
      "Or export the token into your shell before running the script."
  );
  process.exit(1);
}

const rootDir = path.resolve(projectRoot, DIR);
if (!existsSync(rootDir)) {
  console.error(`ERROR: directory not found: ${rootDir}`);
  process.exit(1);
}

/* ---------- walk files ---------- */
async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...(await walk(abs)));
    } else if (entry.isFile()) {
      out.push(abs);
    }
  }
  return out;
}

const files = (await walk(rootDir)).filter((abs) => {
  const ext = path.extname(abs).toLowerCase();
  if (!ALLOWED_EXT.has(ext)) return false;
  const rel = path.relative(projectRoot, abs).replaceAll("\\", "/");
  if (ONLY && !ONLY.test(rel)) return false;
  return true;
});

if (!files.length) {
  console.log("No files matched. Nothing to upload.");
  process.exit(0);
}

/* ---------- upload ---------- */
const uploaded = {};
let skipped = 0;
let errors = 0;

for (const abs of files) {
  // Blob pathname = path relative to `public/`, preserving subfolders.
  // (Strip the leading "public/" so the blob URL matches the live URL.)
  const relFromPublic = path
    .relative(path.join(projectRoot, "public"), abs)
    .replaceAll("\\", "/");

  // If the user scanned a dir outside /public, use the project-relative path.
  const pathname = relFromPublic.startsWith("..")
    ? path.relative(projectRoot, abs).replaceAll("\\", "/")
    : relFromPublic;

  if (DRY) {
    console.log(`[dry]  ${pathname}`);
    continue;
  }

  try {
    if (!OVERWRITE) {
      try {
        const existing = await head(pathname, { token });
        if (existing?.url) {
          console.log(`skip   ${pathname}  (already exists)`);
          uploaded[pathname] = existing.url;
          skipped++;
          continue;
        }
      } catch {
        /* not found -> fall through to upload */
      }
    }

    const body = await readFile(abs);
    const blob = await put(pathname, body, {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: OVERWRITE,
      token,
    });
    uploaded[pathname] = blob.url;
    console.log(`ok     ${pathname} -> ${blob.url}`);
  } catch (err) {
    errors++;
    console.error(`FAIL   ${pathname}: ${err.message}`);
  }
}

/* ---------- write summary ---------- */
if (!DRY) {
  const summaryFile = path.join(__dirname, ".blob-uploads.json");
  await writeFile(summaryFile, JSON.stringify(uploaded, null, 2) + "\n", "utf8");
  console.log(
    `\nDone. Uploaded ${Object.keys(uploaded).length - skipped} file(s), ` +
      `${skipped} skipped, ${errors} errors.\n` +
      `Summary -> ${path.relative(projectRoot, summaryFile)}`
  );
}
