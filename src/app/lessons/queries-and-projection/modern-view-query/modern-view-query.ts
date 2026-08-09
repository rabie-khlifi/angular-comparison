import { Component, ElementRef, viewChild } from '@angular/core';

@Component({
  selector: 'app-modern-view-query',
  templateUrl: './modern-view-query.html',
  styleUrl: './modern-view-query.css',
})
export class ModernViewQuery {
  // viewChild.required() returns a query signal and asserts that the match exists.
  private readonly nameInput = viewChild.required<ElementRef<HTMLInputElement>>('nameInput');

  protected focusInput(): void {
    // Call the query signal to obtain its current ElementRef.
    this.nameInput().nativeElement.focus();
  }
}
