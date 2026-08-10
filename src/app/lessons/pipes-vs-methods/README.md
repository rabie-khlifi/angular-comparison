# Lesson 12: Pipes vs component methods

Open [`/pipes-vs-methods`](https://angular-comparison.netlify.app/pipes-vs-methods). Both sides
filter the same lesson names with the same plain TypeScript function. One side
calls it through a custom pipe; the other calls it through a component method.

A **pipe** expresses a display transformation declaratively:

```html
@for (lesson of lessons() | lessonFilter: query(); track lesson) {
<li>{{ lesson }}</li>
}
```

Custom pipes implement `PipeTransform` and expose a `transform()` method. Pipes
are pure by default. Angular reuses a pure pipe's cached result until a primitive
argument changes or an array/object argument receives a new reference. This
makes pipes well suited to reusable, side-effect-free display formatting.

A **component method** is a normal TypeScript method called by the template:

```html
@for (lesson of filteredWithMethod(); track lesson) {
<li>{{ lesson }}</li>
}
```

Angular can call a template method every time it checks that view. This is fine
for trivial operations, but expensive sorting, filtering, or allocation can be
repeated because unrelated state changed. Event handlers are also naturally
component methods because they perform actions rather than format values.

The interactive mutation experiment explains pure-pipe reference checking. An
in-place array mutation keeps the original reference, so the method sees the
changed contents while the pure pipe retains its cached output. Creating a new
array reference causes the pipe to run again. Prefer immutable updates rather
than using `pure: false`; impure pipes run on every change-detection check and
can create the same performance concern as an expensive template method.

For signal-derived application state, a **computed signal** is often the third
and best option. It is memoized based on the signals read during its calculation
and can be consumed in both TypeScript and templates. Use pipes primarily for
template formatting, computed signals for derived signal state, and methods for
small component behavior or event handling.

The filtering algorithm lives in a plain `filterLessons()` function. The pipe
and method delegate to that function. Code outside a template should import the
plain function instead of injecting a pipe class, keeping reusable logic
independent from Angular's template API.

