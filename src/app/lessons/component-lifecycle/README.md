# Lesson 13: Classic lifecycle hooks vs modern lifecycle APIs

Open [`/component-lifecycle`](https://angular-comparison.netlify.app/component-lifecycle). Two
children receive the same input and record their activity through one
page-scoped timeline service. Change the input, destroy the children, and recreate them to observe
creation, update, render, and cleanup behavior.

The **classic component** uses decorator inputs and lifecycle interfaces:

```ts
export class ClassicCard implements OnChanges, OnInit, AfterViewInit, OnDestroy {
  @Input({ required: true }) learnerName!: string;

  ngOnChanges(changes: SimpleChanges): void {}
  ngOnInit(): void {}
  ngAfterViewInit(): void {}
  ngOnDestroy(): void {}
}
```

For initial creation, Angular constructs the class, assigns inputs and calls
`ngOnChanges`, calls `ngOnInit` once, creates the view, and then calls
`ngAfterViewInit`. Later input assignments call `ngOnChanges` again. Immediately
before removing the component, Angular calls `ngOnDestroy`.

The constructor is normal TypeScript class construction. It is appropriate for
dependency injection and registering setup that does not depend on initialized
inputs. `ngOnInit` is Angular-managed and runs after the first input assignment,
so older components commonly place input-dependent initialization there.

`SimpleChanges` gives `ngOnChanges` the previous value, current value, and
`firstChange` flag for each changed decorator input. An `@Input` setter is
shorter for reacting to one input; `ngOnChanges` is useful when several input
changes must be compared together.

The **modern component** demonstrates composable alternatives:

```ts
readonly learnerName = input.required<string>();
private readonly statusText = viewChild<ElementRef>('statusText');
private readonly destroyRef = inject(DestroyRef);

private readonly reportInput = effect(() => {
  console.log(this.learnerName());
});

constructor() {
  afterNextRender(() => this.statusText());
  this.destroyRef.onDestroy(() => releaseResources());
}
```

A signal input can feed `computed()` for derived values or `effect()` for true
side effects. Do not use an effect merely to copy one signal into another;
derive state with `computed()` instead. The lesson uses an effect legitimately
to report input changes outside the component's state graph.

`viewChild()` is a signal query. `afterNextRender()` schedules browser-only DOM
work after Angular finishes rendering all application views. For work that must
run after every relevant render, use `afterRenderEffect()` and separate DOM
reads from writes using its render phases. Render callbacks do not run during
server-side rendering.

`DestroyRef.onDestroy()` registers cleanup next to the setup that created a
resource. This can be easier to compose than collecting every cleanup action in
one `ngOnDestroy` method. Both approaches are valid, and lifecycle hook
interfaces remain fully supported—they were not deprecated by signals.

The timeline service is provided by the lesson page and inherited by both
children. It therefore remains alive while either child runs its destruction
callback. Emitting a modern component output from `DestroyRef.onDestroy()` is
incorrect because that output is being destroyed too; longer-lived cleanup
observers should use an owner such as this page-scoped service instead.

| Need                     | Classic API                            | Modern option                                       |
| ------------------------ | -------------------------------------- | --------------------------------------------------- |
| Input changes            | `ngOnChanges` or input setter          | Signal input with `computed()`/`effect()`           |
| One-time initialization  | `ngOnInit`                             | Field/constructor setup, or continue using the hook |
| Query component view     | `@ViewChild` after `ngAfterViewInit`   | `viewChild()` signal                                |
| Work after DOM rendering | `ngAfterViewInit`/`ngAfterViewChecked` | `afterNextRender`/`afterRenderEffect`               |
| Cleanup                  | `ngOnDestroy`                          | `DestroyRef.onDestroy()`                            |

Choose based on the work rather than novelty. Keep hooks when maintaining
existing components or when their lifecycle boundary clearly expresses the
requirement. Prefer modern APIs when signal composition, colocated cleanup, or
explicit render scheduling makes the code easier to understand.

