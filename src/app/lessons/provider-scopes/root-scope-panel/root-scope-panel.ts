import { Component, inject, input } from '@angular/core';
import { ScopedCounter } from '../scoped-counter';

@Component({
  selector: 'app-root-scope-panel',
  imports: [],
  templateUrl: './root-scope-panel.html',
  styleUrl: './root-scope-panel.css',
  // There is intentionally no providers array here.
})
export class RootScopePanel {
  readonly label = input.required<string>();

  // DI finds no element-level override and falls back to the root provider.
  protected readonly counter = inject(ScopedCounter);
}
