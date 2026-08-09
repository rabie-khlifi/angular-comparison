import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { filterLessons } from '../filter-lessons';
import { LessonFilterPipe } from '../lesson-filter-pipe/lesson-filter-pipe';

@Component({
  selector: 'app-pipes-vs-methods-page',
  // A standalone custom pipe is imported just like a standalone component or directive.
  imports: [LessonFilterPipe],
  templateUrl: './pipes-vs-methods-page.html',
  styleUrl: './pipes-vs-methods-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PipesVsMethodsPage {
  protected readonly lessons = signal<readonly string[]>([
    'Components',
    'Directives',
    'Signals',
    'Routing',
  ]);
  protected readonly query = signal('');
  protected readonly unrelatedCount = signal(0);
  protected readonly mutationMessage = signal('No mutation performed yet.');

  protected filteredWithMethod(): readonly string[] {
    // A template method is evaluated whenever Angular checks this view.
    // It is easy to write, but repeated filtering can become expensive for large collections.
    return filterLessons(this.lessons(), this.query());
  }

  protected incrementUnrelatedCounter(): void {
    // This state is unrelated to filtering, but its event causes this component view to be checked.
    this.unrelatedCount.update((count) => count + 1);
  }

  protected mutateFirstItem(): void {
    const currentLessons = this.lessons();

    // This deliberately demonstrates a pitfall. It changes the array's contents while keeping
    // the same reference. Do not use this mutation pattern for normal signal state updates.
    (currentLessons as string[])[0] = `${currentLessons[0]}!`;
    this.mutationMessage.set(
      'Same array reference: the method sees the change, but the pure pipe keeps its cached result.',
    );
  }

  protected replaceArrayReference(): void {
    // Spreading creates a new reference. The pure pipe now reruns and displays all current values.
    this.lessons.update((currentLessons) => [...currentLessons]);
    this.mutationMessage.set('New array reference: both results are synchronized again.');
  }

  protected reset(): void {
    // set() supplies a new array reference, so both transformation approaches update.
    this.lessons.set(['Components', 'Directives', 'Signals', 'Routing']);
    this.query.set('');
    this.unrelatedCount.set(0);
    this.mutationMessage.set('No mutation performed yet.');
  }
}
