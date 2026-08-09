import { inject } from '@angular/core';
import { CanActivateFn, ResolveFn, Router } from '@angular/router';
import { DemoAccess } from './demo-access';

// Functional guards use inject() because the router invokes them in an injection context.
export const functionalAccessGuard: CanActivateFn = () => {
  const access = inject(DemoAccess);
  const router = inject(Router);
  return access.allowed() || router.parseUrl('/route-control?denied=functional');
};

// A ResolveFn can return a value, Promise, or Observable of the required route data.
export const functionalMessageResolver: ResolveFn<string> = () => {
  return inject(DemoAccess).loadMessage('functional');
};
