import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-emulated-card',
  templateUrl: './emulated-card.html',
  styleUrl: './emulated-card.css',
  // Emulated is Angular's default, so this explicit setting is only for teaching clarity.
  encapsulation: ViewEncapsulation.Emulated,
})
export class EmulatedCard {}
