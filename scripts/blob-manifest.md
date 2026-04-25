# Vercel Blob — Media Manifest

Map of every blob asset and where it's consumed in the codebase. Regenerate after each upload by running `npm run blob:upload` and updating this table.

Store: `jgcva1vrcvhpcd7t.public.blob.vercel-storage.com`
Served via: `/api/media/[...path]` proxy (see [`app/api/media/[...path]/route.js`](../app/api/media/[...path]/route.js))
Reference shape in `media.json`: `"url": "blob:<path>"` — resolved by [`lib/mediaBlob.js`](../lib/mediaBlob.js)

## Active blobs

| Blob path | Referenced in | Used at |
|-----------|---------------|---------|
| `logo/logo.webp` | [`web-data/media/media.json`](../web-data/media/media.json) → `logo-primary` | Navbar brand logo (light theme, non-transparent nav) |
| `logo/bg-transparent.png` | [`app/components/Navbar/Navbar.js`](../app/components/Navbar/Navbar.js) direct reference | Navbar brand logo (dark theme or transparent-nav state), favicon via layout.js |
| `images/carosel-images/image-1.png` | [`web-data/pages/home.json`](../web-data/pages/home.json) → `hero.heroCarousel.slides[0]` | Hero carousel slide 1 — "Hospitality & F&B" |
| `images/carosel-images/image-2.png` | home.json → `slides[1]` | Hero carousel slide 2 — "BIM & documentation" |
| `images/carosel-images/image-3.jpeg` | home.json → `slides[2]` | Hero carousel slide 3 — "Residential & lifestyle" |
| `images/carosel-images/image-4.jpeg` | home.json → `slides[3]` | Hero carousel slide 4 — "Commercial & workplace" |
| `images/carosel-images/image-5.jpeg` | home.json → `slides[4]` | Hero carousel slide 5 — "Interiors & planning" |
| `images/carosel-images/image-6.jpeg` | home.json → `slides[5]` | Hero carousel slide 6 — "Delivery & visualization" |
| `images/about-us/about-us-feature-image.jpg` | media.json → `about-studio` | About section right-side image |
| `images/service-cards/Commercial-Kitchen.png` | media.json → `service-commercial-kitchen` | Services section · Commercial Kitchen Design card |
| `images/service-cards/BIM-modeling.png` | media.json → `service-bim` | Services section · BIM Modeling card (filename is lowercase `m`) |
| `images/service-cards/Floor-Planning.png` | media.json → `service-floor-plan` | Services section · Floor Planning card |
| `images/home-accordian/Commercial-Kitchen.jpg` | media.json → `accordion-kitchen` | Services Accordion · Kitchen panel showcase |
| `images/home-accordian/BIM-Model.png` | media.json → `accordion-bim` | Services Accordion · BIM panel showcase |
| `images/home-accordian/Floor Planning.png` | media.json → `accordion-floor` | Services Accordion · Floor Planning panel showcase (filename has space) |

## Uploaded but not yet used

| Blob path | Notes |
|-----------|-------|
| `images/Services/Kitchen Design/Kitchen Desgin 1.webp` | Available for service cards, project showcase, or accordion |
| `images/Services/Kitchen Design/Kitchen Desgin 2.webp` | Available — pair with image 1 for a kitchen project gallery |
| `images/carosel-images/Architecture.jpg` | Available — intended replacement for an architecture carousel slide |
| `images/carosel-images/BIM_modeling.png` | Available — intended replacement for the BIM modeling carousel slide |

## External assets (not on Blob)

Still referenced directly from Unsplash / Mixkit in [`web-data/media/media.json`](../web-data/media/media.json):

| Media key | Source | Used at |
|-----------|--------|---------|
| `hero-video` | Mixkit | Hero section (fallback when no carousel) |
| `hero-poster` | Unsplash | Hero static poster / OpenGraph image |
| `service-commercial-kitchen` | Unsplash | Services section card |
| `service-bim` | Unsplash | Services section + BIM accordion panel |
| `service-floor-plan` | Unsplash | Services section |
| `service-architecture` | Unsplash | Services section |
| `about-studio` | Unsplash | About section image |
| `project-1` … `project-6` | Unsplash | Featured Projects grid, Services Accordion showcase images |

## Favicon

Favicons in [`app/layout.js`](../app/layout.js) still point to `/logo/bg-transparent.png` — served from `/public/` for fastest initial delivery. The file must remain in `/public/logo/` for favicons to work (the proxy route isn't used here because browsers request favicons before any JS runs).

## How to add a new file

1. Drop the file into `/public/` anywhere (e.g. `/public/images/projects/new-kitchen.jpg`).
2. Run `npm run blob:upload` — the file uploads to Blob with the same path.
3. Grab the blob path from the script output (`images/projects/new-kitchen.jpg`).
4. Reference it in `media.json` as `"url": "blob:images/projects/new-kitchen.jpg"`.
5. Update this manifest.

## How to remove a file

1. Delete the entry from Blob via Vercel dashboard (Storage → your store → select → delete) or via SDK.
2. Remove the reference from `media.json` / `home.json`.
3. Update this manifest.

## Maintenance commands

| Command | Purpose |
|---------|---------|
| `npm run blob:upload:dry` | Preview what would upload from `/public/` |
| `npm run blob:upload` | Upload new files (skips existing) |
| `npm run blob:upload -- --overwrite` | Force overwrite existing blobs |
| `npm run blob:upload -- --dir=public/images` | Scan only a subfolder |
| `npm run blob:upload -- --only=carosel` | Regex filter on pathname |
