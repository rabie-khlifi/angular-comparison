# Lesson 24: Modern zoneless vs classic Angular testing patterns

Open [`/testing-fundamentals`](https://angular-comparison.netlify.app/testing-fundamentals).
It includes a signal counter, a classic mutable-property counter, and a real
Vitest specification beside the component. Tests use `TestBed` and
`ComponentFixture`, then follow arrange → act → `await fixture.whenStable()` →
assert.

Older zone-based suites often force rendering with `detectChanges()` and
coordinate timers through `fakeAsync()`/`tick()`. Modern zoneless tests prefer
ordinary async code and waiting for stability. `TestBed` is still current;
the important improvement is asserting public behavior without coupling tests
to private implementation details or manual rendering timing.

