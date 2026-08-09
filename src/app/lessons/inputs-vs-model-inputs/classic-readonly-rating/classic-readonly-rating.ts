import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-classic-readonly-rating',
  templateUrl: './classic-readonly-rating.html',
  styleUrl: './classic-readonly-rating.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClassicReadonlyRating {
  // Before input(), @Input decorated a normal property assigned by Angular.
  // `required` adds template checking, but the property is still not a signal.
  @Input({ required: true }) rating!: number;

  @Input() label = 'Classic one-way rating';

  // A getter was a common way to derive display data from an @Input property.
  // Unlike computed(), Angular does not memoize it; it runs whenever the view reads it.
  protected get stars(): string {
    return '★'.repeat(this.rating) + '☆'.repeat(5 - this.rating);
  }
}
