# Learning

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 22.1.3.

## Learning goal

This project is a collection of small examples for learning Angular concepts by
comparing related features. Each lesson includes:

- a focused, runnable example;
- a modern standalone implementation;
- an NgModule implementation when the comparison is relevant;
- a short explanation in this README;
- educational comments in the example files that explain important lines and
  contrast similar concepts; and
- a successful production build before the lesson is considered complete.

Comments are intentionally added to the lines where Angular behavior or a
design choice needs explanation. Obvious HTML, CSS, and TypeScript syntax is
left uncluttered so that the example remains easy to read.

## Planned concept comparisons

1. Standalone components vs NgModules
2. Components vs directives
3. Attribute directives vs structural directives
4. Signals vs regular properties
5. Signals vs RxJS Observables
6. Inputs vs model inputs
7. Outputs vs two-way binding
8. Services vs component state
9. Component `providers` vs `providedIn: 'root'`
10. Template-driven vs reactive vs signal forms
11. Eager vs lazy-loaded routes
12. Pipes vs component methods

Each completed lesson will receive its own short section here explaining what
the APIs do, their main differences, and when to choose each one.

## Lesson 1: Standalone components vs NgModules

Open [`/standalone-vs-ngmodule`](http://localhost:4200/standalone-vs-ngmodule)
after starting the development server. The page renders two interactive
components with identical behavior but different dependency organization.

A **standalone component** owns its template dependencies through the
`imports` array in `@Component`. Since Angular 19, standalone is the default, so
`standalone: true` does not need to be written. Consumers import the component
class directly, and routes can lazy-load it with `loadComponent`.

An **NgModule-declared component** uses `standalone: false` and must appear in
the `declarations` array of exactly one `@NgModule`. That module imports the
component's template dependencies and must export the component before other
code can use it. Consumers normally import the NgModule rather than the
declared component class.

| Concern               | Standalone component          | NgModule-declared component                      |
| --------------------- | ----------------------------- | ------------------------------------------------ |
| Ownership             | Owns itself                   | Declared by exactly one NgModule                 |
| Template dependencies | Component `imports`           | NgModule `imports`                               |
| Sharing               | Import the component directly | Export the declaration and import its NgModule   |
| Lazy routing          | Usually `loadComponent`       | Usually `loadChildren` for a routed module       |
| New Angular code      | Preferred                     | Mostly maintained for existing/module-based code |

The lesson page demonstrates interoperability rather than merely showing two
separate snippets. Its `imports` array contains `StandaloneExample` directly
and also contains `LegacyExampleModule`, whose `exports` array exposes
`LegacyExample`. Both selectors can therefore be used side by side in the same
standalone template.

The organizational model does **not** change component state, event binding,
interpolation, lifecycle hooks, or rendering behavior. "Standalone" also does
not mean that a component has no dependencies; it means those dependencies are
listed locally instead of being supplied through an NgModule. Prefer
standalone for new work, but mix both styles safely while maintaining or
migrating an existing application.

## Lesson 2: Components vs directives

Open [`/components-vs-directives`](http://localhost:4200/components-vs-directives)
to compare a component that creates a complete status-card view with an
attribute directive that adds focus and hover behavior to existing elements.

Both are directives internally, but a **component is the specialized kind that
owns a template**. Angular renders that template inside the component's host
element, creating a reusable view. Use a component when a feature needs its own
markup, styles, state, and UI identity. Only one component can own a particular
host element.

A plain **directive has no view template**. It attaches reusable behavior to
the element or component matched by its selector. The example uses the
attribute selector `[appInteractiveHighlight]` and `host` metadata to listen
for focus and pointer events and toggle a CSS class on the existing host.
Several directives can coexist on one element.

| Concern            | Component                                | Directive                                     |
| ------------------ | ---------------------------------------- | --------------------------------------------- |
| Decorator          | `@Component`                             | `@Directive`                                  |
| Own template       | Yes                                      | No                                            |
| Typical selector   | Custom element such as `app-status-card` | Attribute such as `[appInteractiveHighlight]` |
| Best use           | A reusable piece of UI                   | Reusable behavior for existing UI             |
| DOM responsibility | Renders a view inside its host           | Modifies or observes its existing host        |
| Per host element   | At most one component                    | Multiple directives may coexist               |

Choose a component when you would naturally name the UI object: card, dialog,
toolbar, or profile. Choose a directive when the host element should keep its
identity but gain a reusable capability: highlighting, autofocus, permission
behavior, or a tooltip. For a one-off class, style, property, or event binding,
use normal template binding instead of creating a directive.

Official reference: [Angular directives overview](https://angular.dev/guide/directives).

## Lesson 3: Attribute directives vs structural directives

Open [`/attribute-vs-structural`](http://localhost:4200/attribute-vs-structural)
to change an existing paragraph with `appAccent` and conditionally create an
article with `appUnless`.

An **attribute directive** changes the appearance or behavior of an element,
component, or another directive that already exists. It does not own a
template. The lesson's `Accent` directive uses host bindings to apply a class
and colors to its paragraph. Changing the color changes the same DOM node; it
does not recreate or remove the paragraph.

A **structural directive** controls which embedded template views exist. It
injects `TemplateRef` to access template content and `ViewContainerRef` to
choose where that content is created or cleared. The custom `Unless` directive
renders its template only while its condition is false.

The `*` is structural-directive shorthand, or _microsyntax_:

```html
<article *appUnless="condition">Available</article>
```

Angular interprets that approximately as:

```html
<ng-template [appUnless]="condition">
  <article>Available</article>
</ng-template>
```

| Concern                 | Attribute directive                          | Structural directive                                       |
| ----------------------- | -------------------------------------------- | ---------------------------------------------------------- |
| Primary job             | Change an existing host                      | Create, repeat, or remove template views                   |
| Common syntax           | `[appAccent]="color"`                        | `*appUnless="condition"`                                   |
| Important APIs          | Host properties, classes, styles, and events | `TemplateRef` and `ViewContainerRef`                       |
| Host remains present    | Normally yes                                 | The shorthand host is inside the conditional embedded view |
| Multiple on one element | Multiple attribute directives can coexist    | Only one `*` shorthand per element                         |

For everyday conditions and loops, prefer Angular's built-in `@if`, `@for`,
and `@switch` blocks. These blocks are built into template syntax and are not
custom structural directives. Create a structural directive when the reusable
rendering rule is more specialized—for example permissions, feature flags, or
loading external data into a template context.

### Where `*ngIf`, `*ngFor`, and `*ngSwitchCase` fit

Yes, the older APIs commonly seen in Angular code are built-in structural
directives:

- `*ngIf` uses the `NgIf` directive to create or remove a template based on a
  condition.
- `*ngFor` uses `NgFor`/`NgForOf` to create one embedded view for each item and
  provide context values such as `index`, `first`, and `last`.
- `[ngSwitch]` coordinates a group whose `*ngSwitchCase` and
  `*ngSwitchDefault` directives choose which template views are rendered.

They are exported by `CommonModule`. A standalone component must import the
specific directive or `CommonModule`; an NgModule-based component receives it
from the declaring module's `imports`. Their asterisk forms expand to
`<ng-template>` and use structural-directive microsyntax just like
`*appUnless`.

In this Angular 22 project, these legacy directives are still available for
compatibility but have been deprecated since Angular 20:

| Legacy structural directive                       | Modern replacement                            |
| ------------------------------------------------- | --------------------------------------------- |
| `*ngIf="condition"`                               | `@if (condition) { ... }`                     |
| `*ngFor="let item of items"`                      | `@for (item of items; track item.id) { ... }` |
| `[ngSwitch]`, `*ngSwitchCase`, `*ngSwitchDefault` | `@switch`, `@case`, `@default`                |

The full legacy `*ngIf`/`else` form uses a named fallback template:

```html
<article *ngIf="hasPermission; else noPermission">Permission granted</article>

<ng-template #noPermission> Permission denied </ng-template>
```

When `hasPermission` is truthy, `NgIf` creates the embedded view containing
the article. When it is falsy, `else noPermission` tells `NgIf` to create the
view represented by the `#noPermission` template reference instead. An
`ng-template` does not render by itself; it describes content Angular can
instantiate later. The lesson contains a working toggle for both branches.

### Understanding the one-asterisk rule

Only one structural directive may use `*` on a **single element**. Every
asterisk expands that element into one implicit `ng-template`. This is invalid:

```html
<li *ngIf="show" *ngFor="let item of items">{{ item }}</li>
```

Two meanings are possible: test `show` once and then build the list, or build
the list first and test `show` for every item. Angular will not guess which
generated template should wrap the other. Express the nesting explicitly:

```html
<ng-container *ngIf="show">
  <li *ngFor="let item of items">{{ item }}</li>
</ng-container>
```

Now `*ngIf` owns the outer template and runs first. If it creates its view, the
inner `*ngFor` creates one view per item. `ng-container` groups template
behavior without adding a real wrapper element to the DOM. The rule does not
limit the whole component to one structural directive—you can use any number
on separate or explicitly nested hosts.

The modern forms are built-in control-flow syntax understood directly by the
Angular template compiler. They are **not directive classes**, do not use the
`*` microsyntax, and do not require importing `CommonModule`. Use modern
control flow for new code; recognize the old directives when maintaining or
migrating older applications.

Official references:

- [Angular attribute directives](https://angular.dev/guide/directives/attribute-directives)
- [Angular structural directives](https://angular.dev/guide/directives/structural-directives)
- [Deprecated `NgIf` API](https://angular.dev/api/common/NgIf)
- [Deprecated `NgFor` API](https://angular.dev/api/common/NgFor)
- [Deprecated `NgSwitch` API](https://angular.dev/api/common/NgSwitch)

## Lesson 4: Signals vs regular properties

Open [`/signals-vs-properties`](http://localhost:4200/signals-vs-properties)
to compare two counters and their derived double values. The regular-property
example intentionally includes a button that forgets to synchronize duplicated
state; the signal example derives its double with `computed()`.

A **regular property** is ordinary TypeScript state. Read it with `count` and
replace it with `count = 10`. Angular can display it in a template, but the
property itself has no mechanism for telling reactive consumers that it
changed. Template events still cause Angular change detection, which is why a
plain property visibly updates after a button click in this lesson.

A **signal** wraps a value and notifies consumers when that value changes. Read
it by calling `count()`, replace it with `count.set(10)`, or derive its next
value with `count.update(value => value + 1)`. When a template reads a signal,
Angular records that dependency and can update the relevant view when the
signal changes.

| Concern                   | Regular property                 | Signal                              |
| ------------------------- | -------------------------------- | ----------------------------------- |
| Create                    | `count = 0`                      | `count = signal(0)`                 |
| Read                      | `count`                          | `count()`                           |
| Replace                   | `count = 10`                     | `count.set(10)`                     |
| Update from current value | `count += 1`                     | `count.update(value => value + 1)`  |
| Change notification       | None built in                    | Notifies tracked reactive consumers |
| Derived values            | Getter or manual synchronization | `computed()`                        |

A `computed()` signal is read-only, lazy, and memoized. Angular records the
signals actually read by its calculation, caches the result, and recalculates
only after a tracked dependency changes and the value is requested again. This
makes derived state harder to leave stale than a second manually synchronized
property. A normal getter also stays logically correct, but Angular may execute
it whenever the template is checked and its result is not memoized by Angular.

Signals do not replace every variable. Prefer a regular `const`, local
variable, or property for constants and non-reactive implementation details.
Prefer signals for mutable state that templates, computed values, or other
reactive consumers need to observe. When a signal contains an object or array,
use `set()` or `update()` with a new reference instead of mutating the current
value in place, because in-place mutation does not notify consumers.

Official reference: [Angular signals overview](https://angular.dev/guide/signals).

## Lesson 5: Signals vs RxJS Observables

Open [`/signals-vs-observables`](http://localhost:4200/signals-vs-observables)
to compare an immediate signal search with an RxJS search that emits after a
500 ms pause. The page also consumes the Observable through `AsyncPipe` and
bridges the same stream to a signal with `toSignal()`.

A **signal** represents a current value. It always has something that can be
read synchronously by calling it, and Angular tracks reactive consumers that
read it. Writable signals use `set()` and `update()`; `computed()` derives a
memoized current value. Signals are a natural fit for local UI state and
synchronous state derivation.

An **Observable** represents a lazy sequence of zero or more values over time.
Consumers subscribe and can receive `next`, `error`, and `complete`
notifications. An Observable is not required to emit immediately—or ever—and
subscriptions can be cancelled. RxJS operators compose timing, filtering,
mapping, retries, cancellation, and multiple asynchronous sources.

| Concern                   | Signal                               | Observable                                 |
| ------------------------- | ------------------------------------ | ------------------------------------------ |
| Mental model              | Current reactive value               | Sequence of future values/events           |
| Consumption               | Call `value()`                       | Subscribe, `AsyncPipe`, or bridge          |
| Current value             | Always available                     | Not guaranteed                             |
| Derivation                | `computed()`                         | Operators in `pipe()`                      |
| Error/completion channels | No stream channels                   | `error` and `complete`                     |
| Cleanup                   | Consumers are dependency-tracked     | Subscriptions must be owned and cleaned up |
| Best fit                  | UI and synchronous application state | Async workflows and event composition      |

The Observable example uses a `Subject<string>` as an input-event source.
`startWith('')` supplies an initial emission, `debounceTime(500)` waits for a
pause, `map()` transforms values, `distinctUntilChanged()` removes consecutive
duplicates, and `shareReplay()` shares the most recent pipeline result. The `$`
suffix in `observableResults$` is a naming convention, not special syntax.

`AsyncPipe` subscribes from the template, exposes the latest emission, marks
the view for checking, and unsubscribes when its view is destroyed. Prefer it
over a manual component subscription when the value is only needed in a
template.

`toSignal(observable$, {initialValue})` subscribes immediately and returns a
signal holding the latest emitted value. Angular automatically cleans up that
subscription with the creating component or service. Create the bridge once
and reuse it; repeatedly calling `toSignal()` would create repeated
subscriptions. Conversely, `toObservable(signal)` is useful when a signal must
enter an RxJS operator pipeline.

Neither API replaces the other. Use signals for state such as selected items,
toggles, counters, and derived view models. Use Observables for HTTP/event
streams, debounce, retry, cancellation, websockets, and complex async
composition. A common architecture lets RxJS control the asynchronous workflow
and exposes its latest UI-facing result as a signal.

### Debouncing work driven by a signal

A signal represents the current value and updates immediately by design. It
does not have a built-in `debounceTime()` method because debounce describes the
timing of a sequence of changes. The recommended composition is to keep the
source signal immediate, turn its changes into an Observable, apply RxJS timing
operators, and expose the latest result as another signal:

```ts
readonly query = signal('');

private readonly queryChanges$ = toObservable(this.query);

readonly debouncedQuery = toSignal(
  this.queryChanges$.pipe(debounceTime(500), distinctUntilChanged()),
  { initialValue: '' },
);

readonly results = computed(() => expensiveSearch(this.debouncedQuery()));
```

`query()` remains immediately correct for the input and any UI that needs the
latest text. `debouncedQuery()` changes only after 500 ms without another
source emission. Expensive filtering or a request pipeline should depend on
the debounced value; work that continues reading `query()` is still immediate
and receives no debounce benefit.

Debouncing can reduce expensive searches, HTTP requests, async validation,
analytics events, or storage writes during a burst. It does not prevent browser
input events or writes to the immediate source signal. It also deliberately
adds latency, so it is usually wrong for buttons, toggles, navigation, or state
that must respond immediately.

For HTTP search, the Observable side will often continue with `switchMap()`
after `debounceTime()`. `switchMap()` unsubscribes from the previous inner
request when a newer query arrives, preventing an older response from winning
the race. The final UI-facing result can remain an Observable consumed by
`AsyncPipe`, or it can be bridged once with `toSignal()`.

Avoid implementing derived debounced state by copying values in a plain
`effect()` unless you specifically need custom scheduling behavior and handle
cleanup correctly. RxJS already provides tested timing, cancellation, error,
and teardown semantics. Also avoid repeatedly calling `toSignal()` for the same
stream because each call creates a subscription; store and reuse the returned
signal.

Official references:

- [Angular RxJS and signals interoperability](https://angular.dev/ecosystem/rxjs-interop)
- [RxJS Observable guide](https://rxjs.dev/guide/observable)
- [RxJS operators guide](https://rxjs.dev/guide/operators)

## Standalone, NgModule, and hybrid applications

Standalone APIs and NgModules are two ways to organize modern Angular code.
They can be mixed directly: an NgModule can import a standalone component, and
a standalone component can import an NgModule. No migration bridge is required.
This is useful when modernizing an application gradually.

`ngUpgrade` solves a different problem. It allows AngularJS 1.x and modern
Angular to run together during a gradual framework migration. Such an
application has two framework runtimes and can upgrade AngularJS services or
components for Angular, downgrade Angular code for AngularJS, and coordinate
their bootstrapping. A later lesson will demonstrate this architecture
separately from ordinary standalone/NgModule interoperability, because adding
AngularJS solely to demonstrate NgModules would give a misleading picture.

### What `ngUpgrade` actually does

The bridge is provided by `@angular/upgrade/static`. In an `UpgradeModule`
hybrid application, Angular starts first and then bootstraps the existing
AngularJS root module. AngularJS still owns the application root. The two
frameworks remain independent: every DOM element is owned by exactly one of
them, and adapters form explicit boundaries between them.

- `UpgradeComponent` wraps an AngularJS component so an Angular template can
  use it.
- `downgradeComponent()` exposes an Angular component to an AngularJS
  template.
- AngularJS services can be registered as Angular providers.
- `downgradeInjectable()` exposes an Angular service to AngularJS dependency
  injection.

`downgradeModule()` is an alternative that can start the Angular side lazily
when a downgraded Angular component is first needed. It can reduce initial
hybrid cost, but it does not connect Angular change detection to every
AngularJS `$digest` in the same way as `UpgradeModule`. The application may
therefore need explicit change-detection coordination. `downgradeModule()` and
`UpgradeModule` must not be used together in the same hybrid application.

### Recommended AngularJS migration strategy

Treat the migration as an incremental product change, not as one large
rewrite. A practical sequence is:

1. **Create a safety net.** Record important user journeys, add tests around
   business-critical behavior, establish error and performance baselines, and
   make sure the AngularJS application has a repeatable build and deployment.
2. **Prepare the AngularJS code.** Prefer AngularJS 1.5+ `.component()` APIs,
   one-way inputs, explicit outputs, services for shared state, and small
   feature boundaries. Remove direct DOM manipulation and hidden `$scope`
   coupling where practical.
3. **Introduce modern tooling.** Add TypeScript gradually if useful, align the
   package/build pipeline, and ensure both frameworks can be tested in CI.
   Avoid combining this migration with unrelated visual or product rewrites.
4. **Add the hybrid bridge.** Install compatible `angular`, `@angular/*`, and
   `@angular/upgrade` packages. Bootstrap the AngularJS module through
   `UpgradeModule`, or deliberately choose the lazy `downgradeModule()` model.
5. **Prove one vertical slice.** Migrate a small route or feature end to end,
   including its UI, services, routing, and tests. This exposes integration
   problems before the team commits to a broad migration.
6. **Move feature by feature.** New features should normally be written in
   modern Angular. Migrate leaf components and low-dependency services first,
   then containers, routes, and shared infrastructure. Keep adapter boundaries
   explicit and temporary.
7. **Prefer standalone for newly migrated code.** A temporary Angular
   `NgModule` may still be useful around `UpgradeModule` or older libraries.
   Standalone components and NgModules can interoperate, so this can be changed
   incrementally rather than in the same step as the AngularJS migration.
8. **Retire AngularJS from the leaves inward.** Track every upgraded or
   downgraded adapter. Remove adapters, AngularJS dependencies, `$rootScope`
   listeners, old routes, and legacy build steps as their last consumers
   disappear.
9. **Remove the hybrid bootstrap.** Once AngularJS owns no routes, components,
   or services, switch fully to Angular bootstrapping. The application can then
   use Angular's standalone migration schematics for any remaining NgModules.

This approach is often called a _strangler migration_: modern Angular gradually
replaces AngularJS while the application remains releasable. Migration order
should follow dependency boundaries and business risk, not merely the number
of files in a feature.

### Risks and controls

| Risk                                      | Why it matters                                                                                                        | How to control it                                                                                                                      |
| ----------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Two framework runtimes                    | More JavaScript, memory, bootstrap work, and conceptual overhead                                                      | Keep the hybrid period time-boxed, measure bundles and startup, and lazy-bootstrap only after testing its change-detection trade-offs  |
| Digest and change-detection differences   | Updates crossing the bridge can be late, repeated, or unexpectedly expensive                                          | Use explicit inputs/outputs, avoid shared mutable state, test asynchronous updates, and profile `$digest` and Angular change detection |
| DOM ownership confusion                   | Both frameworks trying to manipulate the same element causes fragile behavior                                         | Give each element one owner and cross boundaries only through upgrade/downgrade adapters                                               |
| Dependency-injection lifetime differences | Bridged or lazily bootstrapped services can accidentally gain multiple instances                                      | Define ownership for each service, centralize bridge registrations, and test singleton assumptions                                     |
| Router and URL conflicts                  | Two routers can respond to the same navigation                                                                        | Assign route ownership clearly and migrate complete route slices where possible                                                        |
| AngularJS template semantics              | Attribute casing, transclusion, watchers, and AngularJS binding behavior do not automatically become Angular behavior | Test adapter contracts and rewrite AngularJS-specific behavior rather than hiding it behind permanent wrappers                         |
| Unsupported third-party libraries         | Old AngularJS libraries may depend on private APIs or direct DOM access                                               | Inventory dependencies early, replace blockers before their feature is migrated, and avoid creating new dependencies on them           |
| CSS and global-state coupling             | Migrated screens can still depend on AngularJS globals or selectors                                                   | Identify global contracts, isolate styles and state gradually, and add visual and integration tests                                    |
| Weak regression coverage                  | A long migration can silently change mature behavior                                                                  | Add tests before moving a feature and compare telemetry, accessibility, and performance before and after release                       |
| Migration that never finishes             | Every adapter adds maintenance cost and allows two architectures to persist                                           | Give features owners, keep an adapter-removal register, set milestones, and stop adding new AngularJS code                             |

AngularJS support officially ended in January 2022, so security, browser, and
dependency exposure increases the longer it remains in production. The bridge
is a transition tool, not a desirable permanent architecture.

Official references:

- [Angular `UpgradeModule` API and hybrid mental model](https://angular.dev/api/upgrade/static/UpgradeModule)
- [Angular `downgradeModule()` API and trade-offs](https://angular.dev/api/upgrade/static/downgradeModule)
- [Angular standalone migration](https://angular.dev/reference/migrations/standalone)
- [Angular migrations overview](https://angular.dev/reference/migrations)
- [AngularJS long-term support status](https://docs.angularjs.org/misc/version-support-status)

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
