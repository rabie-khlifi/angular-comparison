import { Component } from '@angular/core';

@Component({
  // A selector is the custom HTML element used by a parent template.
  selector: 'app-standalone-example',
  // Angular 19+ makes components standalone by default, so standalone: true is optional.
  // Unlike a legacy component, this class must NOT appear in NgModule declarations.
  imports: [],
  templateUrl: './standalone-example.html',
  styleUrl: './standalone-example.css',
})
export class StandaloneExample {
  // Component state works the same way in both organizational styles.
  protected count = 0;

  protected increment(): void {
    this.count += 1;
  }
}
