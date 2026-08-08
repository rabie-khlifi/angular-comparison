import { Component } from '@angular/core';
// The `.module.ts` suffix is the classic Angular filename convention for NgModules.
import { LegacyExampleModule } from '../legacy-example/legacy-example.module';
import { StandaloneExample } from '../standalone-example/standalone-example';

@Component({
  selector: 'app-standalone-vs-ngmodule-page',
  // This is the key interoperability example:
  // StandaloneExample is imported directly; LegacyExample arrives via its NgModule.
  imports: [StandaloneExample, LegacyExampleModule],
  templateUrl: './standalone-vs-ngmodule-page.html',
  styleUrl: './standalone-vs-ngmodule-page.css',
})
export class StandaloneVsNgmodulePage {}
