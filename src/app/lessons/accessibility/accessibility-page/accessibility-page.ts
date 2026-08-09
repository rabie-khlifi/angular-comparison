import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

@Component({
  selector: 'app-accessibility-page',
  templateUrl: './accessibility-page.html',
  styleUrl: './accessibility-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccessibilityPage {
  // This signal controls both visible content and the aria-expanded accessibility state.
  protected readonly customOpen = signal(false);
  // aria-live announces saved status without unexpectedly moving keyboard focus.
  protected readonly statusMessage = signal('No changes saved yet.');

  protected toggleCustom(): void {
    this.customOpen.update((open) => !open);
  }

  protected save(): void {
    this.statusMessage.set('Preferences saved successfully.');
  }
}
