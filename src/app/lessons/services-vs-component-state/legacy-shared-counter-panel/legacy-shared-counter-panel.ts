import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { LegacySharedCounter } from '../legacy-shared-counter';

@Component({
  selector: 'app-legacy-shared-counter-panel',
  // AsyncPipe subscribes, triggers view updates, and unsubscribes automatically on destruction.
  imports: [AsyncPipe],
  templateUrl: './legacy-shared-counter-panel.html',
  styleUrl: './legacy-shared-counter-panel.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LegacySharedCounterPanel {
  // Use a classic input too, making the complete example representative of pre-signals Angular.
  @Input({ required: true }) label!: string;

  protected readonly counter = inject(LegacySharedCounter);
}
