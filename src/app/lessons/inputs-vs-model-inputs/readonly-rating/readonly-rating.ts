import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-readonly-rating',
  imports: [],
  templateUrl: './readonly-rating.html',
  styleUrl: './readonly-rating.css',
})
export class ReadonlyRating {
  // input.required creates a required, read-only InputSignal<number>.
  // The parent must bind [rating], or Angular reports a template compilation error.
  readonly rating = input.required<number>();

  // Optional inputs can provide a default used when the parent omits the binding.
  readonly label = input('One-way rating');

  // Inputs are signals, so computed can react whenever the parent supplies a new value.
  protected readonly stars = computed(
    () => '★'.repeat(this.rating()) + '☆'.repeat(5 - this.rating()),
  );

  // There is intentionally no child update method: InputSignal has no set() or update().
  // The parent owns this value and decides when it changes.
}
