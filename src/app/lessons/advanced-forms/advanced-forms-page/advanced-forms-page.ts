import { ChangeDetectionStrategy, Component, inject, resource, signal } from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import {
  FormField,
  email,
  form,
  required,
  submit,
  validateAsync,
} from '@angular/forms/signals';
import { Observable, map, timer } from 'rxjs';

@Component({
  selector: 'app-advanced-forms-page',
  // Each form system has its own binding directives; importing both enables the comparison.
  imports: [FormField, ReactiveFormsModule],
  templateUrl: './advanced-forms-page.html',
  styleUrl: './advanced-forms-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdvancedFormsPage {
  // Modern Signal Forms begin with a non-null signal model, which remains the source of truth.
  protected readonly modernModel = signal({ username: '', email: '' });
  protected readonly modernMessage = signal('Not submitted yet.');

  protected readonly modernForm = form(this.modernModel, (path) => {
    required(path.username, { message: 'A username is required.' });
    required(path.email, { message: 'An email is required.' });
    email(path.email, { message: 'Enter a valid email address.' });

    // validateAsync owns pending state and connects an asynchronous resource to this field.
    validateAsync(path.username, {
      // params tells Angular which value changes should restart validation.
      params: ({ value }) => value(),
      // The resource loader imitates asking a server whether a username already exists.
      factory: (username) =>
        resource({
          params: username,
          loader: async ({ params }) => {
            await new Promise((resolve) => setTimeout(resolve, 500));
            return params.trim().toLowerCase() === 'admin';
          },
        }),
      // A successful request can still return a validation error such as "taken".
      onSuccess: (taken) =>
        taken ? { kind: 'taken', message: 'The username admin is already taken.' } : undefined,
      // Network failure is different from a normal "taken" response and needs its own message.
      onError: () => ({ kind: 'server', message: 'Username validation could not run.' }),
    });
  });

  // Classic Reactive Forms use FormControl/FormGroup objects and Observable-based validators.
  private readonly formBuilder = inject(NonNullableFormBuilder);
  protected readonly classicMessage = signal('Not submitted yet.');
  protected readonly classicForm = this.formBuilder.group({
    username: this.formBuilder.control('', {
      validators: [Validators.required],
      asyncValidators: [this.classicUsernameValidator()],
    }),
    email: this.formBuilder.control('', [Validators.required, Validators.email]),
  });

  protected submitModern(event: Event): void {
    event.preventDefault();
    // submit marks fields touched and only invokes this async callback when validation succeeds.
    submit(this.modernForm, async () => {
      this.modernMessage.set(`Saved modern model for ${this.modernModel().username}.`);
    });
  }

  protected submitClassic(): void {
    // Classic forms require the component to mark fields before displaying submit-time errors.
    this.classicForm.markAllAsTouched();
    if (this.classicForm.valid) {
      this.classicMessage.set(`Saved classic form for ${this.classicForm.getRawValue().username}.`);
    }
  }

  private classicUsernameValidator(): AsyncValidatorFn {
    return (control: AbstractControl<string>): Observable<ValidationErrors | null> =>
      // timer imitates latency; Angular unsubscribes when a newer control value needs validation.
      timer(500).pipe(
        map(() =>
          control.value.trim().toLowerCase() === 'admin' ? { taken: true } : null,
        ),
      );
  }
}
