import { Component, model } from '@angular/core';

@Component({
  selector: 'app-notification-toggle',
  imports: [],
  templateUrl: './notification-toggle.html',
  styleUrl: './notification-toggle.css',
})
export class NotificationToggle {
  // model() describes one value that both parent and child are allowed to change.
  // Angular exposes `enabled` as an input and creates `enabledChange` as its output.
  readonly enabled = model(false);

  protected toggle(): void {
    // Updating the model automatically emits the new value through enabledChange.
    this.enabled.update((currentValue) => !currentValue);
  }
}
