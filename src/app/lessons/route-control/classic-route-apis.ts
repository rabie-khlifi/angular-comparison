import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Resolve,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { DemoAccess } from './demo-access';

@Injectable({ providedIn: 'root' })
export class ClassicAccessGuard implements CanActivate {
  // Constructor injection was the standard style for class-based guard dependencies.
  constructor(
    private readonly access: DemoAccess,
    private readonly router: Router,
  ) {}

  canActivate(_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): boolean | UrlTree {
    // Returning UrlTree redirects in the same navigation instead of imperatively navigating.
    return this.access.allowed() || this.router.parseUrl('/route-control?denied=classic');
  }
}

@Injectable({ providedIn: 'root' })
export class ClassicMessageResolver implements Resolve<string> {
  constructor(private readonly access: DemoAccess) {}

  resolve(_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): Promise<string> {
    // Angular waits for this Promise before constructing the routed component.
    return this.access.loadMessage('classic');
  }
}
