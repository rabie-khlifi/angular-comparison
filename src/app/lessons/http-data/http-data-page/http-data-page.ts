import { AsyncPipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiLesson } from '../../../http-learning-api';
import { LessonApi } from '../lesson-api';

@Component({
  selector: 'app-http-data-page',
  imports: [AsyncPipe],
  templateUrl: './http-data-page.html',
  styleUrl: './http-data-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HttpDataPage {
  private readonly api = inject(LessonApi);

  // PRE-SIGNALS: expose an Observable and let AsyncPipe own its subscription lifecycle.
  protected classicLessons$: Observable<readonly ApiLesson[]> = this.api.getLessons('');
  protected classicQuery = '';

  // MODERN: the request computation tracks this signal and reruns when it changes.
  protected readonly resourceQuery = signal('');
  protected readonly lessonsResource = httpResource<readonly ApiLesson[]>(() => ({
    url: '/api/lessons',
    params: { query: this.resourceQuery() },
  }));

  protected searchClassic(event: Event): void {
    this.classicQuery = (event.target as HTMLInputElement).value;
    // Replacing the cold Observable lets AsyncPipe unsubscribe and subscribe to the new request.
    this.classicLessons$ = this.api.getLessons(this.classicQuery);
  }

  protected searchResource(event: Event): void {
    // Updating the dependency causes httpResource to cancel stale work and request current data.
    this.resourceQuery.set((event.target as HTMLInputElement).value);
  }
}
