# Lesson 22: Signal Forms vs classic Reactive Forms async validation

Open [`/advanced-forms`](https://angular-comparison.netlify.app/advanced-forms) and enter
`admin` as either username. Modern Signal Forms use a signal as the source of
truth, `[formField]` for binding, and `validateAsync()` with a resource. Field
state is read by calling the field, for example
`modernForm.username().pending()`.

Classic Reactive Forms use `FormGroup`/`FormControl`, `formControlName`, and an
`AsyncValidatorFn` returning an Observable or Promise. Angular cancels stale
async validation when values change in both examples. Reactive Forms remain a
sound choice for existing code and libraries; Angular 21+ new development can
prefer the typed, signal-native Signal Forms API.

