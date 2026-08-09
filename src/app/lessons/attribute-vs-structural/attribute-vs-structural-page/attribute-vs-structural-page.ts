import { NgIf } from '@angular/common';
import { Component, signal } from '@angular/core';
import { Accent } from '../accent';
import { Unless } from '../unless';

@Component({
  selector: 'app-attribute-vs-structural-page',
  // NgIf is imported only to teach the legacy syntax with a working example.
  // Modern @if needs no import; our custom directives are imported directly.
  imports: [NgIf, Accent, Unless],
  templateUrl: './attribute-vs-structural-page.html',
  styleUrl: './attribute-vs-structural-page.css',
})
export class AttributeVsStructuralPage {
  // Changing this color updates the attribute directive but never removes its host.
  protected readonly accentColor = signal('#2563eb');

  // Changing this condition makes the structural directive create or destroy a view.
  protected readonly maintenanceMode = signal(false);

  // This separate condition drives the complete legacy *ngIf/else demonstration.
  protected readonly hasPermission = signal(true);

  protected toggleAccent(): void {
    this.accentColor.update((color) => (color === '#2563eb' ? '#7c3aed' : '#2563eb'));
  }

  protected toggleMaintenance(): void {
    this.maintenanceMode.update((enabled) => !enabled);
  }

  protected togglePermission(): void {
    this.hasPermission.update((allowed) => !allowed);
  }
}
