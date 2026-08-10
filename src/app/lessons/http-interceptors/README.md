# Lesson 20: Class-based vs functional HTTP interceptors

Open [`/http-interceptors`](https://angular-comparison.netlify.app/http-interceptors). Successful
requests show headers added by both interceptor styles; the failing request
returns a mock 503 so error and loading-state handling are visible.

Older Angular applications commonly define an injectable class implementing
`HttpInterceptor`, register it under the `HTTP_INTERCEPTORS` multi-provider,
and enable DI interceptors with `withInterceptorsFromDi()`. This remains
supported for existing code.

Modern Angular prefers `HttpInterceptorFn` functions configured in explicit
order through `withInterceptors()`. Functional interceptors can call `inject()`
inside their injection context and generally have more predictable composition.

Requests and responses are mostly immutable. Clone a request before adding
headers. Good cross-cutting responsibilities include authentication,
correlation IDs, locale, timing, caching policy, and consistent error
translation. Feature code should still decide user-facing recovery, while
backend authorization must never depend on an interceptor or client guard.

The project uses a final documented mock interceptor instead of an external
server. It handles only `/api/lessons` and `/api/interceptor-demo`; unrelated
requests continue to the configured backend. This keeps both lessons runnable
during development, tests, and SSR.

