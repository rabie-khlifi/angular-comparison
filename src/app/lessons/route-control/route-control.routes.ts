import { Routes } from '@angular/router';
import { ClassicAccessGuard, ClassicMessageResolver } from './classic-route-apis';
import { functionalAccessGuard, functionalMessageResolver } from './functional-route-apis';
import { RouteControlPage } from './route-control-page/route-control-page';
import { RouteResult } from './route-result/route-result';

// Loading this Routes array lazily keeps the entire lesson in one feature boundary.
export const ROUTE_CONTROL_ROUTES: Routes = [
  {
    path: '',
    component: RouteControlPage,
    children: [
      {
        path: 'functional-guard',
        component: RouteResult,
        canActivate: [functionalAccessGuard],
        data: { example: 'Functional guard allowed activation' },
      },
      {
        path: 'classic-guard',
        component: RouteResult,
        canActivate: [ClassicAccessGuard],
        data: { example: 'Classic class guard allowed activation' },
      },
      {
        path: 'functional-resolver',
        component: RouteResult,
        resolve: { message: functionalMessageResolver },
      },
      {
        path: 'classic-resolver',
        component: RouteResult,
        resolve: { message: ClassicMessageResolver },
      },
    ],
  },
];
