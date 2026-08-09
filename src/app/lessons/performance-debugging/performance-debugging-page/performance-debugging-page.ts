import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

interface Product { id: number; name: string; price: number; }

@Component({
  selector: 'app-heavy-performance-details',
  template: `<section class="heavy"><h3>Deferred diagnostics loaded</h3><p>This component's code and view were not needed for the first render.</p></section>`,
  styles: `.heavy { padding: 1rem; border: 2px dashed #7c3aed; }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeavyPerformanceDetails {}

@Component({
  selector: 'app-performance-debugging-page',
  imports: [HeavyPerformanceDetails],
  templateUrl: './performance-debugging-page.html',
  styleUrl: './performance-debugging-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PerformanceDebuggingPage {
  protected readonly query = signal('');
  protected readonly products = signal<Product[]>(
    Array.from({ length: 200 }, (_, index) => ({ id: index + 1, name: `Product ${index + 1}`, price: index + 10 })),
  );
  private modernRuns = 0;
  private classicRuns = 0;

  // computed memoizes its result until query or products changes.
  protected readonly modernFiltered = computed(() => {
    this.modernRuns += 1;
    const query = this.query().toLowerCase();
    const items = this.products().filter((product) => product.name.toLowerCase().includes(query)).slice(0, 8);
    return { items, runs: this.modernRuns };
  });

  // Classic template methods may run on every check, even when their inputs did not change.
  protected classicFiltered(): { items: Product[]; runs: number } {
    this.classicRuns += 1;
    const query = this.query().toLowerCase();
    const items = this.products().filter((product) => product.name.toLowerCase().includes(query)).slice(0, 8);
    return { items, runs: this.classicRuns };
  }

  protected updateQuery(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }
}
