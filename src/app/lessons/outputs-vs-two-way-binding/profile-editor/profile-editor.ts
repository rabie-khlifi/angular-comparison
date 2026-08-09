import { Component, input, output, signal } from '@angular/core';

export interface ProfileSaveEvent {
  readonly name: string;
  readonly savedAt: Date;
}

@Component({
  selector: 'app-profile-editor',
  imports: [],
  templateUrl: './profile-editor.html',
  styleUrl: './profile-editor.css',
})
export class ProfileEditor {
  // An input configures the child; it is separate from the events the child emits.
  readonly initialName = input('Ada');

  // output<T>() declares a custom event carrying a strongly typed payload.
  readonly saved = output<ProfileSaveEvent>();

  // output<void>() represents a semantic event with no additional payload.
  readonly cancelled = output<void>();

  // Draft text is private UI state; the parent does not need every keystroke.
  protected readonly draftName = signal('Ada');

  protected updateDraft(event: Event): void {
    this.draftName.set((event.target as HTMLInputElement).value);
  }

  protected save(): void {
    // emit sends one event notification to listeners; it does not return a value.
    this.saved.emit({ name: this.draftName().trim(), savedAt: new Date() });
  }

  protected cancel(): void {
    this.draftName.set(this.initialName());
    this.cancelled.emit();
  }
}
