import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReactiveProfileForm } from '../reactive-profile-form/reactive-profile-form';
import { SignalProfileForm } from '../signal-profile-form/signal-profile-form';
import { TemplateDrivenProfileForm } from '../template-driven-profile-form/template-driven-profile-form';

@Component({
  selector: 'app-form-approaches-page',
  imports: [TemplateDrivenProfileForm, ReactiveProfileForm, SignalProfileForm],
  templateUrl: './form-approaches-page.html',
  styleUrl: './form-approaches-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormApproachesPage {}
