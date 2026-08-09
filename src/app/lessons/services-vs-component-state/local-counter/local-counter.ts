import { Component, input, signal } from '@angular/core';

@Component({
  selector: 'app-local-counter',
  imports: [],
  templateUrl: './local-counter.html',
  styleUrl: './local-counter.css',
})
export class LocalCounter {
  readonly label = input.required<string>();

  // Every LocalCounter component instance constructs its own independent signal.
  protected readonly count = signal(0);

  protected increment(): void {
    this.count.update((count) => count + 1);
  }

  protected reset(): void {
    this.count.set(0);
  }
}
