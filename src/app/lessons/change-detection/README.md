# Lesson 14: Default vs OnPush change detection

Open [`/change-detection`](https://angular-comparison.netlify.app/change-detection). The page
passes the same classic `@Input()` object to a Default child and an OnPush child.
Mutating that object in place lets the Default view appear current while the
OnPush view can remain stale; replacing the object reference updates both.

**Default change detection** uses the traditional CheckAlways strategy. When an
application traversal reaches the component, Angular evaluates its template.
This can make shared-object mutation appear to work, but the hidden mutation is
still difficult to reason about and can break as soon as an OnPush boundary is
introduced.

**OnPush change detection** allows Angular to skip a clean component subtree.
The name does not mean “render once.” Angular checks an OnPush view when a known
trigger marks it, including:

- a bound input receiving a different value or object reference;
- an event handled in that component subtree;
- a signal read by its template changing;
- `AsyncPipe` receiving a new value; or
- explicit `ChangeDetectorRef.markForCheck()`/`detectChanges()` usage.

Before signals, well-structured OnPush applications relied on immutable input
updates, Observable state consumed through `AsyncPipe`, local template events,
and occasional `markForCheck()` calls for external imperative APIs. The lesson
includes a classic decorator input, ordinary local property, `@ViewChild`, and
`ChangeDetectorRef` example.

With signals, a template read registers a reactive dependency. Updating that
signal tells Angular which OnPush view needs checking, reducing manual
`ChangeDetectorRef` work. Signals do not make in-place input mutation safe:
objects and arrays passed across component boundaries should still receive new
references when their contents change.

| Concern                 | Default                                    | OnPush                                           |
| ----------------------- | ------------------------------------------ | ------------------------------------------------ |
| Traversal behavior      | Checked whenever the traversal reaches it  | Clean subtree can be skipped                     |
| Same-reference mutation | Often becomes visible during another check | Can remain stale                                 |
| Classic reactive style  | Plain properties, events, Observables      | Immutable inputs, AsyncPipe, `markForCheck()`    |
| Modern reactive style   | Signals work                               | Signals precisely mark consuming views           |
| Primary benefit         | Simple mental model for small components   | Predictable boundaries and less unnecessary work |

Prefer immutable updates regardless of strategy. Use OnPush with explicit
reactive state for scalable components, and use Default when its simpler
checking model is appropriate. Do not call `detectChanges()` broadly to conceal
unclear ownership; first identify which state change Angular could not observe.

