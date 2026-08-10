import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface Lesson {
  readonly number: number;
  readonly title: string;
  readonly description: string;
  readonly path: string;
}

@Component({
  selector: 'app-home-page',
  imports: [RouterLink],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage {
  protected readonly lessons: readonly Lesson[] = [
    {
      number: 1,
      title: 'Standalone vs NgModule',
      description: 'Compare modern standalone components with module-based Angular architecture.',
      path: '/standalone-vs-ngmodule',
    },
    {
      number: 2,
      title: 'Components vs Directives',
      description: 'See when a UI needs its own view and when reusable behavior is enough.',
      path: '/components-vs-directives',
    },
    {
      number: 3,
      title: 'Attribute vs Structural Directives',
      description:
        'Contrast directives that change an element with directives that change page structure.',
      path: '/attribute-vs-structural',
    },
    {
      number: 4,
      title: 'Signals vs Regular Properties',
      description: 'Explore reactive signal state and ordinary class properties.',
      path: '/signals-vs-properties',
    },
    {
      number: 5,
      title: 'Signals vs RxJS Observables',
      description: 'Choose between synchronous reactive state and asynchronous event streams.',
      path: '/signals-vs-observables',
    },
    {
      number: 6,
      title: 'Inputs vs Model Inputs',
      description: 'Compare one-way component inputs with two-way model inputs.',
      path: '/inputs-vs-model-inputs',
    },
    {
      number: 7,
      title: 'Outputs vs Two-Way Binding',
      description: 'Learn how child components communicate changes to their parents.',
      path: '/outputs-vs-two-way-binding',
    },
    {
      number: 8,
      title: 'Services vs Component State',
      description: 'Decide whether state belongs locally in a component or in a shared service.',
      path: '/services-vs-component-state',
    },
    {
      number: 9,
      title: 'Provider Scopes',
      description: 'Observe how injector placement controls service lifetime and sharing.',
      path: '/provider-scopes',
    },
    {
      number: 10,
      title: 'Form Approaches',
      description: 'Compare Angular form strategies and their best use cases.',
      path: '/form-approaches',
    },
    {
      number: 11,
      title: 'Eager vs Lazy Routes',
      description: 'See how route loading choices affect the application bundle.',
      path: '/route-loading',
    },
    {
      number: 12,
      title: 'Pipes vs Component Methods',
      description: 'Compare declarative template transformations with method calls.',
      path: '/pipes-vs-methods',
    },
    {
      number: 13,
      title: 'Component Lifecycle',
      description: 'Follow a component through creation, rendering, updates, and destruction.',
      path: '/component-lifecycle',
    },
    {
      number: 14,
      title: 'Default vs OnPush',
      description: 'Explore Angular change-detection strategies and their tradeoffs.',
      path: '/change-detection',
    },
    {
      number: 15,
      title: 'View Encapsulation',
      description: 'Compare emulated, global, and Shadow DOM styling boundaries.',
      path: '/view-encapsulation',
    },
    {
      number: 16,
      title: 'Queries and Projection',
      description: 'Use content projection and queries to compose flexible components.',
      path: '/queries-and-projection',
    },
    {
      number: 17,
      title: 'Routing Parameters',
      description: 'Read route and query parameters from a navigated URL.',
      path: '/routing-parameters/42',
    },
    {
      number: 18,
      title: 'Guards vs Resolvers',
      description: 'Control navigation and load route data before a page opens.',
      path: '/route-control',
    },
    {
      number: 19,
      title: 'HTTP Data',
      description: 'Compare HttpClient requests with reactive httpResource state.',
      path: '/http-data',
    },
    {
      number: 20,
      title: 'HTTP Interceptors',
      description: 'Transform and observe requests in a shared HTTP pipeline.',
      path: '/http-interceptors',
    },
    {
      number: 21,
      title: 'Advanced RxJS',
      description: 'Practice higher-order mapping and stream-combination operators.',
      path: '/advanced-rxjs',
    },
    {
      number: 22,
      title: 'Advanced Forms',
      description: 'Explore complex form state and asynchronous validation.',
      path: '/advanced-forms',
    },
    {
      number: 23,
      title: 'CSR vs SSR vs SSG',
      description: 'Visit one component rendered with three different strategies.',
      path: '/rendering-strategies/ssg',
    },
    {
      number: 24,
      title: 'Testing Fundamentals',
      description: 'Learn the core patterns for reliable Angular unit tests.',
      path: '/testing-fundamentals',
    },
    {
      number: 25,
      title: 'State Management',
      description: 'Compare practical approaches to organizing application state.',
      path: '/state-management',
    },
    {
      number: 26,
      title: 'Accessibility',
      description: 'Build interfaces that work with keyboards and assistive technology.',
      path: '/accessibility',
    },
    {
      number: 27,
      title: 'Performance and Debugging',
      description: 'Inspect, measure, and improve Angular application behavior.',
      path: '/performance-debugging',
    },
  ];
}
