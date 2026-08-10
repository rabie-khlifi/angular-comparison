# Lesson 27: Classic vs modern performance and debugging techniques

Open [`/performance-debugging`](https://angular-comparison.netlify.app/performance-debugging).
Filtering demonstrates a classic template method, which can repeat during
checks, beside a memoized `computed()` signal that recalculates only when its
dependencies change. `@for track product.id` preserves DOM identity, while
`@defer` keeps optional diagnostics out of the initial rendering path.

The pre-signals toolkit remains relevant: OnPush, pure pipes, memoized
selectors, lazy NgModules/routes, and `*ngFor trackBy`. Modern signals,
`computed`, standalone lazy routes, `@for track`, and `@defer` make those
intentions more direct. Measure an optimized production build before changing
architecture. Angular DevTools, browser Performance/Network panels, bundle
budgets, source maps, and production telemetry help locate actual change
detection, network, layout, memory, and bundle problems.

