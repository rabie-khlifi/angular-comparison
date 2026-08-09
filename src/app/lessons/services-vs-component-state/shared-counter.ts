import { Injectable, signal } from '@angular/core';

@Injectable({
  // The root environment injector creates one shared instance on first use.
  // Tree shaking can remove the service when no reachable code injects it.
  providedIn: 'root',
})
export class SharedCounter {
  // Keep the writable signal private so consumers cannot bypass service methods.
  private readonly countState = signal(0);

  // Expose a read-only signal: components can react to it but cannot set it.
  readonly count = this.countState.asReadonly();

  increment(): void {
    this.countState.update((count) => count + 1);
  }

  reset(): void {
    this.countState.set(0);
  }
}
