# Lesson 10: Template-driven vs reactive vs signal forms

Open [`/form-approaches`](https://angular-comparison.netlify.app/form-approaches) to complete the
same name-and-email profile form using all three Angular form models.

**Template-driven forms** import `FormsModule` and define most form structure
and validation through template directives such as `NgForm`, `NgModel`,
`required`, and `email`. `[(ngModel)]` synchronizes controls with a plain domain
object. Every registered control needs a `name`, and template references such
as `#emailControl="ngModel"` expose validation state. This approach is concise
for small forms but spreads behavior through HTML as complexity grows.

**Reactive forms** import `ReactiveFormsModule` and construct `FormControl`,
`FormGroup`, and `FormArray` objects explicitly in TypeScript. The template uses
`[formGroup]`, `formControlName`, and related directives to connect elements to
that model. Reactive forms provide synchronous state plus Observable streams
such as `valueChanges` and `events`. They are mature, testable, and remain a
good fit for existing applications with complex reactive-form infrastructure.

**Signal Forms** are the preferred approach for new forms in Angular 21+ and
this Angular 22 project. A signal holds the non-null domain model, `form()`
derives a typed field tree, a schema callback declares validation rules, and
`[formField]` connects fields to native controls:

```ts
readonly profileModel = signal({ name: '', email: '' });

readonly profileForm = form(this.profileModel, schema => {
  required(schema.name, { message: 'Name is required.' });
  required(schema.email, { message: 'Email is required.' });
  email(schema.email, { message: 'Enter a valid email.' });
});
```

```html
<input [formField]="profileForm.email" />
```

| Concern          | Template-driven                | Reactive                           | Signal Forms              |
| ---------------- | ------------------------------ | ---------------------------------- | ------------------------- |
| Import           | `FormsModule`                  | `ReactiveFormsModule`              | `FormField`               |
| Model            | Template directives + object   | Form control object tree           | Signal model + field tree |
| Binding          | `[(ngModel)]`                  | `formControlName`                  | `[formField]`             |
| Validation       | Template attributes/directives | `Validators` functions             | Schema rules              |
| Reactive changes | Directive state                | Observables                        | Signals                   |
| Recommended use  | Small/simple existing forms    | Complex established reactive forms | New Angular 21+ forms     |

Signal Forms field-tree paths and field state are different. `profileForm.email`
is the structural field; call it before accessing state:
`profileForm.email().errors()`, `touched()`, or `valid()`. Initialize input
models with `''`, `0`, `false`, or `[]` rather than `null`/`undefined`. A control
using `[formField]` already receives value, disabled, readonly, and constraint
state from the field APIs, so do not duplicate those bindings or attributes.

Signal Forms submission uses `submit(formTree, async callback)`. It marks
fields touched and invokes the async callback only when validation passes.
Reactive and template-driven forms expose their own submit/reset/state APIs, as
shown side by side in the lesson.

Do not automatically rewrite a stable form. Migration cost, test coverage,
third-party controls, and team expertise matter. For new work in this project,
start with Signal Forms; maintain the matching form model when extending an
existing feature.

Official references:

- [Angular forms overview](https://angular.dev/guide/forms)
- [Template-driven forms](https://angular.dev/guide/forms/template-driven-forms)
- [Reactive forms](https://angular.dev/guide/forms/reactive-forms)

