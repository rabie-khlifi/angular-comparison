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
  {
    path: 'components-vs-directives',
    title: 'Components vs Directives | Angular Concepts Lab',
    // This lesson is another independently lazy-loaded standalone page.
    loadComponent: () =>
      import('./lessons/components-vs-directives/components-vs-directives-page/components-vs-directives-page').then(
        (module) => module.ComponentsVsDirectivesPage,
      ),
  },
  {
    path: 'attribute-vs-structural',
    title: 'Attribute vs Structural Directives | Angular Concepts Lab',
    // Lazy loading keeps this lesson out of the initial JavaScript bundle.
    loadComponent: () =>
      import('./lessons/attribute-vs-structural/attribute-vs-structural-page/attribute-vs-structural-page').then(
        (module) => module.AttributeVsStructuralPage,
      ),
  },
  {
    path: 'signals-vs-properties',
    title: 'Signals vs Regular Properties | Angular Concepts Lab',
    // Each lesson remains independently lazy-loadable as the learning app grows.
    loadComponent: () =>
      import('./lessons/signals-vs-properties/signals-vs-properties-page/signals-vs-properties-page').then(
        (module) => module.SignalsVsPropertiesPage,
      ),
  },
  {
    path: 'signals-vs-observables',
    title: 'Signals vs RxJS Observables | Angular Concepts Lab',
    loadComponent: () =>
      import('./lessons/signals-vs-observables/signals-vs-observables-page/signals-vs-observables-page').then(
        (module) => module.SignalsVsObservablesPage,
      ),
  },
  {
    path: 'inputs-vs-model-inputs',
    title: 'Inputs vs Model Inputs | Angular Concepts Lab',
    loadComponent: () =>
      import('./lessons/inputs-vs-model-inputs/inputs-vs-model-inputs-page/inputs-vs-model-inputs-page').then(
        (module) => module.InputsVsModelInputsPage,
      ),
  },
];
