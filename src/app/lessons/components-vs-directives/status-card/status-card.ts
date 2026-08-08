import { Component, signal } from '@angular/core';

@Component({
  // Components normally use an element selector because they represent a piece of UI.
  selector: 'app-status-card',
  imports: [],
  // A component has a template and creates its own view inside its host element.
  templateUrl: './status-card.html',
  styleUrl: './status-card.css',
})
export class StatusCard {
  // Calling a signal in the template reads its current reactive value.
  protected readonly isOnline = signal(true);

  protected toggleStatus(): void {
    // update derives the next value from the current value.
    this.isOnline.update((currentStatus) => !currentStatus);
  }
}
