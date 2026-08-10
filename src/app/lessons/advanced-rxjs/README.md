# Lesson 21: Advanced RxJS operators and signal interop

Open [`/advanced-rxjs`](https://angular-comparison.netlify.app/advanced-rxjs). Its simulated
search combines `debounceTime`, `distinctUntilChanged`, `switchMap`,
`catchError`, and `shareReplay`. `switchMap` cancels a stale search;
`concatMap` queues work; `mergeMap` runs work concurrently; and `exhaustMap`
ignores new triggers while current work is active.

The classic view consumes the shared Observable with `AsyncPipe`. The modern
view converts that same stream with `toSignal`. Both automatically clean up;
choose `AsyncPipe` when the stream can stay in the template and `toSignal`
when signal-based computed state needs the latest emitted value. Signals are
not a replacement for RxJS cancellation and concurrency operators.

