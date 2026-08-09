import { Component } from '@angular/core';

@Component({
  selector: 'app-legacy-lazy-route-demo',
  // A routed NgModule component must explicitly opt out of Angular's standalone default.
  standalone: false,
  templateUrl: './legacy-lazy-route-demo.html',
  styleUrl: './legacy-lazy-route-demo.css',
})
export class LegacyLazyRouteDemo {
  // Plain component properties were the usual state style before signals.
  protected count = 0;

  protected increment(): void {
    this.count += 1;
  }
}
