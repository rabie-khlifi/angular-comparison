import { Component, ContentChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-classic-projection-card',
  templateUrl: './classic-projection-card.html',
  styleUrl: './classic-projection-card.css',
})
export class ClassicProjectionCard {
  // @ContentChild searches markup projected by the parent, not this component's own view.
  @ContentChild('projectedHeading') private heading?: ElementRef<HTMLElement>;
  protected observedHeading = 'Not queried yet';

  protected inspectHeading(): void {
    this.observedHeading = this.heading?.nativeElement.textContent?.trim() ?? 'Not found';
  }
}
