import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ClassicProjectionCard } from '../classic-projection-card/classic-projection-card';
import { ClassicViewQuery } from '../classic-view-query/classic-view-query';
import { ModernProjectionCard } from '../modern-projection-card/modern-projection-card';
import { ModernViewQuery } from '../modern-view-query/modern-view-query';

@Component({
  selector: 'app-queries-and-projection-page',
  // NgTemplateOutlet instantiates one of the dormant templates selected below.
  imports: [
    NgTemplateOutlet,
    ClassicViewQuery,
    ModernViewQuery,
    ClassicProjectionCard,
    ModernProjectionCard,
  ],
  templateUrl: './queries-and-projection-page.html',
  styleUrl: './queries-and-projection-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QueriesAndProjectionPage {
  // This signal chooses which TemplateRef the outlet instantiates.
  protected readonly showDetails = signal(false);

  protected toggleTemplate(): void {
    this.showDetails.update((visible) => !visible);
  }
}
