# Lesson 18: Route guards vs data resolvers

Open [`/route-control`](https://angular-comparison.netlify.app/route-control). Toggle demo access
and navigate to four real child routes: functional/class-based guards and
functional/class-based resolvers.

A **guard** decides whether navigation can continue. `CanActivate` answers
whether a route may activate; other guard types include `CanMatch`,
`CanActivateChild`, and `CanDeactivate`. Return `true`, `false`, a redirect
`UrlTree`/`RedirectCommand`, or a Promise/Observable of one. Returning a redirect
is preferable to calling `navigate()` from inside the guard.

A **resolver** obtains critical data after guards succeed but before route
activation finishes. Resolved values appear in `ActivatedRoute.data`. Because
navigation waits, resolvers should load only data genuinely required before the
screen can render; noncritical content can load after activation.

Before functional APIs and signals, Angular used injectable classes that
implemented `CanActivate` or `Resolve<T>`, constructor injection, and route-data
Observables consumed through `AsyncPipe`. Lesson 18 runs those classic classes.
It also runs modern `CanActivateFn`/`ResolveFn` functions using `inject()` and
bridges resolved route data to a signal.

| Question      | Guard                                         | Resolver                                  |
| ------------- | --------------------------------------------- | ----------------------------------------- |
| Main job      | Allow, block, or redirect navigation          | Supply critical route data                |
| Timing        | Before activation                             | After guards, before activation completes |
| Common result | Boolean or redirect                           | Data value, Promise, or Observable        |
| Modern API    | `CanActivateFn`/other guard functions         | `ResolveFn<T>`                            |
| Classic API   | Injectable class implementing guard interface | Class implementing `Resolve<T>`           |

Client-side guards improve navigation behavior but provide no real security.
Users control browser code, so the backend must authorize every sensitive API
request independently.

