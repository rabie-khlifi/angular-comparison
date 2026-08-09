import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptors,
  withInterceptorsFromDi,
} from '@angular/common/http';
import {
  ClassicHeaderInterceptor,
  functionalHeaderInterceptor,
  learningApiMockInterceptor,
} from './http-learning-api';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideClientHydration(),
    // Enable classic DI interceptors, then the ordered functional interceptor chain.
    provideHttpClient(
      withInterceptorsFromDi(),
      withInterceptors([functionalHeaderInterceptor, learningApiMockInterceptor]),
    ),
    // multi:true appends this class instead of replacing other HTTP_INTERCEPTORS entries.
    { provide: HTTP_INTERCEPTORS, useClass: ClassicHeaderInterceptor, multi: true },
  ],
};
