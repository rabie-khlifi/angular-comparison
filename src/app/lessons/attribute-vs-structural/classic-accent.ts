import { Directive, Input } from '@angular/core';

@Directive({
  selector: '[appClassicAccent]',
  host: {
    // Before signal inputs, host expressions read ordinary class properties directly.
    '[style.border-left-color]': 'appClassicAccent',
    '[style.background-color]': 'backgroundColor',
    '[class.accented-element]': 'true',
  },
})
export class ClassicAccent {
  // @Input marks a normal property that Angular assigns when the parent binding changes.
  // Naming it after the selector preserves the compact [appClassicAccent] syntax.
  @Input() appClassicAccent = '#2563eb';

  @Input() backgroundColor = '#eff6ff';
}
