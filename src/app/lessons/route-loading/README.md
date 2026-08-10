# Lesson 11: Eager vs lazy-loaded routes

Open [`/route-loading`](https://angular-comparison.netlify.app/route-loading). Its two child
routes render matching counters so that loading strategy—not component
behavior—is the comparison.

An **eager route** uses a static component import and the `component` property:

```ts
import { EagerRouteDemo } from './eager-route-demo';

{ path: 'eager', component: EagerRouteDemo }
```

The bundler sees that normal import while building the application, so the
component code is included in the initial JavaScript graph. The route can
render immediately after navigation, but users download its code even if they
never visit it. Eager loading suits small, essential landing experiences.

A **lazy route** uses a dynamic `import()` through `loadComponent`:

```ts
{
  path: 'lazy',
  loadComponent: () =>
    import('./lazy-route-demo').then((module) => module.LazyRouteDemo),
}
```

The dynamic import creates a bundle split point. Angular downloads that chunk
when navigation first needs it, reducing initial code at the cost of a possible
first-navigation delay. Lazy loading is a strong default for larger and less
frequently visited feature areas. Avoid splitting every tiny component because
many small chunks can create unnecessary request and navigation overhead.

`loadComponent` loads one standalone component. `loadChildren` loads a route
configuration for an entire feature, including nested routes and route-scoped
providers. Modern `loadChildren` can import a plain `Routes` array, so its name
does not mean an NgModule is required.

The page now also runs the classic pre-standalone NgModule pattern:

```ts
{
  path: 'reports',
  loadChildren: () =>
    import('./reports/reports.module').then(module => module.ReportsModule),
}
```

The lazy module declares its non-standalone component and imports
`RouterModule.forChild(featureRoutes)`. The dynamic import still produces a
separate chunk. This pattern remains supported for existing module-based
applications; modern standalone features normally lazy-load a component or a
plain `Routes` array instead.

The Lesson 11 parent page is itself lazy-loaded, while the eager example is
statically imported in the root route configuration. This intentionally shows
that loading decisions apply at each route boundary: a lazy parent does not
automatically make a statically imported child component lazy.

