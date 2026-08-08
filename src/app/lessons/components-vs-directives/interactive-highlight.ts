import { Directive, signal } from '@angular/core';

@Directive({
  // Square brackets make this an attribute selector used as appInteractiveHighlight.
  selector: '[appInteractiveHighlight]',
  // A directive has no template. Host bindings modify the existing matched element.
  host: {
    '(mouseenter)': 'isHighlighted.set(true)',
    '(mouseleave)': 'isHighlighted.set(false)',
    '(focusin)': 'isHighlighted.set(true)',
    '(focusout)': 'isHighlighted.set(false)',
    '[class.interactive-highlight-active]': 'isHighlighted()',
  },
})
export class InteractiveHighlight {
  // One directive instance and signal are created for every matched host element.
  protected readonly isHighlighted = signal(false);
}
