import { Component, computed, model } from '@angular/core';

@Component({
  selector: 'app-editable-rating',
  imports: [],
  templateUrl: './editable-rating.html',
  styleUrl: './editable-rating.css',
})
export class EditableRating {
  // model.required creates a required writable ModelSignal<number>.
  // It also creates an implicit output named ratingChange.
  readonly rating = model.required<number>();

  protected readonly stars = computed(
    () => '★'.repeat(this.rating()) + '☆'.repeat(5 - this.rating()),
  );

  protected decrease(): void {
    // Unlike InputSignal, ModelSignal is writable inside the child.
    // Updating it also emits ratingChange so the parent's bound value stays synchronized.
    this.rating.update((currentRating) => Math.max(1, currentRating - 1));
  }

  protected increase(): void {
    this.rating.update((currentRating) => Math.min(5, currentRating + 1));
  }
}
