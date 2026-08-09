import {
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  effect,
  inject,
  input,
  viewChild,
} from '@angular/core';
import { LifecycleTimeline } from '../lifecycle-timeline';

@Component({
  selector: 'app-modern-lifecycle-card',
  templateUrl: './modern-lifecycle-card.html',
  styleUrl: './modern-lifecycle-card.css',
})
export class ModernLifecycleCard {
  // input.required() produces a read-only InputSignal that always has a value after binding.
  readonly learnerName = input.required<string>();

  // The page-scoped service remains usable while this child is running its destruction callbacks.
  private readonly timeline = inject(LifecycleTimeline);

  // viewChild() returns a signal query whose value becomes available after the view is created.
  private readonly statusText = viewChild<ElementRef<HTMLParagraphElement>>('statusText');

  // DestroyRef lets setup code register cleanup beside the resource that needs that cleanup.
  private readonly destroyRef = inject(DestroyRef);

  // An effect is appropriate here because logging/reporting is a side effect of an input change.
  // It runs once and tracks learnerName(), then reruns whenever that input signal changes.
  private readonly reportInputChanges = effect(() => {
    this.timeline.record('Modern', `Modern effect: learnerName is now "${this.learnerName()}"`);
  });

  constructor() {
    // afterNextRender runs once after Angular has rendered all application views in the browser.
    // Render callbacks do not run during SSR, so DOM-only work naturally remains client-only.
    afterNextRender(() => {
      const renderedText = this.statusText()?.nativeElement.textContent?.trim() ?? 'not found';
      this.timeline.record('Modern', `Modern afterNextRender: read DOM text "${renderedText}"`);
    });

    // onDestroy registers a teardown callback without requiring the OnDestroy interface.
    this.destroyRef.onDestroy(() => {
      // Do not emit a component output here: OutputEmitterRef is also being destroyed at this time.
      this.timeline.record(
        'Modern',
        'Modern DestroyRef.onDestroy: release resources before removal',
      );
    });
  }
}
