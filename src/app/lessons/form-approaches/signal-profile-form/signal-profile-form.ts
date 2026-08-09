import { Component, signal } from '@angular/core';
import { FormField, email, form, required, submit } from '@angular/forms/signals';

@Component({
  selector: 'app-signal-profile-form',
  // FormField binds native controls to fields derived from the signal model.
  imports: [FormField],
  templateUrl: './signal-profile-form.html',
  styleUrl: './signal-profile-form.css',
})
export class SignalProfileForm {
  // Signal Forms derives its field tree directly from this non-null model shape.
  protected readonly profileModel = signal({ name: '', email: '' });

  // Validation rules live in a type-safe schema callback.
  protected readonly profileForm = form(this.profileModel, (schema) => {
    required(schema.name, { message: 'Name is required.' });
    required(schema.email, { message: 'Email is required.' });
    email(schema.email, { message: 'Enter a valid email.' });
  });

  protected readonly submittedValue = signal('Not submitted');

  protected submitProfile(event: SubmitEvent): void {
    event.preventDefault();
    // submit marks fields touched and runs the async callback only when valid.
    submit(this.profileForm, async () => {
      const value = this.profileModel();
      this.submittedValue.set(`${value.name} — ${value.email}`);
    });
  }
}
