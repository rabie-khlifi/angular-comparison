import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, PLATFORM_ID, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Component({
  selector: 'app-rendering-strategies-page',
  imports: [RouterLink],
  templateUrl: './rendering-strategies-page.html',
  styleUrl: './rendering-strategies-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RenderingStrategiesPage {
  private readonly route = inject(ActivatedRoute);
  private readonly platformId = inject(PLATFORM_ID);

  // Route data is an Observable historically; toSignal makes the current mode easy to read.
  protected readonly selectedMode = toSignal(
    this.route.data.pipe(map((data) => (data['mode'] as string | undefined) ?? 'ssg')),
    { initialValue: 'ssg' },
  );

  // isPlatformBrowser is safe during server rendering because it avoids direct window access.
  protected readonly runningPlatform = isPlatformBrowser(this.platformId) ? 'browser' : 'server';
}
