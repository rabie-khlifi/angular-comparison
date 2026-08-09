import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

@Component({
  selector: 'app-signal-test-counter',
  template: `<button type="button" (click)="increment()">Signal count: {{ count() }}</button>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignalTestCounter {
  // A writable signal schedules an OnPush view update when set or update is called.
  readonly count = signal(0);

  increment(): void {
    this.count.update((current) => current + 1);
  }
}

@Component({
  selector: 'app-classic-test-counter',
  template: `<button type="button" (click)="increment()">Classic count: {{ count }}</button>`,
  // Default change detection is intentionally used for this older class-property example.
})
export class ClassicTestCounter {
  // Before signals, component state was commonly stored in a regular mutable class property.
  count = 0;

  increment(): void {
    this.count += 1;
  }
}

@Component({
  selector: 'app-testing-fundamentals-page',
  imports: [SignalTestCounter, ClassicTestCounter],
  templateUrl: './testing-fundamentals-page.html',
  styleUrl: './testing-fundamentals-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestingFundamentalsPage {}
