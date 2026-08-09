import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { DemoAccess } from '../demo-access';

@Component({
  selector: 'app-route-control-page',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './route-control-page.html',
  styleUrl: './route-control-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RouteControlPage {
  // The guard and this page inject the same root service instance.
  protected readonly access = inject(DemoAccess);
}
