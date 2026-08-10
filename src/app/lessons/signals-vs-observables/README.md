# Lesson 5: Signals vs RxJS Observables

Open [`/signals-vs-observables`](https://angular-comparison.netlify.app/signals-vs-observables)
to compare an immediate signal search with an RxJS search that emits after a
500 ms pause. The page also consumes the Observable through `AsyncPipe` and
bridges the same stream to a signal with `toSignal()`.

A **signal** represents a current value. It always has something that can be
read synchronously by calling it, and Angular tracks reactive consumers that
read it. Writable signals use `set()` and `update()`; `computed()` derives a
memoized current value. Signals are a natural fit for local UI state and
synchronous state derivation.

An **Observable** represents a lazy sequence of zero or more values over time.
Consumers subscribe and can receive `next`, `error`, and `complete`
notifications. An Observable is not required to emit immediately—or ever—and
subscriptions can be cancelled. RxJS operators compose timing, filtering,
mapping, retries, cancellation, and multiple asynchronous sources.

| Concern                   | Signal                               | Observable                                 |
| ------------------------- | ------------------------------------ | ------------------------------------------ |
| Mental model              | Current reactive value               | Sequence of future values/events           |
| Consumption               | Call `value()`                       | Subscribe, `AsyncPipe`, or bridge          |
| Current value             | Always available                     | Not guaranteed                             |
| Derivation                | `computed()`                         | Operators in `pipe()`                      |
| Error/completion channels | No stream channels                   | `error` and `complete`                     |
| Cleanup                   | Consumers are dependency-tracked     | Subscriptions must be owned and cleaned up |
| Best fit                  | UI and synchronous application state | Async workflows and event composition      |

The Observable example uses a `Subject<string>` as an input-event source.
`startWith('')` supplies an initial emission, `debounceTime(500)` waits for a
pause, `map()` transforms values, `distinctUntilChanged()` removes consecutive
duplicates, and `shareReplay()` shares the most recent pipeline result. The `$`
suffix in `observableResults$` is a naming convention, not special syntax.

The lesson also includes the common pre-signals state pattern:

```ts
private readonly queryState = new BehaviorSubject('');
readonly query$ = this.queryState.asObservable();
```

Unlike a plain `Subject`, a `BehaviorSubject` requires an initial value,
remembers its latest value, and immediately emits that value to a new
subscriber. It was frequently used for Angular service stores before signals
and remains useful when current state must participate in RxJS pipelines. Keep
the subject private, expose its Observable side, and provide methods that call
`next()` so consumers cannot mutate state arbitrarily.

`AsyncPipe` subscribes from the template, exposes the latest emission, marks
the view for checking, and unsubscribes when its view is destroyed. Prefer it
over a manual component subscription when the value is only needed in a
template.

`toSignal(observable$, {initialValue})` subscribes immediately and returns a
signal holding the latest emitted value. Angular automatically cleans up that
subscription with the creating component or service. Create the bridge once
and reuse it; repeatedly calling `toSignal()` would create repeated
subscriptions. Conversely, `toObservable(signal)` is useful when a signal must
enter an RxJS operator pipeline.

Neither API replaces the other. Use signals for state such as selected items,
toggles, counters, and derived view models. Use Observables for HTTP/event
streams, debounce, retry, cancellation, websockets, and complex async
composition. A common architecture lets RxJS control the asynchronous workflow
and exposes its latest UI-facing result as a signal.

### Debouncing work driven by a signal

A signal represents the current value and updates immediately by design. It
does not have a built-in `debounceTime()` method because debounce describes the
timing of a sequence of changes. The recommended composition is to keep the
source signal immediate, turn its changes into an Observable, apply RxJS timing
operators, and expose the latest result as another signal:

```ts
readonly query = signal('');

private readonly queryChanges$ = toObservable(this.query);

readonly debouncedQuery = toSignal(
  this.queryChanges$.pipe(debounceTime(500), distinctUntilChanged()),
  { initialValue: '' },
);

readonly results = computed(() => expensiveSearch(this.debouncedQuery()));
```

`query()` remains immediately correct for the input and any UI that needs the
latest text. `debouncedQuery()` changes only after 500 ms without another
source emission. Expensive filtering or a request pipeline should depend on
the debounced value; work that continues reading `query()` is still immediate
and receives no debounce benefit.

Debouncing can reduce expensive searches, HTTP requests, async validation,
analytics events, or storage writes during a burst. It does not prevent browser
input events or writes to the immediate source signal. It also deliberately
adds latency, so it is usually wrong for buttons, toggles, navigation, or state
that must respond immediately.

For HTTP search, the Observable side will often continue with `switchMap()`
after `debounceTime()`. `switchMap()` unsubscribes from the previous inner
request when a newer query arrives, preventing an older response from winning
the race. The final UI-facing result can remain an Observable consumed by
`AsyncPipe`, or it can be bridged once with `toSignal()`.

Avoid implementing derived debounced state by copying values in a plain
`effect()` unless you specifically need custom scheduling behavior and handle
cleanup correctly. RxJS already provides tested timing, cancellation, error,
and teardown semantics. Also avoid repeatedly calling `toSignal()` for the same
stream because each call creates a subscription; store and reuse the returned
signal.

Official references:

- [Angular RxJS and signals interoperability](https://angular.dev/ecosystem/rxjs-interop)
- [RxJS Observable guide](https://rxjs.dev/guide/observable)
- [RxJS operators guide](https://rxjs.dev/guide/operators)

