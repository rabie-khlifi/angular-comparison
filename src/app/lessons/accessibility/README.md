# Lesson 26: Native semantics vs accessible custom controls

Open [`/accessibility`](https://angular-comparison.netlify.app/accessibility) and operate it
with a keyboard. The native `details`/`summary`, labeled input, and button
already include essential semantics and keyboard behavior. The custom
disclosure still uses a real button and synchronizes `aria-expanded` with the
rendered panel. A live status region announces a save without stealing focus.

Older code often made a `div` clickable and added only a click handler. That
excludes keyboard and assistive-technology users unless focus, roles, keys,
names, and state are all reimplemented. Prefer native HTML; use ARIA only for
missing semantics. For complex tabs, listboxes, menus, trees, and grids,
Angular Aria can supply their difficult keyboard/focus behavior after the
package is installed. Always combine automated tests with keyboard, zoom,
contrast, reduced-motion, and screen-reader checks.

