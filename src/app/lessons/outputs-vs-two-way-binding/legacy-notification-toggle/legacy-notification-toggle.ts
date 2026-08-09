import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-legacy-notification-toggle',
  imports: [],
  templateUrl: './legacy-notification-toggle.html',
  styleUrl: './legacy-notification-toggle.css',
})
export class LegacyNotificationToggle {
  // Before signal inputs, @Input decorated a normal writable class property.
  // Angular assigns the parent's incoming value to this property.
  @Input() enabled = false;

  // Two-way binding requires an output named exactly: input name + "Change".
  // EventEmitter was the traditional object used to publish that output event.
  @Output() readonly enabledChange = new EventEmitter<boolean>();

  protected toggle(): void {
    // The legacy child updates its local copy first.
    this.enabled = !this.enabled;

    // It must then explicitly emit the new value so the parent can synchronize.
    this.enabledChange.emit(this.enabled);
  }
}
