# Lesson 16: View queries, content projection, ng-template, and ng-container

Open [`/queries-and-projection`](https://angular-comparison.netlify.app/queries-and-projection).
The page contains working classic and signal-query examples, projected cards,
named projection slots, and a runtime template outlet.

A **view query** searches the component's own template. Classic code uses
`@ViewChild()` and receives a property after view initialization. Modern
`viewChild()` returns a query signal; `viewChild.required()` asserts that a
match must exist. Both focus examples query their own native input.

A **content query** searches markup supplied between the child's tags by its
parent. `@ContentChild()` is the classic property API and `contentChild()` is
the modern signal API. View queries cannot see projected content, while content
queries do not search the child's own view.

`ng-content` is a projection placeholder. `select="[card-title]"` routes
matching nodes into a named slot, while the unqualified slot receives remaining
content. Signals did not change projection: both old NgModule components and
modern standalone components use the same mechanism.

`ng-template` describes a dormant embedded view. It renders only when Angular
instantiates it through control flow, `NgTemplateOutlet`, or `ViewContainerRef`.
`ng-container` groups directives or control flow without producing a DOM
wrapper. The example hosts `NgTemplateOutlet` on an `ng-container` and switches
between two template references.

| Concept        | Classic API     | Modern API       | Purpose                  |
| -------------- | --------------- | ---------------- | ------------------------ |
| View query     | `@ViewChild`    | `viewChild()`    | Search component view    |
| Content query  | `@ContentChild` | `contentChild()` | Search projected content |
| Projection     | `ng-content`    | Same             | Place parent markup      |
| Dormant view   | `ng-template`   | Same             | Define later content     |
| DOM-less group | `ng-container`  | Same             | Group template behavior  |

Prefer inputs and outputs for normal data communication. Use queries when code
genuinely needs an element or component reference, such as focusing a control,
measuring rendered output, or integrating a browser/third-party API.

