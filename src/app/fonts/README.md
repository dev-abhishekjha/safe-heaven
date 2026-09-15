# Fonts

Self-hosted variable fonts, latin subset, extracted from the Fontsource npm
packages (`@fontsource-variable/dm-sans`, `@fontsource-variable/playfair-display`).

They are committed rather than fetched by `next/font/google` so builds never
depend on reaching Google at build time, and so no request is made to Google
from the visitor's browser.

| File                            | Family           | Axis      |
| ------------------------------- | ---------------- | --------- |
| `dm-sans-variable.woff2`         | DM Sans          | 100–1000  |
| `dm-sans-variable-italic.woff2`  | DM Sans Italic   | 100–1000  |
| `playfair-display-variable.woff2`| Playfair Display | 400–900   |

Both families are licensed under the SIL Open Font License 1.1 — see the
`*-LICENSE.txt` files in this folder.

To update, reinstall the Fontsource packages and re-copy the
`*-latin-wght-*.woff2` files.
