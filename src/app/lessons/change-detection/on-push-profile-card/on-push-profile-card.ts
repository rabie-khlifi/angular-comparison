import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  inject,
  signal,
} from '@angular/core';
import { Profile } from '../profile';

@Component({
  selector: 'app-on-push-profile-card',
  templateUrl: './on-push-profile-card.html',
  styleUrl: './on-push-profile-card.css',
  // OnPush lets Angular skip this subtree when no known trigger made it dirty.
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OnPushProfileCard {
  // This remains a classic input so the reference-comparison rule is easy to isolate.
  @Input({ required: true }) profile!: Profile;

  // Before signals, local state was usually an ordinary property.
  protected localClicks = 0;

  // Modern signals notify Angular when a template consumer needs checking.
  protected readonly signalClicks = signal(0);

  // ChangeDetectorRef provides imperative control for non-reactive external integrations.
  private readonly changeDetector = inject(ChangeDetectorRef);

  protected incrementPlainProperty(): void {
    // A template event inside this component marks its OnPush view for checking.
    this.localClicks += 1;
  }

  protected incrementSignal(): void {
    // Updating a signal read by this template marks the OnPush component automatically.
    this.signalClicks.update((clicks) => clicks + 1);
  }

  requestCheck(): void {
    // markForCheck schedules this view for the next change-detection traversal.
    // This was the classic solution for updates Angular could not otherwise observe.
    this.changeDetector.markForCheck();
  }
}
