import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appClassicUnless]',
})
export class ClassicUnless {
  // The older pattern reacts through an @Input setter instead of input() + effect().
  @Input()
  set appClassicUnless(condition: boolean) {
    this.container.clear();

    if (!condition) {
      this.container.createEmbeddedView(this.template);
    }
  }

  // Constructor parameters were the traditional DI style before the inject() function.
  constructor(
    private readonly template: TemplateRef<unknown>,
    private readonly container: ViewContainerRef,
  ) {}
}
