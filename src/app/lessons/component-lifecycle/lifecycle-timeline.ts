import { Injectable, signal } from '@angular/core';

@Injectable()
export class LifecycleTimeline {
  // The lesson page provides this service, so both children share one page-scoped timeline.
  private readonly eventState = signal<readonly string[]>([]);

  // Expose a read-only signal so consumers cannot replace timeline state directly.
  readonly events = this.eventState.asReadonly();

  record(source: 'Classic' | 'Modern', message: string): void {
    // Immutable replacement notifies the parent template even during child destruction.
    this.eventState.update((events) => [...events, `${source}: ${message}`]);
  }

  clear(): void {
    // The service owns mutation, so components interact through this small public API.
    this.eventState.set([]);
  }
}
