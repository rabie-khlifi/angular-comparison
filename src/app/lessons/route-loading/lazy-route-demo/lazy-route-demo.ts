import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

@Component({
  selector: 'app-lazy-route-demo',
  templateUrl: './lazy-route-demo.html',
  styleUrl: './lazy-route-demo.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LazyRouteDemo {
  // This state and behavior match the eager example so loading is the only variable.
  protected readonly count = signal(0);

  protected increment(): void {
    this.count.update((currentCount) => currentCount + 1);
  }
}
