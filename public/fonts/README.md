# Local Google Fonts

Local variable WOFF2 fonts, derived from the official Google Fonts sources. `app/site-fonts.ts` uses `next/font/local`: hashed assets, metric fallback and `display: swap`. Body and heading fonts preload; the italic accent loads when used. Each file contains only the Google Fonts `latin` + `cyrillic` ranges (Ukrainian included) plus arrows and `₴`; Latin Extended, Vietnamese and Cyrillic Extended were dropped to keep the preloads small.

- Roboto: normal 400–700 (width axis fixed at 100).
- Montserrat: normal 500–700.
- Playfair Display: italic 400–700; the modified font's internal family is `New Life Accent`, respecting the original's reserved font name.

Prepared on 2026-10-27 using FontTools variable-axis instancing, Unicode subsetting and Brotli compression. `sources.json` records source URLs, sizes, hashes and the exact `unicodes` list; re-run `fontTools.subset` with that list after any font update. Fonts are committed; builds and visitors make no font-provider requests. Poppins and the old CSS/subset files were removed.

The three `*-OFL.txt` files preserve the font licenses from the [official Google Fonts repository](https://github.com/google/fonts/tree/main/ofl).

When updating fonts, preserve licenses, Latin/Cyrillic coverage and refresh `sources.json`.
