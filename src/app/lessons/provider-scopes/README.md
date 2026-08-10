# Lesson 9: Component providers vs providedIn root

Open [`/provider-scopes`](https://angular-comparison.netlify.app/provider-scopes) to compare two
components sharing a root service instance with two components that each
override the same token and receive an isolated instance. The lesson displays
an instance ID so service identity is visible.

An automatic root provider is declared on the service:

```ts
@Injectable({ providedIn: 'root' })
export class ScopedCounter {}
```

Consumers that do not have a nearer matching provider receive the instance
from the root environment injector. It is normally shared across the
application and lives for the application lifetime. This form is tree-shakable
and is the usual choice for shared API clients, authentication, logging,
configuration, and application-level stores.

A component creates a nearer manual provider with:

```ts
@Component({
  providers: [ScopedCounter],
})
export class IsolatedPanel {}
```

Each `IsolatedPanel` instance creates an ElementInjector provider and therefore
its own `ScopedCounter`. That instance is available to the component and its
descendant subtree, shadows the root instance for those consumers, and is
destroyed with the providing component. The shorthand `providers:
[ScopedCounter]` means `{ provide: ScopedCounter, useClass: ScopedCounter }`.

| Concern           | `providedIn: 'root'`                        | Component `providers`                   |
| ----------------- | ------------------------------------------- | --------------------------------------- |
| Typical instances | One per root environment injector           | One per providing component instance    |
| Visibility        | Application-wide unless shadowed            | Component and descendants               |
| Lifetime          | Usually application lifetime                | Providing component lifetime            |
| Provision         | Automatic and tree-shakable                 | Manual provider entry                   |
| Typical use       | Shared infrastructure and application state | Per-widget, editor, or wizard isolation |

Angular resolves an injected token by searching from nearest to farthest:

1. The requesting element's injector.
2. Parent element injectors.
3. Route and other environment injectors.
4. The root environment injector.
5. A provider-not-found error if no match exists, unless injection is optional.

The first matching provider wins. This is why the purple lesson panels receive
their component instances even though the same service also has a root
provider. Descendants inherit that nearer instance unless another descendant
overrides it again.

Provider scope is independent from the service's state technology. A service
containing a plain property, a `BehaviorSubject`, a signal, or no state follows
the same injector lookup, sharing, shadowing, and lifetime rules. Migrating a
service from RxJS state to signals does not make it more or less singleton;
moving its provider changes its instance scope.

Do not put services in every component's `providers` array by habit. Doing so
creates separate instances and is a common reason expected shared state does
not synchronize. Choose root scope for intentional sharing and component scope
for intentional isolation. Route providers offer a middle scope for a feature
and will be covered with routing.

The application header now uses a native `details`/`summary` dropdown for
lesson navigation. This keeps the growing route list compact while retaining
keyboard behavior and active-route highlighting.

Official references:

- [Angular hierarchical injectors](https://angular.dev/guide/di/hierarchical-dependency-injection)
- [Angular dependency providers](https://angular.dev/guide/di/defining-dependency-providers)

