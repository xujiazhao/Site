# Custom cursor sources

Edit these two files to change the site's cursor shapes:

- `cursor-arrow.svg` — the default cursor.
- `cursor-dot.svg` — the cursor over interactive elements.

- Keep the `viewBox` at `0 0 24 24`.
- Keep one closed path. The id `cursor-shape` is preferred, but standard
  Figma/Illustrator exports without an id are also supported.
- Put the arrow's pointer hotspot near the top-left of its artboard. Keep the
  dot centered around `(12, 12)`.
- Fills, strokes, and the SVG's displayed color are ignored by the site; the
  cursor uses the theme yellow defined in CSS.
- Curves and any number of path nodes are supported. The browser samples both
  outlines, then aligns their direction and starting points automatically so
  they can morph smoothly into each other.

After saving the SVG, reload the page to preview it.
