# Lesson 19: HttpClient Observables vs httpResource signals

Open [`/http-data`](https://angular-comparison.netlify.app/http-data). Both searches call the
same in-memory `/api/lessons` endpoint through Angular's real HTTP pipeline.

Classic `HttpClient` methods return cold Observables: no request starts until a
consumer subscribes. `AsyncPipe` is the traditional safe template consumer
because it subscribes, updates the view, and cleans up automatically. Services
should normally own endpoint URLs and domain request methods.

Modern `httpResource()` represents an HTTP read through `value`, `isLoading`,
`error`, `statusCode`, and other signals. Its request computation is eager and
reactive: when a signal read by that computation changes, stale work is
cancelled and a new request begins. Check `hasValue()` before reading `value()`
because `value()` throws while the resource is in an error state.

| Concern     | HttpClient                    | httpResource                       |
| ----------- | ----------------------------- | ---------------------------------- |
| Result      | Cold Observable               | Resource with state signals        |
| Execution   | Starts on subscription        | Eager reactive request             |
| Reads       | Excellent                     | Excellent for signal-driven reads  |
| Mutations   | Use for POST/PUT/PATCH/DELETE | Do not use as mutation replacement |
| Composition | Full RxJS operator ecosystem  | Signal/resource state APIs         |

