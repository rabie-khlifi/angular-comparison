import { Component, ElementRef, contentChild, signal } from '@angular/core';

@Component({
  selector: 'app-modern-projection-card',
  templateUrl: './modern-projection-card.html',
  styleUrl: './modern-projection-card.css',
})
export class ModernProjectionCard {
  // contentChild.required() is the signal-query counterpart to @ContentChild.
  private readonly heading = contentChild.required<ElementRef<HTMLElement>>('projectedHeading');
  protected readonly observedHeading = signal('Not queried yet');

  protected inspectHeading(): void {
    this.observedHeading.set(this.heading().nativeElement.textContent?.trim() ?? 'Not found');
  }
}
