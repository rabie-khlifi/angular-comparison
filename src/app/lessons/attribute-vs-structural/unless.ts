import { Directive, TemplateRef, ViewContainerRef, effect, inject, input } from '@angular/core';

@Directive({
  // The selector looks like an attribute directive; TemplateRef + ViewContainerRef
  // and the directive's rendering behavior are what make it structural.
  selector: '[appUnless]',
})
export class Unless {
  // `*appUnless="expression"` becomes a binding to this same-named input.
  readonly appUnless = input(false);

  // TemplateRef represents the element and children hidden behind the `*` shorthand.
  private readonly template = inject(TemplateRef<unknown>);

  // ViewContainerRef is the anchor where embedded views can be created or removed.
  private readonly container = inject(ViewContainerRef);

  constructor() {
    // effect re-runs when appUnless changes, keeping the rendered structure in sync.
    effect(() => {
      // Clear first so repeated updates never create duplicate embedded views.
      this.container.clear();

      // "Unless" renders only when its condition is false—the inverse of `@if`.
      if (!this.appUnless()) {
        this.container.createEmbeddedView(this.template);
      }
    });
  }
}
