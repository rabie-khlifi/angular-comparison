# Lesson 23: CSR vs SSR vs SSG and hydration

Open [`/rendering-strategies/ssg`](https://angular-comparison.netlify.app/rendering-strategies/ssg).
The page links to three real route configurations. CSR renders in the browser,
SSR produces initial HTML per server request, and SSG/prerendering produces
static HTML during `ng build`. Choose based on content freshness, SEO, server
cost, and whether output is user-specific—not because one mode is universally
newer or better.

Hydration is separate from rendering: it reuses SSR/SSG DOM and attaches
Angular behavior in the browser. Older non-hydrating designs re-rendered and
replaced server HTML. This app uses `provideClientHydration()`. Server-safe
components avoid unguarded access to `window`, `document`, and `localStorage`.

