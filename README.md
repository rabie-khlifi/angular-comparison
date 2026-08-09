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

## Lesson 6: Inputs vs model inputs

Open [`/inputs-vs-model-inputs`](http://localhost:4200/inputs-vs-model-inputs)
to compare a parent-controlled rating using `input()` with an editable rating
using `model()` and two-way binding.

An **input signal** created by `input()` carries data from parent to child. The
child reads it as a signal but cannot call `set()` or `update()` because
`InputSignal` is read-only. `input.required<T>()` makes the binding mandatory at
template compile time, while `input(defaultValue)` defines an optional input.
Inputs also support aliases and transforms.

A **model input** created by `model()` is a writable `ModelSignal`. The child
can update it, and Angular emits an implicit change output named by appending
`Change` to the model name. A model named `rating` therefore has a `rating`
input and `ratingChange` output. Model inputs support aliases but not input
transforms.

| Concern                        | `input()`               | `model()`                            |
| ------------------------------ | ----------------------- | ------------------------------------ |
| Data direction                 | Parent → child          | Parent ↔ child                       |
| Signal type                    | Read-only `InputSignal` | Writable `ModelSignal`               |
| Child calls `set()`/`update()` | No                      | Yes                                  |
| Automatic output               | No                      | Yes: `<name>Change`                  |
| Input transforms               | Supported               | Not supported                        |
| Default choice                 | Most component data     | Values the child is designed to edit |

The two-way syntax:

```html
<app-editable-rating [(rating)]="editableRating" />
```

connects both directions and is conceptually equivalent to:

```html
<app-editable-rating [rating]="editableRating()" (ratingChange)="editableRating.set($event)" />
```

When binding a writable signal to a model with `[(rating)]`, pass the signal
instance without calling it. Angular needs the writable signal so it can keep
the parent synchronized. A plain parent property can also be used, in which
case Angular assigns emitted values back to that property.

Prefer one-way `input()` by default because it makes ownership clear: the
parent owns the value and the child consumes it. Choose `model()` when changing
the value is an intentional part of the child's public API, as with a custom
form control, slider, date picker, rating editor, or reusable counter. Use a
named output for actions such as `saved`, `deleted`, or `submitted` rather than
turning unrelated actions into model state.

The legacy `@Input()` decorator remains supported for existing code. Modern
code should generally prefer signal inputs because they compose naturally with
`computed()` and provide stronger reactive semantics.

Official reference: [Angular component inputs](https://angular.dev/guide/components/inputs).

## Lesson 7: Data binding, outputs, and two-way binding

Open [`/outputs-vs-two-way-binding`](http://localhost:4200/outputs-vs-two-way-binding)
to interact with all four binding forms, emit profile actions with `output()`,
and synchronize notification state with `[(enabled)]`.

Angular's four fundamental data-binding forms are:

| Type             | Syntax                    | Direction        | Purpose                                                         |
| ---------------- | ------------------------- | ---------------- | --------------------------------------------------------------- |
| Interpolation    | `{{ expression }}`        | Component → view | Render dynamic text converted to a string                       |
| Property binding | `[property]="expression"` | Component → view | Assign a typed value to a DOM, directive, or component property |
| Event binding    | `(event)="statement"`     | View → component | Run code for native or custom events                            |
| Two-way binding  | `[(target)]="state"`      | Component ↔ view | Combine a value input with a matching change event              |

**Interpolation** evaluates a template expression and inserts its string form
into text. It is ideal for labels and messages:

```html
<p>Hello, {{ learnerName }}!</p>
```

**Property binding** uses square brackets and preserves the value's type. For
example, `[disabled]="false"` assigns the boolean `false` to the live DOM
property. The literal HTML attribute `disabled="false"` still disables the
button because a boolean attribute is true by its presence. Use an `attr.`
prefix for attributes without corresponding DOM properties, such as
`[attr.aria-label]`. Class and style bindings use specialized forms such as
`[class.active]` and `[style.width.px]`.

**Event binding** uses parentheses for native browser events, directive events,
or component outputs. `$event` is the emitted value: a browser `MouseEvent` for
`(click)`, or the custom payload type for an Angular output.

**Two-way binding** combines property and event binding, which explains the
`[()]` “banana-in-a-box” syntax. For a native form control, `FormsModule`
provides the `NgModel` directive:

The lesson first shows a modern custom text input backed by a model signal:

```ts
readonly value = model('');

updateValue(event: Event): void {
  this.value.set((event.target as HTMLInputElement).value);
}
```

```html
<app-model-text-input [(value)]="signalLearnerName" />
```

Here the parent passes its writable signal without calling it. The shorthand
connects `[value]="signalLearnerName()"` to
`(valueChange)="signalLearnerName.set($event)"`. The child renders a normal text
input, writes its `ModelSignal`, and automatically emits `valueChange`.

The matching classic text-input example uses `NgModel` with a normal property:

```html
<input [(ngModel)]="learnerName" />
```

This expands conceptually to:

```html
<input [ngModel]="learnerName" (ngModelChange)="learnerName = $event" />
```

Native inputs do not have an `ngModel` property themselves. `NgModel` supplies
the input and `ngModelChange` output. Component two-way binding follows the
same naming rule: `[enabled]` plus `(enabledChange)` can be shortened to
`[(enabled)]`.

### Component two-way binding before signal APIs

Before `model()` was introduced, a child component created the same two-way
contract explicitly with `@Input`, `@Output`, and `EventEmitter`:

```ts
@Input() enabled = false;
@Output() readonly enabledChange = new EventEmitter<boolean>();

toggle(): void {
  this.enabled = !this.enabled;
  this.enabledChange.emit(this.enabled);
}
```

The output must use the exact `<inputName>Change` convention. Because the input
is `enabled` and the output is `enabledChange`, the parent can write:

```html
<app-legacy-notification-toggle [(enabled)]="legacyNotificationsEnabled" />
```

That syntax expands to:

```html
<app-legacy-notification-toggle
  [enabled]="legacyNotificationsEnabled"
  (enabledChange)="legacyNotificationsEnabled = $event"
/>
```

The modern equivalent is shorter:

```ts
readonly enabled = model(false);

toggle(): void {
  this.enabled.update(value => !value);
}
```

`model()` creates the `enabled` input and `enabledChange` output contract for
the child. Updating the `ModelSignal` automatically emits the change event. The
classic version must update its normal property and call `emit()` explicitly.
The parent-facing `[(enabled)]` syntax is the same, so old and new components
can coexist during a migration.

| Concern       | Classic API                           | Modern API                       |
| ------------- | ------------------------------------- | -------------------------------- |
| Child value   | Normal `@Input()` property            | Writable `ModelSignal`           |
| Change event  | Explicit `@Output()` + `EventEmitter` | Implicit `<name>Change` output   |
| Child update  | Assign property, then call `emit()`   | Call `set()` or `update()`       |
| Parent syntax | `[(enabled)]="property"`              | `[(enabled)]="propertyOrSignal"` |
| Status        | Supported for existing code           | Preferred for new code           |

An **output** is a custom event from child to parent. Declare it with
`output<T>()`, emit it with `.emit(payload)`, and listen with parentheses. The
special `$event` variable contains the emitted payload:

```ts
readonly saved = output<ProfileSaveEvent>();

save(): void {
  this.saved.emit({ name: 'Ada', savedAt: new Date() });
}
```

```html
<app-profile-editor (saved)="handleSaved($event)" />
```

The event does not assign parent state automatically. The handler can update
state, call a service, navigate, log, or do nothing. Outputs are appropriate
for semantic occurrences such as `saved`, `cancelled`, `closed`, `selected`,
or `submitted`.

**Two-way binding** synchronizes one named value from parent to child and child
back to parent. A model input is an input plus an implicit `<name>Change`
output. `[(enabled)]="notificationsEnabled"` connects `[enabled]` with
`(enabledChange)` so Angular performs the corresponding parent update.

| Concern         | Output                     | Two-way binding                            |
| --------------- | -------------------------- | ------------------------------------------ |
| Meaning         | Something happened         | One value changed                          |
| Child API       | `output<T>()`              | `model<T>()` or matching input/output pair |
| Syntax          | `(saved)="handle($event)"` | `[(enabled)]="state"`                      |
| Parent response | Explicit arbitrary handler | Value assignment/signal synchronization    |
| Naming          | Event: `saved`, `closed`   | Value: `enabled`, `rating`                 |

An output and two-way binding are related because two-way binding uses an
output internally, but their public intent differs. Do not create a model named
`saved` or `submitted`; those are events, not durable values. Conversely, a
slider's `value` or toggle's `enabled` state can be a good two-way contract
because the child edits the same value the parent retains.

Angular custom outputs are case-sensitive and do not bubble through the DOM.
Avoid names that collide with native events such as `click`, and prefer
`saved` over `onSaved`. `output()` returns an Angular `OutputEmitterRef`, not an
RxJS Observable. The legacy `@Output()` plus `EventEmitter` API remains
supported, but `output()` is preferred for modern code.

Official reference: [Angular component outputs](https://angular.dev/guide/components/outputs).

## Lesson 8: Services vs component state

Open [`/services-vs-component-state`](http://localhost:4200/services-vs-component-state)
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

## Lesson 10: Template-driven vs reactive vs signal forms

Open [`/form-approaches`](http://localhost:4200/form-approaches) to complete the
same name-and-email profile form using all three Angular form models.

**Template-driven forms** import `FormsModule` and define most form structure
and validation through template directives such as `NgForm`, `NgModel`,
`required`, and `email`. `[(ngModel)]` synchronizes controls with a plain domain
object. Every registered control needs a `name`, and template references such
as `#emailControl="ngModel"` expose validation state. This approach is concise
for small forms but spreads behavior through HTML as complexity grows.

**Reactive forms** import `ReactiveFormsModule` and construct `FormControl`,
`FormGroup`, and `FormArray` objects explicitly in TypeScript. The template uses
`[formGroup]`, `formControlName`, and related directives to connect elements to
that model. Reactive forms provide synchronous state plus Observable streams
such as `valueChanges` and `events`. They are mature, testable, and remain a
good fit for existing applications with complex reactive-form infrastructure.

**Signal Forms** are the preferred approach for new forms in Angular 21+ and
this Angular 22 project. A signal holds the non-null domain model, `form()`
derives a typed field tree, a schema callback declares validation rules, and
`[formField]` connects fields to native controls:

```ts
readonly profileModel = signal({ name: '', email: '' });

readonly profileForm = form(this.profileModel, schema => {
  required(schema.name, { message: 'Name is required.' });
  required(schema.email, { message: 'Email is required.' });
  email(schema.email, { message: 'Enter a valid email.' });
});
```

```html
<input [formField]="profileForm.email" />
```

| Concern          | Template-driven                | Reactive                           | Signal Forms              |
| ---------------- | ------------------------------ | ---------------------------------- | ------------------------- |
| Import           | `FormsModule`                  | `ReactiveFormsModule`              | `FormField`               |
| Model            | Template directives + object   | Form control object tree           | Signal model + field tree |
| Binding          | `[(ngModel)]`                  | `formControlName`                  | `[formField]`             |
| Validation       | Template attributes/directives | `Validators` functions             | Schema rules              |
| Reactive changes | Directive state                | Observables                        | Signals                   |
| Recommended use  | Small/simple existing forms    | Complex established reactive forms | New Angular 21+ forms     |

Signal Forms field-tree paths and field state are different. `profileForm.email`
is the structural field; call it before accessing state:
`profileForm.email().errors()`, `touched()`, or `valid()`. Initialize input
models with `''`, `0`, `false`, or `[]` rather than `null`/`undefined`. A control
using `[formField]` already receives value, disabled, readonly, and constraint
state from the field APIs, so do not duplicate those bindings or attributes.

Signal Forms submission uses `submit(formTree, async callback)`. It marks
fields touched and invokes the async callback only when validation passes.
Reactive and template-driven forms expose their own submit/reset/state APIs, as
shown side by side in the lesson.

Do not automatically rewrite a stable form. Migration cost, test coverage,
third-party controls, and team expertise matter. For new work in this project,
start with Signal Forms; maintain the matching form model when extending an
existing feature.

Official references:

- [Angular forms overview](https://angular.dev/guide/forms)
- [Template-driven forms](https://angular.dev/guide/forms/template-driven-forms)
- [Reactive forms](https://angular.dev/guide/forms/reactive-forms)

## Lesson 9: Component providers vs providedIn root

Open [`/provider-scopes`](http://localhost:4200/provider-scopes) to compare two
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
