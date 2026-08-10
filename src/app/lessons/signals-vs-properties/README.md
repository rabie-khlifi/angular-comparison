# Lesson 4: Signals vs regular properties

Open [`/signals-vs-properties`](https://angular-comparison.netlify.app/signals-vs-properties)
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

