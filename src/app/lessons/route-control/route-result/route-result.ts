import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';

@Component({
  selector: 'app-route-result',
  imports: [AsyncPipe],
  templateUrl: './route-result.html',
  styleUrl: './route-result.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RouteResult {
  private readonly route = inject(ActivatedRoute);

  // PRE-SIGNALS: route data is an Observable commonly consumed with AsyncPipe.
  protected readonly message$ = this.route.data.pipe(
    map((data) => String(data['message'] ?? data['example'])),
  );

  // MODERN: bridge the same stream once for synchronous signal consumption.
  protected readonly message = toSignal(this.message$, { initialValue: 'Reading route data' });
}
