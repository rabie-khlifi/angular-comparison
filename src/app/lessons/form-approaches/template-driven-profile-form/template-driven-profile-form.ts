import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-template-driven-profile-form',
  // FormsModule supplies NgForm, NgModel, ngSubmit, and validation directives.
  imports: [FormsModule],
  templateUrl: './template-driven-profile-form.html',
  styleUrl: './template-driven-profile-form.css',
})
export class TemplateDrivenProfileForm {
  // The template's [(ngModel)] directives mutate this plain object.
  protected profile = { name: '', email: '' };
  protected submittedValue = 'Not submitted';

  protected submitProfile(formDirective: NgForm): void {
    if (formDirective.invalid) return;
    this.submittedValue = `${this.profile.name} — ${this.profile.email}`;
  }
}
