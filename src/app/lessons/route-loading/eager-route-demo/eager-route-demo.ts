import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

@Component({
  selector: 'app-eager-route-demo',
  templateUrl: './eager-route-demo.html',
  styleUrl: './eager-route-demo.css',
  // OnPush works naturally with signals: updating count marks this view for refresh.
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EagerRouteDemo {
  // The behavior intentionally matches LazyRouteDemo; only route loading is different.
  protected readonly count = signal(0);

  protected increment(): void {
    // update() calculates the next value from the current signal value.
    this.count.update((currentCount) => currentCount + 1);
  }
}
