import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ClassicLifecycleCard } from '../classic-lifecycle-card/classic-lifecycle-card';
import { ModernLifecycleCard } from '../modern-lifecycle-card/modern-lifecycle-card';
import { LifecycleTimeline } from '../lifecycle-timeline';

@Component({
  selector: 'app-component-lifecycle-page',
  // This standalone lesson imports both child approaches directly.
  imports: [ClassicLifecycleCard, ModernLifecycleCard],
  // One service instance belongs to this page and is inherited by both child component subtrees.
  providers: [LifecycleTimeline],
  templateUrl: './component-lifecycle-page.html',
  styleUrl: './component-lifecycle-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComponentLifecyclePage {
  // The same parent signal drives both children so their reactions can be compared fairly.
  protected readonly learnerName = signal('Ada');

  // Removing and recreating the children demonstrates creation and destruction phases.
  protected readonly showExamples = signal(true);

  // The timeline outlives each child, allowing it to capture their destruction callbacks safely.
  protected readonly timeline = inject(LifecycleTimeline);

  protected changeInput(): void {
    // A new input value triggers classic ngOnChanges and the modern input-reading effect.
    this.learnerName.update((name) => (name === 'Ada' ? 'Grace' : 'Ada'));
  }

  protected toggleExamples(): void {
    // @if destroys child instances when false and creates new instances when true again.
    this.showExamples.update((visible) => !visible);
  }

  protected clearTimeline(): void {
    // Clearing the service state does not recreate either child component.
    this.timeline.clear();
  }
}
