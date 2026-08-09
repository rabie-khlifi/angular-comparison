import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

@Component({
  selector: 'app-signals-vs-properties-page',
  imports: [],
  templateUrl: './signals-vs-properties-page.html',
  styleUrl: './signals-vs-properties-page.css',
  // OnPush works especially well with signals because a signal notifies Angular when it changes.
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignalsVsPropertiesPage {
  // A regular property stores a value directly and is read without parentheses.
  protected regularCount = 0;

  // This manually copied derived value can become stale if we forget to synchronize it.
  protected regularDouble = 0;

  // A writable signal wraps its value and exposes a getter function.
  protected readonly signalCount = signal(0);

  // computed tracks the signal read inside it, recalculates when needed, and caches its result.
  protected readonly signalDouble = computed(() => this.signalCount() * 2);

  // A getter stays correct but executes whenever Angular evaluates it during change detection.
  protected get regularDoubleGetter(): number {
    return this.regularCount * 2;
  }

  protected incrementRegularCorrectly(): void {
    this.regularCount += 1;
    // Manual synchronization is extra work and must happen on every update path.
    this.regularDouble = this.regularCount * 2;
  }

  protected incrementRegularWithoutSync(): void {
    this.regularCount += 1;
    // Deliberately omit regularDouble to demonstrate how duplicated state becomes stale.
  }

  protected incrementSignal(): void {
    // update is used when the next signal value depends on the previous one.
    this.signalCount.update((currentCount) => currentCount + 1);
    // No assignment to signalDouble is needed; computed owns that relationship.
  }

  protected setSignalToTen(): void {
    // set replaces a writable signal's value directly.
    this.signalCount.set(10);
  }

  protected resetExamples(): void {
    this.regularCount = 0;
    this.regularDouble = 0;
    this.signalCount.set(0);
  }
}
