import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Profile } from '../profile';

@Component({
  selector: 'app-default-profile-card',
  templateUrl: './default-profile-card.html',
  styleUrl: './default-profile-card.css',
  // Default is Angular's traditional CheckAlways strategy.
  changeDetection: ChangeDetectionStrategy.Default,
})
export class DefaultProfileCard {
  // A classic @Input property makes this example representative of Angular before signals.
  @Input({ required: true }) profile!: Profile;

  // Template events cause Angular to schedule change detection in normal zone-based applications.
  protected localClicks = 0;

  protected incrementLocally(): void {
    // Ordinary property assignment is visible because Default views are checked each traversal.
    this.localClicks += 1;
  }
}
