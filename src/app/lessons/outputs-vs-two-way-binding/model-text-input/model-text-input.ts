import { Component, model } from '@angular/core';

@Component({
  selector: 'app-model-text-input',
  imports: [],
  templateUrl: './model-text-input.html',
  styleUrl: './model-text-input.css',
})
export class ModelTextInput {
  // model() creates a writable value input and an implicit valueChange output.
  readonly value = model('');

  protected updateValue(event: Event): void {
    // Writing the ModelSignal also emits valueChange to synchronize the parent signal.
    this.value.set((event.target as HTMLInputElement).value);
  }
}
