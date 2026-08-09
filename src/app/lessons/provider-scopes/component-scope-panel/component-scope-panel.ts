import { Component, inject, input } from '@angular/core';
import { ScopedCounter } from '../scoped-counter';

@Component({
  selector: 'app-component-scope-panel',
  imports: [],
  templateUrl: './component-scope-panel.html',
  styleUrl: './component-scope-panel.css',
  // Each ComponentScopePanel host element gets a new provider and service instance.
  // This nearer ElementInjector provider shadows the root provider for this subtree.
  providers: [ScopedCounter],
})
export class ComponentScopePanel {
  readonly label = input.required<string>();

  // The token is identical, but the closest provider determines the returned object.
  protected readonly counter = inject(ScopedCounter);
}
