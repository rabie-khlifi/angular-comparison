import { Directive, input } from '@angular/core';

@Directive({
  // The brackets describe an attribute selector; they are not written in HTML usage.
  selector: '[appAccent]',
  host: {
    // An attribute directive keeps the host in the DOM and changes its presentation.
    '[style.border-left-color]': 'appAccent()',
    '[style.background-color]': 'backgroundColor()',
    '[class.accented-element]': 'true',
  },
})
export class Accent {
  // Naming the input like the selector enables the compact [appAccent]="color" syntax.
  readonly appAccent = input('#2563eb');

  // A second input configures another part of the same reusable behavior.
  readonly backgroundColor = input('#eff6ff');
}
