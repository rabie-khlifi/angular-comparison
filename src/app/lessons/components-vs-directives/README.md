# Lesson 2: Components vs directives

Open [`/components-vs-directives`](https://angular-comparison.netlify.app/components-vs-directives)
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

Signals are incidental to this lesson, not part of the component/directive
distinction. Before signals, the examples would store `isOnline` and
`isHighlighted` as ordinary boolean properties and assign them in methods.
Older directives often used `@HostBinding()` and `@HostListener()` decorators;
those remain supported, while the `host` metadata object used here is preferred
for new code. Neither state style changes the rule that a component owns a
template and a directive does not.

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

