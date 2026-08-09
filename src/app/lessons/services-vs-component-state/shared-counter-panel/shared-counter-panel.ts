import { Component, inject, input } from '@angular/core';
import { SharedCounter } from '../shared-counter';

@Component({
  selector: 'app-shared-counter-panel',
  imports: [],
  templateUrl: './shared-counter-panel.html',
  styleUrl: './shared-counter-panel.css',
})
export class SharedCounterPanel {
  readonly label = input.required<string>();

  // inject asks Angular DI for the closest SharedCounter provider.
  // Because only the root provider exists, both panel instances receive the same object.
  protected readonly counter = inject(SharedCounter);
}
