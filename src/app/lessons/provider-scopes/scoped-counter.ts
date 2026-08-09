import { Injectable, signal } from '@angular/core';

@Injectable({
  // This automatic provider is the fallback when no nearer provider overrides it.
  providedIn: 'root',
})
export class ScopedCounter {
  private static nextInstanceId = 0;

  // The id makes otherwise invisible service instances easy to compare in the UI.
  readonly instanceId = ++ScopedCounter.nextInstanceId;
  readonly count = signal(0);

  increment(): void {
    this.count.update((count) => count + 1);
  }
}
