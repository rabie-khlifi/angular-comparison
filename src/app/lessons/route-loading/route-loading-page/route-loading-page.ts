import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-route-loading-page',
  // Standalone components import every directive/component used by their own template.
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './route-loading-page.html',
  styleUrl: './route-loading-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RouteLoadingPage {}
