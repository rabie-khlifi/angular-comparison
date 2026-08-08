import { NgModule } from '@angular/core';
import { LegacyExample } from './legacy-example/legacy-example';

@NgModule({
  // declarations owns non-standalone components, directives, and pipes.
  // Putting a standalone component here would produce a compiler error.
  declarations: [LegacyExample],
  // exports makes this declaration visible to code that imports this module.
  // Without it, LegacyExample stays private to this NgModule's templates.
  exports: [LegacyExample],
})
export class LegacyExampleModule {}
