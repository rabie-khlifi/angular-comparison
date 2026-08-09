import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-reactive-profile-form',
  // ReactiveFormsModule supplies formGroup and formControlName directives.
  imports: [ReactiveFormsModule],
  templateUrl: './reactive-profile-form.html',
  styleUrl: './reactive-profile-form.css',
})
export class ReactiveProfileForm {
  private readonly formBuilder = inject(NonNullableFormBuilder);

  // The form model and validators are explicitly constructed in TypeScript.
  protected readonly profileForm = this.formBuilder.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
  });

  protected submittedValue = 'Not submitted';

  protected submitProfile(): void {
    this.profileForm.markAllAsTouched();
    if (this.profileForm.invalid) return;
    const value = this.profileForm.getRawValue();
    this.submittedValue = `${value.name} — ${value.email}`;
  }
}
