# Lesson 6: Inputs vs model inputs

Open [`/inputs-vs-model-inputs`](https://angular-comparison.netlify.app/inputs-vs-model-inputs)
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

The page now contains a working classic rating component as well. Its child API
uses `@Input({ required: true }) rating`, its parent binds a plain property, and
a TypeScript getter derives the stars. Both `@Input()` and `input()` implement
one-way parent-to-child data flow. The classic property can react through a
setter or `ngOnChanges`; an `InputSignal` instead composes directly with
`computed()` and `effect()` and is read by calling it.

Official reference: [Angular component inputs](https://angular.dev/guide/components/inputs).

