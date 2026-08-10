# Lesson 25: RxJS service vs signal store-style service vs NgRx

Open [`/state-management`](https://angular-comparison.netlify.app/state-management). Two todo
stores provide identical behavior. The classic service keeps private state in
a `BehaviorSubject`, exposes Observables, derives selectors with RxJS
operators, and uses `AsyncPipe`. The modern service keeps a private writable
signal, exposes it with `asReadonly()`, and derives memoized state with
`computed()`.

A small service is often enough. NgRx Store becomes valuable when many teams
and features need formal actions, reducers, effects, selectors, time-travel
debugging, and strict conventions. NgRx SignalStore provides structured
signal-based stores. NgRx is intentionally not imported because it is not a
dependency of this project; the page explains the decision boundary without
misrepresenting a homemade service as the NgRx library.

