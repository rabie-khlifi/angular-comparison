# Lesson 3: Attribute directives vs structural directives

Open [`/attribute-vs-structural`](https://angular-comparison.netlify.app/attribute-vs-structural)
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

The page now runs classic counterparts beside the signal-based directives.
`ClassicAccent` uses ordinary properties decorated with `@Input()`. Its host
bindings read those properties without `()`. `ClassicUnless` reacts through an
`@Input` setter and receives `TemplateRef` and `ViewContainerRef` through
constructor injection:

```ts
@Input()
set appClassicUnless(condition: boolean) {
  this.container.clear();
  if (!condition) this.container.createEmbeddedView(this.template);
}
```

An input setter fits one immediately handled input; `ngOnChanges` is the
classic alternative when changes to several inputs must be compared. Modern
`input()` values can instead participate in `computed()` and `effect()`.

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

