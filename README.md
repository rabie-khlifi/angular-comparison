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
