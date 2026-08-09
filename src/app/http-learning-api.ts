import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpHandlerFn,
  HttpInterceptor,
  HttpInterceptorFn,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, delay, of, throwError } from 'rxjs';

export interface ApiLesson {
  readonly id: number;
  readonly title: string;
}

export interface EchoResponse {
  readonly message: string;
  readonly classicHeader: string;
  readonly functionalHeader: string;
}

const LESSONS: readonly ApiLesson[] = [
  { id: 1, title: 'Components' },
  { id: 2, title: 'Signals' },
  { id: 3, title: 'Routing' },
  { id: 4, title: 'HTTP' },
];

// PRE-FUNCTIONAL API: existing applications often use an injectable interceptor class.
@Injectable()
export class ClassicHeaderInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // HttpRequest is immutable; clone it to attach a header.
    return next.handle(request.clone({ setHeaders: { 'X-Classic-Interceptor': 'active' } }));
  }
}

// MODERN API: functional interceptors are smaller and configured explicitly in order.
export const functionalHeaderInterceptor: HttpInterceptorFn = (request, next) => {
  const modifiedRequest = request.clone({ setHeaders: { 'X-Functional-Interceptor': 'active' } });

  return next(modifiedRequest).pipe(
    // Interceptors can centralize cross-cutting error logging or transformation.
    catchError((error: unknown) => {
      console.error('Functional interceptor observed an HTTP failure.', error);
      return throwError(() => error);
    }),
  );
};

// This final interceptor replaces a real backend only for the learning project.
export const learningApiMockInterceptor: HttpInterceptorFn = (request, next) => {
  if (request.url === '/api/lessons') {
    const query = request.params.get('query')?.trim().toLowerCase() ?? '';
    const body = LESSONS.filter((lesson) => lesson.title.toLowerCase().includes(query));
    return of(new HttpResponse({ status: 200, body })).pipe(delay(120));
  }

  if (request.url === '/api/interceptor-demo') {
    if (request.params.get('fail') === 'true') {
      return throwError(
        () => new HttpErrorResponse({ status: 503, statusText: 'Learning API unavailable' }),
      );
    }

    const body: EchoResponse = {
      message: 'Mock backend received the request',
      classicHeader: request.headers.get('X-Classic-Interceptor') ?? 'missing',
      functionalHeader: request.headers.get('X-Functional-Interceptor') ?? 'missing',
    };
    return of(new HttpResponse({ status: 200, body })).pipe(delay(120));
  }

  // Requests unrelated to the lesson continue to the real configured backend.
  return next(request);
};
