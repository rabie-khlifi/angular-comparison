import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiLesson } from '../../http-learning-api';

@Injectable({ providedIn: 'root' })
export class LessonApi {
  private readonly http = inject(HttpClient);

  getLessons(query: string): Observable<readonly ApiLesson[]> {
    // HttpParams is immutable; set() returns the new instance used by this request.
    const params = new HttpParams().set('query', query);
    // HttpClient returns a cold Observable; the request starts when something subscribes.
    return this.http.get<readonly ApiLesson[]>('/api/lessons', { params });
  }
}
