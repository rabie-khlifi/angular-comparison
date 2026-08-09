import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LegacyLazyRouteDemo } from './legacy-lazy-route-demo/legacy-lazy-route-demo';

// The empty path renders inside the route segment that lazy-loaded this feature module.
const legacyFeatureRoutes: Routes = [{ path: '', component: LegacyLazyRouteDemo }];

@NgModule({
  // Classic routed components belong to exactly one NgModule declaration.
  declarations: [LegacyLazyRouteDemo],
  // forChild registers feature routes without creating a second root Router service.
  imports: [RouterModule.forChild(legacyFeatureRoutes)],
})
export class LegacyLazyFeatureModule {}
