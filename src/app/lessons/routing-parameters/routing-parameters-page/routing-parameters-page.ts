import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { map } from 'rxjs';

@Component({
  selector: 'app-routing-parameters-page',
  imports: [RouterLink, AsyncPipe],
  templateUrl: './routing-parameters-page.html',
  styleUrl: './routing-parameters-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoutingParametersPage {
  // ActivatedRoute describes the currently active route segment and its URL state.
  private readonly route = inject(ActivatedRoute);
  // Router performs imperative navigation when a decision originates in TypeScript.
  private readonly router = inject(Router);

  // PRE-SIGNALS: templates commonly consumed route Observables through AsyncPipe.
  protected readonly classicLearnerId$ = this.route.paramMap.pipe(
    map((parameters) => parameters.get('learnerId') ?? 'missing'),
  );
  protected readonly classicTab$ = this.route.queryParamMap.pipe(
    map((parameters) => parameters.get('tab') ?? 'overview'),
  );

  // MODERN: bridge each Router Observable once into a synchronously readable signal.
  protected readonly learnerId = toSignal(this.classicLearnerId$, { initialValue: 'loading' });
  protected readonly tab = toSignal(this.classicTab$, { initialValue: 'overview' });

  protected openNextLearner(): void {
    // navigate() accepts route-command segments and structured navigation options.
    const nextId = this.learnerId() === '42' ? '84' : '42';
    void this.router.navigate(['/routing-parameters', nextId], {
      // Query parameters are optional URL state and are not part of route matching.
      queryParams: { tab: 'activity', source: 'button' },
    });
  }

  protected switchTabWithoutChangingId(): void {
    // An empty command array keeps the current path; relativeTo identifies the current route.
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab: this.tab() === 'overview' ? 'settings' : 'overview' },
      // merge preserves unrelated query keys rather than replacing the whole query string.
      queryParamsHandling: 'merge',
    });
  }
}
