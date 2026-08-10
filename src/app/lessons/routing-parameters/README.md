# Lesson 17: Route parameters vs query parameters; RouterLink vs Router.navigate

Open [`/routing-parameters/42`](https://angular-comparison.netlify.app/routing-parameters/42).
The same routed component remains mounted while links and buttons change the
learner ID and optional tab state.

A **route parameter** is a required path segment declared with a colon, such as
`routing-parameters/:learnerId`. It normally identifies the resource being
displayed. A **query parameter** follows `?`, is not declared in the route path,
and normally represents optional filters, sorting, tabs, or pagination.

`RouterLink` is declarative navigation. Prefer it for visible destinations
because an anchor preserves browser behaviors such as copying a link or opening
it in another tab. `Router.navigate()` is imperative navigation for decisions
made after validation, saving, authentication, or other TypeScript logic.

Before signals, components consumed `ActivatedRoute.paramMap` and
`queryParamMap` as Observables—often with `AsyncPipe` or a managed subscription.
The lesson keeps that working approach and also bridges each Observable once
with `toSignal()`. A snapshot is only a one-time read and does not react when
Angular reuses the component for new URL values.

Because this application prerenders routes, `app.routes.server.ts` also defines
`getPrerenderParams()` for learner IDs `42` and `84`. Parameterized routes cannot
be prerendered until Angular knows which concrete URLs to generate. IDs not
known during the build would normally use server or client rendering instead.

| Concern           | Route parameter   | Query parameter              |
| ----------------- | ----------------- | ---------------------------- |
| Example           | `/learners/42`    | `?tab=settings`              |
| Route declaration | `learners/:id`    | Not part of path declaration |
| Typical meaning   | Required identity | Optional view/filter state   |
| Reactive source   | `paramMap`        | `queryParamMap`              |

