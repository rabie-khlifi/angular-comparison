import { Routes } from '@angular/router';
import { EagerRouteDemo } from './lessons/route-loading/eager-route-demo/eager-route-demo';

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
  {
    path: 'outputs-vs-two-way-binding',
    title: 'Outputs vs Two-Way Binding | Angular Concepts Lab',
    loadComponent: () =>
      import('./lessons/outputs-vs-two-way-binding/outputs-vs-two-way-binding-page/outputs-vs-two-way-binding-page').then(
        (module) => module.OutputsVsTwoWayBindingPage,
      ),
  },
  {
    path: 'services-vs-component-state',
    title: 'Services vs Component State | Angular Concepts Lab',
    loadComponent: () =>
      import('./lessons/services-vs-component-state/services-vs-component-state-page/services-vs-component-state-page').then(
        (module) => module.ServicesVsComponentStatePage,
      ),
  },
  {
    path: 'provider-scopes',
    title: 'Provider Scopes | Angular Concepts Lab',
    loadComponent: () =>
      import('./lessons/provider-scopes/provider-scopes-page/provider-scopes-page').then(
        (module) => module.ProviderScopesPage,
      ),
  },
  {
    path: 'form-approaches',
    title: 'Angular Form Approaches | Angular Concepts Lab',
    loadComponent: () =>
      import('./lessons/form-approaches/form-approaches-page/form-approaches-page').then(
        (module) => module.FormApproachesPage,
      ),
  },
  {
    path: 'route-loading',
    title: 'Eager vs Lazy Routes | Angular Concepts Lab',
    loadComponent: () =>
      import('./lessons/route-loading/route-loading-page/route-loading-page').then(
        (module) => module.RouteLoadingPage,
      ),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'eager',
      },
      {
        path: 'eager',
        // A direct component reference requires the static import at the top of this file.
        // That makes this child eager even though its parent lesson page is lazy-loaded.
        component: EagerRouteDemo,
      },
      {
        path: 'lazy',
        // Dynamic import delays fetching this component until the route is requested.
        loadComponent: () =>
          import('./lessons/route-loading/lazy-route-demo/lazy-route-demo').then(
            (module) => module.LazyRouteDemo,
          ),
      },
      {
        path: 'legacy-module',
        // This is the classic pre-standalone lazy-routing pattern.
        // The dynamic import still creates a separate JavaScript chunk.
        loadChildren: () =>
          import('./lessons/route-loading/legacy-lazy-feature/legacy-lazy-feature.module').then(
            (module) => module.LegacyLazyFeatureModule,
          ),
      },
    ],
  },
  {
    path: 'pipes-vs-methods',
    title: 'Pipes vs Component Methods | Angular Concepts Lab',
    // The whole lesson remains outside the initial bundle until this URL is visited.
    loadComponent: () =>
      import('./lessons/pipes-vs-methods/pipes-vs-methods-page/pipes-vs-methods-page').then(
        (module) => module.PipesVsMethodsPage,
      ),
  },
  {
    path: 'component-lifecycle',
    title: 'Component Lifecycle | Angular Concepts Lab',
    // Lazy loading keeps this lesson in its own JavaScript chunk until requested.
    loadComponent: () =>
      import('./lessons/component-lifecycle/component-lifecycle-page/component-lifecycle-page').then(
        (module) => module.ComponentLifecyclePage,
      ),
  },
  {
    path: 'change-detection',
    title: 'Default vs OnPush Change Detection | Angular Concepts Lab',
    loadComponent: () =>
      import('./lessons/change-detection/change-detection-page/change-detection-page').then(
        (module) => module.ChangeDetectionPage,
      ),
  },
  {
    path: 'view-encapsulation',
    title: 'View Encapsulation | Angular Concepts Lab',
    loadComponent: () =>
      import('./lessons/view-encapsulation/view-encapsulation-page/view-encapsulation-page').then(
        (module) => module.ViewEncapsulationPage,
      ),
  },
  {
    path: 'queries-and-projection',
    title: 'Queries and Content Projection | Angular Concepts Lab',
    loadComponent: () =>
      import('./lessons/queries-and-projection/queries-and-projection-page/queries-and-projection-page').then(
        (module) => module.QueriesAndProjectionPage,
      ),
  },
  {
    path: 'routing-parameters',
    pathMatch: 'full',
    redirectTo: 'routing-parameters/42',
  },
  {
    path: 'routing-parameters/:learnerId',
    title: 'Route and Query Parameters | Angular Concepts Lab',
    loadComponent: () =>
      import('./lessons/routing-parameters/routing-parameters-page/routing-parameters-page').then(
        (module) => module.RoutingParametersPage,
      ),
  },
  {
    path: 'route-control',
    title: 'Guards vs Resolvers | Angular Concepts Lab',
    loadChildren: () =>
      import('./lessons/route-control/route-control.routes').then(
        (module) => module.ROUTE_CONTROL_ROUTES,
      ),
  },
  {
    path: 'http-data',
    title: 'HttpClient vs httpResource | Angular Concepts Lab',
    loadComponent: () =>
      import('./lessons/http-data/http-data-page/http-data-page').then(
        (module) => module.HttpDataPage,
      ),
  },
  {
    path: 'http-interceptors',
    title: 'HTTP Interceptors | Angular Concepts Lab',
    loadComponent: () =>
      import('./lessons/http-interceptors/http-interceptors-page/http-interceptors-page').then(
        (module) => module.HttpInterceptorsPage,
      ),
  },
  {
    path: 'advanced-rxjs',
    title: 'Advanced RxJS Operators | Angular Concepts Lab',
    loadComponent: () =>
      import('./lessons/advanced-rxjs/advanced-rxjs-page/advanced-rxjs-page').then(
        (module) => module.AdvancedRxjsPage,
      ),
  },
  {
    path: 'advanced-forms',
    title: 'Advanced Forms and Async Validation | Angular Concepts Lab',
    loadComponent: () =>
      import('./lessons/advanced-forms/advanced-forms-page/advanced-forms-page').then(
        (module) => module.AdvancedFormsPage,
      ),
  },
  {
    path: 'rendering-strategies',
    pathMatch: 'full',
    redirectTo: 'rendering-strategies/ssg',
  },
  {
    path: 'rendering-strategies/csr',
    title: 'CSR Rendering | Angular Concepts Lab',
    data: { mode: 'csr' },
    loadComponent: loadRenderingStrategiesPage,
  },
  {
    path: 'rendering-strategies/ssr',
    title: 'SSR Rendering | Angular Concepts Lab',
    data: { mode: 'ssr' },
    loadComponent: loadRenderingStrategiesPage,
  },
  {
    path: 'rendering-strategies/ssg',
    title: 'SSG Rendering | Angular Concepts Lab',
    data: { mode: 'ssg' },
    loadComponent: loadRenderingStrategiesPage,
  },
  {
    path: 'testing-fundamentals',
    title: 'Angular Testing Fundamentals | Angular Concepts Lab',
    loadComponent: () =>
      import(
        './lessons/testing-fundamentals/testing-fundamentals-page/testing-fundamentals-page'
      ).then((module) => module.TestingFundamentalsPage),
  },
  {
    path: 'state-management',
    title: 'Angular State Management | Angular Concepts Lab',
    loadComponent: () =>
      import('./lessons/state-management/state-management-page/state-management-page').then(
        (module) => module.StateManagementPage,
      ),
  },
  {
    path: 'accessibility',
    title: 'Angular Accessibility | Angular Concepts Lab',
    loadComponent: () =>
      import('./lessons/accessibility/accessibility-page/accessibility-page').then(
        (module) => module.AccessibilityPage,
      ),
  },
  {
    path: 'performance-debugging',
    title: 'Angular Performance and Debugging | Angular Concepts Lab',
    loadComponent: () =>
      import(
        './lessons/performance-debugging/performance-debugging-page/performance-debugging-page'
      ).then((module) => module.PerformanceDebuggingPage),
  },
];

// Reusing one loader keeps all three strategy routes pointed at the same educational component.
function loadRenderingStrategiesPage() {
  return import(
    './lessons/rendering-strategies/rendering-strategies-page/rendering-strategies-page'
  ).then((module) => module.RenderingStrategiesPage);
}
