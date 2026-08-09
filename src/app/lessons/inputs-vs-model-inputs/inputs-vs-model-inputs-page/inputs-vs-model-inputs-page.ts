import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { EditableRating } from '../editable-rating/editable-rating';
import { ReadonlyRating } from '../readonly-rating/readonly-rating';

@Component({
  selector: 'app-inputs-vs-model-inputs-page',
  imports: [ReadonlyRating, EditableRating],
  templateUrl: './inputs-vs-model-inputs-page.html',
  styleUrl: './inputs-vs-model-inputs-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputsVsModelInputsPage {
  // The parent owns both pieces of state at the start of each example.
  protected readonly readonlyRating = signal(3);
  protected readonly editableRating = signal(3);

  protected lowerReadonlyRating(): void {
    this.readonlyRating.update((rating) => Math.max(1, rating - 1));
  }

  protected raiseReadonlyRating(): void {
    this.readonlyRating.update((rating) => Math.min(5, rating + 1));
  }
}
