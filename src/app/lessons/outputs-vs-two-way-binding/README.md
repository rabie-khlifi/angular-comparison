# Lesson 7: Outputs vs two-way binding

Open [`/outputs-vs-two-way-binding`](https://angular-comparison.netlify.app/outputs-vs-two-way-binding)
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

