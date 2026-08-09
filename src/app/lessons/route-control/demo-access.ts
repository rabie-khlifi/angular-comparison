import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DemoAccess {
  // A signal makes access state synchronously readable by functional guards and the lesson UI.
  readonly allowed = signal(false);

  toggle(): void {
    this.allowed.update((allowed) => !allowed);
  }

  async loadMessage(apiStyle: 'classic' | 'functional'): Promise<string> {
    // A short Promise represents critical data that must exist before route activation.
    await new Promise((resolve) => setTimeout(resolve, 150));
    return `${apiStyle} resolver loaded this message before activation`;
  }
}
