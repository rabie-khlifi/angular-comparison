import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  Observable,
  Subject,
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  of,
  shareReplay,
  startWith,
  switchMap,
  timer,
} from 'rxjs';

// A result has a stable id so @for can reuse the correct DOM element.
interface SearchResult {
  id: number;
  label: string;
}

@Component({
  selector: 'app-advanced-rxjs-page',
  // AsyncPipe is the classic, still-valid way to consume an Observable in a template.
  imports: [AsyncPipe],
  templateUrl: './advanced-rxjs-page.html',
  styleUrl: './advanced-rxjs-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdvancedRxjsPage {
  // A Subject represents a stream of search events rather than one current value.
  private readonly searchTerms = new Subject<string>();

  // This one shared pipeline is intentionally consumed through both old and new APIs below.
  protected readonly results$: Observable<SearchResult[]> = this.searchTerms.pipe(
    // startWith supplies useful initial content before the learner types anything.
    startWith('angular'),
    // debounceTime waits for a pause, avoiding a request for every keyboard event.
    debounceTime(350),
    // distinctUntilChanged ignores a term when it is identical to the previous term.
    distinctUntilChanged(),
    // switchMap cancels the previous simulated request when a newer term arrives.
    switchMap((term) => this.fakeSearch(term)),
    // catchError keeps the outer search stream alive and provides a safe fallback value.
    catchError(() => of([])),
    // shareReplay prevents AsyncPipe and toSignal from running two independent requests.
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  // Modern bridge: toSignal gives templates synchronous signal reads and automatic cleanup.
  protected readonly signalResults = toSignal(this.results$, { initialValue: [] });

  protected search(event: Event): void {
    // EventTarget is narrowed so TypeScript knows this element has a string value.
    const input = event.target as HTMLInputElement;
    // next() emits an event; unlike signal.set(), a Subject does not expose a current value.
    this.searchTerms.next(input.value.trim());
  }

  private fakeSearch(term: string): Observable<SearchResult[]> {
    // timer imitates network latency without requiring a real backend.
    return timer(500).pipe(
      // map transforms the timer emission into domain objects for the template.
      map(() =>
        term
          ? [1, 2, 3].map((id) => ({ id, label: `${term} result ${id}` }))
          : [],
      ),
    );
  }
}
