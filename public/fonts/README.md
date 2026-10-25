# Local Google Fonts

These are unmodified WOFF2 responses from Google Fonts, committed so builds and visitors do not depend on a Google Fonts request. `app/fonts.css` retains the provider's family names, weights, styles, Unicode ranges and `font-display: swap`; only `src` URLs point to local files. CSS theme tokens remain unchanged. The body font's Latin/Cyrillic files are preloaded in the root layout; other faces load only when used.

- Roboto: normal weights 400–700, italic 400; Latin, Latin Extended, Cyrillic and Cyrillic Extended.
- Poppins: normal 300/400/500/600/700; Latin and Latin Extended. Poppins has no Cyrillic glyphs; the existing sans-serif fallback remains.
- Playfair Display: normal/italic weights 400–700; Latin, Latin Extended and Cyrillic.

Source CSS was retrieved on 2026-10-25 from the official Google Fonts CSS2 API with Chrome 104's User-Agent. `sources.json` records every source URL, SHA-256 and byte size. Total WOFF2 payload: 437,808 bytes across 24 subsets; the browser requests only matching faces/ranges. There is no build-time download script or extra application dependency.

The three `*-OFL.txt` files preserve the font licenses from the [official Google Fonts repository](https://github.com/google/fonts/tree/e7db6ca603fd4862010383ff17ffd6cc4ffac1c0/ofl).

This avoids the extensionless Google Fonts URL failure tracked in [Next.js #99114](https://github.com/vercel/next.js/issues/99114), including its Turbopack `next/font/google queries have exactly one entry` error. Changing bundlers or retrying the same remote request does not remove that dependency. When updating fonts, replace the files deliberately, preserve licenses and refresh hashes in `sources.json`.
