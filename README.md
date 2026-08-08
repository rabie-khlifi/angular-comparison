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
