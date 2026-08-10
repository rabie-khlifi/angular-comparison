# Angular Concepts Lab

This is a hands-on Angular 22 learning project. It was initially created with
the Angular CLI, then expanded into a collection of small, focused lessons that
compare Angular concepts through working examples.

[**Live demo**](https://angular-comparison.netlify.app/)

## About this project

This project is a collection of small examples for learning Angular concepts by
comparing related features. Each lesson includes:

- a focused, runnable example;
- a modern standalone implementation;
- an NgModule implementation when the comparison is relevant;
- a short explanation in its lesson README;
- educational comments in the example files that explain important lines and
  contrast similar concepts; and
- a successful production build before the lesson is considered complete.

Comments are intentionally added to the lines where Angular behavior or a
design choice needs explanation. Obvious HTML, CSS, and TypeScript syntax is
left uncluttered so that the example remains easy to read.

## Planned concept comparisons

1. [Standalone components vs NgModules](src/app/lessons/standalone-vs-ngmodule/README.md)
2. [Components vs directives](src/app/lessons/components-vs-directives/README.md)
3. [Attribute directives vs structural directives](src/app/lessons/attribute-vs-structural/README.md)
4. [Signals vs regular properties](src/app/lessons/signals-vs-properties/README.md)
5. [Signals vs RxJS Observables](src/app/lessons/signals-vs-observables/README.md)
6. [Inputs vs model inputs](src/app/lessons/inputs-vs-model-inputs/README.md)
7. [Outputs vs two-way binding](src/app/lessons/outputs-vs-two-way-binding/README.md)
8. [Services vs component state](src/app/lessons/services-vs-component-state/README.md)
9. [Component `providers` vs `providedIn: 'root'`](src/app/lessons/provider-scopes/README.md)
10. [Template-driven vs reactive vs signal forms](src/app/lessons/form-approaches/README.md)
11. [Eager vs lazy-loaded routes](src/app/lessons/route-loading/README.md)
12. [Pipes vs component methods](src/app/lessons/pipes-vs-methods/README.md)
13. [Classic lifecycle hooks vs modern lifecycle APIs](src/app/lessons/component-lifecycle/README.md)
14. [Default vs OnPush change detection](src/app/lessons/change-detection/README.md)
15. [Emulated vs None vs Shadow DOM view encapsulation](src/app/lessons/view-encapsulation/README.md)
16. [View queries, content projection, ng-template, and ng-container](src/app/lessons/queries-and-projection/README.md)
17. [Route parameters vs query parameters; RouterLink vs Router.navigate](src/app/lessons/routing-parameters/README.md)
18. [Route guards vs data resolvers](src/app/lessons/route-control/README.md)
19. [HttpClient Observables vs httpResource signals](src/app/lessons/http-data/README.md)
20. [Class-based vs functional HTTP interceptors](src/app/lessons/http-interceptors/README.md)
21. [Advanced RxJS operators and signal interop](src/app/lessons/advanced-rxjs/README.md)
22. [Signal Forms vs classic Reactive Forms async validation](src/app/lessons/advanced-forms/README.md)
23. [CSR vs SSR vs SSG and hydration](src/app/lessons/rendering-strategies/README.md)
24. [Modern zoneless vs classic Angular testing patterns](src/app/lessons/testing-fundamentals/README.md)
25. [RxJS service vs signal store-style service vs NgRx](src/app/lessons/state-management/README.md)
26. [Native semantics vs accessible custom controls](src/app/lessons/accessibility/README.md)
27. [Classic vs modern performance and debugging techniques](src/app/lessons/performance-debugging/README.md)

Each lesson link opens the detailed explanation stored beside that lesson's code.

## Mini lesson: Angular CLI commands

The Angular CLI is the main command-line tool for creating, running, testing,
and building Angular applications. Run these commands from the project root.

### 1. Inspect the Angular workspace

```bash
ng version
```

This displays the installed Angular CLI, Angular framework, Node.js, package
manager, and operating-system versions. It is a useful first diagnostic when a
command behaves differently between machines.

```bash
ng help
```

This lists the available commands. Use `ng help <command>`—for example,
`ng help generate`—to inspect the options for one command.

### 2. Run the application locally

```bash
ng serve
```

The CLI builds the development version, starts a local server, and rebuilds
when source files change. Open `http://localhost:4200/` after it starts.

`ng serve` is for development. It does not create the optimized files that
should be deployed to production.

### 3. Generate Angular code

The CLI can create correctly structured Angular files. The long and short
forms below are equivalent:

```bash
ng generate component lessons/example
ng g c lessons/example
```

Common generators include:

| What to create | Long form | Short form |
| --- | --- | --- |
| Component | `ng generate component name` | `ng g c name` |
| Service | `ng generate service name` | `ng g s name` |
| Directive | `ng generate directive name` | `ng g d name` |
| Pipe | `ng generate pipe name` | `ng g p name` |
| Guard | `ng generate guard name` | `ng g g name` |

Use `ng generate --help` to see every available generator and option. A route
definition itself is normally added to the `Routes` array after generating its
page component.

### 4. Run unit tests

```bash
ng test
```

This project uses Vitest as its test runner. During development, the runner can
watch for changes. To run the suite once, as CI would, use:

```bash
ng test --watch=false
```

### 5. Create a production build

```bash
ng build
```

The production build performs Angular template/type checking and creates
optimized browser and server output under `dist/learning/`. Running this before
considering a lesson complete catches errors that may not appear while editing.

### 6. Add or update Angular packages

Use `ng add` for Angular libraries that provide setup schematics:

```bash
ng add <package-name>
```

Use `ng update` when upgrading Angular so the CLI can apply the package's code
migrations as well as update dependency versions:

```bash
ng update
```

### 7. End-to-end tests and deployment

```bash
ng e2e
ng deploy
```

These commands require an E2E framework or deployment builder to be configured
first; a newly created Angular application does not automatically include
either one.

For the complete command reference, see the
[official Angular CLI documentation](https://angular.dev/tools/cli).
