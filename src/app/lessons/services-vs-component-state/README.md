# Lesson 8: Services vs component state

Open [`/services-vs-component-state`](https://angular-comparison.netlify.app/services-vs-component-state)
to compare two independent component counters with two consumers of one shared
service counter.

**Component state** belongs to a component instance. If a template creates two
instances of the same counter component, each class instance constructs its own
signal and changes independently. Its lifetime normally matches the component:
when Angular destroys that instance, its local state disappears.

Keep state local when it represents temporary view details such as expanded
sections, active tabs, draft text, hover state, or a selection no other feature
needs. Local ownership is explicit and prevents unnecessary coupling.

A **service** is a class made available through Angular dependency injection.
This lesson uses the familiar automatic provider form:

```ts
@Injectable({ providedIn: 'root' })
export class SharedCounter {
  private readonly countState = signal(0);
  readonly count = this.countState.asReadonly();

  increment(): void {
    this.countState.update((count) => count + 1);
  }
}
```

Consumers request it in an injection context:

```ts
readonly counter = inject(SharedCounter);
```

With `providedIn: 'root'`, Angular creates one instance in the root environment
injector when it is first requested. Both purple panels resolve that same
object, call the same methods, and read the same signal. The private writable
signal plus public read-only signal prevents components from bypassing the
service's state-changing API.

The orange pre-signals example provides the same shared behavior with RxJS:

```ts
private readonly countState = new BehaviorSubject(0);
readonly count$ = this.countState.asObservable();

increment(): void {
  this.countState.next(this.countState.getValue() + 1);
}
```

Both consumers use `AsyncPipe`, which subscribes, refreshes an OnPush view, and
unsubscribes when the view is destroyed. The service is shared because both
consumers resolve the same root provider—not because it uses a signal or a
BehaviorSubject. Signals offer simpler synchronous reads; RxJS offers stream
operators, async composition, cancellation, error, and completion channels.

| Concern           | Component state                    | Service                                                           |
| ----------------- | ---------------------------------- | ----------------------------------------------------------------- |
| Default owner     | One component instance             | The injector providing the service                                |
| Lifetime          | Component creation to destruction  | Provider scope lifetime                                           |
| Sharing           | Inputs, outputs, or a lifted owner | Inject a shared provided instance                                 |
| Template coupling | Usually presentation-oriented      | Should be independent of one view                                 |
| Typical use       | Drafts, toggles, local selections  | API clients, business rules, caches, authentication, shared state |

Move responsibility to a service when multiple consumers need the same state
or behavior, when business rules should be independent of one view, or when
working with external systems such as HTTP APIs, storage, analytics, and
authentication. A service can also contain stateless reusable behavior; it
does not need to own state.

A class is not a singleton merely because it is called a service.
`providedIn: 'root'` creates a root-scoped shared instance, while a component or
route `providers` array can create a nearer instance with a shorter lifetime.
Angular resolves the nearest matching provider in the injector hierarchy.
Lesson 9 demonstrates root and component provider scopes directly.

Avoid moving every value into a root service. Global mutable state can hide
ownership, make unrelated components depend on each other, persist longer than
intended, and complicate tests. Start with the narrowest reasonable owner and
lift state only when sharing or non-UI responsibility is real.

Official references:

- [Angular dependency injection](https://angular.dev/guide/di)
- [Angular dependency providers](https://angular.dev/guide/di/defining-dependency-providers)

