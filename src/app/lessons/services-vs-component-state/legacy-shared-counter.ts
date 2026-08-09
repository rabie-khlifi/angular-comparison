import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LegacySharedCounter {
  // Before signals, BehaviorSubject commonly combined stored state with Observable notifications.
  private readonly countState = new BehaviorSubject(0);

  // Consumers receive a read-only Observable and cannot call next() directly.
  readonly count$ = this.countState.asObservable();

  increment(): void {
    // getValue() reads the current state; next() stores and emits its replacement.
    this.countState.next(this.countState.getValue() + 1);
  }

  reset(): void {
    this.countState.next(0);
  }
}
