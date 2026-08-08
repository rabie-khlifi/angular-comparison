import { Component } from '@angular/core';

@Component({
  // The selector works exactly like a standalone component selector.
  selector: 'app-legacy-example',
  // This flag opts out of Angular's standalone default.
  // LegacyExample must therefore be declared by exactly one NgModule.
  standalone: false,
  templateUrl: './legacy-example.html',
  styleUrl: './legacy-example.css',
})
export class LegacyExample {
  // Component state and template behavior are unchanged by using an NgModule.
  protected count = 0;

  protected increment(): void {
    this.count += 1;
  }
}
