import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-none-card',
  templateUrl: './none-card.html',
  styleUrl: './none-card.css',
  // None places this stylesheet into the document without Angular selector rewriting.
  encapsulation: ViewEncapsulation.None,
})
export class NoneCard {}
