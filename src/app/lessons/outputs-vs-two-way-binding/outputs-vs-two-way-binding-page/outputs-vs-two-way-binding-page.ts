import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LegacyNotificationToggle } from '../legacy-notification-toggle/legacy-notification-toggle';
import { ModelTextInput } from '../model-text-input/model-text-input';
import { NotificationToggle } from '../notification-toggle/notification-toggle';
import { ProfileEditor, ProfileSaveEvent } from '../profile-editor/profile-editor';

@Component({
  selector: 'app-outputs-vs-two-way-binding-page',
  // FormsModule provides NgModel for native-control two-way binding.
  imports: [
    FormsModule,
    ProfileEditor,
    NotificationToggle,
    LegacyNotificationToggle,
    ModelTextInput,
  ],
  templateUrl: './outputs-vs-two-way-binding-page.html',
  styleUrl: './outputs-vs-two-way-binding-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OutputsVsTwoWayBindingPage {
  // These fields drive the four fundamental binding demonstrations.
  protected readonly interpolationMessage = signal('Angular keeps text current');
  protected readonly propertyDisabled = signal(false);
  protected readonly eventCount = signal(0);

  // NgModel can synchronize a normal writable property in both directions.
  protected learnerName = 'Ada';

  // The modern text-input counterpart keeps the parent value in a writable signal.
  protected readonly signalLearnerName = signal('Grace');

  // This parent signal is synchronized automatically by [(enabled)].
  protected readonly notificationsEnabled = signal(false);

  // The classic two-way example uses an ordinary property, as pre-signal code commonly did.
  protected legacyNotificationsEnabled = false;

  // Outputs do not assign parent state automatically; the handler decides what to do.
  protected readonly eventMessage = signal('No profile event received yet.');

  protected togglePropertyBinding(): void {
    this.propertyDisabled.update((disabled) => !disabled);
  }

  protected recordEvent(event: MouseEvent): void {
    // Native $event is a MouseEvent; a custom output can emit its declared payload type.
    this.eventCount.update((count) => count + 1);
    this.interpolationMessage.set(`Last click position: ${event.clientX}, ${event.clientY}`);
  }

  protected handleSaved(event: ProfileSaveEvent): void {
    // $event in the template becomes this strongly typed method argument.
    this.eventMessage.set(`Saved "${event.name}" at ${event.savedAt.toLocaleTimeString()}.`);
  }

  protected handleCancelled(): void {
    this.eventMessage.set('The child emitted cancelled; the parent chose this message.');
  }
}
