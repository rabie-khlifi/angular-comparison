import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Subject, debounceTime, distinctUntilChanged, map, shareReplay, startWith } from 'rxjs';

interface SearchResult {
  readonly query: string;
  readonly items: readonly string[];
}

@Component({
  selector: 'app-signals-vs-observables-page',
  // AsyncPipe subscribes in the template and unsubscribes when the view is destroyed.
  imports: [AsyncPipe],
  templateUrl: './signals-vs-observables-page.html',
  styleUrl: './signals-vs-observables-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignalsVsObservablesPage {
  protected readonly catalog = ['Angular', 'RxJS', 'Signals', 'TypeScript', 'NgModule', 'Routing'];

  // SIGNAL APPROACH -----------------------------------------------------------
  // A signal always has a current value that can be read synchronously.
  protected readonly signalQuery = signal('');

  // computed derives and memoizes results from the query signal.
  protected readonly signalResults = computed(() => this.filterCatalog(this.signalQuery()));

  // Signals themselves intentionally update immediately; debounce is a time-based stream concern.
  // Convert the source signal to an Observable so RxJS can apply its timing operator.
  private readonly signalQueryChanges$ = toObservable(this.signalQuery);

  // Convert the debounced stream back to a signal for synchronous template consumption.
  // Keep this bridge as one reusable field so it creates only one managed subscription.
  protected readonly debouncedSignalQuery = toSignal(
    this.signalQueryChanges$.pipe(debounceTime(500), distinctUntilChanged()),
    { initialValue: '' },
  );

  // Expensive work should depend on the debounced value, not on the immediate source signal.
  protected readonly debouncedSignalResults = computed(() =>
    this.filterCatalog(this.debouncedSignalQuery()),
  );

  // OBSERVABLE APPROACH -------------------------------------------------------
  // A Subject is both an Observable and an observer; next() pushes future events into it.
  private readonly observableQueryEvents = new Subject<string>();

  // The $ suffix is a convention indicating that this value is an Observable stream.
  protected readonly observableResults$ = this.observableQueryEvents.pipe(
    // A Subject has no current value, so startWith supplies an initial emission.
    startWith(''),
    // Wait for 500 ms without another event before allowing a query through.
    debounceTime(500),
    // Ignore consecutive duplicate queries after trimming and normalizing them.
    map((query) => query.trim().toLowerCase()),
    distinctUntilChanged(),
    // Transform each emitted query into a new emitted SearchResult object.
    map((query): SearchResult => ({ query, items: this.filterCatalog(query) })),
    // AsyncPipe and toSignal share the latest execution instead of duplicating the pipeline.
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  // toSignal bridges the Observable into a synchronously readable Angular signal.
  // It subscribes immediately and automatically cleans up with this component.
  protected readonly observableResultSignal = toSignal(this.observableResults$, {
    initialValue: { query: '', items: this.catalog },
  });

  protected updateSignalQuery(event: Event): void {
    // EventTarget is broad, so narrow it before reading the input's value.
    const inputElement = event.target as HTMLInputElement;
    this.signalQuery.set(inputElement.value);
  }

  protected emitObservableQuery(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    // next() emits an event; the resulting value arrives later after debounceTime.
    this.observableQueryEvents.next(inputElement.value);
  }

  private filterCatalog(query: string): readonly string[] {
    const normalizedQuery = query.trim().toLowerCase();
    return this.catalog.filter((item) => item.toLowerCase().includes(normalizedQuery));
  }
}
