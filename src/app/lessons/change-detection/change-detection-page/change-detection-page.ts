import { ChangeDetectionStrategy, Component, ViewChild, signal } from '@angular/core';
import { DefaultProfileCard } from '../default-profile-card/default-profile-card';
import { OnPushProfileCard } from '../on-push-profile-card/on-push-profile-card';
import { Profile } from '../profile';

@Component({
  selector: 'app-change-detection-page',
  imports: [DefaultProfileCard, OnPushProfileCard],
  templateUrl: './change-detection-page.html',
  styleUrl: './change-detection-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangeDetectionPage {
  // Both child components receive this exact same object reference.
  protected profile: Profile = { name: 'Ada', level: 1 };

  // This status signal ensures the parent view explains the result after every experiment action.
  protected readonly experimentStatus = signal('Choose an experiment below.');

  // The classic decorator query gives the parent access to the OnPush child's public API.
  @ViewChild(OnPushProfileCard) private onPushCard?: OnPushProfileCard;

  protected mutateObjectInPlace(): void {
    // Deliberately violate immutability: change contents without creating a new object reference.
    (this.profile as { name: string; level: number }).name = 'Grace';
    (this.profile as { name: string; level: number }).level += 1;

    // Default sees mutated contents when checked; OnPush receives no new input reference.
    this.experimentStatus.set(
      'Same reference: Default refreshed, while OnPush can remain stale until another trigger.',
    );
  }

  protected replaceObjectReference(): void {
    // Object spread creates a new reference, which is a recognized OnPush input trigger.
    this.profile = {
      ...this.profile,
      name: this.profile.name === 'Ada' ? 'Grace' : 'Ada',
      level: this.profile.level + 1,
    };

    this.experimentStatus.set(
      'New reference: Angular marks the OnPush child and both cards agree.',
    );
  }

  protected manuallyMarkChild(): void {
    // Parent code calls the child API, which uses the classic ChangeDetectorRef solution.
    this.onPushCard?.requestCheck();
    this.experimentStatus.set('markForCheck(): the OnPush child will join the next traversal.');
  }

  protected reset(): void {
    // Reset with a new reference so both children are guaranteed to receive the original values.
    this.profile = { name: 'Ada', level: 1 };
    this.experimentStatus.set('Reset with a new object reference.');
  }
}
