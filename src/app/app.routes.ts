import { Routes } from '@angular/router';

// Routes connect URL paths to the page components that Angular renders.
export const routes: Routes = [
  {
    path: '',
    // A full match prevents the empty path from also matching every URL prefix.
    pathMatch: 'full',
    redirectTo: 'standalone-vs-ngmodule',
  },
  {
    path: 'standalone-vs-ngmodule',
    title: 'Standalone vs NgModule | Angular Concepts Lab',
    // loadComponent lazy-loads this standalone page only when its URL is visited.
    // A module-based lazy route commonly uses loadChildren instead.
    loadComponent: () =>
      import('./lessons/standalone-vs-ngmodule/standalone-vs-ngmodule-page/standalone-vs-ngmodule-page').then(
        (module) => module.StandaloneVsNgmodulePage,
      ),
  },
];
